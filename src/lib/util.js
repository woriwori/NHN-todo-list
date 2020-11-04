import {isObject, isFunction, isNull} from '@/lib/helper';

const util = {
  defineClass(Child, Parent) {
    if (!Parent || !isObject(Parent)) {
      return util.makeClass(Child);
    }

    // inheritance
    const ParentClass = util.makeClass(Parent);
    const childInit = isFunction(Child.init) ? Child.init : null;

    Child.init = function (...args) {
      ParentClass.apply(this);
      if (!isNull(childInit)) childInit.apply(this, args);
    };
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
