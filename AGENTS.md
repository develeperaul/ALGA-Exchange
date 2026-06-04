# AGENTS.md

- Figma token: configured via `.env` file (not committed)
- Use `npm`, not `yarn`, for this repo. `package-lock.json` is checked in and the repo scripts are npm-based.
- Known commands: `npm install`, `npm run dev`, `npm run build`, `npm test`.
- `npm test` is only a placeholder (`echo "No test specified" && exit 0`); there is no real test, lint, or typecheck script in `package.json`.
- App wiring is Quasar/Vue: `src/App.vue` is only `<router-view />`, `src/layouts/MainLayout.vue` is the shell, and `src/pages/IndexPage.vue` is the current home page.
- Keep the catch-all route last in `src/router/routes.ts`.
- Router mode is `hash` in `quasar.config.ts`; do not switch to history without updating Quasar config and deployment assumptions.
- Tailwind is enabled through `postcss.config.cjs` and `tailwind.config.js`; utilities use the `tw-` prefix.
- Global styles live in `src/css/app.scss`.
- SVG icons depend on `src/boot/init.js` importing `virtual:svg-icons-register` plus `vite-plugin-svg-icons` in dependencies.
- Pinia setup is in `src/stores/index.ts`; `src/stores/example-store.ts` is sample code.
