'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface DeleteJobButtonProps {
  jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/careers/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/careers/jobs');
        router.refresh();
      } else {
        alert('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job');
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="btn bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2"
      >
        <Trash2 size={16} />
        Delete
      </button>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
