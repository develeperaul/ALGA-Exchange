import { apiMode } from './config';

export interface AuthSession { token: string; expires_at: string | null }
export const SESSION_STORAGE_KEY = `alga:session:v1:${apiMode}`;
let session: AuthSession | null = null;
let epoch = 0;
let controller = new AbortController();
const listeners = new Set<() => void>();
export const getSessionScope = () => ({ epoch, session, signal: controller.signal });
export const isCurrentSession = (value: number) => epoch === value;
export const onSessionChange = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export function isValidSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as AuthSession;
  return typeof candidate.token === 'string' && Boolean(candidate.token.trim())
    && (candidate.expires_at === null || (typeof candidate.expires_at === 'string'
      && Number.isFinite(Date.parse(candidate.expires_at)) && Date.parse(candidate.expires_at) > Date.now()));
}
export function readSession(): AuthSession | null {
  try {
    if (typeof window === 'undefined') return null;
    const value: unknown = JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_KEY) || 'null');
    if (isValidSession(value)) return { token: value.token, expires_at: value.expires_at };
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch { /* Storage may be unavailable; in-memory authentication still works. */ }
  return null;
}
export function replaceSession(value: AuthSession | null) {
  controller.abort();
  controller = new AbortController();
  epoch += 1;
  session = value;
  try {
    if (typeof window !== 'undefined') {
      if (value) window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: value.token, expires_at: value.expires_at }));
      else window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch { /* Keep session in memory when browser storage is disabled. */ }
  listeners.forEach(listener => listener());
  return epoch;
}
export function clearSession(expectedEpoch?: number) {
  if (expectedEpoch !== undefined && !isCurrentSession(expectedEpoch)) return;
  replaceSession(null);
}
