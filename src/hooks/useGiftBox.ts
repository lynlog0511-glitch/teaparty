'use client';

import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface UseGiftBoxReturn {
  isOpen: boolean;
  openGift: () => void;
  closeGift: () => void;
}

export function useGiftBox(): UseGiftBoxReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openGift = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD1DC', '#FFF59D', '#C8E6C9'],
    });
    setIsOpen(true);
  }, []);

  const closeGift = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openGift,
    closeGift,
  };
}
