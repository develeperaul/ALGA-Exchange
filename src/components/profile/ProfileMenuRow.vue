<template>
  <button
    class="profile-menu-row"
    :class="{ 'profile-menu-row--bordered': bordered }"
    type="button"
  >
    <span
      class="profile-menu-row__icon"
      :class="`profile-menu-row__icon--${icon}`"
      aria-hidden="true"
    />
    <span class="profile-menu-row__label">
      <slot>{{ label }}</slot>
    </span>
    <span
      v-if="chevron"
      class="profile-menu-row__chevron"
      :class="`profile-menu-row__chevron--${chevron}`"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
export type ProfileMenuIcon = 'legal' | 'faq' | 'support';
export type ProfileMenuChevron = 'down' | 'up' | 'right';

interface ProfileMenuRowProps {
  icon: ProfileMenuIcon;
  label?: string;
  chevron?: ProfileMenuChevron;
  bordered?: boolean;
}

withDefaults(defineProps<ProfileMenuRowProps>(), {
  label: '',
  chevron: undefined,
  bordered: false,
});

defineOptions({
  name: 'ProfileMenuRow',
});
</script>

<style scoped lang="scss">
.profile-menu-row {
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: var(--ui-radius-sheet);
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 24px;
  align-items: center;
  column-gap: 10px;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: left;
  cursor: pointer;
}

.profile-menu-row--bordered {
  border-color: var(--ui-brand-light);
}

.profile-menu-row__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-menu-row__icon {
  width: 24px;
  height: 24px;
  position: relative;
  display: block;
  color: var(--ui-brand-primary);
}

.profile-menu-row__icon--legal::before {
  content: "";
  width: 18px;
  height: 13px;
  border-radius: 2px;
  position: absolute;
  left: 3px;
  top: 8px;
  background: currentColor;
}

.profile-menu-row__icon--legal::after {
  content: "";
  width: 8px;
  height: 4px;
  border: 2px solid currentColor;
  border-bottom: 0;
  border-radius: 2px 2px 0 0;
  position: absolute;
  left: 8px;
  top: 5px;
}

.profile-menu-row__icon--faq::before {
  content: "?";
  position: absolute;
  inset: 0;
  color: currentColor;
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  text-align: center;
}

.profile-menu-row__icon--support::before {
  content: "";
  width: 19px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 10px;
  position: absolute;
  left: 2px;
  top: 5px;
}

.profile-menu-row__icon--support::after {
  content: "...";
  position: absolute;
  left: 7px;
  top: 1px;
  color: currentColor;
  font-size: 13px;
  line-height: 18px;
  font-weight: 700;
  letter-spacing: 1px;
}

.profile-menu-row__chevron {
  width: 9px;
  height: 9px;
  justify-self: end;
  border-right: 1.5px solid var(--ui-text-muted);
  border-bottom: 1.5px solid var(--ui-text-muted);
}

.profile-menu-row__chevron--down {
  transform: rotate(45deg) translate(-2px, -2px);
}

.profile-menu-row__chevron--up {
  transform: rotate(-135deg) translate(-2px, -2px);
}

.profile-menu-row__chevron--right {
  transform: rotate(-45deg) translate(-2px, -2px);
}
</style>
