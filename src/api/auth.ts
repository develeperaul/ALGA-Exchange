import { apiClient } from '@/api/client';
import type {
  CheckResetPasswordCodePayload,
  CheckRegisterCodePayload,
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterCodeCheckResponse,
  RegisterCodeResponse,
  RegisterPasswordResponse,
  ResetPasswordCodeCheckResponse,
  ResetPasswordCodeResponse,
  ResetPasswordPasswordResponse,
  SendResetPasswordCodePayload,
  SendRegisterCodePayload,
  SetResetPasswordPasswordPayload,
  SetRegisterPasswordPayload,
} from '@/models';

export async function login(payload: LoginPayload) {
  return apiClient
    .post('api/auth/login', { json: payload })
    .json<LoginResponse>();
}

export async function getProfile() {
  return apiClient
    .get('api/profile/me')
    .json<ProfileResponse>();
}

export async function sendRegisterCode(payload: SendRegisterCodePayload) {
  return apiClient
    .post('api/auth/register/codes', { json: payload })
    .json<RegisterCodeResponse>();
}

export async function checkRegisterCode(payload: CheckRegisterCodePayload) {
  return apiClient
    .post('api/auth/register/codes/check', { json: payload })
    .json<RegisterCodeCheckResponse>();
}

export async function setRegisterPassword(payload: SetRegisterPasswordPayload) {
  return apiClient
    .post('api/auth/register/passwords', { json: payload })
    .json<RegisterPasswordResponse>();
}

export async function sendResetPasswordCode(payload: SendResetPasswordCodePayload) {
  return apiClient
    .post('api/auth/reset-passwords/codes', { json: payload })
    .json<ResetPasswordCodeResponse>();
}

export async function checkResetPasswordCode(payload: CheckResetPasswordCodePayload) {
  return apiClient
    .post('api/auth/reset-passwords/codes/check', { json: payload })
    .json<ResetPasswordCodeCheckResponse>();
}

export async function setResetPasswordPassword(payload: SetResetPasswordPasswordPayload) {
  return apiClient
    .post('api/auth/reset-passwords', { json: payload })
    .json<ResetPasswordPasswordResponse>();
}
