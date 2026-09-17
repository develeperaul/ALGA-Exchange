import type { BanksResponse } from '@/models';
import sberIcon from '@/assets/wallet/rub-sber.svg';
import tbankIcon from '@/assets/wallet/rub-tbank.svg';
import vtbIcon from '@/assets/wallet/rub-vtb.svg';
import mtsIcon from '@/assets/wallet/rub-mts.png';
import alfaIcon from '@/assets/wallet/rub-alfa.svg';
import gazprombankIcon from '@/assets/wallet/rub-gazprombank.svg';
import rosselkhozIcon from '@/assets/wallet/rub-rosselkhoz.svg';
import psbIcon from '@/assets/wallet/rub-psb.svg';
import mkbIcon from '@/assets/wallet/rub-mkb.svg';
import sovcombankIconA from '@/assets/wallet/rub-sovcombank-a.svg';

export const mockBanksResponse: BanksResponse = {
  data: [
    { id: '1', type: 'banks', attributes: { name: 'sber', type: 0, logotype: sberIcon } },
    { id: '2', type: 'banks', attributes: { name: 'tbank', type: 0, logotype: tbankIcon } },
    { id: '3', type: 'banks', attributes: { name: 'vtb', type: 0, logotype: vtbIcon } },
    { id: '4', type: 'banks', attributes: { name: 'mts', type: 0, logotype: mtsIcon } },
    { id: '5', type: 'banks', attributes: { name: 'alfa', type: 0, logotype: alfaIcon } },
    { id: '6', type: 'banks', attributes: { name: 'gazprombank', type: 0, logotype: gazprombankIcon } },
    { id: '7', type: 'banks', attributes: { name: 'rosselkhoz', type: 0, logotype: rosselkhozIcon } },
    { id: '8', type: 'banks', attributes: { name: 'sovcombank', type: 0, logotype: sovcombankIconA } },
    { id: '9', type: 'banks', attributes: { name: 'psb', type: 0, logotype: psbIcon } },
    { id: '10', type: 'banks', attributes: { name: 'mkb', type: 0, logotype: mkbIcon } },
  ],
};
