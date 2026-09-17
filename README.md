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

## Guest vs authorized UI

The existing guest/authorized behavior is preserved.

When no user is signed in, the application continues to show the existing guest layout and static guest content. Personal profile data and KYC state are not injected into guest screens.

After sign-in, the selected mock account becomes the active profile and its own email, name, phone, KYC state and blocked state are used by the application. The active mock profile is also stored locally so a browser refresh does not switch the user back to the default demo account.

## Access rules

Financial operations are available only to a signed-in account with successfully approved KYC and no account block.

| Account state | Orders/history | New financial operations |
| --- | --- | --- |
| Guest | no access; payment lists resolve to empty data | denied; redirect to sign-in |
| `unverified` | may view own existing history | denied |
| `pending` | may view own existing history | denied |
| `rejected` | may view own existing history | denied |
| `approved` | allowed | allowed |
| `approved` + blocked | may view own existing history | denied; blocked screen |

Protected personal routes require authentication. Financial routes additionally require `verificationStatus === 'approved'` and `kycBlocked === false`.

The financial restriction is enforced twice:

- router guards prevent direct navigation to protected operation pages;
- `payments-store` refuses to create a payment unless the active account is authenticated, KYC-approved and not blocked.

This means a guest or non-approved account cannot start an operation by navigating directly to a route or by bypassing the UI.

## Account-scoped orders and history

Orders and payment history belong to the active mock account. They are not shared globally between signed-in users.

- guests always receive an empty payment/order list;
- `demo@alga.exchange` keeps the full existing demo order/history dataset;
- `approved@alga.exchange` has a separate smaller demo dataset;
- `blocked@alga.exchange` has its own historical completed/cancelled operations;
- `unverified@alga.exchange`, `pending@alga.exchange` and `rejected@alga.exchange` start with empty order/history lists;
- unknown dynamically-created mock accounts also start with empty order/history lists;
- a newly created payment is written only to the currently active account and is not visible after switching to another account.

Viewing old history requires authentication but not currently approved KYC. This allows a previously verified account that later becomes rejected or blocked to retain access to its own past operations while preventing any new financial operation.

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

After a new KYC submission the active mock profile moves to `pending`, not directly to `approved`.

## Demo KYC profiles

Each test account has its own profile data and fixed initial KYC scenario. Sign in with another email to demonstrate another state without developer switches in the UI.

| Email | Name | Phone | Verification state | Blocked | Expected UI |
| --- | --- | --- | --- | --- | --- |
| `demo@alga.exchange` | Смирнов Алексей Игоревич | `+7 999 123-45-67` | `approved` | no | Верифицирован — основной demo-профиль |
| `unverified@alga.exchange` | Петров Иван Алексеевич | `+7 900 111-22-33` | `unverified` | no | Не верифицирован |
| `pending@alga.exchange` | Иванова Мария Сергеевна | `+7 901 222-33-44` | `pending` | no | Документы на проверке |
| `approved@alga.exchange` | Соколов Дмитрий Андреевич | `+7 902 333-44-55` | `approved` | no | Верифицирован |
| `rejected@alga.exchange` | Кузнецова Елена Викторовна | `+7 903 444-55-66` | `rejected` | no | Верификация отклонена |
| `blocked@alga.exchange` | Волков Андрей Михайлович | `+7 904 555-66-77` | `approved` | yes | Аккаунт заблокирован |

Use the same demo password for all test profiles:

```text
Password: demo12345
```

`demo@alga.exchange` is the default successful scenario and is equivalent to the `approved` demo profile.

Important: `blocked` is not a fifth KYC status. A user may have successfully passed KYC (`approved`) and later have the account blocked independently.

Unknown emails are also accepted in mock mode. They create a local unverified profile with that email so registration/demo flows can still be exercised.

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
