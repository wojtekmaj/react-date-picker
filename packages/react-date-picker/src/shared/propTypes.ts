import PropTypes from 'prop-types';

import type { Requireable, Validator } from 'prop-types';
import type { Range } from './types.js';

const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

export const isValueType = PropTypes.oneOf(allValueTypes);

export const isMinDate: Validator<Date | null | undefined> = function isMinDate(
  props,
  propName,
  componentName,
) {
  const { [propName]: minDate } = props;

  if (!minDate) {
    return null;
  }

  if (!(minDate instanceof Date)) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof minDate}\` supplied to \`${componentName}\`, expected instance of \`Date\`.`,
    );
  }

  const { maxDate } = props;

  if (maxDate && minDate > maxDate) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof minDate}\` supplied to \`${componentName}\`, minDate cannot be larger than maxDate.`,
    );
  }

  return null;
};

export const isMaxDate: Validator<Date | null | undefined> = function isMaxDate(
  props,
  propName,
  componentName,
) {
  const { [propName]: maxDate } = props;

  if (!maxDate) {
    return null;
  }

  if (!(maxDate instanceof Date)) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof maxDate}\` supplied to \`${componentName}\`, expected instance of \`Date\`.`,
    );
  }

  const { minDate } = props;

  if (minDate && maxDate < minDate) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof maxDate}\` supplied to \`${componentName}\`, maxDate cannot be smaller than minDate.`,
    );
  }

  return null;
};

export const isRef = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.exact({
    current: PropTypes.any,
  }),
]);

export const rangeOf = <T>(type: Requireable<T>): Requireable<Range<T>> => {
  return PropTypes.arrayOf(type) as Requireable<Range<T>>;
};
