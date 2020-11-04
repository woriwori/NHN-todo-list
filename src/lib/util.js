import {isObject, isFunction, isNull} from '@/lib/helper';

const util = {
  defineClass(Child, Parent) {
    if (!Parent || !isObject(Parent)) {
      return util.makeClass(Child);
    }

    // 상속
    const ParentClass = util.makeClass(Parent);
    const _init = isFunction(Child.init) ? Child.init : null;
    const initFunction = function (...args) {
      ParentClass.apply(this);
      if (!isNull(_init)) _init.apply(this, args);
    };
    Child.init = initFunction;
    Child.init.prototype = new ParentClass();
    return util.makeClass(Child);
  },
  makeClass(properties) {
    const methods = [];
    let fakeClass = function () {};

    Object.entries(properties).forEach(([k, v]) => {
      if (k === 'init') {
        fakeClass = v;
      } else {
        methods.push([k, v]);
      }
    });

    fakeClass.prototype.constructor = fakeClass;
    methods.forEach(([k, v]) => (fakeClass.prototype[k] = v));
    return fakeClass;
  }
};

export default util;
