import CustomEvents from '@/lib/CustomEvents';

const paramString = 'abc';
const paramNumber = 123;
const paramNull = null;
const paramUndefined = undefined;
const paramFunction = () => {};
let mockFn = jest.fn();
function getMockFnReturnValue(fn, index) {
  return fn.mock.results[index].value;
}

afterEach(() => {
  mockFn.mockReset();
});

describe('Custom Events mixin', () => {
  let myObj, mixinEventType;

  beforeEach(() => {
    myObj = {};
    mixinEventType = 'deleted';
  });

  test('유효하지 않은 요소로 이벤트 바인딩 시도하는 경우', () => {
    // when
    const throwErrorString = () => CustomEvents.mixin(paramString);
    const throwErrorNumber = () => CustomEvents.mixin(paramNumber);
    const throwErrorNull = () => CustomEvents.mixin(paramNull);
    const throwErrorUndefined = () => CustomEvents.mixin(paramUndefined);
    const throwErrorFunction = () => CustomEvents.mixin(paramFunction);

    // then
    expect(throwErrorString).toThrow();
    expect(throwErrorNumber).toThrow();
    expect(throwErrorNull).toThrow();
    expect(throwErrorUndefined).toThrow();
    expect(throwErrorFunction).toThrow();
  });

  test('유효하지 않은 이벤트 타입으로 이벤트 바인딩 시도하는 경우', () => {
    // given
    CustomEvents.mixin(myObj);

    // when
    const throwErrorNumber = () => myObj.on(paramNumber, () => {});
    const throwErrorNull = () => myObj.on(paramNull, () => {});
    const throwErrorUndefined = () => myObj.on(paramUndefined, () => {});
    const throwErrorFunction = () => myObj.on(paramFunction, () => {});

    // then
    expect(throwErrorNumber).toThrow();
    expect(throwErrorNull).toThrow();
    expect(throwErrorUndefined).toThrow();
    expect(throwErrorFunction).toThrow();
  });

  test('유효하지 않은 함수로 이벤트 바인딩 시도하는 경우', () => {
    // given
    CustomEvents.mixin(myObj);

    // when
    const throwErrorString = () => myObj.on(mixinEventType, paramString);
    const throwErrorNumber = () => myObj.on(mixinEventType, paramNumber);
    const throwErrorNull = () => myObj.on(mixinEventType, paramNull);
    const throwErrorUndefined = () => myObj.on(mixinEventType, paramUndefined);

    // then
    expect(throwErrorString).toThrow();
    expect(throwErrorNumber).toThrow();
    expect(throwErrorNull).toThrow();
    expect(throwErrorUndefined).toThrow();
  });

  test('이벤트 바인딩 검사', () => {
    // given
    const eventDataParam = {message: 'test'};
    mockFn.mockImplementation((eventData) => eventData);
    CustomEvents.mixin(myObj);

    // when
    myObj.on(mixinEventType, mockFn);
    myObj.fire(mixinEventType, eventDataParam);

    // then
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(getMockFnReturnValue(mockFn, 0)).toEqual(eventDataParam);
  });

  test('이벤트 핸들러 2개 이상 추가', () => {
    // given
    const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    CustomEvents.mixin(myObj);

    // when
    mockFnArr.forEach((f) => myObj.on(mixinEventType, f));
    myObj.fire(mixinEventType, {});

    // then
    expect(mockFnArr[0]).toHaveBeenCalledBefore(mockFnArr[1]);
    expect(mockFnArr[1]).toHaveBeenCalledBefore(mockFnArr[2]);
  });

  test('이벤트 2번 이상 발생', () => {
    // given
    const eventDataParamArr = ['first', 'second', 'third'];
    mockFn.mockImplementation((eventData) => eventData);
    CustomEvents.mixin(myObj);
    myObj.on(mixinEventType, mockFn);

    // when
    eventDataParamArr.forEach((param) => myObj.fire(mixinEventType, param));

    // then
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(getMockFnReturnValue(mockFn, 0)).toEqual('first');
    expect(getMockFnReturnValue(mockFn, 1)).toEqual('second');
    expect(getMockFnReturnValue(mockFn, 2)).toEqual('third');
  });

  test('이벤트 바인딩 제거 검사', () => {
    // given
    CustomEvents.mixin(myObj);
    myObj.on(mixinEventType, mockFn);

    // when
    myObj.off(mixinEventType, mockFn);
    myObj.fire(mixinEventType);

    // then
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test('이벤트 핸들러 2개 이상 제거', () => {
    // given
    const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    CustomEvents.mixin(myObj);
    mockFnArr.forEach((fn) => myObj.on(mixinEventType, fn));

    // when
    myObj.off(mixinEventType, mockFnArr[1]);
    myObj.fire(mixinEventType);

    // then
    expect(mockFnArr[0]).toHaveBeenCalledTimes(1);
    expect(mockFnArr[1]).toHaveBeenCalledTimes(0);
    expect(mockFnArr[2]).toHaveBeenCalledTimes(1);
  });
});
