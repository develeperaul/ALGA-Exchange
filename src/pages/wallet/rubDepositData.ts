import sbpIcon from 'assets/wallet/rub-sbp.svg';
import sberIcon from 'assets/wallet/rub-sber.svg';
import tbankIcon from 'assets/wallet/rub-tbank.svg';
import vtbIcon from 'assets/wallet/rub-vtb.svg';
import mtsIcon from 'assets/wallet/rub-mts.png';
import alfaIcon from 'assets/wallet/rub-alfa.svg';
import gazprombankIcon from 'assets/wallet/rub-gazprombank.svg';
import rosselkhozIcon from 'assets/wallet/rub-rosselkhoz.svg';
import psbIcon from 'assets/wallet/rub-psb.svg';
import mkbIcon from 'assets/wallet/rub-mkb.svg';
import sovcombankPartA from 'assets/wallet/rub-sovcombank-a.svg';
import sovcombankPartB from 'assets/wallet/rub-sovcombank-b.svg';

export type RubBankId =
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

export interface RubBank {
  id: RubBankId;
  label: string;
  icon?: string;
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

export const rubBanks: RubBank[] = [
  { id: 'sber', label: 'Сбер', icon: sberIcon, iconClass: 'rub-bank-icon--sber', direct: true },
  { id: 'tbank', label: 'Т-Банк', icon: tbankIcon, iconClass: 'rub-bank-icon--tbank', direct: true },
  { id: 'vtb', label: 'ВТБ', icon: vtbIcon, iconClass: 'rub-bank-icon--vtb', direct: true },
  { id: 'mts', label: 'МТС Банк', icon: mtsIcon, iconClass: 'rub-bank-icon--mts', direct: true },
  { id: 'alfa', label: 'Альфа-Банк', icon: alfaIcon, iconClass: 'rub-bank-icon--alfa' },
  { id: 'gazprombank', label: 'Газпромбанк', icon: gazprombankIcon, iconClass: 'rub-bank-icon--gazprombank' },
  { id: 'rosselkhoz', label: 'Россельхозбанк', icon: rosselkhozIcon, iconClass: 'rub-bank-icon--rosselkhoz' },
  { id: 'sovcombank', label: 'Совкомбанк', iconClass: 'rub-bank-icon--sovcombank' },
  { id: 'psb', label: 'ПСБ', icon: psbIcon, iconClass: 'rub-bank-icon--psb' },
  { id: 'mkb', label: 'МКБ', icon: mkbIcon, iconClass: 'rub-bank-icon--mkb' },
];

export const directRubBanks = rubBanks.filter((bank) => bank.direct);
export const sbpBanks = rubBanks;

export const sbpDefaultBankId: RubBankId = 'sovcombank';
export const sovcombankIconParts = [sovcombankPartA, sovcombankPartB];

export function findRubBank(id: unknown): RubBank | undefined {
  return rubBanks.find((bank) => bank.id === id);
}
