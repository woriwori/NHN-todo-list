const helper = (function () {
  const getElement = (selector) => {
    let element = null;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    } else if (selector instanceof Element) {
      element = selector;
    }
    if (element === null) throw Error('요소가 존재하지 않습니다.');

    return element;
  };

  const checkType = (type) => {
    if (typeof type !== 'string' && type !== '') throw Error('올바른 이벤트 타입이 필요합니다.');
  };
  const checkHandler = (handler) => {
    if (typeof handler !== 'function') throw Error('올바른 이벤트 핸들러 함수가 필요합니다.');
  };

  return {
    getElement(selector) {
      return getElement(selector);
    },
    checkType(type) {
      checkType(type);
    },
    checkHandler(handler) {
      checkHandler(handler);
    }
  };
})();
export default helper;
