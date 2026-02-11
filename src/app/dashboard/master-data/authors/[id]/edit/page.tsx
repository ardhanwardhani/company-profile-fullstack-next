'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackLink from '@/components/BackLink';

interface Author {
  id: string;
  name: string;
  bio: string;
  role: string;
  avatar_id: string;
  is_active: boolean;
}

export default function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [author, setAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    role: '',
    avatar_id: '',
    is_active: true,
  });

  useEffect(() => {
    async function fetchAuthor() {
      const { id } = await params;
      try {
        const res = await fetch(`/api/master-data/authors/${id}`);
        if (!res.ok) {
          throw new Error('Author not found');
        }
        const data = await res.json();
        setAuthor(data.data);
        setFormData({
          name: data.data.name,
          bio: data.data.bio || '',
          role: data.data.role || '',
          avatar_id: data.data.avatar_id || '',
          is_active: data.data.is_active,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthor();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { id } = await params;
      const res = await fetch(`/api/master-data/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update author');
      }

      router.push(`/dashboard/master-data/authors/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !author) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Author</h1>
        <p className="text-gray-500 mb-4">{error}</p>
        <BackLink href="/dashboard/master-data/authors">Back to Authors</BackLink>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <BackLink href={`/dashboard/master-data/authors/${author?.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Author Details
          </BackLink>
          <h1 className="text-3xl font-bold">Edit Author</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                className="input"
                placeholder="e.g., Senior Editor, Contributor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="input min-h-[100px]"
                placeholder="Brief biography of the author (optional)"
                maxLength={1000}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar Image ID
              </label>
              <input
                type="text"
                value={formData.avatar_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, avatar_id: e.target.value }))}
                className="input font-mono"
                placeholder="UUID of uploaded image"
              />
              <p className="text-xs text-gray-500 mt-1">Upload an image in Media Library and paste the UUID here</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Active (author will be available for assignment to posts)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <BackLink href={`/dashboard/master-data/authors/${author?.id}`} className="btn btn-secondary">
            Cancel
          </BackLink>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
