<template>
  <q-layout view="hHh lpR fFf" class="kyc-layout">
    <q-page-container>
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
</style>

