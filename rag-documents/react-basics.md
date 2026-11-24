# React 기초 개념

> 이 문서는 React 입문자가 자주 묻는 기본 질문을 정리한 **자체 작성 학습 자료**입니다.
> 특정 공식 문서 페이지를 옮긴 것이 아니므로 출처가 없습니다. 세부 문법은 컴포넌트와 Props, State와 useState,
> 이벤트 핸들링, 조건부·리스트 렌더링, Effect와 useEffect 학습 자료를 함께 참고하세요.

## 학습 목표
- React가 무엇이고 왜 쓰는지 한 문장으로 설명한다.
- state가 바뀌면 화면이 다시 그려지는 과정을 이해한다.
- Hook의 뜻과 사용 규칙을 안다.
- useState와 useRef의 차이를 구분한다.
- "상태 업데이트는 비동기인가?"라는 질문에 정확하게 답한다.

## 1. React란 무엇인가요?
React는 사용자 인터페이스(UI)를 만들기 위한 자바스크립트 라이브러리입니다. 화면을 버튼, 카드, 목록 같은 작은 조각인 **컴포넌트**로 나누고, 이 조각들을 조립해서 전체 화면을 만듭니다.

React의 핵심 생각은 "화면은 데이터(state)의 결과"라는 것입니다. 개발자는 "데이터가 이럴 때 화면은 이렇게 보여야 한다"를 선언하듯이 작성하고, 데이터가 바뀌면 화면을 맞추는 일은 React가 맡습니다. 이런 방식을 **선언형(declarative) UI**라고 부릅니다.

```jsx
function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>;
}
```

## 2. React는 왜 쓰나요? (직접 DOM을 다루는 방식과 비교)
일반 HTML과 자바스크립트로 화면을 바꾸려면 값이 바뀔 때마다 `document.getElementById` 같은 코드로 요소를 직접 찾아서 수정해야 합니다. 화면이 커질수록 "어떤 값이 바뀌면 어느 요소를 고쳐야 하는지"를 사람이 모두 기억해야 해서 실수가 늘어납니다.

```js
// 일반 자바스크립트: 값이 바뀔 때마다 요소를 직접 찾아 수정
let count = 0;
document.getElementById('btn').addEventListener('click', () => {
  count += 1;
  document.getElementById('count').textContent = count;
});
```

React에서는 state만 바꾸면 됩니다. 화면을 다시 그리는 일은 React가 알아서 처리합니다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}번 클릭</button>;
}
```

React를 쓰는 주요 이유는 다음과 같습니다.
- **재사용**: 한 번 만든 컴포넌트를 여러 곳에서 다시 쓸 수 있습니다.
- **예측 가능성**: 같은 데이터면 같은 화면이 나오므로 동작을 이해하고 고치기 쉽습니다.
- **분업과 유지보수**: 화면을 조각으로 나누어 각자 맡을 수 있고, 한 조각을 고쳐도 다른 조각에 주는 영향이 작습니다.
- **사용자 경험**: 바뀐 부분만 다시 그리기 때문에 페이지 전체를 새로고침하지 않고 앱처럼 부드럽게 동작합니다.

## 3. state가 바뀌면 왜 화면이 다시 그려지나요?
React에서 화면이 바뀌는 과정은 세 단계로 이해할 수 있습니다.

1. **렌더링 요청(trigger)**: `setCount` 같은 state 변경 함수를 호출하면 React에 "이 컴포넌트를 다시 그려 달라"는 요청이 들어갑니다.
2. **렌더링(render)**: React가 해당 컴포넌트 함수를 다시 호출해서 새 state 값으로 JSX를 다시 계산합니다.
3. **화면 반영(commit)**: React가 새 결과와 이전 결과를 비교해서 **실제로 바뀐 부분만** 브라우저 화면(DOM)에 반영합니다.

일반 지역 변수(`let count = 0`)를 바꾸면 React는 그 사실을 알 수 없어서 화면이 바뀌지 않습니다. 또 지역 변수는 컴포넌트 함수가 다시 호출될 때마다 처음 값으로 돌아갑니다. 값을 기억하면서 바뀔 때 화면도 갱신하고 싶다면 state를 써야 합니다.

```jsx
// ❌ 화면이 바뀌지 않는 코드
export default function Counter() {
  let count = 0;
  return <button onClick={() => { count += 1; }}>{count}</button>;
}
```

## 4. JSX란 무엇인가요?
JSX는 자바스크립트 안에서 HTML과 비슷한 모양으로 화면 구조를 적는 문법입니다. 브라우저가 바로 이해하는 문법은 아니고, 빌드 도구가 일반 자바스크립트 코드로 바꿔 줍니다.

JSX의 기본 규칙은 다음과 같습니다.
- 컴포넌트는 **하나의 최상위 요소**를 반환합니다. 여러 요소를 반환하려면 `<>...</>`(Fragment)로 감쌉니다.
- 모든 태그는 닫아야 합니다. 예: `<img />`, `<br />`
- HTML의 `class`는 `className`으로 씁니다.
- 중괄호 `{}` 안에 자바스크립트 값이나 식을 넣을 수 있습니다.

```jsx
function Profile() {
  const name = '다연';
  return (
    <>
      <h2 className="title">{name}의 프로필</h2>
      <p>오늘은 {new Date().getFullYear()}년입니다.</p>
    </>
  );
}
```

## 5. Hook이란 무엇이고, 어떤 규칙이 있나요?
Hook은 `use`로 시작하는 함수로, 함수 컴포넌트에 기능을 붙여 줍니다. 예를 들어 `useState`는 값을 기억하는 기능, `useEffect`는 외부 시스템과 동기화하는 기능, `useRef`는 렌더링과 상관없는 값을 보관하는 기능을 줍니다.

Hook은 다음 규칙을 지켜야 합니다.
- **컴포넌트(또는 직접 만든 커스텀 Hook)의 최상위에서만 호출합니다.** 조건문, 반복문, 중첩 함수 안에서 호출하지 않습니다.
- **함수 컴포넌트나 커스텀 Hook 안에서만 호출합니다.** 일반 자바스크립트 함수에서는 호출하지 않습니다.

React는 Hook이 호출된 **순서**로 각 Hook의 값을 구분하기 때문에, 렌더링마다 호출 순서가 같아야 합니다.

```jsx
// ❌ 조건에 따라 Hook 호출 여부가 바뀌면 안 됩니다
if (isLoggedIn) {
  const [name, setName] = useState('');
}

// ✅ Hook은 항상 최상위에서 호출하고, 조건은 그 아래에서 처리합니다
const [name, setName] = useState('');
if (!isLoggedIn) return <p>로그인이 필요합니다.</p>;
```

## 6. useRef란 무엇인가요?
`useRef`는 렌더링이 다시 일어나도 유지되지만, **바뀌어도 화면을 다시 그리지 않는 값**을 보관할 때 쓰는 Hook입니다. `useRef(초깃값)`은 `{ current: 초깃값 }` 모양의 객체를 돌려주고, `ref.current`를 읽거나 바꿔서 사용합니다.

대표적인 사용 예는 두 가지입니다.

1) 타이머 ID처럼 화면에 보여 줄 필요가 없는 값을 저장할 때

```jsx
import { useRef, useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  return (
    <div>
      <p>{seconds}초</p>
      <button onClick={start}>시작</button>
      <button onClick={stop}>정지</button>
    </div>
  );
}
```

2) 입력창 같은 DOM 요소에 직접 접근할 때

```jsx
import { useRef } from 'react';

export default function SearchBox() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} placeholder="검색어" />
      <button onClick={() => inputRef.current.focus()}>입력창으로 이동</button>
    </>
  );
}
```

렌더링 도중(컴포넌트 함수 본문)에 `ref.current`를 읽거나 바꾸면 동작을 예측하기 어려워지므로, 이벤트 핸들러나 Effect 안에서 다루는 것이 좋습니다.

## 7. useState와 useRef의 차이는 무엇인가요?
두 Hook 모두 렌더링 사이에 값을 기억하지만, **값이 바뀔 때 화면을 다시 그리는지**가 다릅니다.

| 구분 | useState | useRef |
|---|---|---|
| 값을 바꾸는 방법 | `setValue(새 값)` 함수 호출 | `ref.current = 새 값` 직접 대입 |
| 바뀌면 다시 렌더링? | 예, 화면이 갱신됨 | 아니요, 화면은 그대로 |
| 바뀐 값을 읽는 시점 | 다음 렌더링부터 새 값 | 대입 즉시 새 값 |
| 주로 쓰는 곳 | 화면에 보여야 하는 값 (카운트, 입력값, 열림 여부) | 화면과 무관한 값 (타이머 ID, 이전 값), DOM 요소 접근 |

고르는 기준은 간단합니다. **"이 값이 바뀌면 화면도 바뀌어야 하나?"** 그렇다면 useState, 아니라면 useRef를 씁니다.

```jsx
import { useRef, useState } from 'react';

export default function Compare() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);

  return (
    <div>
      <button onClick={() => setStateCount(stateCount + 1)}>
        state: {stateCount} (누를 때마다 화면 갱신)
      </button>
      <button onClick={() => { refCount.current += 1; }}>
        ref: {refCount.current} (값은 늘지만 화면은 그대로)
      </button>
    </div>
  );
}
```

## 8. 상태 업데이트는 비동기인가요? useState가 비동기처럼 보이는 이유
많이 하는 오해이지만, `setCount` 같은 state 변경 함수는 **비동기 함수가 아닙니다.** Promise를 돌려주지 않으므로 `await setCount(...)`처럼 기다릴 수도 없습니다. 비동기처럼 **보이는** 데에는 두 가지 이유가 있습니다.

**1) state는 렌더링 시점의 스냅샷입니다.** 한 번의 렌더링 안에서 `count`는 고정된 값입니다. `setCount`는 "다음 렌더링에서는 이 값을 써 달라"고 예약할 뿐, 지금 실행 중인 코드의 `count` 변수를 바꾸지 않습니다.

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // 여전히 이전 값 (예: 0)
}
```

**2) React는 여러 업데이트를 모아서 한 번에 처리합니다(배치 처리).** 같은 이벤트 안에서 state를 여러 번 바꿔도 화면은 이벤트가 끝난 뒤 한 번만 다시 그립니다. 불필요한 렌더링을 줄이기 위한 동작입니다.

```jsx
function handleClick() {
  setCount(count + 1); // 0 + 1 예약
  setCount(count + 1); // 여전히 0 + 1 예약
  setCount(count + 1); // 여전히 0 + 1 예약
} // 결과: 1
```

이전 값을 바탕으로 여러 번 바꾸려면 **함수형 업데이트**를 씁니다. React가 대기 중인 업데이트를 순서대로 적용합니다.

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
} // 결과: 3
```

바꾼 값을 바로 다음 코드에서 써야 한다면, 새 값을 변수에 먼저 계산해 두고 그 변수를 사용합니다.

```jsx
function handleClick() {
  const next = count + 1;
  setCount(next);
  console.log(next); // 새 값
}
```

## 9. React는 라이브러리인가요, 프레임워크인가요?
React는 **UI를 만드는 라이브러리**입니다. 화면을 컴포넌트로 만들고 state에 따라 갱신하는 일에 집중합니다. 페이지 주소에 따라 화면을 바꾸는 라우팅이나 서버에서 데이터를 가져오는 방식 등은 React 자체가 정해 주지 않으므로, 필요에 따라 다른 도구를 함께 사용합니다. 처음 배울 때는 React 자체의 개념(컴포넌트, Props, State, 이벤트, 렌더링, Effect)을 먼저 익히는 것이 좋습니다.

## 10. 추가 FAQ: React 입문
- **React를 배우려면 무엇을 먼저 알아야 하나요?** HTML, CSS와 자바스크립트 기본(변수, 함수, 배열의 `map`·`filter`, 객체, 화살표 함수, 구조 분해 할당)을 알면 시작하기 쉽습니다.
- **컴포넌트는 한마디로 무엇인가요?** 화면의 한 부분을 맡는, JSX를 반환하는 자바스크립트 함수입니다. 자세한 내용은 "컴포넌트와 Props" 학습 자료를 참고하세요.
- **Props와 State는 어떻게 다른가요?** Props는 부모가 넘겨주는 읽기 전용 값이고, State는 컴포넌트가 스스로 기억하고 바꾸는 값입니다.
- **화면 전체를 매번 다시 그리면 느리지 않나요?** React는 컴포넌트를 다시 계산한 뒤 이전 결과와 비교해 바뀐 부분만 실제 화면에 반영하므로, 보통의 화면에서는 걱정하지 않아도 됩니다.
- **어떤 순서로 공부하면 좋나요?** 컴포넌트와 Props → State(useState) → 이벤트 핸들링 → 조건부·리스트 렌더링 → Effect(useEffect) 순서를 추천합니다.

## 출처 안내
이 문서는 입문자용 기초 질문에 답하기 위해 자체 작성한 자료이며, 특정 공식 문서 출처가 없습니다.
