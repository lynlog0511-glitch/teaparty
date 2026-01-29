'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FortuneCardProps {
  fortuneText: string;
  isFlipped: boolean;
  onDraw: () => void;
}

export function FortuneCard({ fortuneText, isFlipped, onDraw }: FortuneCardProps) {
  return (
    <div className="relative min-h-[120px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl p-4 border border-stone-100">
      {!isFlipped ? (
        <button
          onClick={onDraw}
          className="flex flex-col items-center animate-pulse text-gray-400 hover:text-gray-600 transition-colors w-full h-full justify-center"
        >
          <Sparkles className="w-8 h-8 mb-2 text-yellow-400" fill="currentColor" />
          <span className="font-[Gaegu] text-lg">카드를 톡! 눌러보세요</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <p className="text-[#5D4037] font-[Gaegu] text-2xl font-medium break-keep leading-relaxed">
            &ldquo;{fortuneText}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
}
