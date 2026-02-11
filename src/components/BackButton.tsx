'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = 'Back' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
}
