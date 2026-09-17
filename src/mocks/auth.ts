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

let mockEmail = 'demo@alga.exchange';
let mockPhone = '+7 999 123-45-67';
let mockHasKyc = true;
let mockKycStatus: number = KYC_API_STATUS.APPROVED;
let mockKycBlocked = false;
let mockIdentificationError: string | null = null;
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

function makeProfileData(): ProfileApiData {
  return {
    id: 'mock-user-1',
    type: 'profiles',
    attributes: {
      email: mockEmail,
      phone: mockPhone,
      first_name: 'Алексей',
      last_name: 'Смирнов',
      middle_name: 'Игоревич',
      full_name: 'Смирнов Алексей Игоревич',
      kyc: mockHasKyc
        ? {
            status: mockKycStatus,
            is_blocked: mockKycBlocked,
            identification_error: mockIdentificationError,
          }
        : null,
    },
    meta: {
      has_kyc: mockHasKyc,
      has_phone: Boolean(mockPhone),
    },
  };
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  mockEmail = payload.email || mockEmail;

  return delay({
    data: {
      id: 'mock-session-1',
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
  mockEmail = payload.email;
  return delay({ data: { status: 'sent' } });
}

export async function mockCheckRegisterCode(_payload: CheckRegisterCodePayload): Promise<RegisterCodeCheckResponse> {
  return delay({ data: { token: makeToken('register-code') } });
}

export async function mockSetRegisterPassword(_payload: SetRegisterPasswordPayload): Promise<RegisterPasswordResponse> {
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
  mockEmail = payload.email;
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
  mockPhone = phone;
  mockHasKyc = true;
  mockKycStatus = KYC_API_STATUS.PENDING;
  mockKycBlocked = false;
  mockIdentificationError = null;
}

export function setMockKycState(state: 'unverified' | 'pending' | 'approved' | 'rejected' | 'blocked') {
  mockKycBlocked = state === 'blocked';
  mockIdentificationError = null;

  if (state === 'unverified') {
    mockHasKyc = false;
    return;
  }

  mockHasKyc = true;

  if (state === 'approved') {
    mockKycStatus = KYC_API_STATUS.APPROVED;
    return;
  }

  if (state === 'rejected') {
    mockKycStatus = KYC_API_STATUS.REJECTED;
    mockIdentificationError = 'Не удалось подтвердить личность';
    return;
  }

  mockKycStatus = KYC_API_STATUS.PENDING;
}

export const mockAuthCredentials = {
  email: 'demo@alga.exchange',
  password: 'demo12345',
  code: MOCK_CODE,
};
