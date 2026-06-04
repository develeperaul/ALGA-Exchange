<template>
  <KycFlowShell :title="title" :step="step" :show-back="showBack" @back="onBack">
    <section class="kyc-step">
      <slot />
    </section>

    <template #footer>
      <slot name="footer" />
    </template>
  </KycFlowShell>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import KycFlowShell from 'components/kyc/KycFlowShell.vue';

interface KycStepLayoutProps {
  title: string;
  step?: string;
  showBack?: boolean;
}

withDefaults(defineProps<KycStepLayoutProps>(), {
  step: '',
  showBack: true,
});

defineOptions({
  name: 'KycStepLayout',
});

const router = useRouter();

function onBack() {
  const hasBack = Boolean((window.history.state as unknown as { back?: unknown } | null)?.back);
  if (hasBack) {
    router.back();
    return;
  }

  void router.replace('/profile');
}
</script>

<style scoped lang="scss">
.kyc-step {
  width: 100%;
  min-height: 0;
}
</style>
