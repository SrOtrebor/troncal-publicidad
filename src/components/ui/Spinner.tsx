export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full border-gray-200 border-t-teal animate-spin ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm animate-pulse-soft">Cargando...</p>
      </div>
    </div>
  );
}
