'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserStatusButtonProps {
  userId: string;
  userName: string;
  currentStatus: string;
}

export default function UserStatusButton({ userId, userName, currentStatus }: UserStatusButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleToggle = async () => {
    if (loading) return;

    const newStatus = status === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${actionText} user "${userName}"?`)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || `Failed to ${actionText} user`);
        return;
      }

      setStatus(newStatus);
      router.refresh();
    } catch {
      alert(`Failed to ${actionText} user`);
    } finally {
      setLoading(false);
    }
  };

  const isActive = status === 'active';

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-sm font-medium transition-colors ${isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? '...' : isActive ? 'Deactivate' : 'Activate'}
    </button>
  );
}
