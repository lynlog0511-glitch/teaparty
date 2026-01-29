'use client';

import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm z-10 text-center"
    >
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
        <div className="text-7xl mb-6">🐰</div>

        <h1 className="text-3xl font-bold text-[#5D4037] font-[Gaegu] mb-3">
          Tea Party
        </h1>

        <p className="text-gray-500 font-[Gaegu] text-lg mb-6">
          행운을 전하는 모찌 토끼
        </p>

        <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 text-left">
          <p className="text-sm text-gray-600 font-[Gaegu] leading-relaxed">
            <strong>🎁 선물을 받으셨나요?</strong><br />
            인형의 NFC를 터치해주세요!<br /><br />
            <strong>✍️ 메시지를 등록하려면?</strong><br />
            제품과 함께 받은 카드의<br />
            QR 코드를 스캔해주세요!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
