'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  client_name: string;
  category: string;
  featured_image: string;
  live_url: string;
  case_study_url: string;
  technologies: string[];
  status: string;
  seo_title: string;
  seo_description: string;
  seo_index: boolean;
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    client_name: '',
    category: '',
    featured_image: '',
    live_url: '',
    case_study_url: '',
    technologies: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    seo_index: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Project not found');
        const data = await res.json();
        const proj = data.data;
        setProject(proj);
        setFormData({
          title: proj.title || '',
          slug: proj.slug || '',
          description: proj.description || '',
          content: proj.content || '',
          client_name: proj.client_name || '',
          category: proj.category || '',
          featured_image: proj.featured_image || '',
          live_url: proj.live_url || '',
          case_study_url: proj.case_study_url || '',
          technologies: proj.technologies ? proj.technologies.join(', ') : '',
          status: proj.status || 'draft',
          seo_title: proj.seo_title || '',
          seo_description: proj.seo_description || '',
          seo_index: proj.seo_index !== false,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { id } = await params;
      const technologiesArray = formData.technologies
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update project');
      }

      router.push('/dashboard/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-gray-500 mb-4">{error}</p>
        <Link href="/dashboard/projects" className="text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData(p => ({ ...p, client_name: e.target.value }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                className="input"
                placeholder="e.g., Web Application, Mobile App"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                className="input min-h-[100px]"
                placeholder="Brief description of the project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                className="input min-h-[200px]"
                placeholder="Full project details"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Media</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData(p => ({ ...p, featured_image: e.target.value }))}
                className="input"
                placeholder="https://..."
              />
              {formData.featured_image && (
                <img src={formData.featured_image} alt="Preview" className="mt-2 w-48 h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Links</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData(p => ({ ...p, live_url: e.target.value }))}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Study URL</label>
              <input
                type="url"
                value={formData.case_study_url}
                onChange={(e) => setFormData(p => ({ ...p, case_study_url: e.target.value }))}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData(p => ({ ...p, technologies: e.target.value }))}
                className="input"
                placeholder="React, Node.js, PostgreSQL (comma separated)"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">SEO</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData(p => ({ ...p, seo_title: e.target.value }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => setFormData(p => ({ ...p, seo_description: e.target.value }))}
                className="input min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="seo_index"
                checked={formData.seo_index}
                onChange={(e) => setFormData(p => ({ ...p, seo_index: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="seo_index" className="text-sm text-gray-700">Allow search engines to index this project</label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div>
            <select
              value={formData.status}
              onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
              className="input max-w-xs"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/projects" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn btn-primary flex items-center gap-2">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
