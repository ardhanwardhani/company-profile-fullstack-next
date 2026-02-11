'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

interface CategoryStatusButtonProps {
  categoryId: string;
  categoryName: string;
  currentStatus: boolean;
}

export default function CategoryStatusButton({
  categoryId,
  categoryName,
  currentStatus,
}: CategoryStatusButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isActive = currentStatus;
  const targetStatus = !isActive;

  const handleStatusChange = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/master-data/categories/${categoryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: targetStatus }),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          targetStatus ? 'success' : 'info',
          targetStatus ? 'Category activated successfully!' : 'Category deactivated successfully!'
        );
        router.refresh();
      } else {
        showToast('error', data.error || 'Failed to update status');
      }
    } catch {
      showToast('error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const buttonClass = isActive
    ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
    : 'text-green-600 hover:text-green-800 hover:bg-green-50';

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className={`${buttonClass} text-sm font-medium transition-colors disabled:opacity-50`}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {targetStatus ? 'Activate Category' : 'Deactivate Category'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {targetStatus ? 'activate' : 'deactivate'}{' '}
              <span className="font-medium text-gray-900">"{categoryName}"</span>?
            </p>

            {targetStatus && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-800">
                  This category will be available for selection in blog posts.
                </p>
              </div>
            )}

            {!targetStatus && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  This category will no longer be available for selection in new blog posts.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  targetStatus
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : targetStatus ? (
                  'Activate'
                ) : (
                  'Deactivate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
