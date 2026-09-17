import sbpIcon from 'assets/wallet/rub-sbp.svg';
import { mockBankCatalog, type MockBankId } from '@/mocks/payments/banks';

export type RubBankId = MockBankId;

export interface RubBank {
  id: RubBankId;
  label: string;
  icon: string;
  iconClass: string;
  direct?: boolean;
}

export const rubDepositStatic = {
  amount: '110',
  amountCurrency: 'USDT',
  rubAmount: '8860 RUB',
  rate: '1 USDT = 79,84 RUB',
  resultRate: '1 USDT = 80,04 RUB',
  phone: '+7 (999) 999-99-99',
  promo: 't.me/DS_Exchange123456',
  requestId: '18746429',
  operationId: 'p888f249-6893-4392-9395-50ab26c0419c',
  date: '8 фев. 2026 г. 12:01',
};

export const rubMethodIcons = {
  sbp: sbpIcon,
  usdt: 'USDT',
};

export const rubBanks: RubBank[] = mockBankCatalog.map((bank) => ({
  id: bank.id,
  label: bank.label,
  icon: bank.logotype,
  iconClass: `rub-bank-icon--${bank.id}`,
  direct: bank.direct,
}));

export const directRubBanks = rubBanks.filter((bank) => bank.direct);
export const sbpBanks = rubBanks;

export const sbpDefaultBankId: RubBankId = 'sovcombank';

export function findRubBank(id: unknown): RubBank | undefined {
  return rubBanks.find((bank) => bank.id === id);
}
