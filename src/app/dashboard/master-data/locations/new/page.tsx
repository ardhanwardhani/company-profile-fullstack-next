'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewLocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    is_remote: false,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/master-data/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create location');
      }

      const data = await res.json();
      router.push(`/dashboard/master-data/locations/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/master-data/locations" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Locations
          </Link>
          <h1 className="text-3xl font-bold">Create New Location</h1>
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
              <p className="text-xs text-gray-500 mt-1">e.g., Jakarta, Bandung, Remote</p>
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
          <Link href="/dashboard/master-data/locations" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Location'}
          </button>
        </div>
      </form>
    </div>
  );
}
