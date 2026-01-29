'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDF5]">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">
          <span role="img" aria-label="슬픈 토끼">&#129419;</span>
        </div>
        <h1 className="text-2xl font-bold text-[#5D4037] font-[Gaegu] mb-4">
          앗, 문제가 생겼어요!
        </h1>
        <p className="text-gray-500 font-[Gaegu] mb-8">
          잠시 후 다시 시도해주세요
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-[#5D4037] text-white px-6 py-3 rounded-xl font-[Gaegu] text-lg font-bold shadow-lg hover:bg-[#4E342E] transition-all"
        >
          <RotateCcw size={18} />
          다시 시도하기
        </button>
      </div>
    </main>
  );
}
