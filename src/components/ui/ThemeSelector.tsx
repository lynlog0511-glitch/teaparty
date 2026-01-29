'use client';

import { fortunes } from '@/data/fortunes';
import type { FortuneTheme } from '@/types';

interface ThemeSelectorProps {
  selected: FortuneTheme;
  onSelect: (theme: FortuneTheme) => void;
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  const themes = Object.keys(fortunes) as FortuneTheme[];

  return (
    <div className="flex justify-between px-2">
      {themes.map((color) => {
        const theme = fortunes[color];
        const isSelected = selected === color;

        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all border-2
              ${isSelected ? 'scale-110 border-[#5D4037] shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}
              ${theme.bg}
            `}
            aria-label={`${theme.name} 선택`}
            aria-pressed={isSelected}
          >
            {theme.icon}
          </button>
        );
      })}
    </div>
  );
}
