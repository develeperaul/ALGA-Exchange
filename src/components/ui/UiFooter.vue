<template>
  <nav class="ui-footer" aria-label="Main navigation">
    <button
      v-for="item in navItems"
      :key="item.key"
      class="ui-footer__item"
      :class="{ 'ui-footer__item--active': item.key === active }"
      type="button"
      @click="$emit('update:active', item.key)"
    >
      <span class="ui-footer__icon" aria-hidden="true">
        <img
          v-if="item.icon"
          class="ui-footer__asset"
          :class="item.assetClass"
          :src="item.icon"
          alt=""
        >
        <span
          v-else
          class="ui-footer__document"
          aria-hidden="true"
        >
          <img class="ui-footer__document-line ui-footer__document-line--full" :src="documentLineIcon" alt="">
          <img class="ui-footer__document-line ui-footer__document-line--full ui-footer__document-line--second" :src="documentLineIcon" alt="">
          <img class="ui-footer__document-line ui-footer__document-line--short" :src="documentShortLineIcon" alt="">
        </span>
      </span>
      <span class="ui-footer__label">
        {{ item.label }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import homeIcon from 'assets/ui/footer-home.svg';
import coinsIcon from 'assets/ui/footer-coins.svg';
import avatarIcon from 'assets/ui/footer-avatar.svg';
import documentLineIcon from 'assets/ui/footer-document-line.svg';
import documentShortLineIcon from 'assets/ui/footer-document-short-line.svg';

export type UiFooterItemKey = 'home' | 'orders' | 'referrals' | 'profile';

interface UiFooterProps {
  active?: UiFooterItemKey;
}

withDefaults(defineProps<UiFooterProps>(), {
  active: 'home',
});

defineEmits<{
  'update:active': [value: UiFooterItemKey];
}>();

defineOptions({
  name: 'UiFooter',
});

const navItems: Array<{
  key: UiFooterItemKey;
  label: string;
  icon: string | null;
  assetClass?: string;
}> = [
  {
    key: 'home',
    label: 'Главная',
    icon: homeIcon,
    assetClass: 'ui-footer__asset--home',
  },
  {
    key: 'orders',
    label: 'Заявки',
    icon: null,
  },
  {
    key: 'referrals',
    label: 'Рефералы',
    icon: coinsIcon,
    assetClass: 'ui-footer__asset--coins',
  },
  {
    key: 'profile',
    label: 'Профиль',
    icon: avatarIcon,
    assetClass: 'ui-footer__asset--avatar',
  },
];
</script>

<style scoped lang="scss">
.ui-footer {
  width: 100%;
  height: 70px;
  border-top: 1px solid #E6E4E4;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  overflow: hidden;
  background: var(--ui-surface-white);
}

.ui-footer__item {
  min-width: 0;
  height: 70px;
  padding: 12px 0 10px;
  border: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  background: transparent;
  color: var(--ui-text-muted);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  cursor: pointer;
}

.ui-footer__item--active {
  color: var(--ui-text-brand);
}

.ui-footer__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-footer__asset {
  display: block;
  object-fit: contain;
}

.ui-footer__asset--home {
  width: 20.5px;
  height: 20.4px;
}

.ui-footer__asset--coins {
  width: 16.5px;
  height: 19.5px;
}

.ui-footer__asset--avatar {
  width: 16px;
  height: 19.2px;
}

.ui-footer__document {
  width: 16px;
  height: 20px;
  border: 1.5px solid currentColor;
  border-radius: 4px;
  position: relative;
  display: block;
  background: var(--ui-surface-page);
}

.ui-footer__item--active .ui-footer__document {
  background: #52F77A;
  color: var(--ui-brand-primary);
}

.ui-footer__document-line {
  position: absolute;
  left: 2.5px;
  display: block;
  height: 1.5px;
}

.ui-footer__document-line--full {
  top: 4.25px;
  width: 8px;
}

.ui-footer__document-line--second {
  top: 9.25px;
}

.ui-footer__document-line--short {
  top: 14.25px;
  width: 4px;
}

.ui-footer__label {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
