import type {
  RegisterKycPayload,
  SendKycPhoneCodePayload,
  UploadPassportPayload,
} from '@/models';
import {
  mockDeletePassport,
  mockGetPassport,
  mockRegisterKyc,
  mockSendKycPhoneCode,
  mockUploadPassport,
} from '@/mocks/kyc';

export function uploadPassport(payload: UploadPassportPayload) {
  return mockUploadPassport(payload);
}

export function getPassport(passport: string) {
  return mockGetPassport(passport);
}

export function deletePassport(passport: string) {
  return mockDeletePassport(passport);
}

export function sendKycPhoneCode(payload: SendKycPhoneCodePayload) {
  return mockSendKycPhoneCode(payload);
}

export function registerKyc(payload: RegisterKycPayload) {
  return mockRegisterKyc(payload);
}
