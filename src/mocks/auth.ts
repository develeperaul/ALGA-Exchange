import { KYC_API_STATUS } from '@/models';
import type {
  CheckResetPasswordCodePayload,
  CheckRegisterCodePayload,
  LoginPayload,
  LoginResponse,
  ProfileApiData,
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

const MOCK_DELAY_MS = 250;
const MOCK_CODE = '111111';
const DEFAULT_PROFILE_EMAIL = 'demo@alga.exchange';
const ACTIVE_PROFILE_STORAGE_KEY = 'alga_mock_active_profile';

interface MockProfileDefinition {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  hasKyc: boolean;
  kycStatus: number;
  blocked: boolean;
  identificationError: string | null;
}

const mockProfiles: Record<string, MockProfileDefinition> = {
  'demo@alga.exchange': {
    id: 'mock-user-demo',
    email: 'demo@alga.exchange',
    phone: '+7 999 123-45-67',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    middleName: 'Игоревич',
    hasKyc: true,
    kycStatus: KYC_API_STATUS.APPROVED,
    blocked: false,
    identificationError: null,
  },
  'unverified@alga.exchange': {
    id: 'mock-user-unverified',
    email: 'unverified@alga.exchange',
    phone: '+7 900 111-22-33',
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Алексеевич',
    hasKyc: false,
    kycStatus: KYC_API_STATUS.PENDING,
    blocked: false,
    identificationError: null,
  },
  'pending@alga.exchange': {
    id: 'mock-user-pending',
    email: 'pending@alga.exchange',
    phone: '+7 901 222-33-44',
    firstName: 'Мария',
    lastName: 'Иванова',
    middleName: 'Сергеевна',
    hasKyc: true,
    kycStatus: KYC_API_STATUS.PENDING,
    blocked: false,
    identificationError: null,
  },
  'approved@alga.exchange': {
    id: 'mock-user-approved',
    email: 'approved@alga.exchange',
    phone: '+7 902 333-44-55',
    firstName: 'Дмитрий',
    lastName: 'Соколов',
    middleName: 'Андреевич',
    hasKyc: true,
    kycStatus: KYC_API_STATUS.APPROVED,
    blocked: false,
    identificationError: null,
  },
  'rejected@alga.exchange': {
    id: 'mock-user-rejected',
    email: 'rejected@alga.exchange',
    phone: '+7 903 444-55-66',
    firstName: 'Елена',
    lastName: 'Кузнецова',
    middleName: 'Викторовна',
    hasKyc: true,
    kycStatus: KYC_API_STATUS.REJECTED,
    blocked: false,
    identificationError: 'Не удалось подтвердить личность',
  },
  'blocked@alga.exchange': {
    id: 'mock-user-blocked',
    email: 'blocked@alga.exchange',
    phone: '+7 904 555-66-77',
    firstName: 'Андрей',
    lastName: 'Волков',
    middleName: 'Михайлович',
    hasKyc: true,
    kycStatus: KYC_API_STATUS.APPROVED,
    blocked: true,
    identificationError: null,
  },
};

let activeProfileEmail = readStoredActiveProfileEmail() || DEFAULT_PROFILE_EMAIL;
let tokenCounter = 1;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), MOCK_DELAY_MS);
  });
}

function makeToken(prefix: string) {
  tokenCounter += 1;
  return `mock-${prefix}-${tokenCounter}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readStoredActiveProfileEmail() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY) || '';
}

function setActiveProfileEmail(email: string) {
  activeProfileEmail = email;

  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, email);
  }
}

function ensureMockProfile(email: string): MockProfileDefinition {
  const normalizedEmail = normalizeEmail(email) || DEFAULT_PROFILE_EMAIL;
  const existingProfile = mockProfiles[normalizedEmail];

  if (existingProfile) {
    return existingProfile;
  }

  const dynamicProfile: MockProfileDefinition = {
    id: `mock-user-${Object.keys(mockProfiles).length + 1}`,
    email: normalizedEmail,
    phone: '',
    firstName: 'Пользователь',
    lastName: '',
    middleName: '',
    hasKyc: false,
    kycStatus: KYC_API_STATUS.PENDING,
    blocked: false,
    identificationError: null,
  };

  mockProfiles[normalizedEmail] = dynamicProfile;
  return dynamicProfile;
}

function getActiveProfile() {
  return ensureMockProfile(activeProfileEmail);
}

function makeProfileData(): ProfileApiData {
  const profile = getActiveProfile();
  const fullName = [profile.lastName, profile.firstName, profile.middleName]
    .filter(Boolean)
    .join(' ');

  return {
    id: profile.id,
    type: 'profiles',
    attributes: {
      email: profile.email,
      phone: profile.phone || null,
      first_name: profile.firstName,
      last_name: profile.lastName,
      middle_name: profile.middleName,
      full_name: fullName,
      kyc: profile.hasKyc
        ? {
            status: profile.kycStatus,
            is_blocked: profile.blocked,
            identification_error: profile.identificationError,
          }
        : null,
    },
    meta: {
      has_kyc: profile.hasKyc,
      has_phone: Boolean(profile.phone),
    },
  };
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  const profile = ensureMockProfile(payload.email || DEFAULT_PROFILE_EMAIL);
  setActiveProfileEmail(profile.email);

  return delay({
    data: {
      id: `mock-session-${profile.id}`,
      type: 'tokens',
      attributes: {
        token: makeToken('login'),
        expires_at: '2099-12-31T23:59:59Z',
      },
    },
  });
}

export async function mockGetProfile(): Promise<ProfileResponse> {
  return delay({ data: makeProfileData() });
}

export async function mockSendRegisterCode(payload: SendRegisterCodePayload): Promise<RegisterCodeResponse> {
  const profile = ensureMockProfile(payload.email);
  setActiveProfileEmail(profile.email);
  return delay({ data: { status: 'sent' } });
}

export async function mockCheckRegisterCode(_payload: CheckRegisterCodePayload): Promise<RegisterCodeCheckResponse> {
  return delay({ data: { token: makeToken('register-code') } });
}

export async function mockSetRegisterPassword(_payload: SetRegisterPasswordPayload): Promise<RegisterPasswordResponse> {
  ensureMockProfile(activeProfileEmail);

  return delay({
    data: {
      attributes: {
        token: makeToken('register'),
        expires_at: '2099-12-31T23:59:59Z',
      },
    },
  });
}

export async function mockSendResetPasswordCode(payload: SendResetPasswordCodePayload): Promise<ResetPasswordCodeResponse> {
  const profile = ensureMockProfile(payload.email);
  setActiveProfileEmail(profile.email);
  return delay({ data: { status: 'sent' } });
}

export async function mockCheckResetPasswordCode(_payload: CheckResetPasswordCodePayload): Promise<ResetPasswordCodeCheckResponse> {
  return delay({ data: { token: makeToken('reset-code') } });
}

export async function mockSetResetPasswordPassword(_payload: SetResetPasswordPasswordPayload): Promise<ResetPasswordPasswordResponse> {
  return delay({
    data: {
      attributes: {
        token: makeToken('reset'),
        expires_at: '2099-12-31T23:59:59Z',
      },
    },
  });
}

export function updateMockProfileFromKyc(phone: string) {
  const profile = getActiveProfile();

  profile.phone = phone;
  profile.hasKyc = true;
  profile.kycStatus = KYC_API_STATUS.PENDING;
  profile.blocked = false;
  profile.identificationError = null;
}

export function setMockKycState(state: 'unverified' | 'pending' | 'approved' | 'rejected' | 'blocked') {
  const profile = getActiveProfile();

  profile.blocked = state === 'blocked';
  profile.identificationError = null;

  if (state === 'unverified') {
    profile.hasKyc = false;
    profile.kycStatus = KYC_API_STATUS.PENDING;
    return;
  }

  profile.hasKyc = true;

  if (state === 'approved' || state === 'blocked') {
    profile.kycStatus = KYC_API_STATUS.APPROVED;
    return;
  }

  if (state === 'rejected') {
    profile.kycStatus = KYC_API_STATUS.REJECTED;
    profile.identificationError = 'Не удалось подтвердить личность';
    return;
  }

  profile.kycStatus = KYC_API_STATUS.PENDING;
}

export const mockAuthCredentials = {
  email: DEFAULT_PROFILE_EMAIL,
  password: 'demo12345',
  code: MOCK_CODE,
};

export const mockAuthProfiles = Object.values(mockProfiles).map((profile) => ({
  email: profile.email,
  name: [profile.lastName, profile.firstName, profile.middleName].filter(Boolean).join(' '),
  phone: profile.phone,
}));
