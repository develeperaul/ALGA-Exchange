import type { ApiResponse } from '@/models/common/api';
import type { LoginData } from './login';

export interface SendResetPasswordCodePayload {
  email: string;
}

export interface CheckResetPasswordCodePayload {
  email: string;
  code: string;
}

export interface SetResetPasswordPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordCodeData {
  status: string;
}

export interface ResetPasswordCodeCheckData {
  token: string;
}

/** API Auth resource; identical to the login response contract. */
export type ResetPasswordPasswordData = LoginData;

export type ResetPasswordCodeResponse = ApiResponse<ResetPasswordCodeData>;
export type ResetPasswordCodeCheckResponse = ApiResponse<ResetPasswordCodeCheckData>;
export type ResetPasswordPasswordResponse = ApiResponse<ResetPasswordPasswordData>;
