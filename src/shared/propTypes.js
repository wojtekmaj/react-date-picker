import PropTypes from 'prop-types';

const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

export const isValueType = PropTypes.oneOf(allValueTypes);

export const isMinDate = (props, propName, componentName) => {
  const { [propName]: minDate } = props;

  if (minDate) {
    if (!(minDate instanceof Date)) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof minDate}\` supplied to \`${componentName}\`, expected instance of \`Date\`.`);
    }

    const { maxDate } = props;

    if (maxDate && minDate > maxDate) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof minDate}\` supplied to \`${componentName}\`, minDate cannot be larger than maxDate.`);
    }
  }

  // Everything is fine
  return null;
};

export const isMaxDate = (props, propName, componentName) => {
  const { [propName]: maxDate } = props;

  if (maxDate) {
    if (!(maxDate instanceof Date)) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof maxDate}\` supplied to \`${componentName}\`, expected instance of \`Date\`.`);
    }

    const { minDate } = props;

    if (minDate && maxDate < minDate) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof maxDate}\` supplied to \`${componentName}\`, maxDate cannot be smaller than minDate.`);
    }
  }

  // Everything is fine
  return null;
};
