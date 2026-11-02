import { requireMockMode } from './config';
import { requestJson } from './client';
import { invalidResponse } from './errors';
import type {
  OnboardingStart, OnboardingView, OnboardingState, OnboardingIdentification,
  OnboardingIdentityPayload, OnboardingUpdatePayload,
} from '@/models/kyc/kyc';
import type {
  RegisterKycPayload,
  SendKycPhoneCodePayload,
  UploadPassportPayload,
} from '@/models';

export async function uploadPassport(payload: UploadPassportPayload) {
  requireMockMode();
  return (await import('@/mocks/kyc')).mockUploadPassport(payload);
}

export async function getPassport(passport: string) {
  requireMockMode();
  return (await import('@/mocks/kyc')).mockGetPassport(passport);
}

export async function deletePassport(passport: string) {
  requireMockMode();
  return (await import('@/mocks/kyc')).mockDeletePassport(passport);
}

export async function sendKycPhoneCode(payload: SendKycPhoneCodePayload) {
  requireMockMode();
  return (await import('@/mocks/kyc')).mockSendKycPhoneCode(payload);
}

export async function registerKyc(payload: RegisterKycPayload) {
  requireMockMode();
  return (await import('@/mocks/kyc')).mockRegisterKyc(payload);
}

// The only supported API KYC endpoints. Upload helpers above remain mock-only.

type RecordValue = Record<string, unknown>;
const record = (v: unknown): v is RecordValue => Boolean(v && typeof v === 'object' && !Array.isArray(v));
const nullableString = (v: unknown) => v === null || typeof v === 'string';
const statusValid = (v: unknown) => ['none', 'pending', 'approved', 'rejected'].includes(String(v));
const errorValid = (v: unknown) => v === null || (record(v) && typeof v.code === 'string'
  && (v.provider_code === undefined || nullableString(v.provider_code))
  && (v.retry_at === undefined || nullableString(v.retry_at)));
const stateValid = (v: unknown) => record(v) && typeof v.status === 'string'
  && typeof v.phone_set === 'boolean' && Number.isInteger(v.verification_level)
  && typeof v.identified === 'boolean' && statusValid(v.kyc_status)
  && (v.sms_sent === null || typeof v.sms_sent === 'boolean') && nullableString(v.next_step);
const startValid = (v: unknown) => record(v) && typeof v.request_id === 'string'
  && ['queued', 'processing', 'completed', 'failed'].includes(String(v.state))
  && (v.result === null || stateValid(v.result)) && errorValid(v.error);
const taskValid = (v: unknown) => record(v) && typeof v.request_id === 'string'
  && ['identify', 'update', 'esia'].includes(String(v.action))
  && ['queued', 'checking', 'completed', 'failed', 'review_required'].includes(String(v.state))
  && errorValid(v.error) && (v.redirect_url === undefined || nullableString(v.redirect_url));
const viewValid = (v: unknown) => {
  if (!startValid(v) || !record(v) || !record(v.customer)) return false;
  const c = v.customer;
  return nullableString(c.status) && typeof c.phone_set === 'boolean'
    && Number.isInteger(c.verification_level) && (c.identified === null || typeof c.identified === 'boolean')
    && statusValid(c.kyc_status) && nullableString(c.next_step) && nullableString(c.last_synced_at)
    && nullableString(c.verify_retry_at) && nullableString(c.resend_retry_at)
    && (c.identification === null || taskValid(c.identification));
};
async function onboardingRequest<T>(action: string, validate: (v: unknown) => boolean, signal?: AbortSignal, payload?: unknown): Promise<T> {
  const body = await requestJson<unknown>(`api/kyc/onboarding${action}`, {
    method: payload === undefined ? 'GET' : 'POST', signal, retry: 0, cache: 'no-store',
    ...(payload === undefined ? {} : { json: payload }),
  }, true);
  if (!record(body) || !validate(body.data)) throw invalidResponse();
  return body.data as T;
}
export const getOnboarding = (signal?: AbortSignal) => onboardingRequest<OnboardingView>('', viewValid, signal);
export const startOnboarding = (phone: string, signal?: AbortSignal) => onboardingRequest<OnboardingStart>('/start', startValid, signal, { phone });
export const verifyOnboardingPhone = (otp_code: string, signal?: AbortSignal) => onboardingRequest<OnboardingState>('/verify-phone', stateValid, signal, { otp_code });
export const resendOnboardingOtp = (signal?: AbortSignal) => onboardingRequest<OnboardingState>('/resend-otp', stateValid, signal, {});
export const identifyOnboarding = (payload: OnboardingIdentityPayload, signal?: AbortSignal) => onboardingRequest<OnboardingIdentification>('/identify', taskValid, signal, payload);
export const updateOnboarding = (payload: OnboardingUpdatePayload, signal?: AbortSignal) => onboardingRequest<OnboardingIdentification>('/update', taskValid, signal, payload);
export const esiaOnboarding = (signal?: AbortSignal) => onboardingRequest<OnboardingIdentification>('/esia', taskValid, signal, {});
