import { useEffect, useLayoutEffect } from 'react';
import clsx from 'clsx';
import updateInputWidth, { getFontShorthand } from 'update-input-width';

type InputProps = {
  ariaLabel?: string;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  max: number;
  min: number;
  name: string;
  nameForClass?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> & { target: HTMLInputElement }) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => void;
  placeholder?: string;
  required?: boolean;
  showLeadingZeros?: boolean;
  step?: number;
  value?: string | null;
};

const isBrowser = typeof document !== 'undefined';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const isIEOrEdgeLegacy = isBrowser && /(MSIE|Trident\/|Edge\/)/.test(navigator.userAgent);

const isFirefox = isBrowser && /Firefox/.test(navigator.userAgent);

function onFocus(event: React.FocusEvent<HTMLInputElement>) {
  const { target } = event;

  if (isIEOrEdgeLegacy) {
    requestAnimationFrame(() => target.select());
  } else {
    target.select();
  }
}

function updateInputWidthOnLoad(element: HTMLInputElement) {
  if (document.readyState === 'complete') {
    return;
  }

  function onLoad() {
    updateInputWidth(element);
  }

  window.addEventListener('load', onLoad);
}

function updateInputWidthOnFontLoad(element: HTMLInputElement) {
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

function getSelectionString(input: HTMLInputElement) {
  /**
   * window.getSelection().toString() returns empty string in IE11 and Firefox,
   * so alternatives come first.
   */
  if (
    input &&
    'selectionStart' in input &&
    input.selectionStart !== null &&
    'selectionEnd' in input &&
    input.selectionEnd !== null
  ) {
    return input.value.slice(input.selectionStart, input.selectionEnd);
  }

  if ('getSelection' in window) {
    const selection = window.getSelection();
    return selection?.toString();
  }

  return null;
}

function makeOnKeyPress(maxLength: number | null) {
  if (maxLength === null) {
    return undefined;
  }

  /**
   * Prevents keystrokes that would not produce a number or when value after keystroke would
   * exceed maxLength.
   */
  return function onKeyPress(
    event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement },
  ) {
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
}: InputProps): React.ReactElement {
  useIsomorphicLayoutEffect(() => {
    if (!inputRef || !inputRef.current) {
      return;
    }

    updateInputWidth(inputRef.current);
    updateInputWidthOnLoad(inputRef.current);
    updateInputWidthOnFontLoad(inputRef.current);
  }, [inputRef, value]);

  const hasLeadingZero =
    showLeadingZeros &&
    value &&
    Number(value) < 10 &&
    (value === '0' || !value.toString().startsWith('0'));
  const maxLength = max ? max.toString().length : null;

  return (
    <>
      {hasLeadingZero ? <span className={`${className}__leadingZero`}>0</span> : null}
      <input
        aria-label={ariaLabel}
        autoComplete="off"
        // biome-ignore lint/a11y/noAutofocus: This is up to developers' decision
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
        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
          updateInputWidth(event.target);

          if (onKeyUp) {
            onKeyUp(event);
          }
        }}
        placeholder={placeholder}
        // Assertion is needed for React 18 compatibility
        ref={inputRef as React.RefObject<HTMLInputElement>}
        required={required}
        step={step}
        type="number"
        value={value !== null ? value : ''}
      />
    </>
  );
}
