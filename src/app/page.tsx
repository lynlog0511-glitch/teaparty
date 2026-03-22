'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MailOpen, Mail, Clock, Share2, Copy, Check, ScrollText, PenLine, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface FortuneHistoryEntry {
  day: number;
  content: string;
  date: string;
}
import { fortunes, FortuneTheme } from '../data/fortunes';

const witchformUrl = process.env.NEXT_PUBLIC_WITCHFORM_URL || '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

function MochiImage({ theme, size = 64, className = '' }: { theme: typeof fortunes[FortuneTheme]; size?: number; className?: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !theme.image) {
    return <span className={className} style={{ fontSize: size * 0.6 }}>{theme.icon}</span>;
  }

  return (
    <Image
      src={theme.image}
      alt={theme.name}
      width={size}
      height={size}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const rabbitId = searchParams.get('id');

  const [mode, setMode] = useState<'loading' | 'landing' | 'waiting' | 'gift' | 'fortune'>('loading');
  const [dbMessage, setDbMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState<FortuneTheme>('pink');
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [fortuneText, setFortuneText] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [fortuneHistory, setFortuneHistory] = useState<FortuneHistoryEntry[]>([]);

  const theme = fortunes[selectedColor] || fortunes.pink;

  useEffect(() => {
    async function checkRabbit() {
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
        setMode('waiting');
      }
    }
    checkRabbit();
  }, [rabbitId]);

  const checkTodayFortune = (color: string) => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem(`fortune_date_${color}`);
    const savedContent = localStorage.getItem(`fortune_content_${color}`);

    if (savedDate === todayStr && savedContent) {
      setFortuneText(savedContent);
      setIsFlipped(true);
    }

    loadFortuneHistory(color);
  };

  const loadFortuneHistory = (color: string) => {
    const historyJson = localStorage.getItem(`fortune_history_${color}`);
    if (historyJson) {
      setFortuneHistory(JSON.parse(historyJson));
    }
  };

  const addToHistory = (color: string, content: string) => {
    const historyJson = localStorage.getItem(`fortune_history_${color}`);
    const history: FortuneHistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];

    const newEntry: FortuneHistoryEntry = {
      day: history.length + 1,
      content,
      date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    };

    const newHistory = [...history, newEntry];
    localStorage.setItem(`fortune_history_${color}`, JSON.stringify(newHistory));
    setFortuneHistory(newHistory);
  };

  const shareFortune = async () => {
    const shareText = `오늘의 ${theme.name} 운세\n\n"${fortuneText}"\n\n나도 행운 받으러 가기`;
    const shareUrl = siteUrl || window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tea Party - 오늘의 운세',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyFortune();
    }
  };

  const copyFortune = async () => {
    const shareUrl = siteUrl || window.location.origin;
    const copyText = `오늘의 ${theme.name} 운세\n\n"${fortuneText}"\n\n나도 행운 받으러 가기 ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      alert('복사에 실패했어요');
    }
  };

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

      const newSeenIds = [...seenIds, randomId];
      localStorage.setItem(`seen_ids_${currentTheme}`, JSON.stringify(newSeenIds));

      addToHistory(currentTheme, data.content);

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
            <MochiImage theme={fortunes.pink} size={48} className="inline-block animate-bounce" />
            <span className="ml-2">모찌 찾는 중...</span>
          </motion.div>
        )}

        {/* ===== 랜딩 페이지 ===== */}
        {mode === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md z-10"
          >
            {/* A. 히어로 섹션 */}
            <section className="text-center pt-8 pb-12 relative">
              {/* Floating mochi decoration */}
              <div className="absolute -top-2 -left-4 opacity-20 animate-pulse">
                <MochiImage theme={fortunes.pink} size={40} />
              </div>
              <div className="absolute top-6 -right-2 opacity-15 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <MochiImage theme={fortunes.soda} size={32} />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Image
                  src="/images/logo.svg"
                  alt="Tea Party"
                  width={200}
                  height={58}
                  className="mx-auto mb-8"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-[2.5rem] leading-tight font-bold text-[#5D4037] mb-4 tracking-tight">
                  행운을 선물하세요
                </h1>
                <p className="text-[#8D7B6E] text-lg leading-relaxed mb-8 max-w-xs mx-auto">
                  핸드메이드 모찌 키링에 NFC를 터치하면, 매일 새로운 행운이 찾아와요.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {witchformUrl ? (
                  <a
                    href={witchformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-[#5D4037] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-[#5D4037]/20 hover:bg-[#4E342E] hover:shadow-xl hover:shadow-[#5D4037]/25 transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag size={20} />
                    구매하기
                  </a>
                ) : (
                  <div className="inline-block bg-stone-100 text-[#A89888] px-10 py-4 rounded-full text-lg font-bold">
                    곧 오픈 예정
                  </div>
                )}
              </motion.div>

              {/* Hero mochi showcase */}
              <motion.div
                className="flex justify-center items-end gap-3 mt-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {(Object.keys(fortunes) as FortuneTheme[]).map((color, i) => (
                  <motion.div
                    key={color}
                    className={`${fortunes[color].bg} rounded-2xl p-2 border ${fortunes[color].border} shadow-sm`}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3, ease: 'easeInOut' }}
                  >
                    <MochiImage theme={fortunes[color]} size={i === 2 ? 52 : 40} />
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2 px-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8DDD4] to-transparent" />
            </div>

            {/* B. 브랜드 스토리 섹션 */}
            <section className="my-10 px-2">
              <motion.div
                className="relative bg-gradient-to-b from-[#FFF8F0] to-[#FFFDF5] p-8 rounded-[2rem] border border-[#F0E4D8]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FFF8F0] border border-[#F0E4D8] border-b-0 border-r-0 rotate-45 rounded-tl-md" />
                <div className="text-center relative">
                  <div className="text-6xl text-[#D4C4B0] mb-1 leading-none font-serif">&ldquo;</div>
                  <p className="text-xl text-[#5D4037] font-bold leading-relaxed mb-5">
                    이 서비스는 내가 받고 싶어서<br />만든 거예요.
                  </p>
                  <div className="w-12 h-px bg-[#D4C4B0] mx-auto mb-5" />
                  <p className="text-[#8D7B6E] text-base leading-[1.8]">
                    힘든 시간을 보내면서 생각했어요.<br />
                    누군가 매일 &ldquo;괜찮아질 거야&rdquo;<br />
                    한마디만 해줬으면 좋겠다고.
                  </p>
                  <p className="text-[#B5A494] text-sm mt-5 leading-relaxed">
                    매일 하나씩, 366번의 작은 행운과 응원.<br />
                    1년 뒤에는 타임캡슐처럼 편지가 열려요.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* C. 이용 방법 섹션 */}
            <section className="mb-10 px-2">
              <h2 className="text-2xl font-bold text-[#5D4037] text-center mb-2">어떻게 사용하나요?</h2>
              <p className="text-[#B5A494] text-sm text-center mb-8">간단한 3단계로 행운을 전해요</p>
              <div className="space-y-4">
                {[
                  { step: 1, icon: <PenLine className="w-5 h-5" />, color: 'pink', text: '모찌를 선물하며 마음을 담은 편지를 써요', iconBg: 'bg-pink-50', iconColor: 'text-pink-400', stepColor: 'text-pink-400' },
                  { step: 2, icon: <Sparkles className="w-5 h-5" />, color: 'yellow', text: '받는 사람이 매일 NFC를 터치하면 행운 메시지가 나와요', iconBg: 'bg-amber-50', iconColor: 'text-amber-400', stepColor: 'text-amber-400' },
                  { step: 3, icon: <Mail className="w-5 h-5" />, color: 'purple', text: '366일 뒤, 타임캡슐이 열려요', iconBg: 'bg-violet-50', iconColor: 'text-violet-400', stepColor: 'text-violet-400' },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100/80 flex items-start gap-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                  >
                    <div className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-xs font-bold mb-1.5 ${item.stepColor} tracking-wider`}>STEP {item.step}</div>
                      <p className="text-[#5D4037] font-bold text-[15px] leading-snug">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* D. 모찌 컬렉션 섹션 */}
            <section className="mb-10 px-2">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#5D4037] mb-1">모찌 컬렉션</h2>
                <p className="text-[#B5A494] text-sm">5가지 테마, 각각 다른 행운을 담고 있어요</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(fortunes) as FortuneTheme[]).map((color, i) => {
                  const f = fortunes[color];
                  return (
                    <motion.div
                      key={color}
                      className={`${i === 0 ? 'col-span-2' : ''} bg-white rounded-2xl shadow-sm border border-stone-100/80 overflow-hidden hover:shadow-md transition-all group`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className={`${f.bg} ${i === 0 ? 'p-6 flex items-center gap-5' : 'p-4 text-center'} border-b ${f.border}`}>
                        <div className={`${i === 0 ? '' : 'mx-auto mb-2'} group-hover:scale-105 transition-transform`}>
                          <MochiImage theme={f} size={i === 0 ? 72 : 56} />
                        </div>
                        <div className={i === 0 ? 'text-left' : ''}>
                          <div className={`font-bold text-lg ${f.color}`}>{f.name}</div>
                          <div className="text-[#8D7B6E] text-sm">{f.desc}</div>
                        </div>
                      </div>
                      <div className="p-3">
                        {witchformUrl ? (
                          <a
                            href={witchformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold ${f.color} ${f.bg} border ${f.border} hover:brightness-95 transition-all`}
                          >
                            주문하기
                          </a>
                        ) : (
                          <span className="block w-full text-center py-2.5 rounded-xl text-sm font-bold text-[#B5A494] bg-stone-50 border border-stone-100">
                            준비중
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* E. 하단 CTA */}
            <section className="mx-2 mb-8">
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-[2rem] border border-pink-100/60 text-center relative overflow-hidden">
                <div className="absolute top-3 right-4 opacity-10">
                  <MochiImage theme={fortunes.pink} size={64} />
                </div>
                <Heart className="w-6 h-6 text-pink-300 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#5D4037] mb-2">선물을 받으셨나요?</h3>
                <p className="text-[#8D7B6E] text-sm leading-relaxed">
                  인형의 NFC를 터치하면<br />행운이 시작돼요!
                </p>
              </div>
            </section>

            <footer className="text-center text-[#D4C4B0] text-xs pb-6 tracking-wide">
              Tea Party
            </footer>
          </motion.div>
        )}

        {/* ===== 아직 준비 중 ===== */}
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
              <div className="mb-6">
                <MochiImage theme={fortunes.pink} size={80} className="mx-auto animate-bounce" />
              </div>
              <p className="text-gray-400 text-sm">
                조금만 기다려주세요!<br />곧 행운이 도착할 거예요
              </p>
            </div>
          </motion.div>
        )}

        {/* ===== 선물 모드 ===== */}
        {mode === 'gift' && (
          <motion.div key="gift" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 text-center w-full max-w-sm">
            <div className="mb-8 text-[#5D4037] text-2xl font-bold">누군가 행운을 보냈어요!</div>
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
                  <button onClick={saveAndCloseGift} className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg text-xl">행운 저장하기</button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== 운세 모드 ===== */}
        {mode === 'fortune' && (
          <motion.div key="fortune" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-sm">
            <header className="flex justify-between items-center mb-6 px-2">
              <Image src="/images/logo.svg" alt="Tea Party" width={140} height={40} />
              <div className="flex gap-2">
                {fortuneHistory.length > 0 && (
                  <button onClick={() => setIsHistoryOpen(true)} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-amber-500">
                    <ScrollText size={16} />
                  </button>
                )}
                {dbMessage && (
                  <button onClick={() => setIsLetterOpen(true)} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-500">
                    <Mail size={16} />
                  </button>
                )}
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${theme.bg} ${theme.color} border ${theme.border}`}>{theme.name}</span>
              </div>
            </header>

            <div className="bg-white p-5 pb-8 rounded-[2rem] shadow-lg border-2 border-stone-100">
              <div className={`aspect-square rounded-[1.5rem] ${theme.bg} mb-6 flex items-center justify-center border-2 ${theme.border}`}>
                <MochiImage theme={theme} size={160} />
              </div>
              <div className="relative min-h-[120px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl p-4 border border-stone-100">
                {!isFlipped ? (
                  <button onClick={drawFortune} className="animate-pulse text-gray-400 flex flex-col items-center w-full h-full justify-center hover:text-gray-600 transition-colors">
                    <Sparkles className="w-8 h-8 mb-2 text-yellow-400" fill="currentColor" />
                    <span className="text-lg">카드를 톡! 눌러보세요</span>
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                    <p className="text-[#5D4037] text-2xl font-medium break-keep leading-relaxed mb-4">&ldquo;{fortuneText}&rdquo;</p>
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

            <p className="mt-6 text-center text-gray-400 text-sm">매일 하루 한 번, 당신의 행운을 확인하세요</p>

            {/* 다른 모찌 구경하기 */}
            <a
              href="/"
              className="mt-6 flex items-center justify-center gap-3 bg-white p-4 rounded-2xl shadow-md border-2 border-stone-100 hover:shadow-lg transition-all group"
            >
              <div className="flex -space-x-2">
                {(Object.keys(fortunes) as FortuneTheme[]).map((color) => (
                  <span
                    key={color}
                    className={`w-8 h-8 rounded-full ${fortunes[color].bg} border-2 border-white flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform`}
                  >
                    <MochiImage theme={fortunes[color]} size={28} />
                  </span>
                ))}
              </div>
              <span className="text-[#5D4037] font-bold">다른 모찌 구경하기 &rarr;</span>
            </a>

            {isLetterOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative flex flex-col items-center">
                  <button onClick={() => setIsLetterOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
                  <MailOpen className="text-pink-400 w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold text-[#5D4037] mb-4">보관된 편지</h3>
                  <div className="bg-gray-50 p-5 rounded-xl w-full border border-dashed border-gray-300 text-center text-[#5D4037] text-lg">{dbMessage}</div>
                </motion.div>
              </div>
            )}

            {/* 운세 히스토리 모달 */}
            {isHistoryOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative max-h-[80vh] flex flex-col">
                  <button onClick={() => setIsHistoryOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">&times;</button>
                  <div className="flex items-center gap-2 mb-4">
                    <ScrollText className="text-amber-500 w-6 h-6" />
                    <h3 className="text-xl font-bold text-[#5D4037]">운세 히스토리</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">지금까지 받은 {fortuneHistory.length}개의 행운</p>

                  <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                    {[...fortuneHistory].reverse().map((entry) => (
                      <div key={entry.day} className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold ${theme.color}`}>Day {entry.day}</span>
                          <span className="text-gray-400 text-sm">{entry.date}</span>
                        </div>
                        <p className="text-[#5D4037] text-sm break-keep">&ldquo;{entry.content}&rdquo;</p>
                      </div>
                    ))}
                  </div>
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
