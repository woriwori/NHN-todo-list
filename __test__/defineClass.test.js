import util from '@/lib/util';

let Child, ChildWithInit, Parent, ParentWithInit, AncestorWithInit;

beforeEach(() => {
  Child = {
    sum: function (a, b) {
      return a + b;
    }
  };
  ChildWithInit = {
    init: function (a, b) {
      this.a = a;
      this.b = b;
    },
    sum: function () {
      return this.a + this.b;
    }
  };
  Parent = {
    sum: function (a, b, c) {
      return a + b + c;
    },
    multi: function (a, b, c) {
      return a * b * c;
    }
  };
  ParentWithInit = {
    init: function (c) {
      this.c = c;
    },
    sum: function () {
      return this.a + this.b + this.c;
    },
    multi: function () {
      return this.a * this.b * this.c;
    }
  };
  AncestorWithInit = {
    init: function (d) {
      this.d = d;
    },
    say: function () {
      console.log('ancestor class method !');
    }
  };
});

describe('인스턴스 생성', () => {
  test('유효하지 않은 객체로 클래스 함수 생성 시도하는 경우', () => {
    // when
    const throwErrorFn1 = () => util.defineClass();
    const throwErrorFn2 = () => util.defineClass('abc');
    const throwErrorFn3 = () => util.defineClass(123);

    // then
    expect(throwErrorFn1).toThrow();
    expect(throwErrorFn2).toThrow();
    expect(throwErrorFn3).toThrow();
  });

  test('생성자 함수 검사', () => {
    // given
    const ChildClass = util.defineClass(Child);

    // when
    const instance = new ChildClass();

    // then
    expect(ChildClass.prototype.constructor).toEqual(ChildClass);
    expect(instance.constructor).toEqual(ChildClass);
  });

  test('메서드 검사', () => {
    // given
    const ChildClass = util.defineClass(Child);

    // when
    const instance = new ChildClass();

    // then
    expect(instance.sum(1, 2)).toBe(3);
  });

  test('인스턴스가 여러개인 경우', () => {
    // given
    const ChildClass = util.defineClass(ChildWithInit);

    // when
    const instance1 = new ChildClass(1, 2);
    const instance2 = new ChildClass(1, 2);

    // then
    expect(instance1.sum === instance2.sum).toBeTruthy();
    expect(instance1 === instance2).toBeFalsy();
  });

  describe('매개변수를 전달하는 init 있는 경우', () => {
    test('instance type 검사', () => {
      // given
      const ChildClass = util.defineClass(ChildWithInit);

      // when
      const instance = new ChildClass(1, 3);

      // then
      expect(instance instanceof ChildWithInit.init).toBeTruthy();
    });

    test('멤버 변수 검사', () => {
      // given
      const ChildClass = util.defineClass(ChildWithInit);

      // when
      const instance = new ChildClass(1, 3);

      // then
      expect(instance.a).toBe(1);
      expect(instance.b).toBe(3);
    });
  });
});

describe('부모 클래스를 상속한 인스턴스 생성', () => {
  test('생성자 함수 검사', () => {
    // given
    const ParentClass = util.defineClass(Parent);
    const ChildClass = util.defineClass(Child, ParentClass);

    // when
    const instance = new ChildClass();

    // then
    expect(ChildClass.prototype.constructor).toEqual(ChildClass);
    expect(instance.constructor).toEqual(ChildClass);
  });

  test('메서드 오버라이딩 검사', () => {
    // given
    const ParentClass = util.defineClass(Parent);
    const ChildClass = util.defineClass(Child, ParentClass);

    // when
    const instance = new ChildClass();

    // then
    expect(instance.sum(1, 3, 5)).toBe(4); // 1 + 3
    expect(instance.sum(1, 3, 5)).not.toBe(9); // 1 + 3 + 5
    expect(instance.multi(1, 3, 5)).toBe(15); // 1 * 3 * 5
  });

  test('인스턴스가 여러개인 경우', () => {
    // given
    const ParentClass = util.defineClass(ParentWithInit);
    const ChildClass = util.defineClass(ChildWithInit, ParentClass);

    // when
    const instance1 = new ChildClass(1, 2);
    const instance2 = new ChildClass(1, 2);

    // then
    expect(instance1.sum === instance2.sum).toBeTruthy();
    expect(instance1.multi === instance2.multi).toBeTruthy();
    expect(instance1 === instance2).toBeFalsy();
  });

  describe('매개변수를 전달하는 init 있는 경우', () => {
    test('유효하지 않은 클래스 함수로 상속해서 클래스 함수 생성 시도하는 경우', () => {
      // given
      const ChildClass1 = util.defineClass(ChildWithInit, null);
      const ChildClass2 = util.defineClass(ChildWithInit, 'abc');
      const ChildClass3 = util.defineClass(ChildWithInit, 123);

      // when
      const instance1 = new ChildClass1();
      const instance2 = new ChildClass2();
      const instance3 = new ChildClass3();

      // then
      expect(instance1 instanceof ChildWithInit.init).toBeTruthy();
      expect(instance1 instanceof ParentWithInit.init).toBeFalsy();
      expect(instance2 instanceof ChildWithInit.init).toBeTruthy();
      expect(instance2 instanceof ParentWithInit.init).toBeFalsy();
      expect(instance3 instanceof ChildWithInit.init).toBeTruthy();
      expect(instance3 instanceof ParentWithInit.init).toBeFalsy();
    });

    test('instance type 검사', () => {
      // given;
      const ParentClass = util.defineClass(ParentWithInit);
      const ChildClass = util.defineClass(ChildWithInit, ParentClass);

      // when
      const instance = new ChildClass(1, 3);

      // then
      expect(instance instanceof ChildWithInit.init).toBeTruthy();
      expect(instance instanceof ParentWithInit.init).toBeTruthy();
    });

    test('2단계 상속 검사', () => {
      // given;
      const AncestorClass = util.defineClass(AncestorWithInit);
      const ParentClass = util.defineClass(ParentWithInit, AncestorClass);
      const ChildClass = util.defineClass(ChildWithInit, ParentClass);

      // when
      const instance = new ChildClass(1, 3, 5, 7);

      // then
      expect(instance instanceof ChildWithInit.init).toBeTruthy();
      expect(instance instanceof ParentWithInit.init).toBeTruthy();
      expect(instance instanceof AncestorWithInit.init).toBeTruthy();
      expect(instance.c).toBe(5);
      expect(instance.d).toBe(7);
    });

    test('멤버 변수 검사', () => {
      // given
      const ParentClass = util.defineClass(ParentWithInit);
      const ChildClass = util.defineClass(ChildWithInit, ParentClass);

      // when
      const instance = new ChildClass(1, 3, 5);

      // then
      expect(instance.a).toBe(1);
      expect(instance.b).toBe(3);
      expect(instance.c).toBe(5);
    });

    test('메소드 오버라이딩 검사', () => {
      // given
      const ParentClass = util.defineClass(ParentWithInit);
      const ChildClass = util.defineClass(ChildWithInit, ParentClass);

      // when
      const instance = new ChildClass(1, 3, 5);

      // then
      expect(instance.sum()).toBe(4); // 1 + 3
      expect(instance.multi()).toBe(15); // 1 * 3 * 5
    });
  });
});
