'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import { motion } from 'framer-motion';
import { Gift, Check, Sparkles, Save } from 'lucide-react';
import { fortunes, FortuneTheme } from '../../../data/fortunes';

export default function SetupPage() {
  const params = useParams();
  const rabbitId = params.id as string;

  const [status, setStatus] = useState<'loading' | 'ready' | 'registered' | 'complete'>('loading');
  const [inputMsg, setInputMsg] = useState('');
  const [selectedColor, setSelectedColor] = useState<FortuneTheme>('pink');
  const [isSaving, setIsSaving] = useState(false);

  // 초기 상태 체크
  useEffect(() => {
    async function checkStatus() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('id', rabbitId)
        .single();

      if (data && data.content) {
        setStatus('registered');
      } else {
        setStatus('ready');
      }
    }
    checkStatus();
  }, [rabbitId]);

  // 메시지 저장
  const saveMessage = async () => {
    if (!inputMsg.trim()) return alert('메시지를 입력해주세요!');

    setIsSaving(true);
    const { error } = await supabase
      .from('messages')
      .upsert({ id: rabbitId, content: inputMsg, color: selectedColor });

    if (!error) {
      setStatus('complete');
    } else {
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
    setIsSaving(false);
  };

  // 로딩
  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFFDF5] font-[Gaegu]">
        <div className="animate-pulse text-[#5D4037] text-xl">로딩 중... 🐰</div>
      </main>
    );
  }

  // 이미 등록됨
  if (status === 'registered') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#FFFDF5] font-[Gaegu]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#5D4037] mb-3">이미 등록된 선물이에요</h1>
            <p className="text-gray-500 text-lg mb-6">
              이 모찌에는 이미 메시지가<br />등록되어 있습니다
            </p>
            <div className="text-6xl mb-6">💝</div>
            <p className="text-gray-400 text-sm">
              선물 받는 분이 NFC를 터치하면<br />당신의 마음이 전달됩니다
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  // 등록 완료
  if (status === 'complete') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#FFFDF5] font-[Gaegu]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#5D4037] mb-3">등록 완료!</h1>
            <p className="text-gray-500 text-lg mb-6">
              이제 NFC를 터치하면<br />당신의 마음이 전달돼요
            </p>
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-6">
              <p className="text-sm text-gray-600">
                <Sparkles className="inline w-4 h-4 text-yellow-500 mr-1" />
                선물 받는 분이 NFC를 터치하면<br />메시지와 함께 행운을 받게 됩니다
              </p>
            </div>
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-400 text-sm">이 창은 닫아도 괜찮아요</p>
          </div>
        </motion.div>
      </main>
    );
  }

  // 등록 폼
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#FFFDF5] font-[Gaegu]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#5D4037] mb-2">행운의 메시지 등록</h1>
          <p className="text-gray-500">선물 받을 분에게 전할 메시지를 작성하세요</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
          <label className="block text-[#5D4037] text-lg mb-3 font-bold">1. 어떤 모찌를 보낼까요?</label>
          <div className="flex justify-between mb-6 px-1 gap-1">
            {(Object.keys(fortunes) as FortuneTheme[]).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all
                  ${selectedColor === color ? 'scale-110 border-[#5D4037] shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}
                  ${fortunes[color].bg}`}
              >
                {fortunes[color].icon}
              </button>
            ))}
          </div>

          <div className="text-center mb-6 p-3 rounded-xl bg-gray-50">
            <span className={`font-bold ${fortunes[selectedColor].color}`}>
              {fortunes[selectedColor].name}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              {fortunes[selectedColor].desc}
            </span>
          </div>

          <label className="block text-[#5D4037] text-lg mb-3 font-bold">2. 행운의 메시지</label>
          <textarea
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="예: 00아, 항상 응원해! 행복한 일만 가득하길 💕"
            className="w-full h-32 p-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 focus:border-pink-300 focus:outline-none text-lg resize-none mb-6"
            maxLength={500}
          />

          <button
            onClick={saveMessage}
            disabled={isSaving}
            className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all
              ${isSaving ? 'bg-gray-300 text-gray-500' : 'bg-[#5D4037] text-white hover:bg-[#4E342E]'}`}
          >
            {isSaving ? '저장 중...' : <><Save size={20} /> 메시지 등록하기</>}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          등록 후에는 수정이 어려우니 신중히 작성해주세요
        </p>
      </motion.div>
    </main>
  );
}
