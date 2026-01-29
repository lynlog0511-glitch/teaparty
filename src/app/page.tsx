'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MailOpen, Mail, Clock, Share2, Copy, Check } from 'lucide-react';
import { fortunes, FortuneTheme } from '../data/fortunes';

function HomeContent() {
  const searchParams = useSearchParams();
  const rabbitId = searchParams.get('id');

  // 모드 state: 'loading' | 'landing' | 'waiting' | 'gift' | 'fortune'
  const [mode, setMode] = useState<'loading' | 'landing' | 'waiting' | 'gift' | 'fortune'>('loading');

  // 데이터 state
  const [dbMessage, setDbMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState<FortuneTheme>('pink');

  // 선물/운세 모드 state
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [fortuneText, setFortuneText] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 테마 설정
  const theme = fortunes[selectedColor] || fortunes.pink;

  // 1. 초기 진입 체크
  useEffect(() => {
    async function checkRabbit() {
      // ID가 없으면 랜딩 페이지
      if (!rabbitId) {
        setMode('landing');
        return;
      }

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('id', rabbitId)
        .single();

      if (data && data.content) {
        setSelectedColor(data.color as FortuneTheme);
        setDbMessage(data.content);

        const hasVisited = localStorage.getItem(`visited_${rabbitId}`);
        if (hasVisited) {
          setMode('fortune');
          checkTodayFortune(data.color);
        } else {
          setMode('gift');
        }
      } else {
        // 메시지가 없으면 "아직 준비 중" 페이지
        setMode('waiting');
      }
    }
    checkRabbit();
  }, [rabbitId]);

  // 오늘 이미 뽑은 운세가 있는지 확인하는 함수
  const checkTodayFortune = (color: string) => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem(`fortune_date_${color}`);
    const savedContent = localStorage.getItem(`fortune_content_${color}`);

    if (savedDate === todayStr && savedContent) {
      setFortuneText(savedContent);
      setIsFlipped(true);
    }
  };

  // --- 공유하기 ---
  const shareFortune = async () => {
    const shareText = `🐰 오늘의 ${theme.name} 운세\n\n"${fortuneText}"\n\n나도 행운 받으러 가기 👉`;
    const shareUrl = window.location.origin;

    // Web Share API 지원 시
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tea Party - 오늘의 운세',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // 사용자가 취소한 경우
      }
    } else {
      // 미지원 시 클립보드 복사
      copyFortune();
    }
  };

  const copyFortune = async () => {
    const copyText = `🐰 오늘의 ${theme.name} 운세\n\n"${fortuneText}"\n\n나도 행운 받으러 가기 👉 ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert('복사에 실패했어요');
    }
  };

  // --- 선물 모드 ---
  const openGift = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD1DC', '#FFF59D', '#C8E6C9'] });
    setIsOpen(true);
  };

  const saveAndCloseGift = () => {
    if (rabbitId) localStorage.setItem(`visited_${rabbitId}`, 'true');
    setIsOpen(false);
    setTimeout(() => {
      setMode('fortune');
      checkTodayFortune(selectedColor);
    }, 300);
  };

  // --- 운세 뽑기 (중복 방지 랜덤) ---
  const drawFortune = async () => {
    if (isFlipped) return;

    const currentTheme = selectedColor;

    const seenJson = localStorage.getItem(`seen_ids_${currentTheme}`);
    let seenIds: number[] = seenJson ? JSON.parse(seenJson) : [];

    if (seenIds.length >= 366) {
      seenIds = [];
    }

    let randomId = 0;
    while (true) {
      randomId = Math.floor(Math.random() * 366) + 1;
      if (!seenIds.includes(randomId)) {
        break;
      }
    }

    const { data } = await supabase
      .from('daily_fortunes')
      .select('content')
      .eq('theme', currentTheme)
      .eq('day_number', randomId)
      .maybeSingle();

    if (data && data.content) {
      const todayStr = new Date().toDateString();

      setFortuneText(data.content);
      localStorage.setItem(`fortune_date_${currentTheme}`, todayStr);
      localStorage.setItem(`fortune_content_${currentTheme}`, data.content);

      seenIds.push(randomId);
      localStorage.setItem(`seen_ids_${currentTheme}`, JSON.stringify(seenIds));

      setIsFlipped(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setFortuneText("행운이 오고 있어요! (다시 눌러보세요)");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDF5] relative overflow-hidden font-[Gaegu]">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#5D4037 1px, transparent 1px), linear-gradient(90deg, #5D4037 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <AnimatePresence mode='wait'>
        {mode === 'loading' && (
          <motion.div key="loading" className="animate-pulse text-[#5D4037] text-xl">
            모찌 찾는 중... 🐰
          </motion.div>
        )}

        {/* 랜딩 페이지 (메인) */}
        {mode === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md z-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#5D4037] mb-2">Tea Party 🫖</h1>
              <p className="text-gray-500 text-lg">행운을 전하는 모찌 토끼</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100 mb-6">
              <h2 className="text-xl font-bold text-[#5D4037] mb-4 text-center">모찌 컬렉션</h2>
              <div className="space-y-4">
                {(Object.keys(fortunes) as FortuneTheme[]).map((color) => {
                  const f = fortunes[color];
                  return (
                    <div
                      key={color}
                      className={`flex items-center gap-4 p-4 rounded-2xl ${f.bg} border ${f.border}`}
                    >
                      <div className="text-4xl">{f.icon}</div>
                      <div className="flex-1">
                        <div className={`font-bold text-lg ${f.color}`}>{f.name}</div>
                        <div className="text-gray-500 text-sm">{f.desc}</div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('준비 중이에요! 곧 만나요 🐰'); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold ${f.color} bg-white border ${f.border} hover:scale-105 transition-transform shadow-sm`}
                      >
                        구매하기
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 text-center">
              <p className="text-gray-600 text-sm">
                <strong>🎁 선물을 받으셨나요?</strong><br />
                인형의 NFC를 터치해주세요!<br /><br />
                <strong>✍️ 메시지를 등록하려면?</strong><br />
                제품과 함께 받은 카드의 QR 코드를 스캔해주세요!
              </p>
            </div>
          </motion.div>
        )}

        {/* 아직 준비 중 (메시지 미등록) */}
        {mode === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm z-10 text-center"
          >
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-stone-100">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#5D4037] mb-3">아직 준비 중이에요</h1>
              <p className="text-gray-500 text-lg mb-6">
                선물을 보내는 분이<br />메시지를 등록하는 중입니다
              </p>
              <div className="text-6xl mb-6 animate-bounce">🐰</div>
              <p className="text-gray-400 text-sm">
                조금만 기다려주세요!<br />곧 행운이 도착할 거예요
              </p>
            </div>
          </motion.div>
        )}

        {/* 선물 모드 */}
        {mode === 'gift' && (
          <motion.div key="gift" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 text-center w-full max-w-sm">
            <div className="mb-8 text-[#5D4037] text-2xl font-bold">누군가 행운을 보냈어요! 💌</div>
            <motion.button
              onClick={openGift}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full aspect-[4/3] rounded-3xl shadow-xl flex items-center justify-center border-4 border-dashed cursor-pointer ${theme.bg} ${theme.border}`}
            >
              <Heart className={`w-20 h-20 animate-bounce ${theme.color}`} fill="currentColor" />
              <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow-md transform rotate-12 border-2 border-white">
                Touch Me!
              </div>
            </motion.button>
            {isOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative border-8 border-pink-100 flex flex-col items-center">
                  <MailOpen className="text-pink-400 w-10 h-10 mb-4" />
                  <p className="text-[#5D4037] text-xl mb-8 break-keep">{dbMessage}</p>
                  <button onClick={saveAndCloseGift} className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg text-xl">행운 저장하기 🍀</button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* 운세 모드 */}
        {mode === 'fortune' && (
          <motion.div key="fortune" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-sm">
            <header className="flex justify-between items-center mb-6 px-2">
              <h1 className="text-3xl font-bold text-[#5D4037]">Tea Party 🫖</h1>
              <div className="flex gap-2">
                {dbMessage && (
                  <button onClick={() => setIsLetterOpen(true)} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-500">
                    <Mail size={16} />
                  </button>
                )}
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${theme.bg} ${theme.color} border ${theme.border}`}>{theme.name}</span>
              </div>
            </header>

            <div className="bg-white p-5 pb-8 rounded-[2rem] shadow-lg border-2 border-stone-100">
              <div className={`aspect-square rounded-[1.5rem] ${theme.bg} mb-6 flex items-center justify-center text-9xl border-2 ${theme.border}`}>{theme.icon}</div>
              <div className="relative min-h-[120px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl p-4 border border-stone-100">
                {!isFlipped ? (
                  <button onClick={drawFortune} className="animate-pulse text-gray-400 flex flex-col items-center w-full h-full justify-center hover:text-gray-600 transition-colors">
                    <Sparkles className="w-8 h-8 mb-2 text-yellow-400" fill="currentColor" />
                    <span className="text-lg">카드를 톡! 눌러보세요</span>
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                    <p className="text-[#5D4037] text-2xl font-medium break-keep leading-relaxed mb-4">"{fortuneText}"</p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={shareFortune}
                        className="flex items-center gap-1 px-4 py-2 bg-[#5D4037] text-white rounded-xl text-sm font-bold hover:bg-[#4E342E] transition-colors"
                      >
                        <Share2 size={16} /> 공유하기
                      </button>
                      <button
                        onClick={copyFortune}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                          isCopied
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {isCopied ? <><Check size={16} /> 복사됨!</> : <><Copy size={16} /> 복사</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-gray-400 text-sm">매일 하루 한 번, 당신의 행운을 확인하세요 🍀</p>

            {/* 다른 모찌 구경하기 버튼 */}
            <a
              href="/"
              className="mt-6 flex items-center justify-center gap-3 bg-white p-4 rounded-2xl shadow-md border-2 border-stone-100 hover:shadow-lg transition-all group"
            >
              <div className="flex -space-x-2">
                {(Object.keys(fortunes) as FortuneTheme[]).map((color) => (
                  <span
                    key={color}
                    className={`w-8 h-8 rounded-full ${fortunes[color].bg} border-2 border-white flex items-center justify-center text-sm group-hover:scale-110 transition-transform`}
                  >
                    {fortunes[color].icon}
                  </span>
                ))}
              </div>
              <span className="text-[#5D4037] font-bold">다른 모찌 구경하기 →</span>
            </a>

            {isLetterOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative flex flex-col items-center">
                  <button onClick={() => setIsLetterOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                  <MailOpen className="text-pink-400 w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold text-[#5D4037] mb-4">보관된 편지 💌</h3>
                  <div className="bg-gray-50 p-5 rounded-xl w-full border border-dashed border-gray-300 text-center text-[#5D4037] text-lg">{dbMessage}</div>
                </motion.div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center font-[Gaegu] text-[#5D4037]">로딩 중...</div>}>
      <HomeContent />
    </Suspense>
  );
}
