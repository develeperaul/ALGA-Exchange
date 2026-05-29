import type { ApiResponse } from '@/models/common/api';

export interface SendRegisterCodePayload {
  email: string;
}

export interface CheckRegisterCodePayload {
  email: string;
  code: string;
}

export interface SetRegisterPasswordPayload {
  token: string;
  password: string;
}

export interface RegisterCodeData {
  status: string;
}

export interface RegisterCodeCheckData {
  token: string;
}

export interface RegisterPasswordData {
  token?: string;
  attributes?: {
    token?: string;
    expires_at?: string;
  };
}

export type RegisterCodeResponse = ApiResponse<RegisterCodeData>;
export type RegisterCodeCheckResponse = ApiResponse<RegisterCodeCheckData>;
export type RegisterPasswordResponse = ApiResponse<RegisterPasswordData>;
