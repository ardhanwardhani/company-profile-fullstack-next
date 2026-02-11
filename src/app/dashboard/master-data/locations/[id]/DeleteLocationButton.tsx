'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface DeleteLocationButtonProps {
  locationId: string;
}

export default function DeleteLocationButton({ locationId }: DeleteLocationButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/master-data/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/master-data/locations');
        router.refresh();
      } else {
        alert('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('An error occurred while deleting the location');
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
        title="Delete Location"
        message="Are you sure you want to delete this location? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
