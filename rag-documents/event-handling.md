# 이벤트 핸들링

## 학습 목표
- 클릭·입력·폼 제출 이벤트를 처리한다.
- 이벤트 핸들러 함수를 전달하는 방법을 이해한다.
- 이벤트 전파와 기본 동작을 구분한다.

## 1. 이벤트 핸들러란?
이벤트 핸들러는 버튼 클릭, 입력창 변경, 폼 제출처럼 사용자의 행동이 발생했을 때 실행하는 함수다. React에서는 JSX 속성으로 핸들러 함수를 전달한다. 예를 들어 버튼에는 `onClick`, 입력창에는 `onChange`, 폼에는 `onSubmit`을 사용할 수 있다.

```jsx
export default function SaveButton() {
  function handleSave() {
    alert('저장 버튼을 클릭했습니다.');
  }

  return <button onClick={handleSave}>저장</button>;
}
```

## 2. 함수는 호출하지 말고 전달하기
`onClick={handleSave}`는 함수 자체를 전달해서 클릭 시 실행하도록 한다. 반면 `onClick={handleSave()}`는 렌더링 중 함수를 즉시 실행하므로 일반적인 클릭 핸들러 연결에는 적절하지 않다.

매개변수가 필요하면 화살표 함수를 사용할 수 있다.

```jsx
function ProductButton({ productName }) {
  return (
    <button onClick={() => alert(`${productName} 선택`)}>
      상품 선택
    </button>
  );
}
```

## 3. 입력값 처리
사용자가 입력한 값을 `event.target.value`로 읽을 수 있다. 입력값을 State로 관리하는 경우 `onChange`에서 상태를 변경한다.

```jsx
import { useState } from 'react';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <p>검색어: {keyword}</p>
    </div>
  );
}
```

## 4. 폼 제출 기본 동작 막기
브라우저의 기본 폼 제출은 페이지를 다시 로드할 수 있다. JavaScript에서 직접 처리하려면 `preventDefault()`를 활용한다.

```jsx
export default function SimpleForm() {
  function handleSubmit(e) {
    e.preventDefault();
    alert('폼 내용을 처리합니다.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">제출</button>
    </form>
  );
}
```

## 5. 전파와 기본 동작
- 이벤트 전파: 중첩된 요소의 이벤트가 상위 요소까지 전달될 수 있는 동작이다.
- `e.stopPropagation()`: 상위 요소로 이벤트가 전파되는 것을 막는다.
- `e.preventDefault()`: 링크 이동이나 폼 제출 등 브라우저의 기본 동작을 막는다.
두 메서드는 서로 다른 목적을 가진다.

## 6. 실수하기 쉬운 부분
- 렌더링 중 핸들러를 실행하지 않는다. `onClick={fn()}`와 `onClick={fn}`을 구분한다.
- 클릭하면 카운터가 변경되는 등 화면 갱신이 필요하면 State와 함께 사용한다.
- 폼 안의 버튼은 의도에 맞게 `type="button"` 또는 `type="submit"`을 지정한다.

## 7. 부모에서 이벤트 처리 함수 전달하기
사용자 정의 컴포넌트의 이벤트 Props 이름은 직접 정할 수 있다. 예를 들어 부모가 onSelect 함수를 전달하면 자식은 실제 버튼의 onClick과 연결한다. UI와 비즈니스 동작을 분리하기 좋다.

```jsx
function CourseButton({ title, onSelect }) {
  return <button type="button" onClick={onSelect}>{title}</button>;
}
export default function App() {
  return <CourseButton title="State 학습" onSelect={() => alert('State 선택')} />;
}
```
참고: https://react.dev/learn/responding-to-events

## 8. 이벤트 전파와 캡처
중첩된 버튼의 클릭이 상위 요소에 전달되는 상황을 다음 코드로 확인할 수 있다. 자식 핸들러에서 전파를 중지하면 부모의 일반 클릭 핸들러까지 전달되지 않는다. `onClickCapture`는 캡처 단계에서 먼저 처리해야 하는 경우에 사용한다. React의 onScroll은 일반적인 버블링 이벤트와 다르게 해당 요소에서 처리한다.

```jsx
export default function Toolbar() {
  return <div onClick={() => console.log('도구 모음')}>
    <button onClick={e => {
      e.stopPropagation();
      console.log('다운로드 버튼');
    }}>다운로드</button>
  </div>;
}
```
참고: https://react.dev/learn/responding-to-events

## 9. 제어 입력과 체크박스
텍스트 입력을 제어하려면 value와 onChange를 함께 제공한다. 체크박스는 체크 여부를 `checked`로 표시하고 이벤트에서 `e.target.checked`를 읽는다. 입력값을 계속 State로 관리하지 않아도 된다면 defaultValue, defaultChecked를 사용해 초기값만 제공할 수 있다.

```jsx
import { useState } from 'react';
export default function Consent() {
  const [accepted, setAccepted] = useState(false);
  return <label>
    <input type="checkbox" checked={accepted}
      onChange={e => setAccepted(e.target.checked)} /> 학습 안내 확인
    <span>{accepted ? '확인 완료' : '미확인'}</span>
  </label>;
}
```
value를 전달한 텍스트 입력에서 onChange가 상태를 갱신하지 않으면 사용자가 입력해도 기존 값으로 되돌아간다. 입력의 제어 여부를 수명 중간에 바꾸지 않도록 문자열 State는 빈 문자열로 초기화하는 것이 좋다.
참고: https://react.dev/reference/react-dom/components/input

## 10. 입력 검증과 폼 이벤트
채팅 입력창처럼 빈 문자열을 보내지 않으려면 제출 이벤트에서 값을 확인한다. 다음 예제는 서버 전송 대신 콘솔 출력으로 동작을 시연한다. Enter 제출도 같은 onSubmit 핸들러에서 처리된다.

```jsx
import { useState } from 'react';
export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  function submit(e) {
    e.preventDefault();
    const text = question.trim();
    if (!text) return;
    console.log(text);
    setQuestion('');
  }
  return <form onSubmit={submit}>
    <input aria-label="질문" value={question}
      onChange={e => setQuestion(e.target.value)} />
    <button type="submit" disabled={!question.trim()}>전송</button>
  </form>;
}
```
이 예시는 공식 문서의 이벤트 및 입력 처리 개념을 적용한 자체 작성 실습이다. 실제 서버에서도 입력 검증을 별도로 수행해야 한다.

## 11. 추가 FAQ: 이벤트 핸들링
- Q. 이벤트 함수는 컴포넌트 안에 선언해도 되나요? A. 가능하며 현재 Props와 State를 참조할 수 있다.
- Q. onClick에 인자를 넘기려면? A. `onClick={() => handleSelect(id)}`처럼 클릭 시 호출되는 함수를 전달한다.
- Q. 이벤트 전파를 막으면 링크 이동도 막히나요? A. 아니다. 기본 동작을 막으려면 preventDefault가 필요하다.
- Q. onSubmit은 왜 폼에 작성하나요? A. 버튼 클릭과 키보드 제출을 폼의 제출 동작으로 함께 처리하기 편하다.
- Q. 체크박스의 체크 여부는 어디서 읽나요? A. e.target.checked에서 불리언 값을 읽는다.
- Q. 입력창에 value를 주니 수정할 수 없어요. A. onChange에서 연결된 상태를 업데이트하는지 확인한다.


## 공식 문서 출처 및 이용 안내
- https://react.dev/learn/responding-to-events
- https://react.dev/reference/react-dom/components/input

React 공식 문서(react.dev, React 문서 기여자)를 참고해 한국어로 요약·재구성한 학습 자료입니다. 코드 예시는 과제용으로 새로 작성했습니다. 공식 문서의 라이선스: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). 원문 라이선스: https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md
