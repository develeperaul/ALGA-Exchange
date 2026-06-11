import type { ApiResponse } from '@/models/common/api';

export interface ProfileKyc {
  status: number;
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
  kycStatus: number | null;
  kycBlocked: boolean;
  verified: boolean;
}

export type ProfileResponse = ApiResponse<ProfileApiData>;
