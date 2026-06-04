import { Notify } from 'quasar';

const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так';

type NotifyInput = {
  message?: string;
};

export function notifyError(input?: string | NotifyInput) {
  const message = typeof input === 'string'
    ? input
    : input?.message;

  Notify.create({
    message: message || DEFAULT_ERROR_MESSAGE,
    color: 'negative',
    timeout: 2500,
  });
}

export function notifySuccess(message: string) {
  Notify.create({
    message,
    color: 'positive',
    timeout: 1200,
  });
}
