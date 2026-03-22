// src/data/fortunes.ts

export type FortuneTheme = 'pink' | 'yellow' | 'white' | 'purple' | 'soda';

interface FortuneMeta {
  name: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  image: string;
  desc: string;
}

export const fortunes: Record<FortuneTheme, FortuneMeta> = {
  pink: {
    name: "벚꽃 모찌",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    icon: "🌸",
    image: "/images/mochi/pink.svg",
    desc: "연애운 & 설렘",
  },
  yellow: {
    name: "유자 모찌",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "🍊",
    image: "/images/mochi/yellow.svg",
    desc: "재물운 & 득템",
  },
  white: {
    name: "우유 모찌",
    color: "text-stone-600",
    bg: "bg-stone-50",
    border: "border-stone-200",
    icon: "🥛",
    image: "/images/mochi/white.svg",
    desc: "건강운 & 치유",
  },
  purple: {
    name: "블루베리 모찌",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "🫐",
    image: "/images/mochi/purple.svg",
    desc: "학업운 & 지혜",
  },
  soda: {
    name: "소다 모찌",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: "🥤",
    image: "/images/mochi/soda.svg",
    desc: "액막이 & 상쾌",
  }
};
