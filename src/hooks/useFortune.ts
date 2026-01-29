'use client';

import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { ThemeConfig } from '@/types';

interface UseFortuneReturn {
  fortuneText: string;
  isFlipped: boolean;
  drawFortune: () => void;
  reset: () => void;
}

export function useFortune(theme: ThemeConfig): UseFortuneReturn {
  const [fortuneText, setFortuneText] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const drawFortune = useCallback(() => {
    if (isFlipped) return;

    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = (seed + theme.messages.length) % theme.messages.length;

    setFortuneText(theme.messages[randomIndex]);
    setIsFlipped(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  }, [isFlipped, theme.messages]);

  const reset = useCallback(() => {
    setFortuneText('');
    setIsFlipped(false);
  }, []);

  return {
    fortuneText,
    isFlipped,
    drawFortune,
    reset,
  };
}
