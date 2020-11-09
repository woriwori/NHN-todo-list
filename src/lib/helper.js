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

export const insertNodeAfter = (newNode, referenceNode) =>
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextElementSibling);
export const insertNodeBefore = (newNode, referenceNode) =>
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
export const isElement = (v) => v instanceof Element;
export const isElements = (...args) => args.every((v) => v instanceof Element);
export const isWindow = (v) => v === window;
export const isString = (v) => typeof v === 'string';
export const isEmptyString = (v) => v === '';
export const isFunction = (v) => typeof v === 'function';
export const isObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
export const isNull = (v) => v === null;
export const setHTML = (target, template) => (target.innerHTML = template);
export const sortAscBy = (list, condition) => list.sort((a, b) => a[condition] - b[condition]);
export const sortDescBy = (list, condition) => list.sort((a, b) => b[condition] - a[condition]);
