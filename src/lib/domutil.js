import helper from '@/lib/helper';

const domutil = (function () {
  let addEvent = null;
  let removeEvent = null;
  let element = null;
  let listeners = [];

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

        let reverseListeners = listeners.slice().reverse();
        reverseListeners.forEach((fn) => element.removeEventListener(type, fn));

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

  function on(selector, type, handler) {
    element = helper.getElement(selector);
    helper.checkType(type);
    helper.checkHandler(handler);
    addEvent(type, handler);
  }
  function off(selector, type, handler) {
    element = helper.getElement(selector);
    helper.checkType(type);
    helper.checkHandler(handler);
    removeEvent(type, handler);
  }
  function removeAll(selector, type) {
    element = helper.getElement(selector);
    helper.checkType(type);
    listeners.forEach((fn) => removeEvent(type, fn));
  }
  return {
    on(selector, type, handler) {
      on(selector, type, handler);
    },
    off(selector, type, handler) {
      off(selector, type, handler);
    },
    removeAll(selector, type) {
      removeAll(selector, type);
    }
  };
})();
export default domutil;
