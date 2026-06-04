<template>
  <div
    v-if="modelValue"
    class="success-overlay"
    aria-label="Заявка отправлена"
  >
    <div class="success-overlay__content">
      <div class="success-overlay__illustration">
        <div class="success-overlay__circle">
          <img
            class="success-overlay__image"
            src="~assets/success-check.png"
            alt=""
            aria-hidden="true"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="success-overlay__svg" viewBox="0 0 375 271" fill="none">
            <g filter="url(#filter0_f_871_13785)">
              <ellipse cx="187.5" cy="143" rx="110.5" ry="8" fill="#AFAFE6"/>
            </g>
            <g filter="url(#filter1_i_871_13785)">
              <path d="M113 108.601C113 100.145 118.317 92.6035 126.281 89.763L236.281 50.5297C249.305 45.8846 263 55.5403 263 69.3674V126C263 137.046 254.046 146 243 146H133C121.954 146 113 137.046 113 126V108.601Z" fill="white" fill-opacity="0.5"/>
            </g>
            <defs>
              <filter id="filter0_f_871_13785" x="-43" y="15" width="461" height="256" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur_871_13785"/>
              </filter>
              <filter id="filter1_i_871_13785" x="113" y="45.3506" width="150" height="100.649" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="-4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_871_13785"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <h1 class="success-overlay__title">
        Заявка отправлена
      </h1>

      <p class="success-overlay__subtitle">
        Менеджер свяжется с вами <br> в ближайшее время
      </p>

      <UiButton
        class="success-overlay__button"
        size="large"
        @click="onGoHome"
      >
        На главную
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';

interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const router = useRouter();

function onGoHome() {
  emit('update:modelValue', false);
  void router.push('/');
}

defineOptions({
  name: 'SuccessOverlay',
});
</script>

<style scoped lang="scss">
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 2001;
  display: flex;

  justify-content: center;
  background: var(--ui-surface-page);
}

.success-overlay__content {
  width: 100%;
  max-width: 375px;
  padding:
    calc(40px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.success-overlay__illustration {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.success-overlay__circle {
  position: relative;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.success-overlay__image {
  width: 130px;
  height: 130px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.success-overlay__svg {
  position: absolute;
  bottom: -70px;
  width: 221px;
}

.success-overlay__title {
  margin: 32px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
  text-align: center;
}

.success-overlay__subtitle {
  margin: 12px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: center;
}

.success-overlay__button {
  margin-top: 30px;
  width: 100%;
}
</style>
