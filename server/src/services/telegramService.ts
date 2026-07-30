import { createHmac } from 'crypto';

export function verifyTelegramInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .filter(([k]) => k !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const validHash = createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return validHash === hash;
}

export function parseTelegramUser(initData: string) {
  const params = new URLSearchParams(initData);
  const userData = params.get('user');
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}