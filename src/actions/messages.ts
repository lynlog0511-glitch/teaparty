'use server';

import { createClient } from '@/lib/supabase/server';
import { messageSchema } from '@/lib/utils/validation';
import { sanitizeMessage } from '@/lib/utils/sanitize';
import type { Message, FortuneTheme } from '@/types';
import type { MessageRow, MessageInsert, MessageUpdate } from '@/types/database';

function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    content: row.content,
    color: row.color as FortuneTheme,
    createdAt: new Date(row.created_at),
    firstOpenedAt: row.first_opened_at ? new Date(row.first_opened_at) : null,
    openCount: row.open_count,
  };
}

function generateId(): string {
  return crypto.randomUUID();
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createMessage(
  formData: FormData
): Promise<ActionResult<{ id: string; url: string }>> {
  try {
    const rawContent = formData.get('content');
    const rawColor = formData.get('color');

    const validation = messageSchema.safeParse({
      content: rawContent,
      color: rawColor || 'pink',
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return {
        success: false,
        error: firstError?.message || '유효하지 않은 입력입니다',
      };
    }

    const { content, color } = validation.data;
    const sanitizedContent = sanitizeMessage(content);
    const id = generateId();

    const supabase = await createClient();
    const insertData: MessageInsert = {
      id,
      content: sanitizedContent,
      color,
    };
    const { error } = await supabase.from('messages').insert(insertData);

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        success: false,
        error: '메시지 저장에 실패했습니다',
      };
    }

    return {
      success: true,
      data: {
        id,
        url: `/?id=${id}`,
      },
    };
  } catch (err) {
    console.error('createMessage error:', err);
    return {
      success: false,
      error: '서버 오류가 발생했습니다',
    };
  }
}

export async function registerMessage(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const rawId = formData.get('id');
    const rawContent = formData.get('content');
    const rawColor = formData.get('color');

    if (!rawId || typeof rawId !== 'string') {
      return {
        success: false,
        error: '유효하지 않은 ID입니다',
      };
    }

    const validation = messageSchema.safeParse({
      content: rawContent,
      color: rawColor || 'pink',
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return {
        success: false,
        error: firstError?.message || '유효하지 않은 입력입니다',
      };
    }

    // Check if already registered
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from('messages')
      .select('id')
      .eq('id', rawId)
      .single();

    if (existing) {
      return {
        success: false,
        error: '이미 등록된 선물입니다',
      };
    }

    const { content, color } = validation.data;
    const sanitizedContent = sanitizeMessage(content);

    const insertData: MessageInsert = {
      id: rawId,
      content: sanitizedContent,
      color,
    };
    const { error } = await supabase.from('messages').insert(insertData);

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        success: false,
        error: '메시지 저장에 실패했습니다',
      };
    }

    return {
      success: true,
      data: { id: rawId },
    };
  } catch (err) {
    console.error('registerMessage error:', err);
    return {
      success: false,
      error: '서버 오류가 발생했습니다',
    };
  }
}

export async function getMessage(id: string): Promise<ActionResult<Message>> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        error: '유효하지 않은 메시지 ID입니다',
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: '메시지를 찾을 수 없습니다',
      };
    }

    return {
      success: true,
      data: toMessage(data),
    };
  } catch (err) {
    console.error('getMessage error:', err);
    return {
      success: false,
      error: '서버 오류가 발생했습니다',
    };
  }
}

export async function markAsOpened(id: string): Promise<ActionResult<Message>> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        error: '유효하지 않은 메시지 ID입니다',
      };
    }

    const supabase = await createClient();

    // First get current state
    const { data: current, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return {
        success: false,
        error: '메시지를 찾을 수 없습니다',
      };
    }

    // Prepare update data
    const updateData: MessageUpdate = {
      open_count: current.open_count + 1,
    };

    // Only set first_opened_at if not already set
    if (!current.first_opened_at) {
      updateData.first_opened_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('messages')
      .update(updateData as MessageUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('markAsOpened update error:', error);
      return {
        success: false,
        error: '메시지 업데이트에 실패했습니다',
      };
    }

    return {
      success: true,
      data: toMessage(data),
    };
  } catch (err) {
    console.error('markAsOpened error:', err);
    return {
      success: false,
      error: '서버 오류가 발생했습니다',
    };
  }
}
