<template>
  <div class="ui-promo-field">
    <span class="ui-promo-field__label">Промокод</span>
    <div class="ui-promo-field__control">
      <input
        v-if="!readonly"
        :value="modelValue"
        class="ui-promo-field__input"
        type="text"
        :placeholder="placeholder"
        :aria-label="ariaLabel || 'Промокод'"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <span v-else class="ui-promo-field__value">{{ modelValue }}</span>

      <span
        v-if="showCheck"
        class="ui-promo-field__icon"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_873_14085)">
            <path d="M14.4205 6.82693C14.7256 7.13211 14.7256 7.6268 14.4205 7.93182L9.17938 13.1731C8.87421 13.4781 8.37967 13.4781 8.07449 13.1731L5.57953 10.6779C5.27435 10.3729 5.27435 9.87823 5.57953 9.57321C5.88455 9.26804 6.37924 9.26804 6.68427 9.57321L8.62686 11.5158L13.3156 6.82693C13.6208 6.52191 14.1154 6.52191 14.4205 6.82693ZM20 10C20 15.5275 15.5267 20 10 20C4.4725 20 0 15.5267 0 10C0 4.4725 4.47327 0 10 0C15.5275 0 20 4.47327 20 10ZM18.4375 10C18.4375 5.33615 14.6632 1.5625 10 1.5625C5.33615 1.5625 1.5625 5.33676 1.5625 10C1.5625 14.6638 5.33676 18.4375 10 18.4375C14.6638 18.4375 18.4375 14.6632 18.4375 10Z" fill="#1ED74B"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4375 10C18.4375 5.33615 14.6632 1.5625 10 1.5625C5.33615 1.5625 1.5625 5.33676 1.5625 10C1.5625 14.6638 5.33676 18.4375 10 18.4375C14.6638 18.4375 18.4375 14.6632 18.4375 10ZM14.4205 7.93182C14.7256 7.6268 14.7256 7.13211 14.4205 6.82693C14.1154 6.52191 13.6208 6.52191 13.3156 6.82693L8.62686 11.5158L6.68427 9.57321C6.37924 9.26804 5.88455 9.26804 5.57953 9.57321C5.27435 9.87823 5.27435 10.3729 5.57953 10.6779L8.07449 13.1731C8.37967 13.4781 8.87421 13.4781 9.17938 13.1731L14.4205 7.93182Z" fill="#D4F5DC"/>
          </g>
          <defs>
            <clipPath id="clip0_873_14085">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UiPromoFieldProps {
  modelValue?: string;
  readonly?: boolean;
  showCheck?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<UiPromoFieldProps>(), {
  modelValue: '',
  readonly: false,
  showCheck: false,
  placeholder: 't.me/DS_Exchange123456',
  ariaLabel: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({
  name: 'UiPromoField',
});
</script>

<style scoped lang="scss">
.ui-promo-field {
  display: grid;
  gap: 12px;
}

.ui-promo-field__label {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.ui-promo-field__control {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
  color: var(--ui-text-secondary);
  text-align: left;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.ui-promo-field__input {
  min-width: 0;
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font: inherit;
  letter-spacing: inherit;
}

.ui-promo-field__input::placeholder {
  color: var(--ui-text-muted);
}

.ui-promo-field__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-promo-field__icon {
  width: 20px;
  height: 20px;
  justify-self: end;
  display: grid;
  place-items: center;
}
</style>
