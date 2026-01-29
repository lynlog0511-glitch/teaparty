'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Copy, Check } from 'lucide-react';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { useMessage } from '@/hooks/useMessage';
import { MESSAGE_MAX_LENGTH } from '@/lib/utils/validation';
import type { FortuneTheme } from '@/types';

interface CreateModeProps {
  initialId?: string;
}

export function CreateMode({ initialId }: CreateModeProps) {
  const [inputMsg, setInputMsg] = useState('');
  const [selectedColor, setSelectedColor] = useState<FortuneTheme>('pink');
  const [isCopied, setIsCopied] = useState(false);

  const { generatedUrl, isLoading, error, handleCreate, clearError } = useMessage();

  const handleSubmit = async () => {
    if (!inputMsg.trim()) {
      alert('메시지를 입력해주세요!');
      return;
    }

    clearError();
    await handleCreate(inputMsg, selectedColor);
  };

  const copyToClipboard = async () => {
    if (!generatedUrl) return;

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      alert('링크 복사에 실패했습니다');
    }
  };

  const charCount = inputMsg.length;
  const isOverLimit = charCount > MESSAGE_MAX_LENGTH;

  return (
    <motion.div
      key="create-mode"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm z-10"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#5D4037] font-[Gaegu] mb-2">
          행운의 편지 쓰기
        </h1>
        <p className="text-gray-500 font-[Gaegu]">친구에게 보낼 행운을 담아보세요</p>
        {initialId && (
          <p className="text-sm text-pink-400 font-[Gaegu] mt-2">
            아직 메시지가 없는 링크예요. 새로운 메시지를 작성해보세요!
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
        <label className="block text-[#5D4037] font-[Gaegu] text-lg mb-3 font-bold">
          1. 어떤 토끼를 보낼까요?
        </label>
        <div className="mb-6">
          <ThemeSelector selected={selectedColor} onSelect={setSelectedColor} />
        </div>

        <label className="block text-[#5D4037] font-[Gaegu] text-lg mb-3 font-bold">
          2. 행운의 메시지
        </label>
        <div className="relative">
          <textarea
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="예: 00아, 생일 축하해! 올해는 대박나자!"
            className={`w-full h-32 p-4 rounded-xl bg-gray-50 border-2 border-dashed focus:outline-none font-[Gaegu] text-lg resize-none mb-2 ${
              isOverLimit
                ? 'border-red-300 focus:border-red-400'
                : 'border-gray-300 focus:border-pink-300'
            }`}
            maxLength={MESSAGE_MAX_LENGTH + 50}
            disabled={isLoading}
          />
          <div
            className={`text-right text-sm mb-4 ${
              isOverLimit ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {charCount}/{MESSAGE_MAX_LENGTH}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-[Gaegu]">
            {error}
          </div>
        )}

        {!generatedUrl ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || isOverLimit}
            className={`w-full py-4 rounded-xl font-[Gaegu] text-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
              isLoading || isOverLimit
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#5D4037] text-white hover:bg-[#4E342E]'
            }`}
          >
            <PenLine size={20} />
            {isLoading ? '저장 중...' : '행운 담기 완료'}
          </button>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-4 break-all text-sm text-gray-600 font-mono">
              {generatedUrl}
            </div>
            <button
              onClick={copyToClipboard}
              className={`w-full py-4 rounded-xl font-[Gaegu] text-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                isCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-pink-400 text-white hover:bg-pink-500'
              }`}
            >
              {isCopied ? <Check size={20} /> : <Copy size={20} />}
              {isCopied ? '복사 완료!' : '링크 복사하기'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
