<template>
  <button
    class="home-exchange-hero"
    type="button"
    data-node-id="578:2741"
    @click="$emit('click')"
  >
    <span class="home-exchange-hero__title" data-node-id="578:2742">
      {{ title }}
    </span>

    <span class="home-exchange-hero__icon" data-node-id="578:2743" aria-hidden="true">
      <span class="home-exchange-hero__icon-card" />
    </span>
  </button>
</template>

<script setup lang="ts">
interface HomeExchangeHeroProps {
  title?: string;
}

withDefaults(defineProps<HomeExchangeHeroProps>(), {
  title: 'Безналичный обмен',
});

defineEmits<{
  click: [];
}>();

defineOptions({
  name: 'HomeExchangeHero',
});
</script>

<style scoped lang="scss">
.home-exchange-hero {
  width: 100%;
  height: 90px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #B8EDAF;
  border-radius: var(--ui-radius-sheet);
  position: relative;
  overflow: hidden;
  display: block;
  background:
    linear-gradient(
      180deg,
      #95E144 22.5%,
      var(--ui-brand-primary) 29.558%,
      var(--ui-brand-primary) 66.75%,
      #3FCF62 118.12%
    );
  box-shadow: 0 1px 6px rgb(66 200 98 / 50%);
  cursor: pointer;
}

.home-exchange-hero__title {
  position: absolute;
  top: 34px;
  left: 20px;
  max-width: 230px;
  overflow: hidden;
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-exchange-hero__icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  position: absolute;
  top: 22px;
  right: 25px;
  display: grid;
  place-items: center;
  background: var(--ui-surface-white);
  box-shadow: 0 8px 18px rgb(0 0 0 / 18%);
}

.home-exchange-hero__icon-card {
  width: 22px;
  height: 16px;
  border: 2px solid var(--ui-brand-primary);
  border-radius: 4px;
  position: relative;
  display: block;
}

.home-exchange-hero__icon-card::before,
.home-exchange-hero__icon-card::after {
  content: "";
  height: 2px;
  border-radius: 2px;
  position: absolute;
  left: 4px;
  right: 4px;
  background: var(--ui-brand-primary);
}

.home-exchange-hero__icon-card::before {
  top: 4px;
}

.home-exchange-hero__icon-card::after {
  top: 9px;
}
</style>
