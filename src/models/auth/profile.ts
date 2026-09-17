import type { ApiResponse } from '@/models/common/api';

export const KYC_API_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

export type KycVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'approved'
  | 'rejected';

export interface ProfileKyc {
  /** Raw backend status. Normalize it before using it in UI. */
  status: number;
  /** Account restriction is independent from identity verification status. */
  is_blocked: boolean | null;
  identification_error: string | null;
}

export interface ProfileMeta {
  has_kyc: boolean;
  has_phone: boolean;
}

export interface ProfileAttributes {
  email?: string;
  phone?: string | null;
  kyc?: ProfileKyc | null;
  full_name?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
}

// Raw API response structure
export interface ProfileApiData {
  id: string;
  type: string;
  attributes: ProfileAttributes;
  meta: ProfileMeta;
}

// Normalized profile used in the app
export interface ProfileData {
  id: string;
  type: string;
  attributes?: ProfileAttributes;
  email: string;
  phone: string;
  name: string;
  kyc: ProfileKyc | null;
  hasKyc: boolean;
  hasPhone: boolean;
  /** Raw API status, retained for compatibility/debugging only. */
  kycStatus: number | null;
  /** Domain-level status used by application UI and business logic. */
  verificationStatus: KycVerificationStatus;
  /** Independent account restriction flag. */
  kycBlocked: boolean;
  /** True only after successful identity verification. */
  verified: boolean;
}

export type ProfileResponse = ApiResponse<ProfileApiData>;
