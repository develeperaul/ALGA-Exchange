<template>
  <section class="ui-verified-field" data-node-id="610:12413">
    <div class="ui-verified-field__badge" data-node-id="610:12417">
      <span class="ui-verified-field__badge-icon" aria-hidden="true" />
      <span>Верифицирован</span>
    </div>

    <div class="ui-verified-field__content" data-node-id="610:12414">
      <h3 class="ui-verified-field__name" data-node-id="610:12415">
        {{ name }}
      </h3>
      <p v-if="number" class="ui-verified-field__number" data-node-id="610:12416">
        {{ number }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface UiVerifiedFieldProps {
  name: string;
  number?: string;
}

defineProps<UiVerifiedFieldProps>();

defineOptions({
  name: 'UiVerifiedField',
});
</script>

<style scoped lang="scss">
.ui-verified-field {
  width: 100%;
  height: 122px;
  border-radius: var(--ui-radius-sheet);
  position: relative;
  overflow: hidden;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.ui-verified-field__badge {
  height: 32px;
  padding: 6px 12px;
  border-radius: 30px;
  position: absolute;
  top: 16px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--ui-brand-light);
  color: var(--ui-text-brand);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
}

.ui-verified-field__badge-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  display: block;
  background: var(--ui-brand-primary);
}

.ui-verified-field__badge-icon::before {
  content: "";
  width: 8px;
  height: 5px;
  border-left: 2px solid var(--ui-text-inverse);
  border-bottom: 2px solid var(--ui-text-inverse);
  position: absolute;
  top: 6px;
  left: 6px;
  transform: rotate(-45deg);
}

.ui-verified-field__content {
  position: absolute;
  top: 62px;
  left: 20px;
  right: 20px;
}

.ui-verified-field__name,
.ui-verified-field__number {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-verified-field__name {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: 0;
}

.ui-verified-field__number {
  margin-top: 4px;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}
</style>
