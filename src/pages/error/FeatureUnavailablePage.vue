<template>
  <q-page class="flex flex-center" style="background: var(--ui-surface-page); color: var(--ui-text-primary)">
    <main class="text-center q-pa-lg">
      <h1 class="text-h5">Раздел временно недоступен</h1>
      <UiButton type="button" size="large" @click="router.push('/')">На главную</UiButton>
    </main>
  </q-page>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
defineOptions({ name: 'FeatureUnavailablePage' });
const router = useRouter();
</script>
