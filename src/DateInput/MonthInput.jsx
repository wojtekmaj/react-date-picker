import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

export default class MonthInput extends PureComponent {
  render() {
    const { maxMonth, minMonth } = this;
    const {
      className, disabled, itemRef, value, onChange, onKeyDown, required, showLeadingZeros,
    } = this.props;

    const name = 'month';
    let v = parseInt(value, 10) ? parseInt(value, 10).toString().slice(-2) : '';
    if (showLeadingZeros && v.length === 1) v = `0${v}`;

    return [
      <input
        key="month"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__month`,
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

MonthInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};
