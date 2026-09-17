import type {
  CheckResetPasswordCodePayload,
  CheckRegisterCodePayload,
  LoginPayload,
  SendResetPasswordCodePayload,
  SendRegisterCodePayload,
  SetResetPasswordPasswordPayload,
  SetRegisterPasswordPayload,
} from '@/models';
import {
  mockCheckRegisterCode,
  mockCheckResetPasswordCode,
  mockGetProfile,
  mockLogin,
  mockSendRegisterCode,
  mockSendResetPasswordCode,
  mockSetRegisterPassword,
  mockSetResetPasswordPassword,
} from '@/mocks/auth';

export function login(payload: LoginPayload) {
  return mockLogin(payload);
}

export function getProfile() {
  return mockGetProfile();
}

export function sendRegisterCode(payload: SendRegisterCodePayload) {
  return mockSendRegisterCode(payload);
}

export function checkRegisterCode(payload: CheckRegisterCodePayload) {
  return mockCheckRegisterCode(payload);
}

export function setRegisterPassword(payload: SetRegisterPasswordPayload) {
  return mockSetRegisterPassword(payload);
}

export function sendResetPasswordCode(payload: SendResetPasswordCodePayload) {
  return mockSendResetPasswordCode(payload);
}

export function checkResetPasswordCode(payload: CheckResetPasswordCodePayload) {
  return mockCheckResetPasswordCode(payload);
}

export function setResetPasswordPassword(payload: SetResetPasswordPasswordPayload) {
  return mockSetResetPasswordPassword(payload);
}
