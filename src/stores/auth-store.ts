import { defineStore } from 'pinia';
import {
  checkRegisterCode as checkRegisterCodeRequest,
  login as loginRequest,
  sendRegisterCode as sendRegisterCodeRequest,
  setRegisterPassword as setRegisterPasswordRequest,
} from '@/api/auth';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

function setStoredToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: '',
    verificationToken: '',
    token: '',
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    hydrate() {
      this.token = getStoredToken();
    },
    async login(email: string, password: string) {
      this.isLoading = true;

      try {
        const response = await loginRequest({
          email,
          password,
        });

        this.email = email;
        this.token = response.data.attributes.token;
        setStoredToken(this.token);
      } finally {
        this.isLoading = false;
      }
    },
    async sendRegisterCode(email: string) {
      this.isLoading = true;

      try {
        await sendRegisterCodeRequest({ email });
        this.email = email;
      } finally {
        this.isLoading = false;
      }
    },
    async checkRegisterCode(code: string) {
      this.isLoading = true;

      try {
        const response = await checkRegisterCodeRequest({
          email: this.email,
          code,
        });

        this.verificationToken = response.data.token;
      } finally {
        this.isLoading = false;
      }
    },
    async setRegisterPassword(password: string) {
      this.isLoading = true;

      try {
        const response = await setRegisterPasswordRequest({
          token: this.verificationToken,
          password,
        });

        const token = response.data?.attributes?.token || response.data?.token || '';

        this.token = token;
        setStoredToken(token);
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.email = '';
      this.verificationToken = '';
      this.token = '';
      this.isLoading = false;
      setStoredToken('');
    },
  },
});
