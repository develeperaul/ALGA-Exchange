import { defineStore } from 'pinia';
import type {
  KycCountryCode,
  KycUploadValue,
} from 'components/kyc/useKycLocalState';

export interface KycStoreState {
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

function createEmptyUploadValue(): KycUploadValue {
  return {
    remoteId: '',
    file: null,
    previewUrl: '',
    status: 'idle',
  };
}

export const useKycStore = defineStore('kyc', {
  state: (): KycStoreState => ({
    phone: '',
    code: '',
    selectedCountry: 'RU',
    documents: {
      passportFront: createEmptyUploadValue(),
      passportRegistration: createEmptyUploadValue(),
      foreignPassport: createEmptyUploadValue(),
      address: '',
    },
    selfie: createEmptyUploadValue(),
    infoSheetOpen: false,
    isPhoneCodeLoading: false,
    isRegistering: false,
  }),

  actions: {
    reset() {
      this.phone = '';
      this.code = '';
      this.selectedCountry = 'RU';
      this.documents = {
        passportFront: createEmptyUploadValue(),
        passportRegistration: createEmptyUploadValue(),
        foreignPassport: createEmptyUploadValue(),
        address: '',
      };
      this.selfie = createEmptyUploadValue();
      this.infoSheetOpen = false;
      this.isPhoneCodeLoading = false;
      this.isRegistering = false;
    },
  },
});
