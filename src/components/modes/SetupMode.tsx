'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Sparkles } from 'lucide-react';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { MESSAGE_MAX_LENGTH } from '@/lib/utils/validation';
import { registerMessage } from '@/actions/messages';
import type { FortuneTheme } from '@/types';

interface SetupModeProps {
  id: string;
}

export function SetupMode({ id }: SetupModeProps) {
  const [inputMsg, setInputMsg] = useState('');
  const [selectedColor, setSelectedColor] = useState<FortuneTheme>('pink');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputMsg.trim()) {
      setError('메시지를 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('content', inputMsg);
    formData.append('color', selectedColor);

    const result = await registerMessage(formData);

    if (!result.success) {
      setError(result.error || '등록에 실패했습니다');
      setIsLoading(false);
      return;
    }

    setIsComplete(true);
    setIsLoading(false);
  };

  const charCount = inputMsg.length;
  const isOverLimit = charCount > MESSAGE_MAX_LENGTH;

  // 완료 화면
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm z-10 text-center"
      >
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-[#5D4037] font-[Gaegu] mb-3">
            등록 완료!
          </h1>

          <p className="text-gray-500 font-[Gaegu] text-lg mb-6">
            이제 NFC를 터치하면<br />
            당신의 마음이 전달돼요
          </p>

          <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-6">
            <p className="text-sm text-gray-600 font-[Gaegu]">
              <Sparkles className="inline w-4 h-4 text-yellow-500 mr-1" />
              선물 받는 분이 NFC를 터치하면<br />
              메시지와 함께 행운을 받게 됩니다
            </p>
          </div>

          <div className="text-6xl mb-4">🎁</div>

          <p className="text-gray-400 font-[Gaegu] text-sm">
            이 창은 닫아도 괜찮아요
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm z-10"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-pink-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#5D4037] font-[Gaegu] mb-2">
          행운의 메시지 등록
        </h1>
        <p className="text-gray-500 font-[Gaegu]">
          선물 받을 분에게 전할 메시지를 작성하세요
        </p>
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
            placeholder="예: 00아, 항상 응원해! 행복한 일만 가득하길"
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

        <button
          onClick={handleSubmit}
          disabled={isLoading || isOverLimit}
          className={`w-full py-4 rounded-xl font-[Gaegu] text-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading || isOverLimit
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#5D4037] text-white hover:bg-[#4E342E]'
          }`}
        >
          <Gift size={20} />
          {isLoading ? '등록 중...' : '메시지 등록하기'}
        </button>
      </div>

      <p className="text-center text-gray-400 font-[Gaegu] text-sm mt-6">
        등록 후에는 수정이 어려우니 신중히 작성해주세요
      </p>
    </motion.div>
  );
}
