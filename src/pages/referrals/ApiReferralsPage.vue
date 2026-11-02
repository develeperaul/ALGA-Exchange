<template>
  <ApiPageShell :title="titles[view]">
    <template #actions><RouterLink v-if="view !== 'overview'" to="/referrals">К рефералам</RouterLink></template>
    <template v-if="!auth.isAuthenticated">
      <img class="referrals-api__hero" :src="hero" alt="" />
      <section class="api-card"><h2>Делитесь кодом с друзьями и получайте награды</h2><p>Войдите, чтобы увидеть приглашённых клиентов и историю.</p></section>
      <UiButton @click="router.push('/auth')">Войти</UiButton>
    </template>
    <template v-else>
      <template v-if="overview">
        <img v-if="view === 'overview'" class="referrals-api__hero" :src="hero" alt="" />
        <section class="api-card" aria-label="Код и статистика наград">
          <h2>Код приглашения и награды</h2>
          <ApiReadState :loading="profile.loading.value" :error="profile.error.value" @retry="profile.refresh" />
          <template v-if="profile.data.value">
            <ReferralLinkField :value="profile.data.value.attributes.code" label="Код приглашения" />
            <dl>
              <div><dt>Заработано наград</dt><dd>{{ money(profile.data.value.attributes.earned_amount, 'USDT') }}</dd></div>
              <div><dt>Ожидают распределения</dt><dd>{{ money(profile.data.value.attributes.pending_amount, 'USDT') }}</dd></div>
              <div><dt>Отменено</dt><dd>{{ money(profile.data.value.attributes.cancelled_amount, 'USDT') }}</dd></div>
              <div v-if="profile.data.value.attributes.repaid_amount != null"><dt>Направлено на погашение долга</dt><dd>{{ money(profile.data.value.attributes.repaid_amount, 'USDT') }}</dd></div>
              <div v-if="profile.data.value.attributes.debt_amount != null"><dt>Остаток долга по отменённым наградам</dt><dd>{{ money(profile.data.value.attributes.debt_amount, 'USDT') }}</dd></div>
            </dl>
            <p class="api-meta">Это статистика наград, а не доступный остаток.</p>
            <p v-if="profile.data.value.attributes.repaid_amount != null" class="api-meta">Погашение долга уже включено в заработанную сумму.</p>
            <UiButton size="mini" variant="neutral" :disabled="profile.loading.value" @click="profile.refresh">Обновить награды</UiButton>
          </template>
        </section>
        <section class="api-card" :aria-label="referralBalance ? 'Реферальный баланс USDT' : 'Общий баланс USDT'">
          <h2>{{ referralBalance ? 'Реферальный баланс USDT' : 'Общий баланс USDT' }}</h2>
          <ApiReadState v-if="!referralBalance" :loading="balance.loading.value" :error="balance.error.value" @retry="balance.refresh" />
          <template v-if="displayBalance">
            <dl><div><dt>Доступно</dt><dd>{{ money(displayBalance.available, 'USDT') }}</dd></div>
              <div><dt>В резерве</dt><dd>{{ money(displayBalance.reserved, 'USDT') }}</dd></div>
              <div><dt>Всего</dt><dd>{{ money(displayBalance.total, 'USDT') }}</dd></div></dl>
            <p v-if="displayBalance.is_frozen" role="alert">Расходование средств приостановлено до сверки.</p>
            <template v-if="referralBalance">
              <dl><div><dt>Ожидающие награды</dt><dd>{{ money(referralBalance.pending_rewards, 'USDT') }}</dd></div>
                <div><dt>Минимум вывода</dt><dd>{{ money(referralBalance.minimum_withdrawal, 'USDT') }}</dd></div>
                <div><dt>Комиссия вывода</dt><dd>{{ money(referralBalance.withdrawal_fee, 'USDT') }}</dd></div>
                <div><dt>Сеть</dt><dd>{{ referralBalance.network }}</dd></div></dl>
              <p v-if="!referralBalance.kyc_verified">Для вывода требуется подтверждение личности.</p>
              <RouterLink to="/referrals/account/history">История наград</RouterLink>
            </template>
            <template v-else>
              <p class="api-meta">Реферальные награды поступают в общий баланс.</p>
              <RouterLink to="/orders/history">История движения средств</RouterLink>
              <RouterLink v-if="!displayBalance.is_frozen" to="/wallet">Перейти к операциям</RouterLink>
            </template>
          </template>
        </section>
      </template>
      <template v-if="view === 'overview'">
        <section class="api-card" aria-label="Условия реферальной программы">
          <h2>Условия программы</h2>
          <ApiReadState v-if="!customerProgram" :loading="commission.loading.value" :error="commission.error.value" @retry="commission.refresh" />
          <p v-if="displayProgram">{{ displayProgram.enabled && displayProgram.value !== null
            ? `Награда — ${displayProgram.value}% от комиссии сервиса, а не от всей суммы обмена.`
            : 'Начисление новых наград сейчас отключено.' }}</p>
          <p v-if="customerProgram?.levels?.second != null">Второй уровень: {{ customerProgram.levels.second }}% от комиссии сервиса.</p>
        </section>
        <section class="api-card" aria-label="Доход за период">
          <h2>Заработано за период</h2>
          <form class="api-list" @submit.prevent="applyPeriod">
            <label class="api-field">С даты<input v-model="draftFrom" type="date" /></label>
            <label class="api-field">По дату<input v-model="draftTo" type="date" /></label>
            <p v-if="periodError" role="alert">{{ periodError }}</p>
            <UiButton type="submit" size="mini" :disabled="profit.loading.value">Применить</UiButton>
          </form>
          <ApiReadState :loading="profit.loading.value" :error="profit.error.value" @retry="profit.refresh" />
          <p v-if="profit.data.value">{{ money(profit.data.value.value, 'USDT') }} · {{ from || to ? 'выбранный период' : 'за всё время' }}</p>
          <p class="api-meta">Распределённые и неотменённые награды.</p>
        </section>
        <nav class="api-list" aria-label="Разделы рефералов">
          <RouterLink class="api-card" to="/referrals/my">Мои рефералы</RouterLink>
          <RouterLink class="api-card" to="/referrals/account/history">История наград</RouterLink>
          <RouterLink class="api-card" to="/referrals/account">Средства и награды</RouterLink>
        </nav>
      </template>
      <template v-if="view === 'relations'">
        <ApiReadState :loading="relations.loading.value" :error="relations.error.value" @retry="relations.refresh" />
        <UiButton size="mini" :disabled="relations.loading.value" @click="relations.refresh">Обновить</UiButton>
        <template v-if="relations.data.value">
          <p>Всего приглашённых: {{ relations.data.value.total }}</p>
          <section v-if="relations.data.value.items.length === 0" class="api-card" role="status">У вас пока нет приглашённых друзей.</section>
          <article v-for="person in relations.data.value.items" :key="person.id" class="api-card">
            <h2>Реферал №{{ person.id }}</h2><p class="api-meta">{{ displayDate(person.attributes.created_at) }}</p>
            <p>Сумма распределённых наград: {{ money(person.attributes.transactions_sum, person.attributes.currency) }}</p>
            <p>Распределённых наград: {{ person.attributes.transactions_count }}</p>
          </article>
        </template>
      </template>
      <template v-if="view === 'history' || view === 'account'">
        <h2>История реферальных записей</h2>
        <UiTabs v-model="historyType" :options="historyTabs" aria-label="Тип реферальной записи" />
        <UiButton size="mini" :disabled="history.loading.value" @click="history.refresh">Обновить историю</UiButton>
        <ApiReadState :loading="history.loading.value" :error="history.error.value" @retry="history.retry" />
        <section v-if="!history.loading.value && !history.error.value && !visibleHistory.length" class="api-card" role="status">{{ history.items.value.length || history.next.value ? 'На загруженных страницах нет записей этого типа.' : 'Реферальных записей пока нет.' }}</section>
        <article v-for="entry in visibleHistory" :key="entry.id" class="api-card">
          <h3>{{ entry.attributes.kind === 'legacy' ? (entry.attributes.type === 1 ? 'Старая заявка на выплату' : 'Старое начисление') : 'Реферальная награда' }}</h3>
          <p>{{ money(entry.attributes.amount, entry.attributes.currency) }}</p>
          <p v-if="entry.attributes.currency === null" class="api-meta">Валюта старой записи неизвестна.</p>
          <p>{{ entryStatus(entry.attributes) }}</p><p class="api-meta">{{ displayDate(entry.attributes.created_at) }}</p>
          <UiButton size="mini" variant="neutral" @click="selectedId = entry.id">Подробнее</UiButton>
        </article>
        <UiButton v-if="history.next.value && !history.error.value" :disabled="history.loading.value" @click="history.loadMore">Показать ещё</UiButton>
        <section v-if="selectedId" class="api-card" aria-label="Детали реферальной записи">
          <UiButton size="mini" variant="neutral" @click="selectedId = ''">Закрыть детали</UiButton>
          <ApiReadState :loading="detail.loading.value" :error="detail.error.value" @retry="detail.refresh" />
          <template v-if="detail.data.value">
            <h2>Реферальная запись</h2><p>{{ detail.data.value.id }}</p><p>{{ entryStatus(detail.data.value.attributes) }}</p>
            <dl>
              <div><dt>Сумма записи</dt><dd>{{ money(detail.data.value.attributes.amount, detail.data.value.attributes.currency) }}</dd></div>
              <div><dt>Фактически зачислено</dt><dd>{{ money(detail.data.value.attributes.credited_amount, detail.data.value.attributes.currency) }}</dd></div>
              <div><dt>Погашение долга</dt><dd>{{ money(detail.data.value.attributes.repaid_amount, detail.data.value.attributes.currency) }}</dd></div>
              <div><dt>Долг по отменённой награде</dt><dd>{{ money(detail.data.value.attributes.debt_amount, detail.data.value.attributes.currency) }}</dd></div>
              <div><dt>Распределена</dt><dd>{{ displayDate(detail.data.value.attributes.settled_at) }}</dd></div>
              <div><dt>Отменена</dt><dd>{{ displayDate(detail.data.value.attributes.cancelled_at) }}</dd></div>
              <div><dt>Приглашённый клиент</dt><dd>{{ detail.data.value.attributes.referred?.id ?? '—' }}</dd></div>
            </dl>
          </template>
        </section>
      </template>
    </template>
  </ApiPageShell>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import ApiPageShell from 'components/common/ApiPageShell.vue';
import ApiReadState from 'components/common/ApiReadState.vue';
import ReferralLinkField from 'components/referrals/ReferralLinkField.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiTabs from 'components/ui/UiTabs.vue';
import hero from 'assets/referrals/hero.png';
import { useAuthStore } from '@/stores/auth-store';
import { useSessionRead } from '@/composables/useSessionRead';
import { useSessionList } from '@/composables/useSessionList';
import { fetchBalance, fetchReferralCommission, fetchReferralEntry, fetchReferralHistory, fetchReferralProfile,
  fetchReferralProfit, fetchRelations, type ReferralEntry } from '@/api/activity';
import { displayDate, money, referralStates } from '@/utils/activity-view';
const props = withDefaults(defineProps<{ view?: 'overview' | 'account' | 'relations' | 'history' }>(), { view: 'overview' });
const router = useRouter();
const auth = useAuthStore();
const titles = { overview: 'Рефералы', account: 'Средства и награды', relations: 'Мои рефералы', history: 'История наград' };
const overview = computed(() => props.view === 'overview' || props.view === 'account');
const signedIn = () => auth.isAuthenticated;
const profile = useSessionRead(() => 'referrals:profile', fetchReferralProfile, () => signedIn() && overview.value);
const balance = useSessionRead(() => 'balance', fetchBalance, () => signedIn() && overview.value);
const commission = useSessionRead(() => 'referrals:commission', fetchReferralCommission, () => signedIn() && props.view === 'overview');
const referralBalance = computed(() => profile.data.value?.attributes.balance ?? null);
const displayBalance = computed(() => referralBalance.value ?? balance.data.value);
const customerProgram = computed(() => profile.data.value?.attributes.program ?? null);
const displayProgram = computed(() => customerProgram.value ?? commission.data.value);
const from = ref(''), to = ref(''), draftFrom = ref(''), draftTo = ref(''), periodError = ref('');
const profit = useSessionRead(() => `referrals:profit:${from.value}:${to.value}`,
  signal => fetchReferralProfit(from.value, to.value, signal), () => signedIn() && props.view === 'overview');
function applyPeriod() {
  const valid = (v: string) => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v);
  if (!valid(draftFrom.value) || !valid(draftTo.value) || (draftFrom.value && draftTo.value && draftFrom.value > draftTo.value)) {
    periodError.value = 'Проверьте даты: начало периода должно быть не позже окончания.'; return;
  }
  periodError.value = '';
  if (from.value === draftFrom.value && to.value === draftTo.value) void profit.refresh();
  else { from.value = draftFrom.value; to.value = draftTo.value; }
}
const relations = useSessionRead(() => 'referrals:relations', fetchRelations, () => signedIn() && props.view === 'relations');
const historyType = ref<'all' | '0' | '1'>('all');
const historyTabs = [{ label: 'Все', value: 'all' }, { label: 'Начисления', value: '0' }, { label: 'Старые выплаты', value: '1' }];
const history = useSessionList(() => 'referrals:history',
  (cursor, signal) => fetchReferralHistory(cursor, signal), () => signedIn() && (props.view === 'history' || props.view === 'account'));
const visibleHistory = computed(() => history.items.value.filter(entry => historyType.value === 'all' || entry.attributes.type === Number(historyType.value)));
const selectedId = ref('');
watch(historyType, () => { selectedId.value = ''; });
watch(() => auth.isAuthenticated, () => { selectedId.value = ''; });
const detail = useSessionRead(() => `referrals:entry:${selectedId.value}`,
  signal => fetchReferralEntry(selectedId.value, signal), () => signedIn() && !!selectedId.value);
function entryStatus(a: ReferralEntry) {
  return a.kind === 'legacy' ? ['Ожидает', 'Одобрена', 'Отклонена'][a.status ?? -1] ?? 'Старая запись'
    : referralStates[a.state ?? ''] ?? 'Статус не указан';
}
</script>
<style scoped>
.referrals-api__hero { display: block; width: 155px; height: 155px; object-fit: contain; margin: 0 auto; }
</style>
