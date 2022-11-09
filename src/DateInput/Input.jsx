import React, { useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import updateInputWidth, { getFontShorthand } from 'update-input-width';

import { isRef } from '../shared/propTypes';

/* eslint-disable jsx-a11y/no-autofocus */

const isBrowser = typeof window !== 'undefined';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const isEdgeLegacy = isBrowser && /Edge\//.test(window.navigator.userAgent);

const isFirefox = isBrowser && /Firefox/.test(window.navigator.userAgent);

function onFocus(event) {
  const { target } = event;

  if (isEdgeLegacy) {
    requestAnimationFrame(() => target.select());
  } else {
    target.select();
  }
}

function updateInputWidthOnLoad(element) {
  if (document.readyState === 'complete') {
    return;
  }

  function onLoad() {
    updateInputWidth(element);
  }

  window.addEventListener('load', onLoad);
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

function getSelectionString(input) {
  /**
   * window.getSelection().toString() returns empty string in Firefox,
   * so alternatives come first.
   */
  if (input && 'selectionStart' in input && input.selectionStart !== null) {
    return input.value.slice(input.selectionStart, input.selectionEnd);
  }

  if ('getSelection' in window) {
    return window.getSelection().toString();
  }

  return null;
}

function makeOnKeyPress(maxLength) {
  /**
   * Prevents keystrokes that would not produce a number or when value after keystroke would
   * exceed maxLength.
   */
  return function onKeyPress(event) {
    if (isFirefox) {
      // See https://github.com/wojtekmaj/react-time-picker/issues/92
      return;
    }

    const { key, target: input } = event;
    const { value } = input;

    const isNumberKey = key.length === 1 && /\d/.test(key);
    const selection = getSelectionString(input);

    if (!isNumberKey || !(selection || value.length < maxLength)) {
      event.preventDefault();
    }
  };
}

export default function Input({
  ariaLabel,
  autoFocus,
  className,
  disabled,
  inputRef,
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
  useIsomorphicLayoutEffect(() => {
    if (!inputRef || !inputRef.current) {
      return;
    }

    updateInputWidth(inputRef.current);
    updateInputWidthOnLoad(inputRef.current);
    updateInputWidthOnFontLoad(inputRef.current);
  }, [inputRef, value]);

  const hasLeadingZero =
    showLeadingZeros && value && value < 10 && (value === '0' || !value.toString().startsWith('0'));
  const maxLength = max ? max.toString().length : null;

  return [
    hasLeadingZero && (
      <span key="leadingZero" className={`${className}__leadingZero`}>
        0
      </span>
    ),
    <input
      key="input"
      aria-label={ariaLabel}
      autoComplete="off"
      autoFocus={autoFocus}
      className={clsx(
        `${className}__input`,
        `${className}__${nameForClass || name}`,
        hasLeadingZero && `${className}__input--hasLeadingZero`,
      )}
      data-input="true"
      disabled={disabled}
      inputMode="numeric"
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
      ref={inputRef}
      required={required}
      step={step}
      type="number"
      value={value !== null ? value : ''}
    />,
  ];
}

Input.propTypes = {
  ariaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  nameForClass: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  step: PropTypes.number,
  value: PropTypes.string,
};
