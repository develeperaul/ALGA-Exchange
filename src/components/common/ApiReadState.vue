<template>
  <div v-if="loading" class="api-read-state" role="status">Загрузка…</div>
  <div v-else-if="error" class="api-read-state" role="alert">
    <p>{{ error }}</p>
    <UiButton size="mini" @click="$emit('retry')">Повторить</UiButton>
    <RouterLink v-if="error === 'Сессия завершена. Войдите снова.'" to="/auth">Войти</RouterLink>
  </div>
</template>
<script setup lang="ts">
import UiButton from 'components/ui/UiButton.vue';
import { RouterLink } from 'vue-router';
defineProps<{ loading: boolean; error: string }>();
defineEmits<{ retry: [] }>();
</script>
<style scoped>
.api-read-state { padding: 20px; border-radius: 16px; background: var(--ui-surface-white); overflow-wrap: anywhere; }
.api-read-state p { margin: 0 0 12px; white-space: pre-line; }
</style>
