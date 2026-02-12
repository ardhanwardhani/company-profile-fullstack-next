'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    if (!confirm(`Are you sure you want to delete user "${userName}"? This will set their status to inactive.`)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to delete user');
        return;
      }

      router.refresh();
    } catch {
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
