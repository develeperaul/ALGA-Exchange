import type { ApiResponse } from '@/models/common/api';

export type PassportUploadType = 0 | 1 | 2;
export type KycPassportType = 'other' | 'ru';

export interface UploadPassportPayload {
  media: Blob;
  type: PassportUploadType;
}

export interface KycUploadAttributes {
  [key: string]: unknown;
}

export interface KycUploadData {
  id: string;
  type: string;
  attributes: KycUploadAttributes;
}

export interface SendKycPhoneCodePayload {
  phone: string;
}

export interface RegisterKycPayload {
  address?: string | null;
  passport_type: KycPassportType;
  phone: string;
  code: string;
}

export type UploadPassportResponse = ApiResponse<KycUploadData>;
export type GetPassportResponse = ApiResponse<KycUploadData>;
export type SendKycPhoneCodeResponse = ApiResponse<'OK'>;
export type RegisterKycResponse = ApiResponse<'OK'>;
