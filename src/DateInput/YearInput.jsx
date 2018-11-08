import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

export default class YearInput extends PureComponent {
  render() {
    const {
      className, disabled, itemRef, value, onChange, onKeyDown, required,
    } = this.props;
    const v = parseInt(value, 10) ? parseInt(value, 10).toString().slice(-4) : '';
    const name = 'year';

    return (
      <input
        className={mergeClassNames(
          `${className}__input`,
          `${className}__year`,
        )}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={event => updateInputWidth(event.target)}
        placeholder="----"
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
      />
    );
  }
}

YearInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
