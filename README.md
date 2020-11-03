# Utillity
## Dom Util

```javascript
DOM 이벤트 바인딩/언바인딩 기능을 제공한다.
domutil.on('.class', 'click', function() {});
domutil.on(element, 'click', function() {});
domutil.off('.class', 'click', function() {});
domutil.off(element, 'click', function() {});
```

## Define class
```javascript util.defineClass({ 자식 클래스 객체 }, ?SuperClass);```

- init 메서드가 존재하면 인스턴스를 생성할 때 호출되어야 한다.
- init 메서드안에서는 생성된 인스턴스를 this를 통해 접근 가능 하다.
- 상속과정에서 부모의 init 메서드에서 생성되는 객체맴버는 명시적으로 자식에서 init 을 실행해야 상속 된다.
- 상속과정에서 메서드는 오버라이딩이 가능하다.

```javascript
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
```

## Custom Event

- 객체 간 커스텀 이벤트를 등록, 발생시킬 수 있는 기능을 제공한다.
- CustomEvents.mixin(targetObject) 와같이 믹스인 형태로 사용가능하다.
- targetObject 에는 on(), off(), fire() 메소드가 추가되어야 한다.
- 객체가 이벤트를 발생시키면(fire) 등록된(on) 커스텀 이벤트 핸들러들이 호출되어야 한다.
- 이벤트 핸들러는 첫 번째 인자에 이벤트 발생 시 전달된 인자를 그대로 전달받는다.
- 등록된 이벤트는 해제도(off) 가능해야 한다.

```javascript
var myObj = {};

function onDeleted(eventData) {
    console.log(eventData.message);
}

CustomEvents.mixin(myObj);

myObj.on('deleted', onDeleted);
myObj.fire('deleted', { message: 'test' });    // 콘솔에 test가 출력됨.
myObj.off('deleted', onDeleted);
```

## Drag & Drop

- 선행으로 직접 개발한 커스텀 이벤트 관리 유틸리티를 사용한다.
- 특정 DOM엘리먼트에 사용해 Drag & Drop기능을 부여하는 라이브러리
- 특정 DOM엘리먼트에 사용해 Dropzone으로 설정할 수 있는 기능.
- 하나의 DOM엘리먼가 Drag & Drop, Dropzone 두 기능을 적용할 수 있다.
- 같은 기능을 두 번 이상 적용할 수 없다 (Drag & Drop을 같은 엘리먼트에 적용 불가 처리)
- 엘리먼트가 Dropzone에 드롭되면 커스텀 이벤트가 발생한다.
- Drag가능 엘리먼트와 Dropzone은 동적으로 추가/제거가 가능해야 한다.
- (option) Dropzone에 드롭될 때 커스텀 이벤트에 겹친 상태인지 완전히 포함된 상태인지 데이터를 제공한다.

```html
<div id="dnd1"></div>
<div id="dnd2"></div>
<div class="my-dnd"></div>
<div class="my-dnd"></div>
<div id="drop1"></div>
<div id="drop2"></div>
``` 

```javascript
(function() {
    dnd.draggable('#dnd1');
    dnd.draggable('.my-dnd');    // 2개 엘리먼트 처리
    var dropzone1 = dnd.dropzone('#drop1');    // Dropzone은 인스턴스를 반환하고 한번에 하나의 dropzone을 생성할 수 있다.
    var dropzone2 = dnd.dropzone('#drop2');
    
    dropzone1.on('drop', function(eventData) {
        console.log(eventData.target);    // 드롭 된 엘리먼트
        console.log(eventData.isContain);    // 완전 포함 여부
    });
})();
```

# Todo List

## 기본 조건
- 학습한 모든 개발 도구를 사용한다.(eslint, jest, webpack)
- UI는 Todo 입력부와 Todo 목록 출력부, 정보 출력부로 나뉜다. (UI는 예제 화면과 동일하지 않아도된다)
- Todo는 [완료 전], [완료] 두 가지 상태를 가진다. (default : 완료 전)

### 입력부
- Todo를 입력 받을 수 있는 input 있다.
- Input에 텍스트로 Todo를 입력할 수 있으며, enter키로 Todo를 등록할 수 있다.
- 등록된 Todo는 Todo 목록 상단에 추가되며, 등록과 동시에 input의 내용은 초기화된다.

### 목록부
- 등록된 Todo 목록이 출력된다.
- Todo 는 등록순으로 소팅되어 최근 목록이 상단에 위치한다.
- Todo는 아래와 같이 구성된다.
- 완료 여부를 나타내는 checkbox
- 내용을 나타내는 textnode
- checkbox를 클릭하여 완료 처리할 수 있으며, 토클 방식으로 상태를 변경할 수 있다.
  - 체크 : [완료] 상태
  - 체크해제 : [완료 전] default 상태
- 완료된 Todo는 Todo 목록의 하단으로 이동하며, 이미 완료된 Todo를 다시 [완료 전] 상태로 변경하면 Todo 목록 상단으로 다시 이동한다.
- Todolist의 ul은 하나만 사용한다.
- 완료된 Todo는 취소선과 폰트 컬러로 시각적으로 다르게 한다.

### 하단 정보부
- 현재 남아있는 완료 전 Todo의 갯수를 출력한다.
- [전체], [완료 전], [완료됨] 의 탭으로 Todo목록을 필터해 볼 수 있는 기능을 제공한다.
- 완료항목 삭제 기능을 제공한다.

### Drag & Drop 기능
- 직접 개발한 드래그앤 드롭 컴포넌트를 이용한다.
- 아이템 엘리먼트(TodoItem)이 Draggable이다.
- 리스트 엘리먼트(TodoList)는 Droppable이다.
- 이미 만들어진 아이템을 다른 위치로 드래그 & 드롭하여 리스트 내부 순서를 바꿀 수 있다.
- 드래그할 때, 어디로 이동 되는지 가이드 엘리먼트가 나타난다.
- 리스트 외부로 드롭 하는 경우 드래그가 취소된다.
- 드래그 도중 ESC를 누른 경우 드래그가 취소된다.
- 해당 위치에서 약 2초 정도 머문 경우 (추가 구현 선택)
블러 처리가 된 TodoItem이 해당 위치에 임시로 적용되어 preview가 나타난다.
