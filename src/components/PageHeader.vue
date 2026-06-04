<template>
  <header class="page-header">
    <button
      class="page-header__back"
      type="button"
      aria-label="Назад"
      @click="goBack"
    >
      <UiIcon
        name="back"
        :size="24"
        color="var(--ui-text-icon)"
      />
    </button>
    <h1 class="page-header__title">{{ title }}</h1>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import UiIcon from 'components/ui/UiIcon.vue';

interface Props {
  title: string;
}

defineProps<Props>();

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }
  void router.push('/profile');
}

defineOptions({
  name: 'PageHeader',
});
</script>

<style scoped lang="scss">
.page-header {
  min-height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-header__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.page-header__back {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-surface-white);
  cursor: pointer;
}
</style>
