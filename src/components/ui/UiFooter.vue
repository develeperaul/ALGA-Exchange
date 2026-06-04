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


      <span class="ui-footer__icon" aria-hidden="true" v-html="item.icon">


      </span>
      <span class="ui-footer__label">
        {{ item.label }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">

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
    icon:  `<svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 10.9384C2.5 9.71422 3.06058 8.55744 4.02142 7.79888L9.52142 3.45677C10.9747 2.30948 13.0253 2.30948 14.4786 3.45677L19.9786 7.79888C20.9394 8.55744 21.5 9.71422 21.5 10.9384V17.5C21.5 19.7091 19.7091 21.5 17.5 21.5H16C15.4477 21.5 15 21.0523 15 20.5V17.5C15 16.3954 14.1046 15.5 13 15.5H11C9.89543 15.5 9 16.3954 9 17.5V20.5C9 21.0523 8.55228 21.5 8 21.5H6.5C4.29086 21.5 2.5 19.7091 2.5 17.5L2.5 10.9384Z" fill="#77FF98" stroke="#1ED74B" stroke-width="1.5"/>
            </svg>`,
    assetClass: 'ui-footer__asset--home',

  },
  {
    key: 'orders',
    label: 'Заявки',
    icon: `<svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="16" height="20" rx="4" fill="#F8F8F8" stroke="#95939F" stroke-width="1.5"/>
            <path d="M8 7H16" stroke="#95939F" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 12H16" stroke="#95939F" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 17H12" stroke="#95939F" stroke-width="1.5" stroke-linecap="round"/>
          </svg>`,
  },
  {
    key: 'referrals',
    label: 'Рефералы',
    icon: `<svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5.64706C19 7.10899 15.6421 8.29412 11.5 8.29412C7.35786 8.29412 4 7.10899 4 5.64706C4 4.18513 7.35786 3 11.5 3C15.6421 3 19 4.18513 19 5.64706Z" fill="#F8F8F8"/>
            <path d="M19 5.64706C19 7.10899 15.6421 8.29412 11.5 8.29412C7.35786 8.29412 4 7.10899 4 5.64706V9.88235C4 11.3443 7.35786 12.5294 11.5 12.5294C15.6421 12.5294 19 11.3443 19 9.88235V5.64706Z" fill="#F8F8F8"/>
            <path d="M19 9.88235C19 11.3443 15.6421 12.5294 11.5 12.5294C7.35786 12.5294 4 11.3443 4 9.88235V14.1176C4 15.5796 7.35786 16.7647 11.5 16.7647C15.6421 16.7647 19 15.5796 19 14.1176V9.88235Z" fill="#F8F8F8"/>
            <path d="M19 14.1176C19 15.5796 15.6421 16.7647 11.5 16.7647C7.35786 16.7647 4 15.5796 4 14.1176V18.3529C4 19.8149 7.35786 21 11.5 21C15.6421 21 19 19.8149 19 18.3529V14.1176Z" fill="#F8F8F8"/>
            <path d="M19 5.64706C19 7.10899 15.6421 8.29412 11.5 8.29412C7.35786 8.29412 4 7.10899 4 5.64706M19 5.64706C19 4.18513 15.6421 3 11.5 3C7.35786 3 4 4.18513 4 5.64706M19 5.64706V18.3529M19 5.64706V9.88235M4 5.64706V18.3529M4 5.64706V9.88235M19 9.88235C19 11.3443 15.6421 12.5294 11.5 12.5294C7.35786 12.5294 4 11.3443 4 9.88235M19 9.88235V14.1176M4 9.88235V14.1176M19 14.1176C19 15.5796 15.6421 16.7647 11.5 16.7647C7.35786 16.7647 4 15.5796 4 14.1176M19 14.1176V18.3529M4 14.1176V18.3529M19 18.3529C19 19.8149 15.6421 21 11.5 21C7.35786 21 4 19.8149 4 18.3529" stroke="#95939F" stroke-width="1.5"/>
          </svg>`,
    assetClass: 'ui-footer__asset--coins',
  },
  {
    key: 'profile',
    label: 'Профиль',
    icon:  `<svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="7" r="4" fill="#F8F8F8"/>
            <path d="M19 18.475C19 20.6384 14.0817 20.1538 12 20.1538C9.91831 20.1538 5 20.6384 5 18.475C5 16.3116 6.07692 11.2002 12 11.2002C18.2064 11.2002 19 16.3116 19 18.475Z" fill="#F8F8F8"/>
            <path d="M14.8507 10.9027C16.0606 10.0067 16.8485 8.55665 16.8485 6.92308C16.8485 4.20849 14.6735 2 12 2C9.32654 2 7.15151 4.20849 7.15151 6.92308C7.15151 8.55665 7.93938 10.0067 9.14934 10.9027C6.14161 12.0714 4 15.0324 4 18.4923C4 19.9853 5.19626 21.2 6.66667 21.2H17.3333C18.8037 21.2 20 19.9853 20 18.4923C20 15.0324 17.8584 12.0714 14.8507 10.9027ZM8.60607 6.92308C8.60607 5.02288 10.1286 3.47694 12 3.47694C13.8714 3.47694 15.3939 5.02288 15.3939 6.92308C15.3939 8.82328 13.8714 10.3693 12 10.3693C10.1286 10.3693 8.60607 8.82328 8.60607 6.92308ZM17.3333 19.7231H6.66667C5.99831 19.7231 5.45456 19.1709 5.45456 18.4923C5.45456 14.8276 8.3908 11.8461 12 11.8461C15.6093 11.8461 18.5455 14.8275 18.5455 18.4923C18.5455 19.1709 18.0017 19.7231 17.3333 19.7231Z" fill="#95939F"/>
          </svg>`,
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
.ui-footer__icon:deep(svg) > * {
  stroke: #95939F;
  fill: #F8F8F8;
}
.ui-footer__item--active .ui-footer__icon :deep(svg) > * {
  stroke: #1ED74B;
  fill: #77FF98;
}
// .ui-footer__asset--home {
//   width: 20.5px;
//   height: 20.4px;
// }

// .ui-footer__asset--coins {
//   width: 16.5px;
//   height: 19.5px;
// }

// .ui-footer__asset--avatar {
//   width: 16px;
//   height: 19.2px;
// }

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
