import {getElement, isString, isEmptyString, isFunction} from '@/lib/helper';

let addEvent = null;
let removeEvent = null;
let element = null;

const listenersHelper = {
  listeners: new Map(),
  add(element, type, handler) {
    const handlers = listenersHelper.getHandlers(element, type);
    handlers.push(handler);
  },
  remove(element, type, handler) {
    const handlers = listenersHelper.getHandlers(element, type);
    listenersHelper.setHandlers(
      element,
      type,
      handlers.filter((f) => f !== handler)
    );
  },
  getEventTypes(element) {
    // return : Map { click => [], focus => [], ... }
    if (listenersHelper.listeners.has(element)) return listenersHelper.listeners.get(element);
    else return listenersHelper.listeners.set(element, new Map()).get(element);
  },
  getHandlers(element, type) {
    // return :  [ () => {..}, ... ]
    const eventTypes = listenersHelper.getEventTypes(element);
    if (eventTypes.has(type)) return eventTypes.get(type);
    else return eventTypes.set(type, []).get(type);
  },
  setHandlers(element, type, handlers) {
    const eventTypes = listenersHelper.getEventTypes(element);
    eventTypes.set(type, handlers);
  }
};

(function () {
  // on
  if (document.addEventListener) {
    addEvent = function (type, handler) {
      listenersHelper.add(element, type, handler);
      element.addEventListener(type, handler);
    };
  } else if (document.attachEvent) {
    addEvent = function (type, handler) {
      handler = handler.bind(element);

      const reverseListeners = listenersHelper.getHandlers(element, type).slice().reverse();
      reverseListeners.forEach((fn) => element.detachEvent(type, fn));

      listenersHelper.add(element, type, handler); // listeners가 갖고있는 핸들러 함수들은 항상 등록한 순서를 유지
      reverseListeners.unshift(handler);

      reverseListeners.forEach((fn) => element.attachEvent(type, fn));
    };
  } else {
    addEvent = function (type, handler) {
      listenersHelper.add(element, type, handler);
      const handlers = listenersHelper.getHandlers(element, type);
      element[`on${type}`] = (e) => handlers.forEach((fn) => fn(e).call(element));
    };
  }

  // off
  if (document.removeEventListener) {
    removeEvent = function (type, handler) {
      listenersHelper.remove(element, type, handler);
      element.removeEventListener(type, handler);
    };
  } else if (document.detachEvent) {
    removeEvent = function (type, handler) {
      listenersHelper.remove(element, type, handler);
      element.detachEvent(type, handler);
    };
  } else {
    removeEvent = function (type, handler) {
      listenersHelper.remove(element, type, handler);
      const handlers = listenersHelper.getHandlers(element, type);
      element[`on${type}`] = (e) => handlers.forEach((fn) => fn(e));
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

  listenersHelper.getHandlers(element, type).forEach((fn) => removeEvent(type, fn));
};
