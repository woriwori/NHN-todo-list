import {getElement, isString, isEmptyString, isFunction} from '@/lib/helper';

let addEvent = null;
let removeEvent = null;
let element = null; // TODO: 초기화
let listeners = []; // TODO: 초기화, 요소-타입별 관리

(function () {
  // on
  if (document.addEventListener) {
    addEvent = function (type, handler) {
      listeners.push(handler);
      element.addEventListener(type, handler);
    };
  } else if (document.attachEvent) {
    addEvent = function (type, handler) {
      handler = handler.bind(element);

      const reverseListeners = listeners.slice().reverse();
      reverseListeners.forEach((fn) => element.detachEvent(type, fn));

      listeners.push(handler);
      reverseListeners.unshift(handler);

      reverseListeners.forEach((fn) => element.attachEvent(type, fn));
    };
  } else {
    addEvent = function (type, handler) {
      handler = handler.bind(element);
      listeners.push(handler);
      element[`on${type}`] = (e) => listeners.forEach((fn) => fn(e));
    };
  }

  // off
  if (document.removeEventListener) {
    removeEvent = function (type, handler) {
      element.removeEventListener(type, handler);
    };
  } else if (document.detachEvent) {
    removeEvent = function (type, handler) {
      element.detachEvent(type, handler);
    };
  } else {
    removeEvent = function (type, handler) {
      listeners = listeners.filter((fn) => fn !== handler);
      element[`on${type}`] = (e) => listeners.forEach((fn) => fn(e));
    };
  }
})();

export const on = (selector, type, handler) => {
  element = getElement(selector);

  if (!isString(type) || isEmptyString(type)) throw Error('올바른 이벤트 타입이 필요합니다.');
  if (!isFunction(handler)) throw Error('올바른 이벤트 핸들러 함수가 필요합니다.');

  addEvent(type, handler);
};

export const off = (selector, type, handler) => {
  element = getElement(selector);

  if (!isString(type) || isEmptyString(type)) throw Error('올바른 이벤트 타입이 필요합니다.');
  if (!isFunction(handler)) throw Error('올바른 이벤트 핸들러 함수가 필요합니다.');

  removeEvent(type, handler);
};

export const removeAll = (selector, type) => {
  element = getElement(selector);

  if (!isString(type) || isEmptyString(type)) throw Error('올바른 이벤트 타입이 필요합니다.');

  listeners.forEach((fn) => removeEvent(type, fn));
};
