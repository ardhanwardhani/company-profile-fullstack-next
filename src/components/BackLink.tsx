'use client';

import { useRouter } from 'next/navigation';

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function BackLink({ href, children, className = '' }: BackLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
    router.refresh();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`text-primary-600 hover:underline ${className}`}
    >
      ← {children}
    </a>
  );
}
