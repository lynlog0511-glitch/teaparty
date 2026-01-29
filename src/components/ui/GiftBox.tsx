'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { ThemeConfig } from '@/types';

interface GiftBoxProps {
  theme: ThemeConfig;
  onOpen: () => void;
}

export function GiftBox({ theme, onOpen }: GiftBoxProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      className={`relative w-full aspect-[4/3] rounded-3xl shadow-xl flex items-center justify-center border-4 border-dashed cursor-pointer ${theme.bg} ${theme.border}`}
    >
      <Heart
        className={`w-20 h-20 animate-bounce ${theme.color}`}
        fill="currentColor"
      />
      <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow-md transform rotate-12 border-2 border-white">
        Touch Me!
      </div>
    </motion.button>
  );
}
