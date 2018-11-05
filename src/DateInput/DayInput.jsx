import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { isMaxDate, isMinDate } from '../shared/propTypes';
import { updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

export default class DayInput extends PureComponent {
  render() {
    const {
      className, disabled, itemRef, value, onChange, onKeyDown, required, showLeadingZeros,
    } = this.props;
    let v = parseInt(value, 10) ? parseInt(value, 10).toString().slice(-2) : '';
    if (showLeadingZeros && v.length === 1) v = `0${v}`;
    const name = 'day';

    return [
      <input
        key="day"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__day`,
        )}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={event => updateInputWidth(event.target)}
        placeholder="--"
        ref={(ref) => {
          if (ref) {
            updateInputWidth(ref);
          }

          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        required={required}
        value={v}
      />,
    ];
  }
}

DayInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};