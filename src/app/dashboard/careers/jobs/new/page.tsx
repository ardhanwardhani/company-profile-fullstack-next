'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface Department {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  is_remote: boolean;
}

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
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

  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write job description here...' }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, description: editor.getHTML() }));
    },
  });

  const responsibilitiesEditor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'List responsibilities...' }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, responsibilities: editor.getHTML() }));
    },
  });

  const requirementsEditor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'List requirements...' }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, requirements: editor.getHTML() }));
    },
  });

  const benefitsEditor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'List benefits...' }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, benefits: editor.getHTML() }));
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [deptRes, locRes] = await Promise.all([
          fetch('/api/master-data/departments'),
          fetch('/api/master-data/locations'),
        ]);

        if (deptRes.ok) {
          const data = await deptRes.json();
          setDepartments(data.data || []);
        }
        if (locRes.ok) {
          const data = await locRes.json();
          setLocations(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }
    loadData();
  }, []);

  const addLink = (editor: any) => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = (editor: any) => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const Toolbar = ({ editor }: { editor: any }) => (
    <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
      {[
        { action: () => editor?.chain().focus().toggleBold().run(), label: <strong>B</strong>, title: 'Bold' },
        { action: () => editor?.chain().focus().toggleItalic().run(), label: <em>I</em>, title: 'Italic' },
        { action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), label: 'H1', title: 'Heading 1' },
        { action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), label: 'H2', title: 'Heading 2' },
        { action: () => editor?.chain().focus().toggleBulletList().run(), label: '•', title: 'Bullet List' },
        { action: () => editor?.chain().focus().toggleOrderedList().run(), label: '1.', title: 'Numbered List' },
        { action: () => editor?.chain().focus().toggleBlockquote().run(), label: '"', title: 'Quote' },
        { action: () => addLink(editor), label: '🔗', title: 'Add Link' },
        { action: () => addImage(editor), label: '🖼', title: 'Add Image' },
        { action: () => editor?.chain().focus().setHorizontalRule().run(), label: '―', title: 'Horizontal Rule' },
        { action: () => editor?.chain().focus().undo().run(), label: '↩', title: 'Undo' },
        { action: () => editor?.chain().focus().redo().run(), label: '↪', title: 'Redo' },
      ].map((btn, idx) => (
        <button
          key={idx}
          type="button"
          onClick={btn.action}
          className="p-2 hover:bg-gray-200 rounded editor-btn"
          title={btn.title}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/careers/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create job');
      }

      const data = await res.json();
      router.push(`/dashboard/careers/jobs/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/careers/jobs" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold">Create New Job</h1>
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
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="Enter job title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, department_id: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_id: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}{loc.is_remote ? ' (Remote)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <select
                  value={formData.employment_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="input"
                >
                  <option value="">Select level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply URL *
              </label>
              <input
                type="url"
                value={formData.apply_url}
                onChange={(e) => setFormData(prev => ({ ...prev, apply_url: e.target.value }))}
                className="input"
                placeholder="https://example.com/apply or mailto:email@example.com"
                required
              />
            </div>
          </div>
        </div>

        {['description', 'responsibilities', 'requirements', 'benefits'].map((field) => (
          <div key={field} className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {field.replace('_', ' ')} *
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Toolbar editor={field === 'description' ? descriptionEditor : field === 'responsibilities' ? responsibilitiesEditor : field === 'requirements' ? requirementsEditor : benefitsEditor} />
              <div className="min-h-[400px]">
                <EditorContent editor={field === 'description' ? descriptionEditor : field === 'responsibilities' ? responsibilitiesEditor : field === 'requirements' ? requirementsEditor : benefitsEditor} />
              </div>
            </div>
          </div>
        ))}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                className="input"
                placeholder="SEO meta title (optional)"
                maxLength={255}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                className="input min-h-[80px]"
                placeholder="SEO meta description (optional)"
                maxLength={500}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="seo_index"
                checked={formData.seo_index}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_index: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="seo_index" className="text-sm text-gray-700">
                Allow search engines to index this job posting
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/careers/jobs" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .editor-btn {
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ProseMirror { min-height: 400px !important; }
        .ProseMirror > *:first-child { margin-top: 0 !important; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin-left: 0;
          color: #6b7280;
          font-style: italic;
        }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5em; }
        .ProseMirror a { color: #2563eb; text-decoration: underline; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1em 0; }
        .ProseMirror ul, .ProseMirror ol { padding: 0; margin: 0.5em 0; }
        .ProseMirror ul li, .ProseMirror ol li { margin: 0.25em 0; }
      `}</style>
    </div>
  );
}
