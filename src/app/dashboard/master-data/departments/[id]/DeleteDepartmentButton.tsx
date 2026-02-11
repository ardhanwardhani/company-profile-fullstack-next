'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface DeleteDepartmentButtonProps {
  departmentId: string;
}

export default function DeleteDepartmentButton({ departmentId }: DeleteDepartmentButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/master-data/departments/${departmentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/master-data/departments');
        router.refresh();
      } else {
        alert('Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('An error occurred while deleting the department');
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
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
