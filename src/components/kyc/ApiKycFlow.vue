<template>
  <KycStepLayout title="Проверка личности" :step="stepLabel">
    <section class="api-kyc" :aria-busy="busy">
      <p v-if="!authenticated">Войдите в аккаунт, чтобы пройти проверку личности.</p>
      <RouterLink v-if="!authenticated" to="/auth">Войти</RouterLink>
      <template v-else>
        <p v-if="error" class="api-kyc__error" role="alert">{{ error }}</p>
        <p v-if="notice" role="status">{{ notice }}</p>
        <UiButton variant="neutral" :disabled="busy || cooling('read')" @click="refresh">
          {{ busy ? 'Подождите…' : 'Обновить состояние' }}
        </UiButton>
        <p v-if="refreshRequired">Перед следующей отправкой обновите состояние проверки.</p>
        <p v-if="cooldownLabel">{{ cooldownLabel }}</p>

        <form v-if="canStart" class="api-kyc__form" @submit.prevent="start">
          <p>На указанный номер будет отправлен код подтверждения. Номер должен совпадать с указанным в банках.</p>
          <UiInput v-model="phone" name="onboarding-phone" label="Номер телефона" placeholder="+70000000000" type="tel" autocomplete="tel" maxlength="16" :disabled="busy || Boolean(startedPhone)" />
          <p v-if="view?.state === 'failed'">Начало проверки не завершено. Для повтора укажите тот же номер телефона.</p>
          <UiButton type="submit" :disabled="!phoneValid || blocked || cooling('start')">Отправить код</UiButton>
        </form>

        <template v-if="view">
          <p v-if="view.state === 'queued' || view.state === 'processing'">Подключаем проверку. Обновите состояние через несколько секунд.</p>
          <p v-if="view.error" class="api-kyc__error">Не удалось начать проверку: {{ view.error.code }}</p>
          <template v-if="view.state === 'completed'">
            <form v-if="!customer?.phone_set" class="api-kyc__form" @submit.prevent="verify">
              <UiInput v-model="otp" name="onboarding-otp" label="Код из SMS" inputmode="numeric" autocomplete="one-time-code" maxlength="64" :disabled="busy" />
              <UiButton type="submit" :disabled="!otpValid || blocked || cooling('verify')">Подтвердить телефон</UiButton>
              <UiButton variant="neutral" :disabled="blocked || cooling('resend')" @click="resend">Отправить SMS повторно</UiButton>
              <p>Повторная SMS доступна не ранее чем через 60 секунд. Действуют ограничения на число SMS и попыток ввода кода.</p>
            </form>

            <template v-else>
              <p>Телефон подтверждён.</p>
              <p v-if="customer">Статус проверки: {{ statusLabels[customer.kyc_status] }}. Уровень: {{ customer.verification_level }}.</p>
              <p v-if="task">{{ taskLabels[task.state] }}</p>
              <p v-if="task?.error" class="api-kyc__error">Ошибка проверки: {{ task.error.code }}</p>
              <a v-if="esiaLink" :href="esiaLink" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Продолжить в Госуслугах</a>
              <p v-if="task?.action === 'esia' && task.state === 'checking'">После возврата из Госуслуг обновите состояние на этой странице.</p>
              <p v-if="task?.state === 'review_required'">Требуется ручная сверка службой поддержки. Повторная отправка временно недоступна.</p>

              <template v-if="identityAvailable">
                <form v-if="!passportApproved" class="api-kyc__form" @submit.prevent="submitIdentity">
                  <UiInput v-model="identity.last_name" name="onboarding-last-name" label="Фамилия" autocomplete="family-name" maxlength="255" :disabled="busy" />
                  <UiInput v-model="identity.first_name" name="onboarding-first-name" label="Имя" autocomplete="given-name" maxlength="255" :disabled="busy" />
                  <UiInput v-model="identity.patronymic" name="onboarding-patronymic" label="Отчество (если есть)" autocomplete="additional-name" maxlength="255" :disabled="busy" />
                  <UiInput v-model="identity.birth_date" name="onboarding-birth-date" :label="correction ? 'Дата рождения (необязательно)' : 'Дата рождения'" type="date" :max="yesterday" :disabled="busy" />
                  <UiInput v-model="identity.persondoc_number" name="onboarding-document" label="Серия и номер документа" maxlength="128" :disabled="busy" />
                  <p>Введите данные документа. Фотографии паспорта и селфи не требуются.</p>
                  <label v-if="task"><input v-model="correction" type="checkbox" :disabled="busy"> Отправить исправленный комплект данных</label>
                  <UiButton type="submit" :disabled="!identityValid || blocked || cooling('identity')">
                    {{ correction ? 'Отправить исправленные данные' : 'Отправить на проверку' }}
                  </UiButton>
                </form>
                <p>Или пройдите проверку через Госуслуги.</p>
                <UiButton variant="neutral" :disabled="blocked || cooling('identity') || (customer?.kyc_status === 'approved' && customer.verification_level >= 4)" @click="esia">Начать проверку через Госуслуги</UiButton>
              </template>
              <RouterLink to="/profile">Вернуться в профиль</RouterLink>
            </template>
          </template>
        </template>
      </template>
    </section>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import UiInput from 'components/ui/UiInput.vue';
import UiButton from 'components/ui/UiButton.vue';
import { getOnboarding, startOnboarding, verifyOnboardingPhone, resendOnboardingOtp, identifyOnboarding, updateOnboarding, esiaOnboarding } from '@/api/kyc';
import { getSessionScope, isCurrentSession, isValidSession, onSessionChange } from '@/api/session';
import { ApiError } from '@/api/errors';
import { useAuthStore } from '@/stores/auth-store';
import type { OnboardingView } from '@/models/kyc/kyc';

const auth = useAuthStore();
const view = ref<OnboardingView | null>(null);
const missing = ref(false);
const busy = ref(false);
const error = ref('');
const notice = ref('');
const refreshRequired = ref(true);
const phone = ref('');
const startedPhone = ref('');
const otp = ref('');
const correction = ref(false);
const identity = reactive({ first_name: '', last_name: '', patronymic: '', birth_date: '', persondoc_number: '' });
const authenticated = ref(isValidSession(getSessionScope().session));
const now = ref(Date.now());
type Action = 'read' | 'start' | 'verify' | 'resend' | 'identity';
const retryAt = reactive<Record<Action, number>>({ read: 0, start: 0, verify: 0, resend: 0, identity: 0 });
let controller = new AbortController();
let generation = 0;
let disposed = false;
let timer: ReturnType<typeof setInterval> | undefined;
const customer = computed(() => view.value?.customer);
const task = computed(() => customer.value?.identification);
const blocked = computed(() => busy.value || refreshRequired.value || !authenticated.value);
const canStart = computed(() => missing.value || view.value?.state === 'failed');
const phoneValid = computed(() => /^\+[1-9][0-9]{7,14}$/.test(phone.value));
const otpValid = computed(() => /^[0-9]{1,64}$/.test(otp.value));
const identityAvailable = computed(() => view.value?.state === 'completed' && customer.value?.phone_set
  && !['queued', 'checking', 'review_required'].includes(task.value?.state || ''));
const passportApproved = computed(() => customer.value?.kyc_status === 'approved' && customer.value.verification_level >= 3);
const stepLabel = computed(() => canStart.value ? 'Номер телефона' : customer.value?.phone_set ? 'Данные и статус проверки' : 'Подтверждение телефона');
const yesterday = computed(() => {
  const d = new Date(now.value); d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});
function validBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && value <= yesterday.value;
}
const identityValid = computed(() => Boolean(identity.first_name.trim() && identity.last_name.trim() && identity.persondoc_number.trim())
  && identity.first_name.length <= 255 && identity.last_name.length <= 255 && identity.patronymic.length <= 255
  && identity.persondoc_number.length <= 128 && (validBirthDate(identity.birth_date) || (correction.value && !identity.birth_date)));
const statusLabels = { none: 'не пройдена', pending: 'на рассмотрении', approved: 'одобрена', rejected: 'отклонена' };
const taskLabels = { queued: 'Данные приняты в обработку. Обновите состояние через несколько секунд.', checking: 'Проверяем данные. Обновите состояние позже.', completed: 'Задача проверки завершена.', failed: 'Задача проверки не завершена.', review_required: 'Нужна ручная сверка.' };
const esiaLink = computed(() => {
  if (refreshRequired.value || task.value?.action !== 'esia' || task.value.state !== 'checking' || !task.value.redirect_url) return '';
  try {
    const url = new URL(task.value.redirect_url);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
});
function dateTime(value?: string | null) { const n = value ? Date.parse(value) : 0; return Number.isFinite(n) ? n : 0; }
function deadline(action: Action) {
  const c = customer.value;
  const backend = action === 'verify' ? dateTime(c?.verify_retry_at) : action === 'resend' ? dateTime(c?.resend_retry_at)
    : action === 'start' ? dateTime(view.value?.error?.retry_at) : action === 'identity' ? dateTime(task.value?.error?.retry_at) : 0;
  return Math.max(retryAt[action], backend);
}
function cooling(action: Action) { return deadline(action) > now.value; }
const cooldownLabel = computed(() => {
  const nearest = Math.min(...(['read', 'start', 'verify', 'resend', 'identity'] as Action[]).map(deadline).filter(t => t > now.value));
  return Number.isFinite(nearest) ? `Следующая попытка ограниченного действия — не ранее ${new Date(nearest).toLocaleTimeString()}.` : '';
});
function clearForms() {
  phone.value = ''; startedPhone.value = ''; otp.value = ''; correction.value = false;
  Object.assign(identity, { first_name: '', last_name: '', patronymic: '', birth_date: '', persondoc_number: '' });
}
function clearScope() {
  generation++; controller.abort(); controller = new AbortController();
  busy.value = false; view.value = null; missing.value = false; refreshRequired.value = true;
  error.value = ''; notice.value = ''; clearForms();
  for (const key of Object.keys(retryAt) as Action[]) retryAt[key] = 0;
  authenticated.value = isValidSession(getSessionScope().session);
}
const stopSessionListener = onSessionChange(clearScope);

function applyView(result: OnboardingView) {
  view.value = result; missing.value = false; refreshRequired.value = false;
  // Financial eligibility still comes from the profile, not onboarding alone.
  if (result.customer?.kyc_status === 'approved') {
    void auth.fetchProfile({ background: true }).catch(() => {});
  }
}

// Writes run once; successful identity submissions are reconciled with one GET.
async function run(action: Action, operation: (signal: AbortSignal) => Promise<unknown>) {
  if (disposed || busy.value || cooling(action) || !authenticated.value || (action !== 'read' && refreshRequired.value)) return;
  const scope = getSessionScope();
  if (!isValidSession(scope.session)) { clearScope(); return; }
  const current = ++generation;
  const active = () => !disposed && current === generation && isCurrentSession(scope.epoch) && !controller.signal.aborted;
  let phase = action;
  busy.value = true; error.value = ''; notice.value = '';
  if (action !== 'read') refreshRequired.value = true;
  try {
    const result = await operation(controller.signal);
    if (!active()) return;
    if (action === 'read') {
      applyView(result as OnboardingView);
    } else {
      notice.value = 'Ответ получен. Обновите состояние проверки перед следующим действием.';
      if (action === 'start') { startedPhone.value = phone.value; retryAt.resend = Date.now() + 60000; }
      if (action === 'resend') retryAt.resend = Date.now() + 60000;
      if (action === 'verify') otp.value = '';
      if (action === 'identity') {
        Object.assign(identity, { first_name: '', last_name: '', patronymic: '', birth_date: '', persondoc_number: '' });
        correction.value = false;
        notice.value = 'Данные отправлены. Обновляем состояние проверки…';
        if (cooling('read')) {
          notice.value = 'Данные отправлены. Обновите состояние после окончания ограничения.';
          return;
        }
        phase = 'read';
        const updated = await getOnboarding(controller.signal);
        if (!active()) return;
        applyView(updated);
        notice.value = 'Данные отправлены. Состояние проверки обновлено.';
      }
    }
  } catch (e) {
    if (!active()) return;
    if (action === 'read' && e instanceof ApiError && e.status === 404) {
      view.value = null; missing.value = true; refreshRequired.value = false;
    } else {
      error.value = (action === 'identity' && phase === 'read' ? 'Данные отправлены, но не удалось обновить состояние. Нажмите «Обновить состояние». ' : '')
        + (e instanceof Error ? e.message : 'Не удалось выполнить запрос.');
      if (phase === 'read') refreshRequired.value = true;
      if (action === 'identity' && phase === 'read') notice.value = '';
      if (e instanceof ApiError && e.retryAfter) {
        const seconds = Number(e.retryAfter);
        const until = Number.isFinite(seconds) ? Date.now() + Math.max(0, seconds) * 1000 : dateTime(e.retryAfter);
        retryAt[phase] = Math.max(retryAt[phase], until);
      }
      if (action === 'resend') retryAt.resend = Math.max(retryAt.resend, Date.now() + 60000);
    }
  } finally { if (active()) busy.value = false; }
}
function refresh() { return run('read', getOnboarding); }
function start() { if (canStart.value && phoneValid.value) return run('start', signal => startOnboarding(phone.value, signal)); }
function verify() { if (view.value?.state === 'completed' && !customer.value?.phone_set && otpValid.value) return run('verify', signal => verifyOnboardingPhone(otp.value, signal)); }
function resend() { if (view.value?.state === 'completed' && !customer.value?.phone_set) return run('resend', resendOnboardingOtp); }
function submitIdentity() {
  if (!identityAvailable.value || passportApproved.value || !identityValid.value) return;
  const payload = { first_name: identity.first_name.trim(), last_name: identity.last_name.trim(), patronymic: identity.patronymic.trim() || null, persondoc_number: identity.persondoc_number.trim() };
  return run('identity', signal => correction.value
    ? updateOnboarding({ ...payload, birth_date: identity.birth_date || null }, signal)
    : identifyOnboarding({ ...payload, birth_date: identity.birth_date }, signal));
}
function esia() {
  if (identityAvailable.value && !(customer.value?.kyc_status === 'approved' && customer.value.verification_level >= 4)) return run('identity', esiaOnboarding);
}
function dispose() {
  disposed = true; clearScope(); stopSessionListener(); if (timer) clearInterval(timer);
}
onMounted(() => { timer = setInterval(() => { now.value = Date.now(); }, 1000); void refresh(); });
onBeforeUnmount(dispose);
</script>

<style scoped lang="scss">
.api-kyc { display: flex; flex-direction: column; gap: 18px; padding-bottom: 32px; }
.api-kyc p { margin: 0; font-size: var(--ui-font-t1); line-height: var(--ui-line-t1); }
.api-kyc__form { display: flex; flex-direction: column; gap: 20px; margin: 8px 0; }
.api-kyc__error { color: var(--ui-state-error-figma); white-space: pre-line; }
.api-kyc a { color: var(--ui-brand-primary); overflow-wrap: anywhere; }
</style>
