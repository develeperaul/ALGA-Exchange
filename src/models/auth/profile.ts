import type { ApiResponseWithMeta } from '@/models/common/api';

export interface ProfileKyc {
  status: number;
  is_blocked: boolean;
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

export interface ProfileData {
  id?: string;
  type?: 'profile' | 'customer' | string;
  email?: string;
  phone?: string | null;
  name?: string;
  full_name?: string;
  kyc?: ProfileKyc | null;
  hasKyc?: boolean;
  hasPhone?: boolean;
  kycStatus?: number | null;
  kycBlocked?: boolean;
  verified?: boolean;
  attributes?: ProfileAttributes;
}

export type ProfileResponse = ApiResponseWithMeta<ProfileData, ProfileMeta>;
