import type { ApiResponse } from '@/models/common/api';

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

export interface ResetPasswordPasswordData {
  token?: string;
  attributes?: {
    token?: string;
    expires_at?: string;
  };
}

export type ResetPasswordCodeResponse = ApiResponse<ResetPasswordCodeData>;
export type ResetPasswordCodeCheckResponse = ApiResponse<ResetPasswordCodeCheckData>;
export type ResetPasswordPasswordResponse = ApiResponse<ResetPasswordPasswordData>;
