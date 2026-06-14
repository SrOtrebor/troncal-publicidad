interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'green' | 'red' | 'yellow' | 'gray';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'teal',
  size = 'sm',
  dot = false,
}: BadgeProps) {
  const variants = {
    teal: 'bg-teal-50 text-teal-dark border-teal-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const dotColors = {
    teal: 'bg-teal',
    green: 'bg-green',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-full)] border ${variants[variant]} ${sizes[size]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
