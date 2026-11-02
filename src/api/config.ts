/** Public build-time settings. Base URL is an origin/deployment root, not /api. */
export const apiMode: 'api' | 'mock' = import.meta.env.VITE_API_MODE === 'mock' ? 'mock' : 'api';
export const isMockMode = apiMode === 'mock';
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export function requireMockMode() {
  if (!isMockMode) throw new Error('Этот раздел пока недоступен в режиме API');
}
