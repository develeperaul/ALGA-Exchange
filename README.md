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
