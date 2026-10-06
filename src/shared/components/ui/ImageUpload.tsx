import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useToast } from './Toast';

interface ImageUploadProps {
  onUploaded: (url: string) => void;
  label?: string;
  multiple?: boolean;
}

export default function ImageUpload({ onUploaded, label = 'Upload image', multiple = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          showToast('error', `${file.name} is not an image`);
          continue;
        }
        const ext = file.name.split('.').pop() || 'png';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from('image').upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });
        if (error) {
          showToast('error', `Upload failed: ${error.message}`);
          continue;
        }
        const { data } = supabase.storage.from('image').getPublicUrl(path);
        onUploaded(data.publicUrl);
      }
      showToast('success', 'Image uploaded');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 bg-primary border border-color rounded-lg px-4 py-2 text-sm hover:opacity-80 disabled:opacity-50"
      >
        <Upload size={16} />
        {uploading ? 'Uploading...' : label}
      </button>
    </div>
  );
}
