'use client';

import { AnimatePresence } from 'framer-motion';
import { FortuneMode } from '@/components/modes/FortuneMode';
import type { Message } from '@/types';

interface FortuneModeWrapperProps {
  message: Message;
}

export function FortuneModeWrapper({ message }: FortuneModeWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <FortuneMode message={message} />
    </AnimatePresence>
  );
}
