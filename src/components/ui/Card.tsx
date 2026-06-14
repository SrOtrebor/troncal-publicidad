import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles = `rounded-[var(--radius-lg)] ${paddings[padding]}`;
  const bgStyles = glass
    ? 'glass'
    : 'bg-white border border-gray-200';
  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'
    : 'transition-shadow duration-200';

  return (
    <div
      className={`${baseStyles} ${bgStyles} ${hoverStyles} shadow-md ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
