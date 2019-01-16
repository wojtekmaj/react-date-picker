export {
  between,
} from 'react-calendar/dist/shared/utils';

const isValidNumber = a => typeof a === 'number' && !isNaN(a);
const valueIsHigherThanMax = (value, max) => Number(value) > Number(max);
const keyIsHigherThanMaxFirstChar = (key, max) => Number(key) > Number(max.charAt(0));
const valueLengthEqualsMaxLength = (value, max) => value.length === max.length;

const findInput = sibling => (element) => {
  const foundElement = element[sibling]; // Divider between inputs
  if (!foundElement) {
    return null;
  }
  return foundElement[sibling]; // Actual input
};

export const findPreviousInput = element => findInput('previousElementSibling')(element);
export const findNextInput = element => findInput('nextElementSibling')(element);
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
