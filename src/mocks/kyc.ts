import type {
  GetPassportResponse,
  RegisterKycPayload,
  RegisterKycResponse,
  SendKycPhoneCodePayload,
  SendKycPhoneCodeResponse,
  UploadPassportPayload,
  UploadPassportResponse,
} from '@/models';
import { updateMockProfileFromKyc } from '@/mocks/auth';

const MOCK_DELAY_MS = 300;
const passports = new Map<string, UploadPassportResponse['data']>();
let passportCounter = 100;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), MOCK_DELAY_MS);
  });
}

export async function mockUploadPassport(payload: UploadPassportPayload): Promise<UploadPassportResponse> {
  passportCounter += 1;
  const id = `mock-passport-${passportCounter}`;
  const data: UploadPassportResponse['data'] = {
    id,
    type: 'kyc-passports',
    attributes: {
      upload_type: payload.type,
      file_size: payload.media.size,
      mime_type: payload.media.type,
      status: 'uploaded',
    },
  };

  passports.set(id, data);
  return delay({ data });
}

export async function mockGetPassport(passport: string): Promise<GetPassportResponse> {
  const data = passports.get(passport) ?? {
    id: passport,
    type: 'kyc-passports',
    attributes: { status: 'uploaded' },
  };

  return delay({ data });
}

export async function mockDeletePassport(passport: string): Promise<void> {
  passports.delete(passport);
  await delay(undefined);
}

export async function mockSendKycPhoneCode(_payload: SendKycPhoneCodePayload): Promise<SendKycPhoneCodeResponse> {
  return delay({ data: 'OK' });
}

export async function mockRegisterKyc(payload: RegisterKycPayload): Promise<RegisterKycResponse> {
  updateMockProfileFromKyc(payload.phone);
  return delay({ data: 'OK' });
}
