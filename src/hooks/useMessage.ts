'use client';

import { useState, useTransition } from 'react';
import { createMessage, markAsOpened } from '@/actions/messages';
import type { FortuneTheme } from '@/types';

interface UseMessageReturn {
  generatedUrl: string | null;
  isLoading: boolean;
  error: string | null;
  handleCreate: (content: string, color: FortuneTheme) => Promise<boolean>;
  handleMarkOpened: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useMessage(): UseMessageReturn {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (content: string, color: FortuneTheme): Promise<boolean> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        setError(null);

        const formData = new FormData();
        formData.append('content', content);
        formData.append('color', color);

        const result = await createMessage(formData);

        if (!result.success) {
          setError(result.error || '메시지 생성에 실패했습니다');
          resolve(false);
          return;
        }

        if (result.data) {
          const baseUrl = window.location.origin;
          setGeneratedUrl(`${baseUrl}${result.data.url}`);
        }
        resolve(true);
      });
    });
  };

  const handleMarkOpened = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        const result = await markAsOpened(id);
        resolve(result.success);
      });
    });
  };

  const clearError = () => setError(null);

  return {
    generatedUrl,
    isLoading: isPending,
    error,
    handleCreate,
    handleMarkOpened,
    clearError,
  };
}
