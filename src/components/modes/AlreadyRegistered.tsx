'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface AlreadyRegisteredProps {
  id: string;
}

export function AlreadyRegistered({ id }: AlreadyRegisteredProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm z-10 text-center"
    >
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-blue-500" />
        </div>

        <h1 className="text-2xl font-bold text-[#5D4037] font-[Gaegu] mb-3">
          이미 등록된 선물이에요
        </h1>

        <p className="text-gray-500 font-[Gaegu] text-lg mb-6">
          이 NFC에는 이미 메시지가<br />
          등록되어 있습니다
        </p>

        <div className="text-6xl mb-6">💝</div>

        <p className="text-gray-400 font-[Gaegu] text-sm">
          선물 받는 분이 NFC를 터치하면<br />
          당신의 마음이 전달됩니다
        </p>
      </div>
    </motion.div>
  );
}
