# AGENTS.md

- Используй `npm`, не `yarn`; `package-lock.json` — lockfile проекта.
- Команды: `npm install`, `npm run dev`, `npm run build`, `npm test` (Vitest), `npm run test:watch`.
- API — режим по умолчанию. `VITE_API_MODE=mock` явно включает legacy demo mocks.
- `VITE_API_BASE_URL` — origin/deployment root без `/api`; dev proxy `/api` настраивается через `ALGA_DEV_API_TARGET`.
- Не читай `.env` и не добавляй секреты в клиентские `VITE_*` переменные.
- API auth включает login, profile, регистрацию и reset-password по email-коду. Сессия хранится в `sessionStorage` и разделена по режимам. Registration/reset proofs хранятся только в памяти, привязаны к email и сбрасываются при изменении/уходе/смене сессии. После принятого Auth и сбоя загрузки профиля повторяй только fetchProfile, без повторного POST пароля.
- Profile UI различает guest/restoring/error/authenticated и использует статус provider KYC; редактирование профиля API не предоставляет. Профиль кэшируется в памяти сессии: login/restore загружают его один раз, навигация не перезапрашивает; возврат из фонового приложения обновляет в фоне. Logout/смена сессии очищают кэш. После KYC профиль обновляется явно.
- Котировки главной: публичный GET /api/quotes без amount/bearer, Fetch cache no-store. Курс уже включает комиссию; сохраняй decimal-строки, направления buy/sell и method, quote_id и expires_at. Истёкшие котировки скрывай, включая возврат из фоновой вкладки. GET /api/rates — отдельные внутренние CRM курсы; не подменяй ими quotes и не вычисляй обратный курс. Демо-цены только при VITE_API_MODE=mock.
- API KYC onboarding и формы POST cash/invoice/transactions подключены; отправка только по явному действию пользователя, без автоматических повторов. Cash/invoice требуют авторизации, создание transactions — approved provider KYC. История /orders, /orders/history, /orders/:id и referrals подключены к GET; чтение требует auth, без требования approved KYC. Старые wallet/deposit, cash/confirm и referrals/account/withdraw остаются mock-only. Не объявляй финансовую операцию успешной по accepted ответу; Idempotency-Key сохраняется при неоднозначном результате transactions.
- История и referrals используют src/api/activity.ts, useSessionRead/useSessionList: кэш только в памяти сессии на 30 секунд, очистка при смене аккаунта, отмена/отбрасывание старых ответов. Пагинация берёт только query-параметры links.next, bearer никогда не отправляется на host из ответа. Суммы остаются строками; не считать completed_at признаком успешной операции, не обозначать неизвестную валюту legacy-награды как USDT. Production referrals/me может отдавать отдельные attributes.balance и program; они приоритетны для реферальных средств/условий, отсутствующие debt/repaid не превращать в 0. Код приглашения не превращать в выдуманный URL.
- Quasar/Vue: `src/App.vue` — router view, `src/layouts/MainLayout.vue` — shell. Pinia в `src/stores/index.ts`.
- Catch-all маршрут должен оставаться последним в `src/router/routes.ts`.
- Router mode `hash` задан в `quasar.config.ts`; не переключай на history без обновления deployment assumptions.
- Tailwind подключён через `postcss.config.cjs` и `tailwind.config.js`; utilities имеют префикс `tw-`.
- Глобальные стили — `src/css/app.scss`.
- SVG icons требуют `virtual:svg-icons-register` в `src/boot/init.js` и `vite-plugin-svg-icons`.
