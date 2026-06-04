<template>
  <UiBottomSheet
    :model-value="modelValue"
    aria-label="Специальные условия для инфлюенсеров"
    :closable="false"
    :show-handle="false"
    panel-class="influencer-modal__panel"
    content-class="influencer-modal__content"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <section class="influencer-modal">
      <button
        class="influencer-modal__close"
        type="button"
        aria-label="Закрыть"
        @click="$emit('update:modelValue', false)"
      >
        <span aria-hidden="true" />
      </button>
      <div class=" tw-flex tw-items-center tw-justify-between tw-mt-4">

        <h2 class="influencer-modal__title tw-mt-5">
          Специальные условия
          <br>
          для инфлюенсеров
        </h2>

        <div class="influencer-modal__image" aria-hidden="true">
          <img class="influencer-modal__img influencer-modal__img--1" :src="influencer1Image" alt="">
          <img class="influencer-modal__img influencer-modal__img--2" :src="influencer2Image" alt="">
        </div>
      </div>

      <p class="influencer-modal__text">
        Если вы блогер-инфлюенсер с аудиторией, то для вас мы подготовили уникальные условия!
      </p>

      <p class="influencer-modal__text influencer-modal__text--support">
        Свяжитесь с поддержкой, чтобы узнать подробнее
      </p>

      <button class="influencer-modal__chat" type="button">
        <UiIcon name="support" size="24" color="var(--ui-brand-primary)" />

        <span>Написать в чат</span>
      </button>
    </section>
  </UiBottomSheet>
</template>

<script setup lang="ts">
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import influencer1Image from 'assets/referrals/influencer-1.png';
import influencer2Image from 'assets/referrals/influencer-2.png';

interface InfluencerConditionsModalProps {
  modelValue: boolean;
}

defineProps<InfluencerConditionsModalProps>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

defineOptions({
  name: 'InfluencerConditionsModal',
});
</script>

<style scoped lang="scss">
.influencer-modal {

  color: var(--ui-text-primary);
}

:global(.influencer-modal__panel) {
  padding: 0 16px calc(28px + var(--ui-safe-area-bottom));
}

:global(.influencer-modal__content) {
  max-height: none;
  margin-top: 0;
  overflow: visible;
}

.influencer-modal__close {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #BDBDBD;
  cursor: pointer;
}

.influencer-modal__close span,
.influencer-modal__close span::after {
  width: 16px;
  height: 2px;
  border-radius: 2px;
  display: block;
  background: currentColor;
}

.influencer-modal__close span {
  transform: rotate(45deg);
}

.influencer-modal__close span::after {
  content: '';
  transform: rotate(90deg);
}

.influencer-modal__title {


  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.influencer-modal__image {
  position: relative;
  width: 102px;
  height: 83px;

}

.influencer-modal__img {
  position: absolute;
  object-fit: contain;
}

.influencer-modal__img--1 {
  width: 102px;
  height: 102px;
  // left: 0;
  // top: -15px;
}

.influencer-modal__img--2 {
  width: 106px;
  height: 106px;
  left: -13px;
  // top: -11px;
}

.influencer-modal__text {
  width: 100%;
  margin: 35px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.influencer-modal__text--support {
  margin-top: 10px;
}

.influencer-modal__chat {
  width: 100%;
  height: 50px;
  margin-top: 22px;
  padding: 10px;
  border: 0;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--ui-brand-light);
  color: var(--ui-text-brand);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
  cursor: pointer;
}
</style>
