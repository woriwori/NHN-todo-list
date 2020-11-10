import ListenerHelper from '@/lib/ListenerHelper';
import {isObject, isString, isEmptyString, isFunction} from '@/lib/helper';

const listenersHelper = new ListenerHelper();

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

const CustomEvents = {
  mixin(obj) {
    if (!isObject(obj)) throw Error('올바른 객체가 필요합니다.');

    obj.on = mixinOn(obj);
    obj.fire = mixinFire(obj);
    obj.off = mixinOff(obj);
  }
};

export default CustomEvents;
