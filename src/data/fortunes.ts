// src/data/fortunes.ts
// 이제 메시지 배열(messages)은 필요 없고, 테마 정보만 남깁니다!

export type FortuneTheme = 'pink' | 'yellow' | 'white' | 'purple' | 'soda';

interface FortuneMeta {
  name: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  desc: string;
}

export const fortunes: Record<FortuneTheme, FortuneMeta> = {
  pink: {
    name: "벚꽃 모찌",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    icon: "🌸",
    desc: "연애운 & 설렘",
  },
  yellow: {
    name: "유자 모찌",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "🍊", 
    desc: "재물운 & 득템",
  },
  white: {
    name: "우유 모찌",
    color: "text-stone-600",
    bg: "bg-stone-50",
    border: "border-stone-200",
    icon: "🥛",
    desc: "건강운 & 치유",
  },
  purple: {
    name: "블루베리 모찌",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "🫐",
    desc: "학업운 & 지혜",
  },
  soda: {
    name: "소다 모찌",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: "🥤",
    desc: "액막이 & 상쾌",
  }
};