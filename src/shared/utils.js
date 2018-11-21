export {
  between,
} from 'react-calendar/dist/shared/utils';

const isValidNumber = a => typeof a === 'number' && !isNaN(a);
export const min = (...args) => Math.min(...args.filter(isValidNumber));
export const max = (...args) => Math.max(...args.filter(isValidNumber));

export const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value || element.placeholder;

  const container = element.parentElement;

  container.appendChild(span);

  const { width } = span.getBoundingClientRect();
  element.style.width = `${Math.ceil(width)}px`;

  container.removeChild(span);
};
