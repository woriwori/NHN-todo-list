import domutil from '@/lib/domutil';
import helper from '@/lib/helper';

const eventType = 'click';
let mockFn = jest.fn();
let element;
let invalidElement;
let clickEvent;
function getMockFnReturnValue(fn, index) {
  return fn.mock.results[index].value;
}

beforeAll(() => {
  document.body.innerHTML = `<div id="foo"></div>`;
  element = document.getElementById('foo');
  invalidElement = document.getElementById('bar');

  clickEvent = new Event(eventType, {bubbles: true});
});

afterEach(() => {
  mockFn.mockReset();
});

describe('요소 접근', () => {
  test('selector로 요소 접근하는 경우', () => {
    // given
    const selectorId = element.id;

    // when
    const received = helper.getElement(`#${selectorId}`);

    // then
    expect(received).toEqual(element);
  });

  test('DOM Element로 접근 하는 경우', () => {
    // given
    const selectorDOM = element;

    // when
    const received = helper.getElement(selectorDOM);

    // then
    expect(received).toEqual(element);
  });

  test('유효하지 않은 값으로 요소 접근하는 경우', () => {
    // given
    const selectorEmptyString = '';
    const selectorNull = null;

    // when
    const throwErrorFn1 = () => helper.getElement(selectorEmptyString);
    const throwErrorFn2 = () => helper.getElement(selectorNull);

    // then
    expect(throwErrorFn1).toThrow();
    expect(throwErrorFn2).toThrow();
  });
});

describe.only('이벤트 바인딩 (공통)', () => {
  test.only('유효하지 않은 요소로 이벤트 바인딩 시도하는 경우', () => {
    // given
    const selectorEmptyString = '';
    const selectorNull = null;

    // when
    const throwErrorFn1 = () => domutil.on(selectorEmptyString, eventType, () => {});
    const throwErrorFn2 = () => domutil.on(selectorNull, eventType, () => {});

    // then
    expect(throwErrorFn1).toThrow();
    expect(throwErrorFn2).toThrow();
  });

  test('유효하지 않은 이벤트 타입으로 이벤트 바인딩 시도하는 경우', () => {
    // given
    const eventTypeEmptyString = '';
    const eventTypeNull = null;

    // when
    const throwErrorFn1 = () => domutil.on(element, eventTypeEmptyString, () => {});
    const throwErrorFn2 = () => domutil.on(element, eventTypeNull, () => {});

    // then
    expect(throwErrorFn1).toThrow();
    expect(throwErrorFn2).toThrow();
  });

  test('유효하지 않은 함수로 이벤트 바인딩 시도하는 경우', () => {
    // given
    const handlerEmptyString = '';
    const handlerNull = null;

    // when
    const throwErrorFn1 = () => domutil.on(element, eventType, handlerEmptyString);
    const throwErrorFn2 = () => domutil.on(element, eventType, handlerNull);

    // then
    expect(throwErrorFn1).toThrow();
    expect(throwErrorFn2).toThrow();
  });

  test('이벤트 핸들러 내부의 this value 검사', () => {
    // given
    mockFn.mockReturnThis();

    // when
    domutil.on(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    // then
    expect(getMockFnReturnValue(mockFn, 0)).toEqual(element);
  });

  test('이벤트가 버블링 된 경우의 currentTarget과 target 값 검사', () => {
    // given
    element.innerHTML = `<div id="current"></div>`;
    const bubblingTarget = element;
    const target = document.getElementById('current');
    mockFn.mockImplementation((e) => ({
      currentTarget: e.currentTarget,
      target: e.target
    }));

    // when
    domutil.on(target, eventType, mockFn);
    domutil.on(bubblingTarget, eventType, mockFn);
    target.dispatchEvent(clickEvent);

    // then
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(getMockFnReturnValue(mockFn, 1).currentTarget).toEqual(bubblingTarget);
    expect(getMockFnReturnValue(mockFn, 1).target).toEqual(target);

    document.body.innerHTML = `<div class="foo"></div>`;
  });
});

describe('이벤트 바인딩 (DOM Level 0)', () => {
  test('이벤트 바인딩 검사 (onevent)', () => {
    document.addEventListener = null;
    document.attachEvent = null;

    domutil.on(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('이벤트 핸들러 2개 이상 추가 (onevent)', () => {
    const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    document.addEventListener = null;
    document.attachEvent = null;

    mockFnArr.forEach((f) => domutil.on(element, eventType, f));
    element.dispatchEvent(clickEvent);

    expect(mockFnArr[1]).toHaveBeenCalledBefore(mockFnArr[2]);
    expect(mockFnArr[0]).toHaveBeenCalledBefore(mockFnArr[1]);
  });

  test('이벤트 바인딩 제거 검사 (null 할당)', () => {
    document.addEventListener = null;
    document.attachEvent = null;
    document.removeEventListener = null;
    document.detachEvent = null;
    domutil.on(element, eventType, mockFn);

    domutil.off(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test('이벤트 핸들러 2개 이상 제거 (null 할당)', () => {
    const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    mockFnArr.forEach((f) => domutil.on(element, eventType, f));

    domutil.off(element, eventType, mockFnArr[1]);
    element.dispatchEvent(clickEvent);

    expect(mockFnArr[0]).toHaveBeenCalledTimes(1);
    expect(mockFnArr[1]).toHaveBeenCalledTimes(0);
    expect(mockFnArr[2]).toHaveBeenCalledTimes(1);
  });
});

describe('이벤트 바인딩 (DOM Level 2)', () => {
  test('이벤트 바인딩 검사 (addEventListener)', () => {
    domutil.on(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('이벤트 핸들러 2개 이상 추가 (addEventListener)', () => {
    const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    mockFnArr.forEach((f) => domutil.on(element, eventType, f));

    element.dispatchEvent(clickEvent);

    expect(mockFnArr[1]).toHaveBeenCalledBefore(mockFnArr[2]);
    expect(mockFnArr[0]).toHaveBeenCalledBefore(mockFnArr[1]);
  });

  test('이벤트 바인딩 제거 검사 (removeEventListener) ', () => {
    domutil.on(element, eventType, mockFn);

    domutil.off(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test('이벤트 핸들러 2개 이상 제거 (removeEventListener)', () => {
    const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    mockFnArr.forEach((f) => domutil.on(element, eventType, f));

    domutil.off(element, eventType, mockFnArr[1]);
    element.dispatchEvent(clickEvent);

    mockFnArr.forEach((f, i) => expect(f).toBeCalledTimes(i === 1 ? 0 : 1));
  });
});

describe('이벤트 바인딩 (<IE9)', () => {
  test('이벤트 바인딩 검사 (attachEvent)', () => {
    document.attachEvent = document.addEventListener;
    document.addEventListener = null;

    domutil.on(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('이벤트 핸들러 2개 이상 추가 (attachEvent)', () => {
    const mockFnArr = [jest.fn(() => 0), jest.fn(() => 1), jest.fn(() => 2)];
    document.attachEvent = document.addEventListener;
    document.addEventListener = null;

    mockFnArr.forEach((f) => domutil.on(element, eventType, f));
    element.dispatchEvent(clickEvent);

    expect(mockFnArr[2]).toHaveBeenCalledBefore(mockFnArr[1]);
    expect(mockFnArr[1]).toHaveBeenCalledBefore(mockFnArr[0]);
  });

  test('이벤트 바인딩 제거 검사 (detachEvent)', () => {
    document.attachEvent = document.addEventListener;
    document.addEventListener = null;
    document.detachEvent = document.removeEventListener;
    document.removeEventListener = null;
    domutil.on(element, eventType, mockFn);

    domutil.off(element, eventType, mockFn);
    element.dispatchEvent(clickEvent);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test('이벤트 핸들러 2개 이상 제거 (detachEvent)', () => {
    // const mockFnArr = [jest.fn(), jest.fn(), jest.fn()];
    // mockFnArr.forEach((f) => domutil.on(element, eventType, f));
    // domutil.off(element, eventType, mockFnArr[1]);
    // element.dispatchEvent(clickEvent);
    // mockFnArr.forEach((f, i) => expect(f).toBeCalledTimes(i === 1 ? 0 : 1));
  });
});
