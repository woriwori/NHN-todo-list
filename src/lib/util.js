/*
util.defineClass({ 자식 클래스 객체 }, ?SuperClass);

init 메서드가 존재하면 인스턴스를 생성할 때 호출되어야 한다.
init 메서드안에서는 생성된 인스턴스를 this를 통해 접근 가능 하다.
상속과정에서 부모의 init 메서드에서 생성되는 객체맴버는 명시적으로 자식에서 init 을 실행해야 상속 된다.
상속과정에서 메서드는 오버라이딩이 가능하다.

var Animal = util.defineClass({
    init: function() {},
    walk: function() {}
});
var Person = util.defineClass({
    init: function() {},
    talk: function() {}
    // etc...
}, Animal);

var p = new Person();
*/
const util = {
  defineClass(Child, Parent) {
    const methods = [];
    let fakeClass = function () {};

    Object.entries(Child).forEach(([k, v]) => {
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
