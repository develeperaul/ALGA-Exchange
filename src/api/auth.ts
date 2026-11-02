import type {
  CheckResetPasswordCodePayload,
  CheckRegisterCodePayload,
  LoginPayload,
  SendResetPasswordCodePayload,
  SendRegisterCodePayload,
  SetResetPasswordPasswordPayload,
  SetRegisterPasswordPayload,
} from '@/models';
import { isMockMode } from './config';
import { requestJson } from './client';
import type {
  LoginResponse, ProfileResponse, RegisterCodeResponse, RegisterCodeCheckResponse,
  RegisterPasswordResponse, ResetPasswordCodeResponse, ResetPasswordCodeCheckResponse,
  ResetPasswordPasswordResponse,
} from '@/models';

export async function login(payload: LoginPayload, signal?: AbortSignal) {
  if (isMockMode) return (await import('@/mocks/auth')).mockLogin(payload);
  return requestJson<LoginResponse>('api/auth/login', { method: 'post', json: payload, signal });
}

export async function getProfile(signal?: AbortSignal): Promise<ProfileResponse> {
  if (isMockMode) return (await import('@/mocks/auth')).mockGetProfile();
  return requestJson<ProfileResponse>('api/profile/me', { signal }, true);
}

export async function sendRegisterCode(payload: SendRegisterCodePayload, signal?: AbortSignal) {
  if (isMockMode) return (await import('@/mocks/auth')).mockSendRegisterCode(payload);
  return requestJson<RegisterCodeResponse>('api/auth/register/codes', { method: 'post', json: payload, signal });
}

export async function checkRegisterCode(payload: CheckRegisterCodePayload, signal?: AbortSignal) {
  if (isMockMode) return (await import('@/mocks/auth')).mockCheckRegisterCode(payload);
  return requestJson<RegisterCodeCheckResponse>('api/auth/register/codes/check', { method: 'post', json: payload, signal });
}

export async function setRegisterPassword(payload: SetRegisterPasswordPayload, signal?: AbortSignal) {
  if (isMockMode) return (await import('@/mocks/auth')).mockSetRegisterPassword(payload);
  return requestJson<RegisterPasswordResponse>('api/auth/register/passwords', { method: 'post', json: payload, signal });
}

export async function sendResetPasswordCode(payload: SendResetPasswordCodePayload, signal?: AbortSignal) {
  if (isMockMode) return (await import('@/mocks/auth')).mockSendResetPasswordCode(payload);
  return requestJson<ResetPasswordCodeResponse>('api/auth/reset-passwords/codes', { method: 'post', json: payload, signal });
}

export async function checkResetPasswordCode(payload: CheckResetPasswordCodePayload, signal?: AbortSignal) {
  if (isMockMode) return (await import('@/mocks/auth')).mockCheckResetPasswordCode(payload);
  return requestJson<ResetPasswordCodeCheckResponse>('api/auth/reset-passwords/codes/check', { method: 'post', json: payload, signal });
}

export async function setResetPasswordPassword(payload: SetResetPasswordPasswordPayload, signal?: AbortSignal): Promise<ResetPasswordPasswordResponse> {
  if (isMockMode) return (await import('@/mocks/auth')).mockSetResetPasswordPassword(payload);
  return requestJson<ResetPasswordPasswordResponse>('api/auth/reset-passwords', { method: 'post', json: payload, signal });
}
