import type { ApiResponse } from '@/models/common/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginAttributes {
  token: string;
  expires_at: string;
}

export interface LoginData {
  id: string;
  type: string;
  attributes: LoginAttributes;
}

export type LoginResponse = ApiResponse<LoginData>;
