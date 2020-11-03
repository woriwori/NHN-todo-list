export function getElement(selector) {
  let element = null;

  if (isString(selector)) {
    element = document.querySelector(selector);
  } else if (isElement(selector)) {
    element = selector;
  }
  if (isNull(element)) throw Error('요소가 존재하지 않습니다.');

  return element;
}

export function isElement(v) {
  return v instanceof Element;
}

export function isString(v) {
  return typeof v === 'string';
}

export function isEmptyString(v) {
  return v === '';
}

export function isFunction(v) {
  return typeof v === 'function';
}

export function isNull(v) {
  return v === null;
}
