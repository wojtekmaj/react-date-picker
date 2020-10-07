import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import updateInputWidth, { getFontShorthand } from 'update-input-width';

/* eslint-disable jsx-a11y/no-autofocus */

function onFocus(event) {
  const { target } = event;

  requestAnimationFrame(() => target.select());
}

function updateInputWidthOnFontLoad(element) {
  if (!document.fonts) {
    return;
  }

  const font = getFontShorthand(element);

  if (!font) {
    return;
  }

  const isFontLoaded = document.fonts.check(font);

  if (isFontLoaded) {
    return;
  }

  function onLoadingDone() {
    updateInputWidth(element);
  }

  document.fonts.addEventListener('loadingdone', onLoadingDone);
}

function getSelectionString() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.getSelection().toString();
}

function makeOnKeyPress(maxLength) {
  return function onKeyPress(event) {
    const { key, target: input } = event;
    const { value } = input;

    const isNumberKey = !isNaN(parseInt(key, 10));
    const selection = getSelectionString();

    if (isNumberKey && (selection || value.length <= maxLength)) {
      return;
    }

    event.preventDefault();
  };
}

export default function Input({
  ariaLabel,
  autoFocus,
  className,
  disabled,
  itemRef,
  max,
  min,
  name,
  nameForClass,
  onChange,
  onKeyDown,
  onKeyUp,
  placeholder = '--',
  required,
  showLeadingZeros,
  step,
  value,
}) {
  const hasLeadingZero = showLeadingZeros && value !== null && value < 10;
  const maxLength = max.toString().length;

  return [
    (hasLeadingZero && <span key="leadingZero" className={`${className}__leadingZero`}>0</span>),
    <input
      key="input"
      aria-label={ariaLabel}
      autoComplete="off"
      autoFocus={autoFocus}
      className={mergeClassNames(
        `${className}__input`,
        `${className}__${nameForClass || name}`,
        hasLeadingZero && `${className}__input--hasLeadingZero`,
      )}
      data-input="true"
      disabled={disabled}
      max={max}
      min={min}
      name={name}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyPress={makeOnKeyPress(maxLength)}
      onKeyUp={(event) => {
        updateInputWidth(event.target);

        if (onKeyUp) {
          onKeyUp(event);
        }
      }}
      placeholder={placeholder}
      ref={(ref) => {
        if (ref) {
          updateInputWidth(ref);
          updateInputWidthOnFontLoad(ref);
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
}

Input.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  step: PropTypes.number,
  value: PropTypes.number,
};
