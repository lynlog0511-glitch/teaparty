'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GiftMode } from '@/components/modes/GiftMode';
import { FortuneMode } from '@/components/modes/FortuneMode';
import { useVisitTracking } from '@/hooks/useVisitTracking';
import type { Message } from '@/types';

interface GiftModeWrapperProps {
  message: Message;
}

export function GiftModeWrapper({ message }: GiftModeWrapperProps) {
  const { hasVisited } = useVisitTracking();
  const [mode, setMode] = useState<'gift' | 'fortune' | 'loading'>('loading');

  useEffect(() => {
    // Check localStorage for visit status (client-side only)
    const visited = hasVisited(message.id);
    setMode(visited ? 'fortune' : 'gift');
  }, [message.id, hasVisited]);

  if (mode === 'loading') {
    return <div className="min-h-screen bg-[#FFFDF5]" />;
  }

  return (
    <AnimatePresence mode="wait">
      {mode === 'gift' ? (
        <GiftMode message={message} />
      ) : (
        <FortuneMode message={message} />
      )}
    </AnimatePresence>
  );
}
