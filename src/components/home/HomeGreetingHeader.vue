<template>
  <header class="home-greeting-header">
    <span class="home-greeting-header__avatar" aria-hidden="true" />
    <p>Привет, {{ name }}</p>
  </header>
</template>

<script setup lang="ts">
interface HomeGreetingHeaderProps {
  name?: string;
}

withDefaults(defineProps<HomeGreetingHeaderProps>(), {
  name: 'Пользователь',
});

defineOptions({
  name: 'HomeGreetingHeader',
});
</script>

<style scoped lang="scss">
.home-greeting-header {
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-greeting-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  flex: 0 0 auto;
  background: var(--ui-brand-primary);
}

.home-greeting-header__avatar::before,
.home-greeting-header__avatar::after {
  content: "";
  position: absolute;
  left: 50%;
  background: var(--ui-surface-white);
  transform: translateX(-50%);
}

.home-greeting-header__avatar::before {
  width: 8px;
  height: 8px;
  top: 6px;
  border-radius: 50%;
}

.home-greeting-header__avatar::after {
  width: 16px;
  height: 8px;
  bottom: 6px;
  border-radius: 9px 9px 4px 4px;
}

.home-greeting-header p {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}
</style>
