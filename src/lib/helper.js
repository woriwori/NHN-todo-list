export const getElement = (selector) => {
  let element = null;

  if (isString(selector)) {
    element = document.querySelector(selector);
  } else if (isElement(selector) || isWindow(selector)) {
    element = selector;
  }
  if (isNull(element)) throw Error('요소가 존재하지 않습니다.');

  return element;
};
export const isElement = (v) => v instanceof Element;
export const isWindow = (v) => v === window;
export const isString = (v) => typeof v === 'string';
export const isEmptyString = (v) => v === '';
export const isFunction = (v) => typeof v === 'function';
export const isNull = (v) => v === null;
