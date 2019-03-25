import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

const Input = ({
  className,
  disabled,
  itemRef,
  max,
  min,
  name,
  nameForClass,
  onChange,
  onKeyDown,
  placeholder,
  required,
  showLeadingZeros,
  step,
  value,
}) => {
  const hasLeadingZero = showLeadingZeros && value !== null && value < 10;

  return [
    (hasLeadingZero && <span key="leadingZero" className={`${className}__leadingZero`}>0</span>),
    <input
      key="input"
      autoComplete="off"
      className={mergeClassNames(
        `${className}__input`,
        `${className}__${nameForClass || name}`,
        hasLeadingZero && `${className}__input--hasLeadingZero`,
      )}
      disabled={disabled}
      name={name}
      max={max}
      min={min}
      onChange={onChange}
      onFocus={event => select(event.target)}
      onKeyDown={onKeyDown}
      onKeyUp={event => updateInputWidth(event.target)}
      placeholder={placeholder}
      ref={(ref) => {
        if (ref) {
          updateInputWidth(ref);
        }

        if (itemRef) {
          itemRef(ref, name);
        }
      }}
      required={required}
      step={step}
      type="number"
      value={value !== null ? value : ''}
    />,
  ];
};

Input.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  step: PropTypes.number,
  value: PropTypes.number,
};

Input.defaultProps = {
  placeholder: '--',
};

export default Input;
