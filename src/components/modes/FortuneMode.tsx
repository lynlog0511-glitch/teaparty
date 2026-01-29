'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { FortuneCard } from '@/components/ui/FortuneCard';
import { LetterModal } from '@/components/ui/LetterModal';
import { AnimatedRabbit } from '@/components/shared/AnimatedRabbit';
import { useFortune } from '@/hooks/useFortune';
import { fortunes } from '@/data/fortunes';
import type { Message } from '@/types';

interface FortuneModeProps {
  message: Message;
}

export function FortuneMode({ message }: FortuneModeProps) {
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  const theme = fortunes[message.color] || fortunes.pink;
  const { fortuneText, isFlipped, drawFortune } = useFortune(theme);

  return (
    <motion.div
      key="fortune-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="z-10 w-full max-w-sm relative"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-3xl font-bold text-[#5D4037] font-[Gaegu]">Tea Party</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLetterOpen(true)}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-200 transition-colors"
            aria-label="받은 편지함"
          >
            <Mail size={16} />
          </button>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-bold ${theme.bg} ${theme.color} border ${theme.border}`}
          >
            {theme.name}
          </span>
        </div>
      </header>

      {/* Rabbit Card */}
      <div className="bg-white p-5 pb-8 rounded-[2rem] shadow-lg transform transition-transform border-2 border-stone-100">
        <div
          className={`aspect-square rounded-[1.5rem] ${theme.bg} mb-6 flex items-center justify-center relative overflow-hidden border-2 ${theme.border}`}
        >
          <AnimatedRabbit icon={theme.icon} className="text-9xl filter drop-shadow-sm" />
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 shadow-sm border border-white">
            {theme.desc}
          </div>
        </div>

        {/* Fortune Text */}
        <FortuneCard
          fortuneText={fortuneText}
          isFlipped={isFlipped}
          onDraw={drawFortune}
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 font-[Gaegu]">
          매일 하루 한 번, 당신의 행운을 확인하세요
        </p>
      </div>

      {/* Letter Modal */}
      <LetterModal
        content={message.content}
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        variant="view"
      />
    </motion.div>
  );
}
