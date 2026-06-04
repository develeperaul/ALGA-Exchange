<template>
  <div class="kyc-doc-type">
    <button
      type="button"
      class="kyc-doc-type__option"
      :class="{ 'kyc-doc-type__option--active': modelValue === 'RU' }"
      @click="emit('update:modelValue', 'RU')"
    >
      <span class="kyc-doc-type__radio" aria-hidden="true" />
      <span>Россия</span>
    </button>

    <button
      type="button"
      class="kyc-doc-type__option"
      :class="{ 'kyc-doc-type__option--active': modelValue === 'FOREIGN' }"
      @click="emit('update:modelValue', 'FOREIGN')"
    >
      <span class="kyc-doc-type__radio" aria-hidden="true" />
      <span>Иностранный паспорт</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { KycCountryCode } from 'components/kyc/useKycLocalState';

interface KycDocTypeSelectorProps {
  modelValue: KycCountryCode;
}

defineProps<KycDocTypeSelectorProps>();

const emit = defineEmits<{
  'update:modelValue': [value: KycCountryCode];
}>();

defineOptions({
  name: 'KycDocTypeSelector',
});
</script>

<style scoped lang="scss">
.kyc-doc-type {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kyc-doc-type__option {
  padding: 0;
  border: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
  text-align: left;
  cursor: pointer;
}

.kyc-doc-type__radio {
  width: 22px;
  height: 22px;
  border: 2px solid var(--ui-text-muted);
  border-radius: 50%;
  position: relative;
  flex: 0 0 auto;
}

.kyc-doc-type__option--active .kyc-doc-type__radio {
  border-color: var(--ui-brand-primary);
}

.kyc-doc-type__option--active .kyc-doc-type__radio::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  inset: 4px;
  background: var(--ui-brand-primary);
}
</style>
