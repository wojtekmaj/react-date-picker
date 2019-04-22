import getUserLocale from 'get-user-locale';

/* eslint-disable import/prefer-default-export */

export const getFormatter = options => (locale, date) => (
  date.toLocaleString(locale || getUserLocale(), options)
);
