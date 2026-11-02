import { getSessionScope, readSession, replaceSession } from '@/api/session';

/** Legacy callers use the isolated, versioned session; auth_token is never read. */
export function getStoredToken() {
  return (getSessionScope().session || readSession())?.token || '';
}
export function setStoredToken(token: string) {
  replaceSession(token.trim() ? { token, expires_at: null } : null);
}
