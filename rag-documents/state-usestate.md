# State와 useState

## 학습 목표
- State가 왜 필요한지 설명한다.
- `useState`의 반환값 두 가지를 구분한다.
- 상태 변경에 따라 화면이 다시 렌더링되는 것을 이해한다.

## 1. State란?
State는 컴포넌트가 렌더링 사이에 기억해야 할 값이다. 예를 들어 카운터 숫자, 입력창 내용, 메뉴 열림 여부가 있다. 단순한 지역 변수를 변경해도 React는 그 사실을 자동으로 알아차리지 못한다. 화면에 변경된 값을 반영하려면 State를 사용한다.

## 2. useState 기본 형태
`useState(초깃값)`은 현재 상태값과 상태를 바꾸는 함수를 반환한다. 관례적으로 `[count, setCount]`처럼 이름을 짓는다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>클릭 횟수: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

처음에는 `count`가 0이다. 버튼을 클릭해 `setCount`를 호출하면 다음 렌더링에 새 상태가 적용되고 화면도 갱신된다. `count = count + 1`처럼 상태 변수를 직접 바꾸는 방식은 올바른 상태 업데이트가 아니다.

## 3. 이전 상태를 바탕으로 변경하기
다음 상태가 직전 상태에 의존할 때는 함수형 업데이트가 안전하다.

```jsx
setCount(previousCount => previousCount + 1);
```

예를 들어 같은 이벤트에서 증가를 두 번 요청할 때는 다음과 같이 작성할 수 있다.

```jsx
function addTwo() {
  setCount(c => c + 1);
  setCount(c => c + 1);
}
```

React는 상태 업데이트를 모아 처리할 수 있으므로 직전 값을 직접 참조해야 하는 연속 업데이트에는 함수형 방식이 적합하다.

## 4. 문자열 입력 관리
입력 폼도 State로 관리할 수 있다.

```jsx
import { useState } from 'react';

export default function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>입력한 이름: {name}</p>
    </div>
  );
}
```

사용자가 글자를 입력할 때마다 `onChange`가 실행되고 State가 갱신된다.

## 5. 규칙과 주의사항
- `useState`는 컴포넌트 함수의 최상위에서 호출한다. 조건문이나 반복문 안에서 호출하지 않는다.
- State는 컴포넌트 인스턴스별로 독립적이다. 같은 카운터를 두 번 렌더링하면 각각 자신의 값을 기억한다.
- 배열과 객체를 State로 다룰 때 기존 값을 직접 변경하기보다 새 배열·객체를 만들어 업데이트한다.
- 상태 변경 직후 같은 이벤트 핸들러 안에서 읽는 변수에는 이전 렌더링의 값이 남아 있을 수 있다.

## 6. 상태는 렌더링 시점의 스냅샷
상태 변경 함수는 현재 실행 중인 이벤트 핸들러의 변수 자체를 바꾸지 않는다. 다음 렌더링에서 새 값이 사용된다. 예를 들어 count가 0인 렌더링에서 아래 버튼을 클릭하면 콘솔에는 0이 출력되고 다음 화면에는 1이 표시된다.

```jsx
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  function increase() {
    setCount(count + 1);
    console.log(count);
  }
  return <button onClick={increase}>{count}</button>;
}
```
참고: https://react.dev/learn/state-as-a-snapshot

## 7. 연속 업데이트와 배치 처리
한 클릭에서 `setCount(count + 1)`을 세 번 실행하면 세 호출이 같은 렌더링의 count를 참조한다. 0에서 시작하면 최종 값은 1이다. 반대로 업데이트 함수 세 개를 큐에 넣으면 각 함수는 앞선 업데이트의 결과를 전달받아 3이 된다.

```jsx
function addThree() {
  setCount(n => n + 1);
  setCount(n => n + 1);
  setCount(n => n + 1);
}
```
React는 이벤트 처리 중의 업데이트를 묶어 불필요한 렌더링을 줄인다. 업데이트 함수는 이전 상태로부터 다음 값을 계산하는 순수 함수로 작성한다.
참고: https://react.dev/learn/queueing-a-series-of-state-updates

## 8. 객체 State 업데이트
객체의 한 속성만 바꾸더라도 새로운 객체를 생성한다. 객체 전개 문법은 기존 속성을 유지하며 일부 값만 교체할 때 유용하다. 중첩 객체라면 수정되는 경로의 객체도 새로 만들어야 한다.

```jsx
import { useState } from 'react';
export default function ProfileEditor() {
  const [profile, setProfile] = useState({ name: '', major: 'CS' });
  return <input value={profile.name} onChange={e => {
    const name = e.target.value;
    setProfile(p => ({ ...p, name }));
  }} />;
}
```
`profile.name = '새 이름'; setProfile(profile);`은 동일한 객체 참조를 넘기므로 렌더링이 생략될 수 있으며 이전 상태도 오염시킨다.
참고: https://react.dev/learn/updating-objects-in-state

## 9. 배열 State 업데이트
배열에 항목을 추가할 때 전개 문법, 삭제할 때 filter, 특정 항목을 수정할 때 map을 사용하면 새 배열을 만들 수 있다. 배열 안 객체를 수정할 때에도 해당 객체를 새로 생성한다.

```jsx
import { useState } from 'react';
export default function TaskList() {
  const [tasks, setTasks] = useState([{ id: 1, title: 'JSX', done: false }]);
  function toggle(id) {
    setTasks(old => old.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id) {
    setTasks(old => old.filter(t => t.id !== id));
  }
  return <ul>{tasks.map(t => <li key={t.id}>
    <button onClick={() => toggle(t.id)}>{t.done ? '완료' : '진행'}: {t.title}</button>
    <button onClick={() => remove(t.id)}>삭제</button>
  </li>)}</ul>;
}
```
`push`, `splice`, `sort` 등으로 상태 배열 자체를 변경하지 않는다. 정렬이 필요하면 `[...items].sort(compare)`처럼 복사 후 처리한다.
참고: https://react.dev/learn/updating-arrays-in-state

## 10. 초기값과 불필요한 상태
초기 계산이 비싸면 `useState(createInitialValue)`처럼 초기화 함수를 전달할 수 있다. 초기화 함수에는 부수 효과를 넣지 않는다. 기존 Props나 State만으로 계산할 수 있는 값은 일반 변수로 계산하는 편이 상태 중복을 피하기 쉽다. 예를 들어 `const total = items.length`로 충분하다면 total을 별도 State로 저장할 이유가 없다.
참고: https://react.dev/reference/react/useState

## 11. 추가 FAQ: State와 useState
- Q. setState 직후 console.log에 이전 값이 나오는 이유는? A. 현재 핸들러는 현재 렌더링의 스냅샷을 사용한다.
- Q. 연속 세 번 증가시키는 방법은? A. 이전 값에 의존하는 업데이트 함수 세 개를 전달한다.
- Q. 객체의 일부 값만 수정하면 나머지 값은 자동 유지되나요? A. useState의 setter는 값을 교체하므로 전개 문법 등으로 유지할 속성을 포함한다.
- Q. 배열 push 후 setter를 호출해도 되나요? A. 기존 배열을 변경하지 않고 새 배열로 교체한다.
- Q. 동일한 값을 setter에 넣으면 어떻게 되나요? A. React는 Object.is 비교 결과가 같으면 업데이트에 따른 렌더링을 생략할 수 있다.
- Q. useState를 if 안에서 호출하면 안 되는 이유는? A. React는 호출 순서를 이용해 Hook 상태를 연결하므로 매 렌더링에서 순서를 유지해야 한다.


## 공식 문서 출처 및 이용 안내
- https://react.dev/learn/state-a-components-memory
- https://react.dev/learn/state-as-a-snapshot
- https://react.dev/learn/queueing-a-series-of-state-updates
- https://react.dev/learn/updating-objects-in-state
- https://react.dev/learn/updating-arrays-in-state
- https://react.dev/reference/react/useState

React 공식 문서(react.dev, React 문서 기여자)를 참고해 한국어로 요약·재구성한 학습 자료입니다. 코드 예시는 과제용으로 새로 작성했습니다. 공식 문서의 라이선스: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). 원문 라이선스: https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md
