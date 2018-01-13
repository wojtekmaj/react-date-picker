export {
  between,
} from 'react-calendar/dist/shared/utils';

export const min = (...args) => Math.min(...args.filter(a => typeof a === 'number' && !Number.isNaN(a)));
export const max = (...args) => Math.max(...args.filter(a => typeof a === 'number' && !Number.isNaN(a)));

export const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value || element.placeholder;

  const container = element.parentElement;

  container.appendChild(span);

  const width = span.getBoundingClientRect().width + 4;
  element.style.width = `${width}px`;

  container.removeChild(span);
};
