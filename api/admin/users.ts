import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Simple in-memory rate limiter (per serverless instance)
const bucket = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX = 20;

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = bucket.get(key);
  if (!entry || entry.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX;
}

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase credentials');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

async function getAuthorizedUser(req: any) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;
  if (!token) return null;
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export default async function handler(req: any, res: any) {
  try {
    if (!ALLOWED_METHODS.includes(req.method)) {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
      .toString()
      .split(',')[0]
      .trim();
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    const user = await getAuthorizedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (user.app_metadata?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      return res.status(200).json({ users: data.users || [] });
    }

    if (req.method === 'DELETE') {
      const userId = req.query?.userId;
      if (typeof userId !== 'string' || !UUID_RE.test(userId)) {
        return res.status(400).json({ error: 'valid userId required' });
      }
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'POST') {
      const { email, password } = req.body ?? {};
      if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'valid email required' });
      }
      if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return res.status(400).json({ error: 'password must be 8-128 chars' });
      }
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      const target = listData.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
      if (!target) return res.status(404).json({ error: 'User not found' });
      const { error } = await supabaseAdmin.auth.admin.updateUserById(target.id, { password });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PUT') {
      const { email } = req.body ?? {};
      if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'valid email required' });
      }
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      const target = data.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
      if (!target) return res.status(404).json({ error: 'User not found' });
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(target.id, {
        app_metadata: { ...target.app_metadata, role: 'admin' }
      });
      if (updateError) throw updateError;
      return res.status(200).json({ success: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
