'use client';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle';
  className?: string;
}

export function SkeletonLoader({ variant = 'text', className = '' }: SkeletonLoaderProps) {
  const baseClass = 'animate-pulse bg-gray-200 rounded';

  const variantClasses = {
    card: 'w-full h-64 rounded-[2rem]',
    text: 'h-4 w-3/4',
    circle: 'w-12 h-12 rounded-full',
  };

  return <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
        <SkeletonLoader variant="text" className="mb-4" />
        <SkeletonLoader variant="card" className="mb-6" />
        <SkeletonLoader variant="text" className="w-1/2" />
      </div>
    </div>
  );
}
