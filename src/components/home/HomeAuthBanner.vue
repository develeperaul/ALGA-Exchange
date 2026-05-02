<template>
  <section class="home-auth-banner" data-node-id="608:11794">
    <span class="home-auth-banner__icon" data-node-id="608:11797" aria-hidden="true">
      <span class="home-auth-banner__avatar" data-node-id="608:11800" />
    </span>

    <h2 class="home-auth-banner__title" data-node-id="608:11796">
      {{ title }}
    </h2>

    <button
      class="home-auth-banner__button"
      type="button"
      data-node-id="608:11799"
      @click="$emit('login')"
    >
      {{ buttonText }}
    </button>
  </section>
</template>

<script setup lang="ts">
interface HomeAuthBannerProps {
  title?: string;
  buttonText?: string;
}

withDefaults(defineProps<HomeAuthBannerProps>(), {
  title: 'Войти/авторизоваться',
  buttonText: 'Войти',
});

defineEmits<{
  login: [];
}>();

defineOptions({
  name: 'HomeAuthBanner',
});
</script>

<style scoped lang="scss">
.home-auth-banner {
  width: 100%;
  height: 122px;
  border-radius: var(--ui-radius-sheet);
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 210px 88px at 62% 49%, rgb(120 134 169 / 68%) 0%, rgb(83 93 118 / 20%) 54%, transparent 75%),
    linear-gradient(90deg, #2E303D 7.43%, #535D76 107.43%);
  color: var(--ui-text-inverse);
}

.home-auth-banner__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  top: 16px;
  left: 20px;
  display: grid;
  place-items: center;
  background: var(--ui-brand-primary);
}

.home-auth-banner__avatar {
  width: 14px;
  height: 14px;
  position: relative;
  display: block;
}

.home-auth-banner__avatar::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 4px;
  background: var(--ui-surface-white);
}

.home-auth-banner__avatar::after {
  content: "";
  width: 12px;
  height: 7px;
  border-radius: 7px 7px 3px 3px;
  position: absolute;
  left: 1px;
  bottom: 0;
  background: var(--ui-surface-white);
}

.home-auth-banner__title {
  width: 227px;
  margin: 0;
  position: absolute;
  top: 17px;
  left: 54px;
  overflow: hidden;
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-auth-banner__button {
  width: 230px;
  height: 40px;
  padding: 10px;
  border: 0;
  border-radius: var(--ui-radius-button);
  position: absolute;
  top: 56px;
  left: 55px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-button);
  line-height: var(--ui-line-button);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  cursor: pointer;
}

.home-auth-banner__button:hover {
  background: var(--ui-brand-hover);
}

.home-auth-banner__button:active {
  background: var(--ui-brand-active);
}

.home-auth-banner__button:focus-visible {
  outline: 2px solid var(--ui-surface-white);
  outline-offset: 2px;
}

@media (max-width: 359px) {
  .home-auth-banner__button {
    width: calc(100% - 40px);
    left: 20px;
  }

  .home-auth-banner__title {
    width: calc(100% - 74px);
  }
}
</style>
