<template>
  <section class="kyc-shell" aria-label="KYC flow">
    <header class="kyc-shell__header">
      <div class="kyc-shell__header-frame" :class="{ 'kyc-shell__header-frame--centered': centered }">
        <button
          v-if="showBack"
          class="kyc-shell__back"
          type="button"
          aria-label="Назад"
          @click="$emit('back')"
        >
          <span class="kyc-shell__back-icon" aria-hidden="true" />
        </button>

        <div class="kyc-shell__titles" :class="{ 'kyc-shell__titles--centered': centered }">
          <p v-if="step" class="kyc-shell__step">
            {{ step }}
          </p>
          <h1 v-if="title" class="kyc-shell__title">
            {{ title }}
          </h1>
        </div>
      </div>
    </header>

    <main class="kyc-shell__content">
      <slot />
    </main>

    <footer v-if="$slots.footer" class="kyc-shell__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
interface KycFlowShellProps {
  title?: string;
  step?: string;
  showBack?: boolean;
  centered?: boolean;
}

withDefaults(defineProps<KycFlowShellProps>(), {
  title: '',
  step: '',
  showBack: true,
  centered: true,
});

defineEmits<{
  back: [];
}>();

defineOptions({
  name: 'KycFlowShell',
});
</script>

<style scoped lang="scss">
.kyc-shell {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.kyc-shell__header {
  padding:
    calc(16px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    0
    calc(16px + var(--ui-safe-area-left));
}

.kyc-shell__header-frame {
  min-height: 108px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.kyc-shell__header-frame--centered {
  justify-content: flex-start;
}

.kyc-shell__back {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  align-self: flex-start;
  background: var(--ui-surface-white);
  cursor: pointer;
}

.kyc-shell__back:active {
  transform: translateY(1px);
}

.kyc-shell__back:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.kyc-shell__back-icon {
  width: 9px;
  height: 9px;
  border-bottom: 2px solid var(--ui-text-muted);
  border-left: 2px solid var(--ui-text-muted);
  transform: rotate(45deg) translate(2px, -1px);
}

.kyc-shell__titles {
  margin-top: 28px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kyc-shell__titles--centered {
  align-items: center;
  text-align: center;
}

.kyc-shell__step {
  margin: 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.kyc-shell__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.kyc-shell__content {
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  padding:
    8px
    calc(16px + var(--ui-safe-area-right))
    0
    calc(16px + var(--ui-safe-area-left));
}

.kyc-shell__footer {
  width: 100%;
  padding:
    16px
    calc(16px + var(--ui-safe-area-right))
    calc(16px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  background: transparent;
}
</style>
