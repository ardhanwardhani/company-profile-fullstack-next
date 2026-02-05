'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeletePostButtonProps {
  postId: string;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/blog/posts');
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="btn bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}
