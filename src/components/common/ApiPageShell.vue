<template>
  <q-page class="api-page">
    <main class="api-page__content">
      <header class="api-page__header"><h1>{{ title }}</h1><slot name="actions" /></header>
      <slot />
    </main>
  </q-page>
</template>
<script setup lang="ts">defineProps<{ title: string }>();</script>
<style scoped lang="scss">
.api-page { width: 100%; background: var(--ui-surface-page); color: var(--ui-text-primary); font-family: var(--ui-font-family); }
.api-page__content { width: 100%; padding: calc(24px + var(--ui-safe-area-top)) calc(16px + var(--ui-safe-area-right)) calc(32px + var(--ui-safe-area-bottom)) calc(16px + var(--ui-safe-area-left)); display: grid; gap: 20px; }
.api-page__header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.api-page h1 { margin: 0; font-size: var(--ui-font-h1); line-height: var(--ui-line-h1); }
.api-page :deep(h2) { margin: 0; font-size: var(--ui-font-h2); }
.api-page :deep(h3) { margin: 0; font-size: var(--ui-font-t1); }
.api-page :deep(p) { margin: 0; }
.api-page :deep(.api-card) { min-width: 0; padding: 20px; border-radius: 16px; display: grid; gap: 12px; background: var(--ui-surface-white); overflow-wrap: anywhere; }
.api-page :deep(.api-list) { display: grid; gap: 12px; }
.api-page :deep(.api-field) { display: grid; gap: 8px; min-width: 0; }
.api-page :deep(select), .api-page :deep(input) { width: 100%; min-width: 0; min-height: 44px; padding: 10px 12px; border: 1px solid var(--ui-border-focus); border-radius: 12px; background: var(--ui-surface-white); color: var(--ui-text-primary); font: inherit; }
.api-page :deep(.api-row) { display: flex; gap: 12px; justify-content: space-between; flex-wrap: wrap; }
.api-page :deep(.api-meta) { color: var(--ui-text-muted); font-size: var(--ui-font-t2); }
.api-page :deep(a) { color: var(--ui-text-primary); overflow-wrap: anywhere; }
.api-page :deep(.api-card-link) { text-decoration: none; }
.api-page :deep(button:focus-visible), .api-page :deep(a:focus-visible) { outline: 2px solid var(--ui-border-focus); outline-offset: 3px; }
.api-page :deep(dl) { display: grid; gap: 12px; margin: 0; }
.api-page :deep(dl > div) { display: grid; gap: 4px; }
.api-page :deep(dt) { color: var(--ui-text-muted); }
.api-page :deep(dd) { margin: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
</style>
