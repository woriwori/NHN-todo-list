import {isObject, isFunction, isNull} from '@/lib/helper';

function getParams(childInit, args) {
  let childParams = [];
  let parentParams = [];

  if (!isNull(childInit)) {
    childParams = args.slice(0, childInit.length);
    parentParams = args.slice(childInit.length);
  } else {
    parentParams = args;
  }

  return {
    childParams,
    parentParams
  };
}

function makeClass(properties) {
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

const util = {
  defineClass(Child, ParentClass) {
    if (!Child || !isObject(Child)) throw Error('올바른 객체를 전달하세요.');

    if (!ParentClass || !isFunction(ParentClass)) {
      return makeClass(Child);
    }

    // inheritance
    const childInit = isFunction(Child.init) ? Child.init : null;

    Child.init = function (...args) {
      const {childParams, parentParams} = getParams(childInit, args);

      ParentClass.apply(this, parentParams);
      if (!isNull(childInit)) childInit.apply(this, childParams);
    };
    Child.init.prototype = new ParentClass();

    return makeClass(Child);
  }
};

export default util;
