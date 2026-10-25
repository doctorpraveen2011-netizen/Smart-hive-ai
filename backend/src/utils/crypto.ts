import crypto from 'crypto';

export function calculateSha256(content: string | object): string {
  const data = typeof content === 'string' ? content : JSON.stringify(content);
  return crypto.createHash('sha256').update(data).digest('hex');
}
