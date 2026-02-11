'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface DeleteAuthorButtonProps {
  authorId: string;
}

export default function DeleteAuthorButton({ authorId }: DeleteAuthorButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/master-data/authors/${authorId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/master-data/authors');
        router.refresh();
      } else {
        alert('Failed to delete author');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('An error occurred while deleting the author');
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
        className="btn bg-red-50 text-red-600 hover:bg-red-100"
      >
        Delete
      </button>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Author"
        message="Are you sure you want to delete this author? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
