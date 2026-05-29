<template>
  <UiBottomSheet
    :model-value="modelValue"
    aria-label="Детали операции"
    :closable="false"
    :show-handle="false"
    panel-class="ref-op-modal__panel"
    content-class="ref-op-modal__content"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <section v-if="operation" class="ref-op-modal">
      <div class="ref-op-modal__header">
        <span class="ref-op-modal__icon" :class="{ 'ref-op-modal__icon--negative': isNegative }" aria-hidden="true">
          <q-icon :name="isNegative ? 'remove' : 'add'" size="18px" />
        </span>

        <div>
          <h2 class="ref-op-modal__title">
            {{ operation.type }}
          </h2>
          <p class="ref-op-modal__date">
            {{ operation.date }}
          </p>
        </div>
      </div>

      <div class="ref-op-modal__grid">
        <div class="ref-op-modal__field">
          <p class="ref-op-modal__value ref-op-modal__value--amount" :class="{ 'ref-op-modal__value--negative': isNegative }">
            {{ operation.amount }}
          </p>
          <p class="ref-op-modal__label">
            Сумма
          </p>
        </div>

        <div class="ref-op-modal__field">
          <p class="ref-op-modal__value">
            ID {{ operation.referralId }}
          </p>
          <p class="ref-op-modal__label">
            Реферал
          </p>
        </div>
      </div>

      <button class="ref-op-modal__close" type="button" @click="$emit('update:modelValue', false)">
        Закрыть
      </button>
    </section>
  </UiBottomSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';

export interface ReferralOperationDetails {
  type: string;
  date: string;
  amount: string;
  referralId: string;
}

interface ReferralOperationDetailsModalProps {
  modelValue: boolean;
  operation: ReferralOperationDetails | null;
}

const props = defineProps<ReferralOperationDetailsModalProps>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

defineOptions({
  name: 'ReferralOperationDetailsModal',
});

const isNegative = computed(() => props.operation?.amount.trim().startsWith('-') ?? false);
</script>

<style scoped lang="scss">
:global(.ref-op-modal__panel) {
  padding: 29px 16px calc(34px + var(--ui-safe-area-bottom));
}

:global(.ref-op-modal__content) {
  max-height: none;
  margin-top: 0;
  overflow: visible;
}

.ref-op-modal {
  color: var(--ui-text-primary);
}

.ref-op-modal__header {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  column-gap: 10px;
  align-items: start;
}

.ref-op-modal__icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
}

.ref-op-modal__icon--negative {
  background: var(--ui-text-danger);
}

.ref-op-modal__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-op-modal__date {
  margin: 3px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-op-modal__grid {
  margin-top: 17px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.ref-op-modal__field {
  min-width: 0;
  height: 80px;
  padding: 17px 16px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--ui-surface-page);
}

.ref-op-modal__value {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ref-op-modal__value--amount {
  color: var(--ui-text-brand);
}

.ref-op-modal__value--negative {
  color: var(--ui-text-danger);
}

.ref-op-modal__label {
  margin: 4px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-op-modal__close {
  width: 230px;
  max-width: 100%;
  height: 45px;
  margin: 30px auto 0;
  padding: 10px;
  border: 0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-text-neutral);
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
  cursor: pointer;
}
</style>
