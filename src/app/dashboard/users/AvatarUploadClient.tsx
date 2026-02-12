'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AvatarUploadClientProps {
  userId: string;
  currentAvatar?: string;
}

export default function AvatarUploadClient({ userId, currentAvatar }: AvatarUploadClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload');
      }

      const data = await res.json();
      const fileName = data.data.fileName;
      setPreview(fileName);
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Remove this avatar?')) return;

    setUploading(true);

    try {
      const res = await fetch(`/api/users/${userId}/avatar`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete avatar');
      }

      setPreview(null);
      router.refresh();
    } catch (error) {
      alert('Failed to delete avatar');
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = preview ? `/uploads/avatars/${preview}` : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-gray-400">?</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn btn-secondary text-sm"
          >
            {avatarUrl ? 'Change' : 'Upload'} Avatar
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={uploading}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">Max 2MB. Allowed: JPG, PNG, GIF, WebP</p>
    </div>
  );
}
