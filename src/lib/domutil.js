import {getElement, isString, isEmptyString, isFunction, isObject} from '@/lib/helper';

let element = null;

const listenersHelper = {
  listeners: new Map(),
  add(element, type, handler) {
    const handlers = listenersHelper.getHandlers(element, type);
    handlers.push(handler);
  },
  remove(element, type, handler) {
    const filteredHandlers = listenersHelper.getHandlers(element, type).filter((f) => f !== handler);
    listenersHelper.setHandlers(element, type, filteredHandlers);
  },
  getEventTypes(element) {
    // return : Map { click => [], focus => [], ... }
    const isEmptyEventTypes = !listenersHelper.listeners.has(element);
    if (isEmptyEventTypes) {
      return listenersHelper.listeners.set(element, new Map()).get(element);
    }

    return listenersHelper.listeners.get(element);
  },
  getHandlers(element, type) {
    // return :  [ () => {..}, ... ]
    const eventTypes = listenersHelper.getEventTypes(element);
    const hasEventType = eventTypes.has(type);
    let handlers = eventTypes.get(type);

    if (!hasEventType) {
      handlers = listenersHelper.initializeHandlers(eventTypes, type);
    }

    return handlers;
  },
  initializeHandlers(eventTypes, type) {
    return eventTypes.set(type, []).get(type);
  },
  setHandlers(element, type, handlers) {
    listenersHelper.getEventTypes(element).set(type, handlers);
  }
};

let addEvent = function (type, handler) {
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
  addEvent(type, handler);
};

let removeEvent = function (type, handler) {
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
  removeEvent(type, handler);
};

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

/* 
custom events - mixin 
*/
const mixinOn = (obj) => (type, handler) => {
  if (!isString(type) || isEmptyString(type)) throw Error('올바른 이벤트 타입이 필요합니다.');
  if (!isFunction(handler)) throw Error('올바른 이벤트 핸들러 함수가 필요합니다.');

  listenersHelper.add(obj, type, handler);
};

const mixinFire = (obj) => (type, eventData) => {
  if (!isString(type) || isEmptyString(type)) throw Error('올바른 이벤트 타입이 필요합니다.');

  const handlers = listenersHelper.getHandlers(obj, type);
  handlers.forEach((fn) => fn(eventData));
};

const mixinOff = (obj) => (type, handler) => {
  if (!isString(type) || isEmptyString(type)) throw Error('올바른 이벤트 타입이 필요합니다.');
  if (!isFunction(handler)) throw Error('올바른 이벤트 핸들러 함수가 필요합니다.');

  listenersHelper.remove(obj, type, handler);
};

export const CustomEvents = {
  mixin(obj) {
    if (!isObject(obj)) throw Error('올바른 객체가 필요합니다.');

    obj.on = mixinOn(obj);
    obj.fire = mixinFire(obj);
    obj.off = mixinOff(obj);
  }
};
