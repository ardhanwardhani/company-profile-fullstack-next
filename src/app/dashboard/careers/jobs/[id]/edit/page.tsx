'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface Job {
  id: string;
  title: string;
  description: any;
  responsibilities: any;
  requirements: any;
  benefits: any;
  department_id: string;
  location_id: string;
  employment_type: string;
  level: string;
  apply_url: string;
  status: string;
  seo_title: string;
  seo_description: string;
  seo_index: boolean;
}

interface FormData {
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  department_id: string;
  location_id: string;
  employment_type: string;
  level: string;
  apply_url: string;
  status: string;
  seo_title: string;
  seo_description: string;
  seo_index: boolean;
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [error, setError] = useState('');
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    department_id: '',
    location_id: '',
    employment_type: 'full-time',
    level: 'mid',
    apply_url: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    seo_index: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        const res = await fetch(`/api/careers/jobs/${id}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        const jobData = data.data;
        setJob(jobData);
        setFormData({
          title: jobData.title || '',
          description: jobData.description || '',
          responsibilities: jobData.responsibilities || '',
          requirements: jobData.requirements || '',
          benefits: jobData.benefits || '',
          department_id: jobData.department_id || '',
          location_id: jobData.location_id || '',
          employment_type: jobData.employment_type || 'full-time',
          level: jobData.level || 'mid',
          apply_url: jobData.apply_url || '',
          status: jobData.status || 'draft',
          seo_title: jobData.seo_title || '',
          seo_description: jobData.seo_description || '',
          seo_index: jobData.seo_index !== false,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { id } = await params;
      const res = await fetch(`/api/careers/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update job');
      }
      setShowSaveModal(false);
      router.push(`/dashboard/careers/jobs/${id}`);
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

  if (error && !job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Job</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link href="/dashboard/careers/jobs" className="text-primary-600 hover:underline">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/careers/jobs/${job?.id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />Back to Job
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={(e) => { e.preventDefault(); setShowSaveModal(true); }} className="space-y-6">
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="input" placeholder="Enter job title" required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                <select value={formData.employment_type} onChange={(e) => setFormData(p => ({ ...p, employment_type: e.target.value }))} className="input" required>
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select value={formData.level} onChange={(e) => setFormData(p => ({ ...p, level: e.target.value }))} className="input">
                  <option value="">Select level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))} className="input">
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apply URL *</label>
              <input type="url" value={formData.apply_url} onChange={(e) => setFormData(p => ({ ...p, apply_url: e.target.value }))} className="input" placeholder="https://example.com/apply or mailto:email@example.com" required />
            </div>
          </div>
        </div>

        {['description', 'responsibilities', 'requirements', 'benefits'].map((field) => (
          <div key={field} className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace('_', ' ')}</label>
            <RichTextEditor content={formData[field as keyof FormData] as string} onChange={(content) => setFormData(p => ({ ...p, [field]: content }))} placeholder={`Write ${field} here...`} />
          </div>
        ))}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input type="text" value={formData.seo_title} onChange={(e) => setFormData(p => ({ ...p, seo_title: e.target.value }))} className="input" placeholder="SEO meta title (optional)" maxLength={255} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea value={formData.seo_description} onChange={(e) => setFormData(p => ({ ...p, seo_description: e.target.value }))} className="input min-h-[80px]" placeholder="SEO meta description (optional)" maxLength={500} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="seo_index" checked={formData.seo_index} onChange={(e) => setFormData(p => ({ ...p, seo_index: e.target.checked }))} />
              <label htmlFor="seo_index" className="text-sm text-gray-700">Allow search engines to index this job posting</label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href={`/dashboard/careers/jobs/${job?.id}`} className="btn btn-secondary">Cancel</Link>
          <button type="button" disabled={saving} onClick={() => setShowSaveModal(true)} className="btn btn-primary disabled:opacity-50 flex items-center gap-2">
            <Save size={16} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConfirmationModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} onConfirm={handleSave} title="Save Changes" message="You have unsaved changes. Do you want to save your changes?" isLoading={saving} />
    </div>
  );
}
