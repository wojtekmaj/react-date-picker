import PropTypes from 'prop-types';

export {
  isCalendarType,
  isMaxDate,
  isMinDate,
  isValue,
} from 'react-calendar/dist/shared/propTypes';

const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

export const isDetail = PropTypes.oneOf(allViews);

export const isValueType = PropTypes.oneOf(allValueTypes);
