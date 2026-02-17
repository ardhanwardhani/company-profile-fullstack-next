"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "white";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({ children, href, variant = "primary", className = "", onClick, disabled = false, type = "button" }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200";
  
  const variants: Record<"primary" | "secondary" | "outline" | "danger" | "white", string> = {
    primary: "bg-primary-700 text-white hover:bg-primary-800 shadow-sm",
    secondary: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline: "border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    white: "bg-white text-primary-700 hover:bg-gray-100 border-2 border-white",
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
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {buttonContent}
    </button>
  );
}
