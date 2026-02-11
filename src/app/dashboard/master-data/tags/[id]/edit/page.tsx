'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackLink from '@/components/BackLink';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export default function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tag, setTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    async function fetchTag() {
      const { id } = await params;
      try {
        const res = await fetch(`/api/master-data/tags/${id}`);
        if (!res.ok) {
          throw new Error('Tag not found');
        }
        const data = await res.json();
        setTag(data.data);
        setFormData({
          name: data.data.name,
          slug: data.data.slug,
          description: data.data.description || '',
          is_active: data.data.is_active,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTag();
  }, [params]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { id } = await params;
      const res = await fetch(`/api/master-data/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update tag');
      }

      router.push(`/dashboard/master-data/tags/${id}`);
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

  if (error && !tag) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tag</h1>
        <p className="text-gray-500 mb-4">{error}</p>
        <BackLink href="/dashboard/master-data/tags">Back to Tags</BackLink>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <BackLink href={`/dashboard/master-data/tags/${tag?.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Tag Details
          </BackLink>
          <h1 className="text-3xl font-bold">Edit Tag</h1>
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
                onChange={handleNameChange}
                className="input"
                placeholder="Enter tag name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="input font-mono"
                placeholder="tag-url-slug"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="input min-h-[100px]"
                placeholder="Brief description of the tag (optional)"
                maxLength={500}
              />
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
                Active (tag will be available for use)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <BackLink href={`/dashboard/master-data/tags/${tag?.id}`} className="btn btn-secondary">
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
