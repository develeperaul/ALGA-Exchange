<template>
  <section class="ui-stage-field" aria-label="Referral stages">
    <img
      class="ui-stage-field__line"
      :src="stageLine"
      alt=""
      aria-hidden="true"
    >

    <div
      v-for="(step, index) in steps"
      :key="`${index}-${step}`"
      class="ui-stage-field__step"
    >
      <span class="ui-stage-field__marker">
        <img
          class="ui-stage-field__marker-bg"
          :src="stageCircle"
          alt=""
          aria-hidden="true"
        >
        <span class="ui-stage-field__marker-text">
          {{ formatIndex(index) }}
        </span>
      </span>
      <p class="ui-stage-field__text">
        {{ step }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import stageCircle from 'assets/ui/stage-circle.svg';
import stageLine from 'assets/ui/stage-line.svg';

interface UiStageFieldProps {
  steps?: string[];
}

withDefaults(defineProps<UiStageFieldProps>(), {
  steps: () => [
    'Вы приглашаете друга.\nОн совершает обмены',
    'Вы зарабатываете 20% от комиссии сервиса с каждой сделки друга',
    'Чем больше друзей вы приглашаете, тем выше доход',
    'Выводите средства на любой кошелек. Без ограничений выплат',
  ],
});

defineOptions({
  name: 'UiStageField',
});

function formatIndex (index: number) {
  return String(index + 1).padStart(2, '0');
}
</script>

<style scoped lang="scss">
.ui-stage-field {
  width: 100%;
  min-height: 232px;
  padding: 10px 20px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.ui-stage-field__line {
  width: 156px;
  height: 1px;
  position: absolute;
  top: 25px;
  left: 35px;
  transform: rotate(90deg);
  transform-origin: left center;
}

.ui-stage-field__step {
  min-height: 52px;
  display: grid;
  grid-template-columns: 30px 1fr;
  column-gap: 12px;
  position: relative;
  z-index: 1;
}

.ui-stage-field__marker {
  width: 30px;
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-stage-field__marker-bg {
  width: 30px;
  height: 30px;
  position: absolute;
  inset: 0;
  display: block;
}

.ui-stage-field__marker-text {
  position: relative;
  color: var(--ui-text-brand);
  font-family: var(--ui-font-family);
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  text-align: center;
}

.ui-stage-field__text {
  margin: 0;
  padding-top: 1px;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
  white-space: pre-line;
}
</style>
