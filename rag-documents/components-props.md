# 컴포넌트와 Props

## 학습 목표
- React 컴포넌트가 무엇인지 설명한다.
- 부모 컴포넌트가 자식에게 Props를 전달하는 방식을 이해한다.
- Props와 State를 구분하고 간단한 JSX 예제를 읽는다.

## 1. 컴포넌트(Component)란?
컴포넌트는 화면의 한 부분을 맡는 재사용 가능한 UI 단위다. 버튼, 프로필 카드, 메뉴처럼 작은 부분도 컴포넌트로 만들 수 있다. React 컴포넌트는 일반적으로 JSX를 반환하는 JavaScript 함수로 작성한다. 사용자 정의 컴포넌트의 이름은 대문자로 시작한다. 예를 들어 `Welcome`은 컴포넌트이고, `div`는 HTML 태그다.

```jsx
function Welcome() {
  return <h2>React에 오신 것을 환영합니다!</h2>;
}

export default function App() {
  return <Welcome />;
}
```

컴포넌트를 작은 단위로 나누면 같은 UI를 여러 곳에서 재사용하고 내용을 관리하기 편하다. 컴포넌트 함수 정의를 다른 컴포넌트 함수 안에 중첩하기보다는 파일의 최상위 수준에 정의한다.

## 2. Props란?
Props는 부모 컴포넌트가 자식 컴포넌트에게 전달하는 입력값이다. 문자열뿐 아니라 숫자, 배열, 객체, 함수도 전달할 수 있다. 부모는 JSX 속성에 값을 넣고 자식은 함수 매개변수에서 받는다.

```jsx
function Greeting({ name, message }) {
  return <p>{name}님, {message}</p>;
}

export default function App() {
  return (
    <section>
      <Greeting name="민지" message="안녕하세요!" />
      <Greeting name="준호" message="반가워요!" />
    </section>
  );
}
```

이 예제에서 `App`은 부모, `Greeting`은 자식이다. 하나의 `Greeting` 컴포넌트를 서로 다른 Props로 재사용한다. JSX에서 JavaScript 값을 전달할 때는 중괄호를 쓴다. 예: `<Greeting name={userName} message="안녕" />`.

## 3. 기본값과 children
구조 분해 할당에서 기본값을 줄 수 있다. 값이 전달되지 않았거나 `undefined`일 때 기본값이 적용된다.

```jsx
function Badge({ label = '새 항목' }) {
  return <strong>{label}</strong>;
}
```

태그 사이에 넣은 내용은 `children`이라는 특별한 Props로 받을 수 있다.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

export default function App() {
  return <Card><p>카드 안의 내용</p></Card>;
}
```

## 4. Props와 State의 차이
- Props: 부모가 전달하는 값. 자식 입장에서는 읽기 전용이다. 자식 컴포넌트가 Props를 직접 수정하지 않는다.
- State: 컴포넌트 내부에서 기억하고 변경하는 값. 사용자 입력이나 클릭처럼 화면을 바꾸어야 할 때 `useState` 등을 사용한다.
- Props가 달라지면 자식은 새로운 Props를 받아 다시 렌더링될 수 있다.

## 5. 자주 하는 실수
- `<greeting />`처럼 사용자 정의 컴포넌트의 이름을 소문자로 작성하지 않는다.
- `props.name = '다른 이름'`처럼 Props를 직접 변경하지 않는다.
- HTML 속성과 JSX 속성을 혼동하지 않는다. 예: CSS 클래스 지정은 보통 `className`을 사용한다.

## 6. JSX 작성 규칙과 표현식
JSX는 HTML과 비슷해 보이지만 JavaScript의 문법 확장이다. 여러 요소를 반환할 때는 하나의 부모 요소나 Fragment(`<>...</>`)로 묶는다. 빈 태그도 닫고, CSS 클래스는 `className`으로 지정한다. 중괄호 안에는 값을 계산하는 표현식을 넣을 수 있다. `if` 문 자체를 중괄호 안에 넣기보다는 반환 전에 조건을 처리한다.

```jsx
function CourseSummary({ title, duration }) {
  return (
    <>
      <h2 className="title">{title}</h2>
      <p>예상 소요 시간: {duration * 60}분</p>
    </>
  );
}
```

`style`에 객체를 전달할 때에는 `style={{ color: 'navy' }}`처럼 바깥 중괄호는 JSX 표현식을, 안쪽 중괄호는 객체를 나타낸다.
참고: https://react.dev/learn/writing-markup-with-jsx

## 7. 컴포넌트 파일 분리와 재사용
컴포넌트는 파일을 나누어 관리할 수 있다. default export는 파일당 하나이고, named export는 여러 개를 정의할 수 있다. 가져오는 문법은 내보낸 방식에 맞춰야 한다.

```jsx
// CourseCard.jsx
export default function CourseCard({ title, level }) {
  return <article>{title} ({level})</article>;
}
```
```jsx
// App.jsx
import CourseCard from './CourseCard.jsx';
export default function App() {
  return <CourseCard title="React 기초" level="입문" />;
}
```
참고: https://react.dev/learn/importing-and-exporting-components

## 8. 부모가 관리하는 값 변경 요청
자식이 Props를 직접 수정하는 대신 부모가 상태를 관리하고 변경 함수를 전달할 수 있다. 아래 예제에서 버튼 클릭은 부모의 상태를 바꾸며, 변경된 값은 다시 Props로 전달된다. 이런 방식은 두 컴포넌트가 동일한 값을 공유해야 할 때도 유용하다.

```jsx
import { useState } from 'react';
function ScoreButton({ score, onIncrease }) {
  return <button onClick={onIncrease}>점수: {score}</button>;
}
export default function App() {
  const [score, setScore] = useState(0);
  return <ScoreButton score={score} onIncrease={() => setScore(s => s + 1)} />;
}
```
참고: https://react.dev/learn/sharing-state-between-components

## 9. 렌더링의 순수성
렌더링 중에는 외부 데이터를 임의로 변경하지 않고 입력값을 바탕으로 JSX를 계산한다. 예를 들어 컴포넌트 밖에 선언한 배열에 렌더링할 때마다 항목을 추가하면 화면을 다시 계산할 때 결과가 달라질 수 있다. 클릭에 따른 변경은 이벤트 핸들러로 옮기고, 외부 시스템과 동기화는 Effect가 필요한지 검토한다. 렌더링 중 새로 생성한 지역 배열을 조작하는 것은 외부 배열을 변경하는 것과 다르다.
참고: https://react.dev/learn/keeping-components-pure

## 10. 추가 FAQ: 컴포넌트와 Props
- Q. 컴포넌트와 JSX의 차이는? A. 컴포넌트는 화면을 구성하는 단위이며 JSX는 그 화면 구조를 표현하는 문법이다.
- Q. Props에 함수를 넣어도 되나요? A. 가능하다. 부모가 전달한 콜백을 자식의 이벤트 핸들러에서 실행할 수 있다.
- Q. Props 기본값은 null에도 적용되나요? A. 구조 분해 기본값은 누락되거나 undefined일 때만 적용된다.
- Q. 자식 컴포넌트에 텍스트 외에 JSX도 전달할 수 있나요? A. children 또는 일반 Props로 JSX를 전달할 수 있다.
- Q. 왜 컴포넌트를 다른 컴포넌트 안에서 선언하지 않나요? A. 렌더링마다 새로운 컴포넌트 타입이 만들어져 내부 상태가 초기화되는 문제가 생길 수 있다.
- Q. Props를 복사해서 State로 저장해야 하나요? A. 일반적으로는 원래 Props를 그대로 사용한다. 별도로 기억해야 하는 독립적인 값인지 먼저 판단한다.


## 공식 문서 출처 및 이용 안내
- https://react.dev/learn/passing-props-to-a-component
- https://react.dev/learn/your-first-component
- https://react.dev/learn/writing-markup-with-jsx
- https://react.dev/learn/importing-and-exporting-components
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/keeping-components-pure

React 공식 문서(react.dev, React 문서 기여자)를 참고해 한국어로 요약·재구성한 학습 자료입니다. 코드 예시는 과제용으로 새로 작성했습니다. 공식 문서의 라이선스: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). 원문 라이선스: https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md
