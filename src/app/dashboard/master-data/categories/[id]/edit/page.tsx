'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BackLink from '@/components/BackLink';
import { Save } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });

  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        const res = await fetch(`/api/master-data/categories/${id}`);
        if (!res.ok) throw new Error('Category not found');
        const data = await res.json();
        const categoryData = data.data;
        setCategory(categoryData);
        setFormData({
          name: categoryData.name || '',
          slug: categoryData.slug || '',
          description: categoryData.description || '',
          is_active: categoryData.is_active,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { id } = await params;
      const res = await fetch(`/api/master-data/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update category');
      }
      setShowSaveModal(false);
      router.push(`/dashboard/master-data/categories/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Category</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <BackLink href="/dashboard/master-data/categories">Back to Categories</BackLink>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackLink href={`/dashboard/master-data/categories/${category?.id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            Back to Category
          </BackLink>
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={(e) => { e.preventDefault(); setShowSaveModal(true); }} className="space-y-6">
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={formData.name} onChange={handleNameChange} className="input" placeholder="Enter category name" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))} className="input font-mono" placeholder="category-url-slug" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="input min-h-[100px]" placeholder="Brief description (optional)" maxLength={500} />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="is_active" className="text-sm text-gray-700">Active (category will be available for use)</label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <BackLink href={`/dashboard/master-data/categories/${category?.id}`} className="btn btn-secondary">Cancel</BackLink>
          <button type="button" disabled={saving} onClick={() => setShowSaveModal(true)} className="btn btn-primary disabled:opacity-50 flex items-center gap-2">
            <Save size={16} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConfirmationModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} onConfirm={handleSave} title="Save Changes" message="You have unsaved changes. Do you want to save your changes?" isLoading={saving} />
    </div>
  );
}
