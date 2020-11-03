import util from '@/lib/util';

let obj = null;
let objWithInit = null;

beforeAll(() => {
  obj = {
    sum: function (a, b) {
      return a + b;
    }
  };
  objWithInit = {
    init: function (a, b) {
      this.a = a;
      this.b = b;
    },
    sum: function () {
      return this.a + this.b;
    }
  };
});

describe('인스턴스 생성', () => {
  test('생성자 함수 검사', () => {
    // given
    const Sum = util.defineClass(obj);

    // when
    const instance = new Sum();

    // then
    expect(Sum.prototype.constructor).toEqual(Sum);
    expect(instance.constructor).toEqual(Sum);
  });

  test('메서드 검사', () => {
    // given
    const Sum = util.defineClass(obj);

    // when
    const instance = new Sum();

    // then
    expect(instance.sum(1, 2)).toBe(3);
  });

  test('init 있는 경우', () => {
    // given
    const Sum = util.defineClass(objWithInit);

    // when
    const instance = new Sum(1, 2);

    // then
    expect(Sum.prototype.constructor).toEqual(objWithInit.init);
    expect(instance.sum()).toBe(3);
  });

  test('인스턴스가 여러개인 경우', () => {
    // given
    const Sum = util.defineClass(objWithInit);

    // when
    const instance1 = new Sum(1, 2);
    const instance2 = new Sum(1, 2);

    // then
    expect(instance1.sum === instance2.sum).toBeTruthy();
    expect(instance1 === instance2).toBeFalsy();
  });
});

describe('부모 상속 인스턴스 생성', () => {
  test('인스턴스 ', () => {
    // given
    // when
    // then
  });
});
