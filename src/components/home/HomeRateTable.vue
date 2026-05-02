<template>
  <section class="home-rate-table" data-node-id="578:2761" aria-label="Курс обменов">
    <div class="home-rate-table__header" aria-hidden="true">
      <span />
      <span>Покупка</span>
      <span>Продажа</span>
    </div>

    <div class="home-rate-table__panel" data-node-id="578:2765">
      <div
        v-for="item in items"
        :key="item.name"
        class="home-rate-table__row"
      >
        <span class="home-rate-table__name">
          {{ item.name }}
        </span>

        <span class="home-rate-table__value">
          <span
            class="home-rate-table__arrow"
            :class="`home-rate-table__arrow--${normalizeDirection(item.buy.direction)}`"
            aria-hidden="true"
          />
          <span>{{ item.buy.value }}</span>
        </span>

        <span class="home-rate-table__value">
          <span
            class="home-rate-table__arrow"
            :class="`home-rate-table__arrow--${normalizeDirection(item.sell.direction)}`"
            aria-hidden="true"
          />
          <span>{{ item.sell.value }}</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type HomeRateDirection = 'up' | 'down' | 'вверх' | 'вниз';

interface HomeRateValue {
  direction: HomeRateDirection;
  value: string | number;
}

interface HomeRateItem {
  name: string;
  buy: HomeRateValue;
  sell: HomeRateValue;
}

interface HomeRateTableProps {
  items?: HomeRateItem[];
}

withDefaults(defineProps<HomeRateTableProps>(), {
  items: () => [
    {
      name: 'Безналичный',
      buy: {
        direction: 'up',
        value: '79,8 ₽',
      },
      sell: {
        direction: 'up',
        value: '76,33 ₽',
      },
    },
    {
      name: 'Наличный',
      buy: {
        direction: 'down',
        value: '79,9 ₽',
      },
      sell: {
        direction: 'up',
        value: '77,33 ₽',
      },
    },
  ],
});

defineOptions({
  name: 'HomeRateTable',
});

function normalizeDirection(direction: HomeRateDirection): 'up' | 'down' {
  return direction === 'down' || direction === 'вниз' ? 'down' : 'up';
}
</script>

<style scoped lang="scss">
.home-rate-table {
  width: 100%;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.home-rate-table__header {
  height: 18px;
  margin-bottom: 10px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.home-rate-table__panel {
  min-height: 90px;
  padding: 14px 20px;
  border-radius: var(--ui-radius-card);
  overflow: hidden;
  background: var(--ui-surface-white);
}

.home-rate-table__row {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
}

.home-rate-table__row + .home-rate-table__row {
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px solid #E6E4E4;
}

.home-rate-table__name {
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-rate-table__value {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
}

.home-rate-table__arrow {
  width: 7px;
  height: 13px;
  margin-right: 10px;
  position: relative;
  flex: 0 0 auto;
  color: var(--ui-brand-dark);
}

.home-rate-table__arrow::before {
  content: "";
  width: 1.5px;
  height: 12px;
  border-radius: 2px;
  position: absolute;
  top: 1px;
  left: 3px;
  background: currentColor;
}

.home-rate-table__arrow::after {
  content: "";
  width: 6px;
  height: 6px;
  border-top: 1.5px solid currentColor;
  border-left: 1.5px solid currentColor;
  position: absolute;
  top: 1px;
  left: 0.25px;
  transform: rotate(45deg);
  transform-origin: center;
}

.home-rate-table__arrow--down {
  color: var(--ui-state-error);
  transform: rotate(180deg);
}
</style>
