'use client';

import { motion } from 'framer-motion';
import { MailOpen } from 'lucide-react';

interface LetterModalProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'gift' | 'view';
  onAction?: () => void;
  actionLabel?: string;
}

export function LetterModal({
  content,
  isOpen,
  onClose,
  variant = 'view',
  onAction,
  actionLabel = '행운 저장하기',
}: LetterModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && variant === 'view') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative border-8 border-pink-100 flex flex-col items-center"
      >
        {variant === 'gift' && (
          <div className="absolute -top-10 bg-white p-4 rounded-full shadow-lg border-4 border-pink-50">
            <MailOpen className="text-pink-400 w-10 h-10" />
          </div>
        )}

        {variant === 'view' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        )}

        {variant === 'view' && (
          <div className="bg-pink-50 p-4 rounded-full mb-4">
            <MailOpen className="text-pink-400 w-8 h-8" />
          </div>
        )}

        <div className={variant === 'gift' ? 'mt-8 text-center w-full' : 'text-center w-full'}>
          {variant === 'view' && (
            <h3 className="text-xl font-bold text-[#5D4037] font-[Gaegu] mb-4">보관된 편지</h3>
          )}

          <div
            className={`p-5 rounded-xl min-h-[100px] flex items-center justify-center ${
              variant === 'gift'
                ? 'bg-pink-50 mb-6'
                : 'bg-gray-50 border border-dashed border-gray-300'
            }`}
          >
            <p className="text-[#5D4037] font-[Gaegu] text-xl leading-relaxed whitespace-pre-wrap break-keep text-center">
              {content}
            </p>
          </div>

          {variant === 'gift' && onAction && (
            <button
              onClick={onAction}
              className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 font-[Gaegu] text-xl flex items-center justify-center gap-2"
            >
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
