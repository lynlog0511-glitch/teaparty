'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export function NotYetRegistered() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm z-10 text-center"
    >
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>

        <h1 className="text-2xl font-bold text-[#5D4037] font-[Gaegu] mb-3">
          아직 준비 중이에요
        </h1>

        <p className="text-gray-500 font-[Gaegu] text-lg mb-6">
          선물을 보내는 분이<br />
          메시지를 등록하는 중입니다
        </p>

        <div className="text-6xl mb-6 animate-bounce">🐰</div>

        <p className="text-gray-400 font-[Gaegu] text-sm">
          조금만 기다려주세요!<br />
          곧 행운이 도착할 거예요
        </p>
      </div>
    </motion.div>
  );
}
