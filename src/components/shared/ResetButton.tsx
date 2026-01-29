'use client';

import { RotateCcw } from 'lucide-react';

export function ResetButton() {
  const handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleReset}
      className="fixed top-4 right-4 z-[100] bg-gray-200 p-2 rounded-full opacity-50 hover:opacity-100 text-xs flex items-center gap-1"
    >
      <RotateCcw size={14} /> 처음으로
    </button>
  );
}
