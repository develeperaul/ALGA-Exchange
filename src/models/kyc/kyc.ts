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
  code?: string | null;
}

export type UploadPassportResponse = ApiResponse<KycUploadData>;
export type GetPassportResponse = ApiResponse<KycUploadData>;
export type SendKycPhoneCodeResponse = ApiResponse<'OK'>;
export type RegisterKycResponse = ApiResponse<'OK'>;

// API onboarding is independent of the legacy mock document-upload flow.
export type OnboardingKycStatus = 'none' | 'pending' | 'approved' | 'rejected';
export interface OnboardingError {
  code: string;
  provider_code?: string | null;
  retry_at?: string | null;
}
export interface OnboardingState {
  status: string;
  phone_set: boolean;
  verification_level: number;
  identified: boolean;
  kyc_status: OnboardingKycStatus;
  sms_sent: boolean | null;
  next_step: string | null;
}
export interface OnboardingStart {
  request_id: string;
  state: 'queued' | 'processing' | 'completed' | 'failed';
  result: OnboardingState | null;
  error: OnboardingError | null;
}
export interface OnboardingIdentification {
  request_id: string;
  action: 'identify' | 'update' | 'esia';
  state: 'queued' | 'checking' | 'completed' | 'failed' | 'review_required';
  error: OnboardingError | null;
  redirect_url?: string | null;
}
export interface OnboardingCustomer {
  status: string | null;
  phone_set: boolean;
  verification_level: number;
  identified: boolean | null;
  kyc_status: OnboardingKycStatus;
  next_step: string | null;
  last_synced_at: string | null;
  verify_retry_at: string | null;
  resend_retry_at: string | null;
  identification: OnboardingIdentification | null;
}
export interface OnboardingView extends OnboardingStart { customer: OnboardingCustomer }
export interface OnboardingIdentityPayload {
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  birth_date: string;
  persondoc_number: string;
}
export type OnboardingUpdatePayload = Omit<OnboardingIdentityPayload, 'birth_date'> & { birth_date?: string | null };
