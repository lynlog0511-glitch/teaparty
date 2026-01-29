export type Mode = 'create' | 'gift' | 'fortune';

export type FortuneTheme = 'green' | 'pink' | 'yellow' | 'white' | 'black';

export interface Message {
  id: string;
  content: string;
  color: FortuneTheme;
  createdAt: Date;
  firstOpenedAt: Date | null;
  openCount: number;
}

export interface ThemeConfig {
  name: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  desc: string;
  messages: string[];
}

export type FortuneThemes = Record<FortuneTheme, ThemeConfig>;
