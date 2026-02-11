'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackLink from '@/components/BackLink';

interface Location {
  id: string;
  name: string;
  is_remote: boolean;
  is_active: boolean;
}

export default function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    is_remote: false,
    is_active: true,
  });

  useEffect(() => {
    async function fetchLocation() {
      const { id } = await params;
      try {
        const res = await fetch(`/api/master-data/locations/${id}`);
        if (!res.ok) {
          throw new Error('Location not found');
        }
        const data = await res.json();
        setLocation(data.data);
        setFormData({
          name: data.data.name,
          is_remote: data.data.is_remote,
          is_active: data.data.is_active,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLocation();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { id } = await params;
      const res = await fetch(`/api/master-data/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update location');
      }

      router.push(`/dashboard/master-data/locations/${id}`);
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

  if (error && !location) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Location</h1>
        <p className="text-gray-500 mb-4">{error}</p>
        <BackLink href="/dashboard/master-data/locations">Back to Locations</BackLink>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <BackLink href={`/dashboard/master-data/locations/${location?.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Location Details
          </BackLink>
          <h1 className="text-3xl font-bold">Edit Location</h1>
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
                placeholder="Enter location name"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_remote"
                checked={formData.is_remote}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_remote: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_remote" className="text-sm text-gray-700">
                Remote position
              </label>
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
                Active (location will be available for job postings)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <BackLink href={`/dashboard/master-data/locations/${location?.id}`} className="btn btn-secondary">
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
