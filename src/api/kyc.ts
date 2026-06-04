import { apiClient } from '@/api/client';
import type {
  GetPassportResponse,
  RegisterKycPayload,
  RegisterKycResponse,
  SendKycPhoneCodePayload,
  SendKycPhoneCodeResponse,
  UploadPassportPayload,
  UploadPassportResponse,
} from '@/models';

export async function uploadPassport(payload: UploadPassportPayload) {
  const formData = new FormData();

  formData.append('media', payload.media);
  formData.append('type', String(payload.type));

  return apiClient
    .post('api/kyc/passports', { body: formData })
    .json<UploadPassportResponse>();
}

export async function getPassport(passport: string) {
  return apiClient
    .get(`api/kyc/passports/${passport}`)
    .json<GetPassportResponse>();
}

export async function deletePassport(passport: string) {
  await apiClient.delete(`api/kyc/passports/${passport}`);
}

export async function sendKycPhoneCode(payload: SendKycPhoneCodePayload) {
  return apiClient
    .post('api/kyc/phones/codes', { json: payload })
    .json<SendKycPhoneCodeResponse>();
}

export async function registerKyc(payload: RegisterKycPayload) {
  return apiClient
    .post('api/kyc/registrations', { json: payload })
    .json<RegisterKycResponse>();
}
