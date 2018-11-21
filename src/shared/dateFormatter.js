import getUserLocale from 'get-user-locale';

const formatterCache = {};

/* eslint-disable import/prefer-default-export */

/**
 * Gets Intl-based date formatter from formatter cache. If it doesn't exist in cache
 * just yet, it will be created on the fly.
 */
export const getFormatter = (options, locale) => {
  if (!locale) {
    // Default parameter is not enough as it does not protect us from null values
    // eslint-disable-next-line no-param-reassign
    locale = getUserLocale();
  }

  const stringifiedOptions = JSON.stringify(options);

  if (!formatterCache[locale]) {
    formatterCache[locale] = {};
  }

  if (!formatterCache[locale][stringifiedOptions]) {
    formatterCache[locale][stringifiedOptions] = new Intl.DateTimeFormat(locale, options).format;
  }

  return formatterCache[locale][stringifiedOptions];
};
