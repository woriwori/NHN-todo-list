import helper from '@/lib/helper';

document.addEventListener = null;
document.removeEventListener = null;

const domutil = (function () {
  let addEvent = null;
  let removeEvent = null;
  let element = null;
  let listeners = [];

  (function () {
    // on
    if (document.addEventListener) {
      addEvent = function (type, handler) {
        element.addEventListener(type, handler);
      };
    } else if (document.attachEvent) {
      addEvent = function (type, handler) {
        handler = handler.bind(element);

        let reverseListeners = listeners.slice().reverse();
        reverseListeners.forEach((fn) => element.removeEventListener(type, fn));

        listeners.push(handler);
        reverseListeners.unshift(handler);

        reverseListeners.forEach((fn) => element.attachEvent(type, fn));
      };
    } else {
      addEvent = function (type, handler) {
        listeners.push(handler);
        element[`on${type}`] = () => listeners.forEach((fn) => fn());
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
        element[`on${type}`] = () => listeners.forEach((fn) => fn());
      };
    }
  })();

  const on = (selector, type, handler) => {
    element = helper.getElement(selector);
    helper.checkType(type);
    helper.checkHandler(handler);
    addEvent(type, handler);
  };
  const off = (selector, type, handler) => {
    element = helper.getElement(selector);
    helper.checkType(type);
    helper.checkHandler(handler);
    removeEvent(type, handler);
  };
  return {
    on(selector, type, handler) {
      on(selector, type, handler);
    },
    off(selector, type, handler) {
      off(selector, type, handler);
    }
  };
})();
export default domutil;