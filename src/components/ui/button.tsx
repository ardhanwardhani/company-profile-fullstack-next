"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export function Button({ children, href, variant = "primary", className = "", onClick }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
    secondary: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline: "border-2 border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-600",
  };

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  const buttonContent = (
    <motion.span {...motionProps}>
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {buttonContent}
    </button>
  );
}
