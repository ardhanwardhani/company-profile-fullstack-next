'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Write content here...' }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
        {[
          { action: () => editor?.chain().focus().toggleBold().run(), label: 'B', title: 'Bold', bold: true },
          { action: () => editor?.chain().focus().toggleItalic().run(), label: 'I', title: 'Italic', italic: true },
          { action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), label: 'H1', title: 'Heading 1' },
          { action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), label: 'H2', title: 'Heading 2' },
          { action: () => editor?.chain().focus().toggleBulletList().run(), label: '•', title: 'Bullet List' },
          { action: () => editor?.chain().focus().toggleOrderedList().run(), label: '1.', title: 'Numbered List' },
          { action: () => editor?.chain().focus().toggleBlockquote().run(), label: '"', title: 'Quote' },
          { action: addLink, label: '🔗', title: 'Add Link' },
          { action: addImage, label: '🖼', title: 'Add Image' },
          { action: () => editor?.chain().focus().setHorizontalRule().run(), label: '—', title: 'Horizontal Rule' },
          { action: () => editor?.chain().focus().undo().run(), label: '↩', title: 'Undo' },
          { action: () => editor?.chain().focus().redo().run(), label: '↪', title: 'Redo' },
        ].map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            className={`p-2 hover:bg-gray-200 rounded editor-btn ${btn.bold ? 'font-bold' : ''} ${btn.italic ? 'italic' : ''}`}
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .editor-btn { min-width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
        .ProseMirror { min-height: 400px !important; }
        .ProseMirror > *:first-child { margin-top: 0 !important; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #adb5bd; pointer-events: none; height: 0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
        .ProseMirror blockquote { border-left: 3px solid #e5e7eb; padding-left: 1em; margin-left: 0; color: #6b7280; font-style: italic; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5em; }
        .ProseMirror a { color: #2563eb; text-decoration: underline; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1em 0; }
        .ProseMirror ul, .ProseMirror ol { padding: 0; margin: 0.5em 0; }
        .ProseMirror ul li, .ProseMirror ol li { margin: 0.25em 0; }
      `}</style>
    </div>
  );
}
