export {
  between,
} from 'react-calendar/dist/shared/utils';

const isValidNumber = a => typeof a === 'number' && !isNaN(a);
const valueIsHigherThanMax = (value, max) => Number(value) > Number(max);
const keyIsHigherThanMaxFirstChar = (key, max) => Number(key) > Number(max.charAt(0));
const valueLengthEqualsMaxLength = (value, max) => value.length === max.length;

export const findPreviousInput = (element) => {
  const previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

export const findNextInput = (element) => {
  const nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

export const min = (...args) => Math.min(...args.filter(isValidNumber));
export const max = (...args) => Math.max(...args.filter(isValidNumber));
export const focus = element => element && element.focus();
export const select = element => element && element.select();

export const appendInputValue = (event, onChange) => {
  const { target, key } = event;
  const { value, max: maxValue } = target;

  if (!isValidNumber(Number(key))) {
    return;
  }
  if (valueIsHigherThanMax(value, maxValue)) {
    target.value = maxValue;
    const nextInput = findNextInput(target);

    onChange(event);
    focus(nextInput);
    return;
  }
  if (keyIsHigherThanMaxFirstChar(key, maxValue) || valueLengthEqualsMaxLength(value, maxValue)) {
    const nextInput = findNextInput(target);

    focus(nextInput);
  }
};

export const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value || element.placeholder;

  const container = element.parentElement;

  container.appendChild(span);

  const { width } = span.getBoundingClientRect();
  element.style.width = `${Math.ceil(width)}px`;

  container.removeChild(span);
};
