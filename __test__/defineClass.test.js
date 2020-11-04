import util from '@/lib/util';

const Sub = {
  sum: function (a, b) {
    return a + b;
  }
};
const SubWithInit = {
  init: function (a, b) {
    this.a = a;
    this.b = b;
  },
  sum: function () {
    return this.a + this.b;
  }
};
const Super = {
  sum: function (a, b, c) {
    return a + b + c;
  },
  multi: function (a, b, c) {
    return a * b * c;
  }
};
const SuperWithInit = {
  init: function () {
    this.c = 10;
  },
  sum: function () {
    return this.a + this.b + this.c;
  },
  multi: function () {
    return this.a * this.b * this.c;
  }
};

describe('인스턴스 생성', () => {
  test('생성자 함수 검사', () => {
    // given
    const SubClass = util.defineClass(Sub);

    // when
    const instance = new SubClass();

    // then
    expect(SubClass.prototype.constructor).toEqual(SubClass);
    expect(instance.constructor).toEqual(SubClass);
  });

  test('메서드 검사', () => {
    // given
    const SubClass = util.defineClass(Sub);

    // when
    const instance = new SubClass();

    // then
    expect(instance.sum(1, 2)).toBe(3);
  });

  test('인스턴스가 여러개인 경우', () => {
    // given
    const SubClass = util.defineClass(SubWithInit);

    // when
    const instance1 = new SubClass(1, 2);
    const instance2 = new SubClass(1, 2);

    // then
    expect(instance1.sum === instance2.sum).toBeTruthy();
    expect(instance1 === instance2).toBeFalsy();
  });

  describe('매개변수를 전달하는 init 있는 경우', () => {
    test('instance type 검사', () => {
      // given
      const SubClass = util.defineClass(SubWithInit);

      // when
      const instance = new SubClass(1, 3);

      // then
      expect(instance instanceof SubWithInit.init).toBeTruthy();
    });

    test('멤버 변수 검사', () => {
      // given
      const SubClass = util.defineClass(SubWithInit);

      // when
      const instance = new SubClass(1, 3);

      // then
      expect(instance.a).toBe(1);
      expect(instance.b).toBe(3);
    });
  });
});

describe('부모 클래스를 상속한 인스턴스 생성', () => {
  test('생성자 함수 검사', () => {
    // given
    const SubClass = util.defineClass(Sub, Super);

    // when
    const instance = new SubClass();

    // then
    expect(SubClass.prototype.constructor).toEqual(SubClass);
    expect(instance.constructor).toEqual(SubClass);
  });

  test('메서드 오버라이딩 검사', () => {
    // given
    const SubClass = util.defineClass(Sub, Super);

    // when
    const instance = new SubClass();

    // then
    expect(instance.sum(1, 3, 5)).toBe(4); // 1 + 3
    expect(instance.sum(1, 3, 5)).not.toBe(9); // 1 + 3 + 5
    expect(instance.multi(1, 3, 5)).toBe(15); // 1 * 3 * 5
  });

  test('인스턴스가 여러개인 경우', () => {
    // given
    const SubClass = util.defineClass(SubWithInit, SuperWithInit);

    // when
    const instance1 = new SubClass(1, 2);
    const instance2 = new SubClass(1, 2);

    // then
    expect(instance1.sum === instance2.sum).toBeTruthy();
    expect(instance1.multi === instance2.multi).toBeTruthy();
    expect(instance1 === instance2).toBeFalsy();
  });

  describe('매개변수를 전달하는 init 있는 경우', () => {
    test('instance type 검사', () => {
      // given;
      const SubClass = util.defineClass(SubWithInit, SuperWithInit);

      // when
      const instance = new SubClass(1, 3);

      // then
      expect(instance instanceof SubWithInit.init).toBeTruthy();
      expect(instance instanceof SuperWithInit.init).toBeTruthy();
    });

    test('멤버 변수 검사', () => {
      // given;
      const SubClass = util.defineClass(SubWithInit, SuperWithInit);

      // when
      const instance = new SubClass(1, 3);

      // then
      expect(instance.a).toBe(1);
      expect(instance.b).toBe(3);
      expect(instance.c).toBe(10);
    });

    test('메소드 오버라이딩 검사', () => {
      // given;
      const SubClass = util.defineClass(SubWithInit, SuperWithInit);

      // when
      const instance = new SubClass(1, 3);

      // then
      expect(instance.sum()).toBe(4); // 1 + 3
      expect(instance.multi()).toBe(30); // 1 * 3 * 10
    });
  });
});
