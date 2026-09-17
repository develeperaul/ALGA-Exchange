import type { BankResource, BanksResponse } from '@/models';
import sberIcon from '@/assets/wallet/rub-sber.svg';
import tbankIcon from '@/assets/wallet/rub-tbank.svg';
import vtbIcon from '@/assets/wallet/rub-vtb.svg';
import mtsIcon from '@/assets/wallet/rub-mts.png';
import alfaIcon from '@/assets/wallet/rub-alfa.svg';
import gazprombankIcon from '@/assets/wallet/rub-gazprombank.svg';
import rosselkhozIcon from '@/assets/wallet/rub-rosselkhoz.svg';
import sovcombankIcon from '@/assets/wallet/rub-sovcombank.svg';
import psbIcon from '@/assets/wallet/rub-psb.svg';
import mkbIcon from '@/assets/wallet/rub-mkb.svg';

export type MockBankId =
  | 'sber'
  | 'tbank'
  | 'vtb'
  | 'mts'
  | 'alfa'
  | 'gazprombank'
  | 'rosselkhoz'
  | 'sovcombank'
  | 'psb'
  | 'mkb';

export interface MockBankDefinition {
  id: MockBankId;
  label: string;
  logotype: string;
  direct: boolean;
}

export const mockBankCatalog: MockBankDefinition[] = [
  { id: 'sber', label: 'Сбер', logotype: sberIcon, direct: true },
  { id: 'tbank', label: 'Т-Банк', logotype: tbankIcon, direct: true },
  { id: 'vtb', label: 'ВТБ', logotype: vtbIcon, direct: true },
  { id: 'mts', label: 'МТС Банк', logotype: mtsIcon, direct: true },
  { id: 'alfa', label: 'Альфа-Банк', logotype: alfaIcon, direct: false },
  { id: 'gazprombank', label: 'Газпромбанк', logotype: gazprombankIcon, direct: false },
  { id: 'rosselkhoz', label: 'Россельхозбанк', logotype: rosselkhozIcon, direct: false },
  { id: 'sovcombank', label: 'Совкомбанк', logotype: sovcombankIcon, direct: false },
  { id: 'psb', label: 'ПСБ', logotype: psbIcon, direct: false },
  { id: 'mkb', label: 'МКБ', logotype: mkbIcon, direct: false },
];

const bankResources = mockBankCatalog.map((bank): BankResource => ({
  id: bank.id,
  type: 'banks',
  attributes: {
    name: bank.label,
    type: 0,
    logotype: bank.logotype,
  },
})) as [BankResource, ...BankResource[]];

export const mockBanksResponse: BanksResponse & {
  data: [BankResource, ...BankResource[]];
} = {
  data: bankResources,
};

export function findMockBank(bankId: string) {
  return mockBankCatalog.find((bank) => bank.id === bankId);
}
