<template>
  <q-layout view="hHh lpR fFf" class="kyc-layout">
    <q-page-container class="kyc-layout__page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KycLayout',
});
</script>

<style scoped lang="scss">
.kyc-layout {
  background: var(--ui-surface-page);
}

.kyc-layout__page-container {
  height: 100vh;
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-padding-block: 16px calc(32px + var(--ui-safe-area-bottom));
}

// The desktop phone frame clips its contents to the viewport minus its margins.
@media (min-width: 768px) {
  .kyc-layout__page-container {
    height: calc(100vh - 64px);
    height: calc(100dvh - 64px);
  }
}
</style>

