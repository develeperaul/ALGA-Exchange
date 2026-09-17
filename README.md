# ALGA Exchange — Mock Banking MVP

Standalone MVP of the ALGA Exchange frontend built with Vue 3 + Quasar + Pinia.

## MVP mode

This branch is designed to run without an application backend:

- auth requests use local typed mocks;
- registration and password reset use local typed mocks;
- KYC upload/phone/registration flows use local typed mocks;
- payments, orders and history are generated locally;
- the legacy HTTP client is hard-disabled so an accidental old call cannot reach a server;
- mock responses reuse the existing application TypeScript models.

Mock latency is intentionally preserved so loading states remain visible during demos.

## KYC states

Application UI and business logic use normalized KYC states instead of raw numeric API values:

- `unverified` — KYC has not been started/completed;
- `pending` — documents were submitted and are under review;
- `approved` — identity verification succeeded;
- `rejected` — identity verification failed and can be retried.

Account blocking is independent from identity verification and is represented by `is_blocked` / `kycBlocked`.
A blocked account can still have an `approved` identity status.

For the mock API the raw numeric contract is:

- `0` — pending;
- `1` — approved;
- `2` — rejected.

UI code must not interpret these raw numbers directly. The auth store normalizes them into `verificationStatus`.
Unknown raw statuses are treated as `pending`, never as verified.

`isVerified` is true only when `verificationStatus === 'approved'`; `has_kyc` only means that a KYC record exists.

After a new KYC submission the mock profile moves to `pending`, not directly to `approved`.

## Demo KYC profiles

For MVP demos, each test account should have its own fixed KYC state. This makes it possible to show every verification scenario simply by signing in with a different email, without developer switches in the UI.

| Email | Verification state | Blocked | Expected UI |
| --- | --- | --- | --- |
| `demo@alga.exchange` | `approved` | no | Верифицирован — основной demo-профиль |
| `unverified@alga.exchange` | `unverified` | no | Не верифицирован |
| `pending@alga.exchange` | `pending` | no | Документы на проверке |
| `approved@alga.exchange` | `approved` | no | Верифицирован |
| `rejected@alga.exchange` | `rejected` | no | Верификация отклонена |
| `blocked@alga.exchange` | `approved` | yes | Аккаунт заблокирован |

Use the same demo password for all test profiles:

```text
Password: demo12345
```

`demo@alga.exchange` is the default successful scenario and is equivalent to the `approved` demo profile.

Important: `blocked` is not a fifth KYC status. A user may have successfully passed KYC (`approved`) and later have the account blocked independently.

Suggested mock mapping:

```ts
const mockProfiles = {
  'demo@alga.exchange': {
    verificationStatus: 'approved',
    kyc: {
      status: 1,
      is_blocked: false,
      identification_error: null,
    },
    hasKyc: true,
    isBlocked: false,
  },
  'unverified@alga.exchange': {
    verificationStatus: 'unverified',
    kyc: null,
    hasKyc: false,
    isBlocked: false,
  },
  'pending@alga.exchange': {
    verificationStatus: 'pending',
    kyc: {
      status: 0,
      is_blocked: false,
      identification_error: null,
    },
    hasKyc: true,
    isBlocked: false,
  },
  'approved@alga.exchange': {
    verificationStatus: 'approved',
    kyc: {
      status: 1,
      is_blocked: false,
      identification_error: null,
    },
    hasKyc: true,
    isBlocked: false,
  },
  'rejected@alga.exchange': {
    verificationStatus: 'rejected',
    kyc: {
      status: 2,
      is_blocked: false,
      identification_error: 'Не удалось подтвердить личность',
    },
    hasKyc: true,
    isBlocked: false,
  },
  'blocked@alga.exchange': {
    verificationStatus: 'approved',
    kyc: {
      status: 1,
      is_blocked: true,
      identification_error: null,
    },
    hasKyc: true,
    isBlocked: true,
  },
};
```

## Banks

The RUB/SBP demo contains 10 banks with local logo assets:

- Сбер
- Т-Банк
- ВТБ
- МТС Банк
- Альфа-Банк
- Газпромбанк
- Россельхозбанк
- Совкомбанк
- ПСБ
- МКБ

No bank logo is loaded from a remote URL at runtime.

## Demo auth

Authentication accepts demo input locally. Suggested credentials:

```text
Email: demo@alga.exchange
Password: demo12345
Code: 111111
```

## Install

Use npm because `package-lock.json` is committed:

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Tests

```bash
npm test
```

The current test command is a placeholder and does not run an automated test suite yet.
