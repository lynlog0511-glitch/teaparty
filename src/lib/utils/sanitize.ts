import DOMPurify from 'dompurify';

export function sanitizeMessage(input: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }

  // Client-side: use DOMPurify
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

export function sanitizeForDisplay(input: string): string {
  if (typeof window === 'undefined') {
    return input;
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['br'],
    ALLOWED_ATTR: [],
  });
}
