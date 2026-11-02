<template>
  <section class="home-rate-table" data-node-id="859:13158" aria-label="Курс обменов">
    <h2 class="home-rate-table__title">Курс обменов (1 USDT)</h2>
    <div class="home-rate-table__header" aria-hidden="true"><span /><span>Покупка</span><span>Продажа</span></div>
    <div class="home-rate-table__panel">
      <div v-for="(item, index) in items" :key="item.id || index" class="home-rate-table__row">
        <span class="home-rate-table__name">
          {{ item.name }}
          <span v-if="item.notice" class="home-rate-table__notice" :role="item.status === 'error' ? 'alert' : 'status'">
            {{ item.notice }}
            <button v-if="item.retry" type="button" class="home-rate-table__retry" @click="$emit('refresh', item.retry)">
              {{ item.status === 'error' ? 'Повторить' : 'Обновить' }}
            </button>
          </span>
        </span>
        <span class="home-rate-table__value" :title="item.buy.raw ? `${item.buy.raw} ₽` : undefined"
          :aria-label="item.buy.raw ? `${item.buy.raw} ₽` : undefined">
          <span v-if="item.buy.direction" class="home-rate-table__arrow" :class="`home-rate-table__arrow--${normalizeDirection(item.buy.direction)}`" aria-hidden="true" />
          {{ item.buy.value }}
        </span>
        <span class="home-rate-table__value home-rate-table__value--sell" :title="sellOption(item).raw ? `${sellOption(item).raw} ₽` : undefined"
          :aria-label="sellOption(item).raw ? `${sellOption(item).raw} ₽, ${sellOption(item).method || ''}` : undefined">
          <span v-if="item.sell.direction" class="home-rate-table__arrow" :class="`home-rate-table__arrow--${normalizeDirection(item.sell.direction)}`" aria-hidden="true" />
          {{ sellOption(item).value }}
          <select v-if="item.sell.options && item.sell.options.length > 1" :value="sellOption(item).id"
            class="home-rate-table__method" aria-label="Способ продажи USDT"
            @change="selectedSellId = ($event.target as HTMLSelectElement).value">
            <option v-for="option in item.sell.options" :key="option.id" :value="option.id">{{ option.method }}</option>
          </select>
          <span v-else-if="item.sell.method" class="home-rate-table__method-label">{{ item.sell.method }}</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type HomeRateDirection = 'up' | 'down' | 'вверх' | 'вниз';
type RateSource = 'quotes' | 'cash';
interface SellOption { id: string; method: string; value: string; raw: string }
interface HomeRateValue {
  id?: string;
  direction?: HomeRateDirection;
  value: string | number;
  raw?: string;
  method?: string;
  options?: readonly SellOption[];
}
interface HomeRateItem {
  id?: string;
  name: string;
  buy: HomeRateValue;
  sell: HomeRateValue;
  notice?: string;
  status?: 'loading' | 'ready' | 'error';
  retry?: RateSource;
}

withDefaults(defineProps<{ items?: readonly HomeRateItem[] }>(), { items: () => [] });
defineEmits<{ refresh: [source: RateSource] }>();
defineOptions({ name: 'HomeRateTable' });

const selectedSellId = ref('');
function sellOption(item: HomeRateItem): HomeRateValue {
  const options = item.sell.options;
  if (!options?.length) return item.sell;
  return options.find(option => option.id === selectedSellId.value) || options[0]!;
}
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
.home-rate-table__title {
  margin: 0 0 11px;
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}
.home-rate-table__header {
  display: grid;
  grid-template-columns: minmax(0, 144fr) minmax(0, 95fr) minmax(0, 64fr);
}
.home-rate-table__header {
  margin-bottom: 10px;
  padding: 0 30px 0 10px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  white-space: nowrap;
}
.home-rate-table__panel {
  min-height: 90px;
  padding: 14px 20px;
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface-white);
}
.home-rate-table__row {
  display: grid;
  grid-template-columns: minmax(0, 134fr) minmax(0, 95fr) minmax(0, 74fr);
  align-items: start;
  min-height: 21px;
}
.home-rate-table__row + .home-rate-table__row {
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px solid #E6E4E4;
}
.home-rate-table__name {
  min-width: 0;
  padding-top: 2px;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}
.home-rate-table__notice {
  display: block;
  margin-top: 2px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
}
.home-rate-table__retry {
  display: block;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ui-text-brand);
  font-size: inherit;
  line-height: inherit;
  cursor: pointer;
}
.home-rate-table__value {
  min-width: 0;
  padding-left: 10px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
  white-space: nowrap;
}
.home-rate-table__method,
.home-rate-table__method-label {
  display: block;
  width: 100%;
  min-width: 0;
  margin-top: 1px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  letter-spacing: 0;
}
.home-rate-table__method {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.home-rate-table__arrow {
  display: inline-block;
  width: 0;
  height: 13px;
  margin-right: 10px;
  margin-left: -10px;
  position: relative;
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
}
.home-rate-table__arrow--down { color: var(--ui-state-error); transform: rotate(180deg); }
</style>
