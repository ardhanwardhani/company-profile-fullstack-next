'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { ArrowLeft, Save } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  status: string;
  featured_image: string;
}

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    content: '',
    excerpt: '',
    status: 'draft',
    featured_image: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your blog post content here...',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        
        const [postRes, categoriesRes] = await Promise.all([
          fetch(`/api/blog/posts/${id}`),
          fetch('/api/master-data/categories'),
        ]);

        if (!postRes.ok) {
          throw new Error('Post not found');
        }

        const postData = await postRes.json();
        const categoriesData = await categoriesRes.json();

        const post = postData.data;
        setPost(post);
        setCategories(categoriesData.data || []);

        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          category_id: post.category_id || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          status: post.status || 'draft',
          featured_image: post.featured_image || '',
        });

        if (editor && post.content) {
          editor.commands.setContent(post.content);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params, editor]);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, featured_image: data.url }));
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const { id } = await params;

      const sanitizedData = {
        ...formData,
        category_id: formData.category_id || null,
        featured_image: formData.featured_image || null,
      };

      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update post');
      }

      setShowSaveModal(false);
      router.push(`/dashboard/blog/posts/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Post</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link href="/dashboard/blog/posts" className="text-primary-600 hover:underline">
          ← Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/blog/posts/${post?.id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Back to Post</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
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
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="input"
                placeholder="Enter post title"
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
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="input"
                placeholder="post-url-slug"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="input"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
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
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input"
              />
              {formData.featured_image && (
                <div className="mt-2">
                  <img src={formData.featured_image} alt="Featured" className="h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="input min-h-[80px]"
                placeholder="Brief description of the post"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Strike"
              >
                <s>S</s>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Code"
              >
                &lt;/&gt;
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Numbered List"
              >
                1.
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Quote"
              >
                &quot;
              </button>
              <button
                type="button"
                onClick={addLink}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Add Link"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={addImage}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Add Image"
              >
                🖼
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Horizontal Rule"
              >
                ―
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Undo"
              >
                ↩
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                className="p-2 hover:bg-gray-200 rounded editor-btn"
                title="Redo"
              >
                ↪
              </button>
            </div>
            
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link
            href={`/dashboard/blog/posts/${post?.id}`}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => setShowSaveModal(true)}
            className="btn btn-primary disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Save Changes"
        message="You have unsaved changes. Do you want to save your changes?"
        isLoading={saving}
      />

      <style jsx global>{`
        .editor-btn {
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
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
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin-left: 0;
          color: #6b7280;
          font-style: italic;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }
        .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
}
