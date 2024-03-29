import * as helper from '@/lib/helper';

describe('getElement', () => {
  let element;

  beforeAll(() => {
    document.body.innerHTML = `<div id="foo"></div>`;
    element = document.getElementById('foo');
  });

  test('selector로 요소 접근하는 경우', () => {
    // given
    const selectorId = element.id;

    // when
    const received = helper.getElement(`#${selectorId}`);

    // then
    expect(received).toEqual(element);
  });

  test('selector가 동일한 여러개의 요소가 있는 경우', () => {
    // given
    element.innerHTML = `
    <a>1</a>
    <a>2</a>
    <a>3</a>`;
    const firstAnchor = document.querySelector('a');

    // when
    const received = helper.getElement(`a`);

    // then
    expect(received.innerHTML).toBe('1');
    expect(received).toEqual(firstAnchor);
  });

  test('DOM Element로 접근 하는 경우', () => {
    // given
    const selectorDOM = element;

    // when
    const received = helper.getElement(selectorDOM);

    // then
    expect(received).toEqual(element);
  });

  test('window로 접근 하는 경우', () => {
    // when
    const received = helper.getElement(window);

    // then
    expect(received).toEqual(window);
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
