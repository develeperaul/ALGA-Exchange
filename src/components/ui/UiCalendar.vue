<template>
  <section class="ui-calendar">
    <button
      v-if="closable"
      class="ui-calendar__close"
      type="button"
      aria-label="Закрыть"
      @click="$emit('close')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <header class="ui-calendar__header">
      <h2 class="ui-calendar__month">
        {{ currentMonth.locale('ru').format('MMMM YYYY') }}
      </h2>

      <div class="ui-calendar__arrows">
        <button
          class="ui-calendar__arrow ui-calendar__arrow--prev"
          type="button"
          aria-label="Предыдущий месяц"
          :disabled="isPrevDisabled"
          @click="prevMonth"
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18L2 10L10 2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button
          class="ui-calendar__arrow ui-calendar__arrow--next"
          type="button"
          aria-label="Следующий месяц"
          @click="nextMonth"
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 18L10 10L2 2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="ui-calendar__weekdays">
      <span
        v-for="day in weekDays"
        :key="day"
        class="ui-calendar__weekday"
      >
        {{ day }}
      </span>
    </div>

    <div class="ui-calendar__days">
      <button
        v-for="day in calendarDays"
        :key="day.value.format('YYYY-MM-DD')"
        type="button"
        class="ui-calendar__day"
        :class="{
          'ui-calendar__day--other': day.isOtherMonth || day.isPast,
          'ui-calendar__day--current': day.isCurrentDay,
          'ui-calendar__day--selected': day.isSelected,
        }"
        @click="selectDay(day.value)"
      >
        <span class="ui-calendar__day-text">
          {{ day.value.date() }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export type UiCalendarModelValue = string | Date | Dayjs | '';

interface UiCalendarProps {
  modelValue?: UiCalendarModelValue;
  closable?: boolean;
  disablePast?: boolean;
}

const props = withDefaults(defineProps<UiCalendarProps>(), {
  modelValue: '',
  closable: true,
  disablePast: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: Dayjs | ''];
  close: [];
}>();

defineOptions({
  name: 'UiCalendar',
});

const currentMonth = ref(dayjs().startOf('month'));
const today = dayjs().startOf('day');

const selectedDay = computed(() => {
  if (!props.modelValue) return null;
  return dayjs(props.modelValue).startOf('day');
});

const isPrevDisabled = computed(() => {
  if (!props.disablePast) return false;
  return currentMonth.value.isSame(today, 'month') || currentMonth.value.isBefore(today, 'month');
});

function isDayDisabled(day: Dayjs) {
  if (!props.disablePast) return false;
  return day.isBefore(today, 'day');
}

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const calendarDays = computed(() => {
  const start = currentMonth.value.startOf('month').startOf('week');
  const days: { value: Dayjs; isOtherMonth: boolean; isCurrentDay: boolean; isSelected: boolean; isPast: boolean }[] = [];

  for (let i = 0; i < 42; i++) {
    const day = start.add(i, 'day');
    const isOtherMonth = !day.isSame(currentMonth.value, 'month');
    const isCurrentDay = day.isSame(today, 'day');
    const isSelected = selectedDay.value ? day.isSame(selectedDay.value, 'day') : false;
    const isPast = isDayDisabled(day);

    days.push({ value: day, isOtherMonth, isCurrentDay, isSelected, isPast });
  }

  return days;
});

function prevMonth() {
  if (isPrevDisabled.value) return;
  currentMonth.value = currentMonth.value.subtract(1, 'month');
}

function nextMonth() {
  currentMonth.value = currentMonth.value.add(1, 'month');
}

function selectDay(day: Dayjs) {
  if (isDayDisabled(day)) return;
  if (selectedDay.value && day.isSame(selectedDay.value, 'day')) {
    emit('update:modelValue', '');
  } else {
    emit('update:modelValue', day);
  }
}
</script>

<style scoped lang="scss">
.ui-calendar {
  width: 100%;
  max-width: 375px;
  padding: 57px 22px 44px;
  border-radius: 24px;
  background: var(--ui-surface-white);
  box-shadow: var(--ui-calendar-shadow);
  font-family: var(--ui-font-family);
  position: relative;
}

.ui-calendar__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--ui-calendar-close-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 160ms ease;
  z-index: 2;
}

.ui-calendar__close:hover {
  color: var(--ui-text-primary);
}

.ui-calendar__close svg {
  width: 14px;
  height: 14px;
}

.ui-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 44px;
}

.ui-calendar__arrow {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--ui-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 160ms ease;
}

.ui-calendar__arrow:hover {
  color: var(--ui-text-primary);
}

.ui-calendar__arrow svg {
  width: 12px;
  height: 20px;
}

.ui-calendar__month {
  margin: 0;
  font-size: var(--ui-calendar-font-header);
  font-weight: 500;
  line-height: 1.21;
  color: var(--ui-text-secondary);
  text-transform: capitalize;
  text-align: left;
}

.ui-calendar__arrows {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ui-calendar__arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.ui-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-bottom: 25px;
}

.ui-calendar__weekday {
  text-align: center;
  font-size: var(--ui-calendar-font-day);
  font-weight: 400;
  line-height: 1.21;
  color: var(--ui-text-primary);
}

.ui-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  row-gap: 4px;
}

.ui-calendar__day {
  width: var(--ui-calendar-day-size);
  height: var(--ui-calendar-day-size);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: var(--ui-font-family);
  font-size: var(--ui-calendar-font-day);
  font-weight: 500;
  line-height: 1.21;
  color: var(--ui-text-secondary);
  transition: background-color 160ms ease, color 160ms ease;
  margin: 0 auto;
}

.ui-calendar__day-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ui-calendar__day--other {
  color: var(--ui-calendar-text-other);
}

.ui-calendar__day--other {
  cursor: default;
}

.ui-calendar__day--current:not(.ui-calendar__day--selected) .ui-calendar__day-text {
  border: 1.5px solid var(--ui-brand-dark);
}

.ui-calendar__day--selected .ui-calendar__day-text {
  background: var(--ui-brand-dark);
  color: var(--ui-text-inverse);
}

.ui-calendar__day:hover:not(.ui-calendar__day--selected) .ui-calendar__day-text {
  background: var(--ui-surface-muted);
}

.ui-calendar__day:active:not(.ui-calendar__day--selected) .ui-calendar__day-text {
  transform: scale(0.95);
}
</style>
