import type { BanksResponse } from '@/models';

export const mockBanksResponse: BanksResponse = {
  data: [
    {
      id: '1',
      type: 'banks',
      attributes: {
        name: 'mts-bank',
        type: 0,
        logotype: 'https://placehold.co/64x64/png',
      },
    },
    {
      id: '2',
      type: 'banks',
      attributes: {
        name: 'sber',
        type: 0,
        logotype: 'https://placehold.co/64x64/png',
      },
    },
    {
      id: '3',
      type: 'banks',
      attributes: {
        name: 't-bank',
        type: 0,
        logotype: 'https://placehold.co/64x64/png',
      },
    },
    {
      id: '4',
      type: 'banks',
      attributes: {
        name: 'sbp',
        type: 1,
        logotype: 'https://placehold.co/64x64/png',
      },
    },
  ],
};
