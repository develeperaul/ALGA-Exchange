import { useKycStore } from 'stores/kyc-store';

export type KycCountryCode = 'RU' | 'FOREIGN';
export type KycUploadStatus = 'idle' | 'uploading' | 'uploaded';

export interface KycUploadValue {
  remoteId: string;
  file: File | null;
  previewUrl: string;
  status: KycUploadStatus;
}

export interface KycLocalState {
  phone: string;
  code: string;
  selectedCountry: KycCountryCode;
  documents: {
    passportFront: KycUploadValue;
    passportRegistration: KycUploadValue;
    foreignPassport: KycUploadValue;
    address: string;
  };
  selfie: KycUploadValue;
  infoSheetOpen: boolean;
  isPhoneCodeLoading: boolean;
  isRegistering: boolean;
}

export const KYC_STATE_KEY: unique symbol = Symbol('kyc-local-state');

export function createEmptyUploadValue(): KycUploadValue {
  return {
    remoteId: '',
    file: null,
    previewUrl: '',
    status: 'idle',
  };
}

/**
 * @deprecated Use `useKycStore()` from 'stores/kyc-store' instead.
 * This function now returns the Pinia store for backward compatibility.
 */
export function useKycLocalState(): KycLocalState {
  const store = useKycStore();
  return store as unknown as KycLocalState;
}
