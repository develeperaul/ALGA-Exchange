<template>
  <q-page class="order-detail-page">
    <main class="order-detail-screen" aria-label="Детали заявки">
      <header class="order-detail-header">
        <button
          class="order-detail-back"
          type="button"
          aria-label="Назад"
          @click="goBack"
        >
          <span class="order-detail-back__arrow" aria-hidden="true" />
        </button>
      </header>

      <h1 class="order-detail-title">
        {{ title }}
      </h1>

      <section class="order-detail-meta" aria-label="Метаданные заявки">
        <div class="order-detail-meta__left">
          <div class="order-detail-id">
            <span class="order-detail-id__text">
              ID заявки {{ requestId }}
            </span>
            <button
              class="order-detail-id__copy"
              :class="{ 'order-detail-id__copy--copied': copied }"
              type="button"
              :aria-label="copyLabel"
              @click="copyRequestId"
            >
              <svg
                class="order-detail-id__copy-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 8V6.6C8 5.716 8.716 5 9.6 5H17.4C18.284 5 19 5.716 19 6.6V14.4C19 15.284 18.284 16 17.4 16H16"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <rect
                  x="5"
                  y="8"
                  width="11"
                  height="11"
                  rx="2.2"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
              </svg>
            </button>
          </div>

          <time class="order-detail-date">
            {{ date }}
          </time>
        </div>

        <span class="order-detail-status" :class="`order-detail-status--${status}`">
          {{ statusLabel }}
        </span>
      </section>

      <section class="order-detail-card order-detail-card--summary" aria-label="Сумма заявки">
        <span class="order-detail-card__label">Сумма</span>
        <span class="order-detail-card__value">{{ amount }}</span>
      </section>

      <section class="order-detail-card order-detail-card--details" aria-label="Реквизиты заявки">
        <div class="order-detail-row">
          <span class="order-detail-row__label">Куда</span>
          <span class="order-detail-row__value">
            <span class="order-detail-bank__icon" aria-hidden="true">T</span>
            <span class="order-detail-bank__text">{{ destination }}</span>
          </span>
        </div>

        <div class="order-detail-row">
          <span class="order-detail-row__label">Сумма в рублях</span>
          <span class="order-detail-row__value">{{ amountRub }}</span>
        </div>

        <div class="order-detail-row">
          <span class="order-detail-row__label">Курс</span>
          <span class="order-detail-row__value">{{ rate }}</span>
        </div>
      </section>

      <button class="order-detail-chat" type="button">
        <svg
          class="order-detail-chat__icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3.5C6.753 3.5 2.5 7.09 2.5 11.52c0 2.39 1.24 4.54 3.22 6.01l-.63 2.63c-.08.33.22.63.55.55l3.05-.73c1.03.29 2.14.45 3.31.45 5.247 0 9.5-3.59 9.5-8.01S17.247 3.5 12 3.5Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M8.2 11.6h7.6"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
          <path
            d="M8.2 14.6h5.2"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <span class="order-detail-chat__text">Написать в чат</span>
      </button>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'OrderDetailPage',
});

type OrderStatus = 'processing' | 'completed' | 'cancelled';

const router = useRouter();
const route = useRoute();

const status = ref<OrderStatus>('processing');
const title = ref('Вывод средств');
const requestId = computed(() => String(route.params.id ?? '13522251'));
const date = ref('8 фев. 2026 г.');
const amount = ref('-132 USDT');
const destination = ref('Т-банк');
const amountRub = ref('-10 600 RUB');
const rate = ref('1 USDT = 79,84 RUB');

const statusLabel = computed(() => {
  const labels: Record<OrderStatus, string> = {
    processing: 'В обработке',
    completed: 'Исполнена',
    cancelled: 'Отменена',
  };

  return labels[status.value];
});

const copied = ref(false);
let copiedTimer: number | undefined;

const copyLabel = computed(() => (
  copied.value ? 'Скопировано' : `Скопировать ID заявки ${requestId.value}`
));

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/orders');
}

async function copyRequestId() {
  const raw = requestId.value.trim();
  if (!raw) return;

  const textToCopy = raw.replace(/[^\d]/g, '') || raw;

  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (error) {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.setAttribute('readonly', 'true');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  copied.value = true;
  if (copiedTimer) {
    window.clearTimeout(copiedTimer);
  }
  copiedTimer = window.setTimeout(() => {
    copied.value = false;
  }, 1200);
}
</script>

<style scoped lang="scss">
.order-detail-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.order-detail-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(16px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.order-detail-header {
  height: 40px;
  display: flex;
  align-items: flex-start;
}

.order-detail-back {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 9px 0 rgb(0 0 0 / 5%);
  color: var(--ui-text-muted);
  cursor: pointer;
}

.order-detail-back:active {
  transform: translateY(1px);
}

.order-detail-back:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.order-detail-back__arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(1px) rotate(135deg);
}

.order-detail-title {
  margin: 4px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: 0;
}

.order-detail-meta {
  margin-top: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.order-detail-meta__left {
  min-width: 0;
}

.order-detail-id {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.order-detail-id__text {
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-detail-id__copy {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.order-detail-id__copy--copied {
  color: var(--ui-text-brand);
}

.order-detail-id__copy:hover {
  color: var(--ui-text-secondary);
}

.order-detail-id__copy:active {
  transform: translateY(1px);
}

.order-detail-id__copy:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.order-detail-date {
  display: block;
  margin-top: 4px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.order-detail-status {
  height: 24px;
  padding: 0 16px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
}

.order-detail-status--processing {
  background: #FBEB0F;
  color: var(--ui-text-primary);
}

.order-detail-status--completed {
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
}

.order-detail-status--cancelled {
  background: #FB3E0F;
  color: var(--ui-text-inverse);
}

.order-detail-card {
  margin-top: 16px;
  padding: 14px 20px;
  border-radius: 16px;
  background: var(--ui-surface-white);
}

.order-detail-card--summary {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.order-detail-card__label {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.order-detail-card__value {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  white-space: nowrap;
}

.order-detail-card--details {
  display: grid;
  gap: 10px;
}

.order-detail-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.order-detail-row__label {
  min-width: 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-detail-row__value {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  white-space: nowrap;
}

.order-detail-bank__icon {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #FBEB0F;
  color: var(--ui-text-primary);
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
}

.order-detail-chat {
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
  background: var(--ui-brand-soft);
  color: var(--ui-text-brand);
  cursor: pointer;
}

.order-detail-chat:active {
  transform: translateY(1px);
}

.order-detail-chat:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.order-detail-chat__text {
  font-size: var(--ui-font-button);
  line-height: var(--ui-line-button);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
}

.order-detail-chat__icon {
  flex: 0 0 auto;
}
</style>
