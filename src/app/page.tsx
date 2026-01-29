'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../utils/supabaseClient'; 
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MailOpen, Save, Mail } from 'lucide-react';
import { fortunes, FortuneTheme } from '../data/fortunes';

function HomeContent() {
  const searchParams = useSearchParams();
  const rabbitId = searchParams.get('id');

  // 모드 state
  const [mode, setMode] = useState<'loading' | 'create' | 'gift' | 'fortune'>('loading');
  
  // 데이터 state
  const [dbMessage, setDbMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState<FortuneTheme>('pink');
  
  // 작성 모드 state
  const [inputMsg, setInputMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 선물/운세 모드 state
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [fortuneText, setFortuneText] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  // 테마 설정
  const theme = fortunes[selectedColor] || fortunes.pink;

  // 1. 초기 진입 체크
  useEffect(() => {
    async function checkRabbit() {
      if (!rabbitId) {
        setMode('fortune'); 
        return;
      }

      const { data, error } = await supabase
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
          // 운세 모드라면, 오늘 이미 뽑은 운세가 있는지 확인해서 보여줌
          checkTodayFortune(data.color);
        } else {
          setMode('gift');
        }
      } else {
        setMode('create');
      }
    }
    checkRabbit();
  }, [rabbitId]);

  // 오늘 이미 뽑은 운세가 있는지 확인하는 함수
  const checkTodayFortune = (color: string) => {
    const todayStr = new Date().toDateString(); // "Fri Jan 30 2026"
    const savedDate = localStorage.getItem(`fortune_date_${color}`);
    const savedContent = localStorage.getItem(`fortune_content_${color}`);

    // 날짜가 같고 내용이 저장되어 있으면 -> 카드 뒤집힌 상태로 바로 보여줌
    if (savedDate === todayStr && savedContent) {
        setFortuneText(savedContent);
        setIsFlipped(true);
    }
  };

  // --- 작성 모드: 저장 ---
  const saveMessage = async () => {
    if (!inputMsg.trim()) return alert("메시지를 입력해주세요!");
    if (!rabbitId) return alert("잘못된 접근입니다");

    setIsSaving(true);
    const { error } = await supabase
      .from('messages')
      .upsert({ id: rabbitId, content: inputMsg, color: selectedColor });

    if (!error) {
      alert("행운을 담았습니다! 🍀");
      localStorage.setItem(`visited_${rabbitId}`, 'true');
      setMode('fortune');
    }
    setIsSaving(false);
  };

  // --- 선물 모드: 저장 ---
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

  // --- [핵심] 운세 뽑기 (중복 방지 랜덤) ---
  const drawFortune = async () => {
    if (isFlipped) return; // 이미 뒤집혔으면 클릭 방지

    // 1. 현재 테마 확인
    const currentTheme = mode === 'create' ? selectedColor : (searchParams.get('color') as FortuneTheme || selectedColor);
    
    // 2. 이미 본 번호 리스트 가져오기 (localStorage)
    const seenJson = localStorage.getItem(`seen_ids_${currentTheme}`);
    let seenIds: number[] = seenJson ? JSON.parse(seenJson) : [];

    // 만약 366개를 다 봤다면? -> 리셋!
    if (seenIds.length >= 366) {
        seenIds = [];
    }

    // 3. 안 본 번호 뽑기 (랜덤 뺑뺑이)
    let randomId = 0;
    while (true) {
        randomId = Math.floor(Math.random() * 366) + 1; // 1 ~ 366 랜덤
        if (!seenIds.includes(randomId)) {
            break; // 안 본 번호면 당첨! 반복문 탈출
        }
    }

    // 4. DB에서 해당 번호 가져오기
    const { data, error } = await supabase
      .from('daily_fortunes')
      .select('content')
      .eq('theme', currentTheme)
      .eq('day_number', randomId)
      .maybeSingle();

    if (data && data.content) {
      // 5. 결과 저장 및 보여주기
      const todayStr = new Date().toDateString();
      
      setFortuneText(data.content);
      
      // "오늘 본 운세"로 저장 (새로고침 해도 유지되게)
      localStorage.setItem(`fortune_date_${currentTheme}`, todayStr);
      localStorage.setItem(`fortune_content_${currentTheme}`, data.content);
      
      // "이미 본 번호 리스트"에 추가
      seenIds.push(randomId);
      localStorage.setItem(`seen_ids_${currentTheme}`, JSON.stringify(seenIds));
      
      setIsFlipped(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setFortuneText("행운이 오고 있어요! (다시 눌러보세요)");
    }
  };

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDF5] relative overflow-hidden font-[Gaegu]`}>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#5D4037 1px, transparent 1px), linear-gradient(90deg, #5D4037 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <AnimatePresence mode='wait'>
        {mode === 'loading' && <div className="animate-pulse text-[#5D4037]">토끼 찾는 중... 🐰</div>}

        {/* 작성 모드 */}
        {mode === 'create' && (
          <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm z-10">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#5D4037] mb-2">토끼가 비어있어요!</h1>
              <p className="text-gray-500">행운을 담아주세요</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
              {/* 색상 선택 */}
              <div className="flex justify-between mb-6 px-1 gap-1">
                {(Object.keys(fortunes) as FortuneTheme[]).map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${selectedColor === color ? 'scale-110 border-[#5D4037] shadow-md' : 'border-transparent opacity-50 hover:opacity-100'} ${fortunes[color].bg}`}>{fortunes[color].icon}</button>
                ))}
              </div>
              <textarea value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="친구에게 전할 말..." className="w-full h-32 p-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 focus:outline-none text-lg resize-none mb-6" />
              <button onClick={saveMessage} disabled={isSaving} className="w-full bg-[#5D4037] text-white py-4 rounded-xl text-xl font-bold shadow-lg flex items-center justify-center gap-2">{isSaving ? "저장 중..." : <><Save size={20} /> 행운 담기</>}</button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">ID: {rabbitId}</p>
          </motion.div>
        )}

        {/* 선물 모드 */}
        {mode === 'gift' && (
          <motion.div key="gift" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 text-center w-full max-w-sm">
            <div className="mb-8 text-[#5D4037] text-2xl font-bold">누군가 행운을 보냈어요! 💌</div>
            <motion.button onClick={openGift} className={`relative w-full aspect-[4/3] rounded-3xl shadow-xl flex items-center justify-center border-4 border-dashed cursor-pointer ${theme.bg} ${theme.border}`}>
              <Heart className={`w-20 h-20 animate-bounce ${theme.color}`} fill="currentColor" />
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
                <button onClick={() => setIsLetterOpen(true)} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400"><Mail size={16} /></button>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${theme.bg} ${theme.color} border ${theme.border}`}>{theme.name}</span>
              </div>
            </header>

            <div className="bg-white p-5 pb-8 rounded-[2rem] shadow-lg border-2 border-stone-100">
              <div className={`aspect-square rounded-[1.5rem] ${theme.bg} mb-6 flex items-center justify-center text-9xl border-2 ${theme.border}`}>{theme.icon}</div>
              <div className="relative min-h-[120px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl p-4 border border-stone-100">
                 {!isFlipped ? (
                   <button onClick={drawFortune} className="animate-pulse text-gray-400 flex flex-col items-center w-full h-full justify-center">
                     <Sparkles className="w-8 h-8 mb-2 text-yellow-400" fill="currentColor" />
                     <span className="text-lg">카드를 톡! 눌러보세요</span>
                   </button>
                 ) : (
                   <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                     <p className="text-[#5D4037] text-2xl font-medium break-keep leading-relaxed">"{fortuneText}"</p>
                   </motion.div>
                 )}
              </div>
            </div>

            {isLetterOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <motion.div className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative flex flex-col items-center">
                        <button onClick={() => setIsLetterOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
                        <h3 className="text-xl font-bold text-[#5D4037] mb-4">보관된 편지 💌</h3>
                        <div className="bg-gray-50 p-5 rounded-xl w-full border border-dashed border-gray-300 text-center text-[#5D4037] text-lg">{dbMessage || "저장된 편지가 없어요."}</div>
                    </motion.div>
                </div>
            )}
            
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-8 text-gray-300 text-sm underline w-full text-center">[테스트] 초기화</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF5]" />}>
      <HomeContent />
    </Suspense>
  );
}