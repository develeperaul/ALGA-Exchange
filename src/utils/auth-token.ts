const AUTH_TOKEN_STORAGE_KEY = 'auth_token';

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
