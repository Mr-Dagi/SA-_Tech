import { Github, Linkedin, Twitter, Youtube, Instagram, Facebook, Send, Music2, Globe, Mail } from 'lucide-react';

export const socialIconOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'email', label: 'Email' },
  { value: 'globe', label: 'Website' }
];

export const getSocialIcon = (icon?: string, platform?: string, size = 18) => {
  const key = (icon || platform || '').toLowerCase();
  switch (key) {
    case 'github': return <Github size={size} />;
    case 'linkedin': return <Linkedin size={size} />;
    case 'twitter': case 'x': return <Twitter size={size} />;
    case 'youtube': return <Youtube size={size} />;
    case 'instagram': return <Instagram size={size} />;
    case 'facebook': return <Facebook size={size} />;
    case 'telegram': return <Send size={size} />;
    case 'tiktok': return <Music2 size={size} />;
    case 'email': case 'mail': return <Mail size={size} />;
    default: return <Globe size={size} />;
  }
};
