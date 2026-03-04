'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface ThemeToggleProps {
  variant?: 'default' | 'nav';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const baseClasses = 'p-2 rounded-lg transition-colors focus:outline-none';

  const variantClasses =
    variant === 'nav'
      ? 'text-current hover:bg-white/10 dark:hover:bg-white/10'
      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700';

  return (
    <button
      onClick={toggleTheme}
      className={`${baseClasses} ${variantClasses}`}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
