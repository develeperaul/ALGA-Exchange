import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { fetchCashRates, fetchQuotes, isCurrentQuote, type CashRate, type SharedQuote } from 'src/api/quotes';
import { isMockMode } from 'src/api/config';

type Status = 'loading' | 'ready' | 'error';
export function useHomeQuotes() {
  const quotes = ref<SharedQuote[]>([]);
  const cashRates = ref<CashRate[]>([]);
  const quotesStatus = ref<Status>('loading');
  const cashStatus = ref<Status>('loading');
  const now = ref(Date.now());
  let active = true;
  let quoteController: AbortController | undefined;
  let cashController: AbortController | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  // Timers may pause in background tabs or during device sleep. Resume events
  // revalidate against wall time without fetching or reusing an expired quote.
  function revalidateExpiry() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    if (!active || isMockMode) return;
    now.value = Date.now();
    const deadlines = [
      ...quotes.value.map(quote => Date.parse(quote.expires_at)),
      ...cashRates.value.map(rate => rate.attributes.expires_at === null
        ? NaN : Date.parse(rate.attributes.expires_at)),
    ].filter(deadline => Number.isFinite(deadline) && deadline > now.value);
    if (deadlines.length) {
      // Avoid browser timeout overflow for expiries more than ~24 days away.
      const delay = Math.min(Math.min(...deadlines) - now.value, 2_147_483_647);
      timer = setTimeout(revalidateExpiry, delay);
    }
  }
  async function refreshQuotes() {
    if (isMockMode || !active) return;
    quoteController?.abort();
    const controller = quoteController = new AbortController();
    quotes.value = [];
    quotesStatus.value = 'loading';
    revalidateExpiry();
    try {
      const result = await fetchQuotes(controller.signal);
      if (!active || controller.signal.aborted) return;
      quotes.value = result;
      revalidateExpiry();
      quotesStatus.value = 'ready';
    } catch {
      if (active && !controller.signal.aborted) quotesStatus.value = 'error';
    }
  }
  async function refreshCash() {
    if (isMockMode || !active) return;
    cashController?.abort();
    const controller = cashController = new AbortController();
    cashRates.value = [];
    cashStatus.value = 'loading';
    revalidateExpiry();
    try {
      const result = await fetchCashRates(controller.signal);
      if (!active || controller.signal.aborted) return;
      cashRates.value = result;
      revalidateExpiry();
      cashStatus.value = 'ready';
    } catch {
      if (active && !controller.signal.aborted) cashStatus.value = 'error';
    }
  }
  onMounted(() => {
    if (isMockMode) return;
    void refreshQuotes();
    void refreshCash();
    document.addEventListener('visibilitychange', revalidateExpiry);
    window.addEventListener('pageshow', revalidateExpiry);
    window.addEventListener('focus', revalidateExpiry);
  });
  onBeforeUnmount(() => {
    active = false;
    quoteController?.abort();
    cashController?.abort();
    if (timer !== undefined) clearTimeout(timer);
    document.removeEventListener('visibilitychange', revalidateExpiry);
    window.removeEventListener('pageshow', revalidateExpiry);
    window.removeEventListener('focus', revalidateExpiry);
  });
  return {
    quotesStatus, cashStatus, refreshQuotes, refreshCash,
    currentQuotes: computed(() => quotes.value.filter(q => isCurrentQuote(q, now.value))),
    currentCash: computed(() => cashRates.value.filter(r => r.attributes.type === 0 &&
      r.attributes.currency_from === 'USDT' && r.attributes.currency_to === 'RUB' &&
      isCurrentQuote(r.attributes, now.value))),
  };
}
