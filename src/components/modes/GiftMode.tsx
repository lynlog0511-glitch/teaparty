'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GiftBox } from '@/components/ui/GiftBox';
import { LetterModal } from '@/components/ui/LetterModal';
import { useGiftBox } from '@/hooks/useGiftBox';
import { useVisitTracking } from '@/hooks/useVisitTracking';
import { useMessage } from '@/hooks/useMessage';
import { fortunes } from '@/data/fortunes';
import type { Message } from '@/types';

interface GiftModeProps {
  message: Message;
}

export function GiftMode({ message }: GiftModeProps) {
  const router = useRouter();
  const { isOpen, openGift, closeGift } = useGiftBox();
  const { markVisited } = useVisitTracking();
  const { handleMarkOpened } = useMessage();

  const theme = fortunes[message.color] || fortunes.pink;

  const handleSaveAndClose = async () => {
    // Mark as visited in localStorage
    markVisited(message.id);

    // Mark as opened in database
    await handleMarkOpened(message.id);

    // Close modal and navigate
    closeGift();

    // Small delay for animation
    setTimeout(() => {
      router.refresh();
    }, 300);
  };

  return (
    <motion.div
      key="gift-mode"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="z-10 text-center w-full max-w-sm relative"
    >
      <div className="mb-8 text-[#5D4037] text-2xl font-bold font-[Gaegu]">
        누군가 행운을 보냈어요!
      </div>

      <GiftBox theme={theme} onOpen={openGift} />

      <LetterModal
        content={message.content}
        isOpen={isOpen}
        onClose={closeGift}
        variant="gift"
        onAction={handleSaveAndClose}
        actionLabel="행운 저장하기"
      />
    </motion.div>
  );
}
