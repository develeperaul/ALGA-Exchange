import sbpIcon from 'assets/wallet/rub-sbp.svg';
import sberIcon from 'assets/wallet/rub-sber.svg';
import tbankIcon from 'assets/wallet/rub-tbank.svg';
import vtbIcon from 'assets/wallet/rub-vtb.svg';
import mtsIcon from 'assets/wallet/rub-mts.png';
import sovcombankPartA from 'assets/wallet/rub-sovcombank-a.svg';
import sovcombankPartB from 'assets/wallet/rub-sovcombank-b.svg';

export type RubBankId =
  | 'sber'
  | 'tbank'
  | 'vtb'
  | 'mts'
  | 'sovcombank'
  | 'alfa'
  | 'rencredit'
  | 'otp'
  | 'ozon'
  | 'raiffeisen'
  | 'ubrir'
  | 'uralsib'
  | 'yandex'
  | 'mkb'
  | 'kazan'
  | 'inbank';

export interface RubBank {
  id: RubBankId;
  label: string;
  icon?: string;
  iconClass: string;
  iconText?: string;
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
  { id: 'tbank', label: 'Т-банк', icon: tbankIcon, iconClass: 'rub-bank-icon--tbank', direct: true },
  { id: 'vtb', label: 'ВТБ', icon: vtbIcon, iconClass: 'rub-bank-icon--vtb', direct: true },
  { id: 'mts', label: 'МТС-Деньги', icon: mtsIcon, iconClass: 'rub-bank-icon--mts', direct: true },
  { id: 'alfa', label: 'Альфа-банк', iconClass: 'rub-bank-icon--alfa', iconText: 'A' },
  { id: 'rencredit', label: 'Ренессанс Банк', iconClass: 'rub-bank-icon--rencredit', iconText: 'Р' },
  { id: 'sovcombank', label: 'Совкомбанк', iconClass: 'rub-bank-icon--sovcombank' },
  { id: 'otp', label: 'ОТП-банк', iconClass: 'rub-bank-icon--otp', iconText: '◎' },
  { id: 'ozon', label: 'Ozon Банк', iconClass: 'rub-bank-icon--ozon', iconText: 'ozon' },
  { id: 'raiffeisen', label: 'Райффайзенбанк', iconClass: 'rub-bank-icon--raiffeisen', iconText: '×' },
  { id: 'ubrir', label: 'УБРиР', iconClass: 'rub-bank-icon--ubrir', iconText: 'U' },
  { id: 'uralsib', label: 'Уралсиб', iconClass: 'rub-bank-icon--uralsib', iconText: 'U' },
  { id: 'yandex', label: 'Яндекс Банк', iconClass: 'rub-bank-icon--yandex', iconText: 'Я' },
  { id: 'mkb', label: 'МКБ', iconClass: 'rub-bank-icon--mkb', iconText: 'МКБ' },
  { id: 'kazan', label: 'Банк Казани', iconClass: 'rub-bank-icon--kazan', iconText: 'К' },
  { id: 'inbank', label: 'Инбанк', iconClass: 'rub-bank-icon--inbank', iconText: 'i' },
];

export const directRubBanks = rubBanks.filter((bank) => bank.direct);
export const sbpBanks = rubBanks.filter((bank) => !bank.direct || bank.id === 'vtb' || bank.id === 'mts');

export const sbpDefaultBankId: RubBankId = 'sovcombank';
export const sovcombankIconParts = [sovcombankPartA, sovcombankPartB];

export function findRubBank(id: unknown): RubBank | undefined {
  return rubBanks.find((bank) => bank.id === id);
}
