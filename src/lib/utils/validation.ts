import { z } from 'zod';
import type { FortuneTheme } from '@/types';

export const MESSAGE_MAX_LENGTH = 500;

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, '메시지를 입력해주세요')
    .max(MESSAGE_MAX_LENGTH, `메시지는 ${MESSAGE_MAX_LENGTH}자를 넘을 수 없습니다`)
    .transform((val) => val.trim()),
  color: z.enum(['green', 'pink', 'yellow', 'white', 'black'] as const).default('pink'),
});

export type MessageInput = z.infer<typeof messageSchema>;

export function validateMessage(data: unknown): {
  success: boolean;
  data?: MessageInput;
  error?: string;
} {
  const result = messageSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || '유효하지 않은 입력입니다',
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function isValidFortuneTheme(value: string): value is FortuneTheme {
  return ['green', 'pink', 'yellow', 'white', 'black'].includes(value);
}
