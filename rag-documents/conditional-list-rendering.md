# 조건부 렌더링과 리스트 렌더링

## 학습 목표
- 조건에 따라 UI를 다르게 표시한다.
- 배열 데이터를 `map()`으로 목록으로 표시한다.
- React의 `key` 속성이 필요한 이유를 이해한다.

## 1. 조건부 렌더링이란?
조건부 렌더링은 어떤 조건이 참인지 거짓인지에 따라 다른 JSX를 표시하는 방법이다. JavaScript의 `if`, 삼항 연산자(`? :`), 논리 AND(`&&`) 등을 사용할 수 있다.

```jsx
function LoginStatus({ isLoggedIn }) {
  if (isLoggedIn) {
    return <p>로그인 상태입니다.</p>;
  }
  return <p>로그인이 필요합니다.</p>;
}
```

두 UI 중 하나를 간단히 고르고 싶을 때는 삼항 연산자를 쓸 수 있다.

```jsx
function AccessLabel({ isAdmin }) {
  return <strong>{isAdmin ? '관리자' : '일반 사용자'}</strong>;
}
```

조건이 참일 때만 표시하고 싶다면 `&&`를 사용할 수 있다.

```jsx
function Notice({ hasUnread }) {
  return <div>{hasUnread && <span>읽지 않은 알림이 있습니다.</span>}</div>;
}
```

숫자 0처럼 화면에 표시될 수 있는 값을 `&&` 왼쪽에 그대로 쓰면 의도치 않게 `0`이 렌더링될 수 있다. 이때는 `count > 0 && ...`처럼 명시적인 불리언 조건을 사용한다.

## 2. 리스트 렌더링이란?
리스트 렌더링은 배열의 항목들을 UI로 변환해서 반복 표시하는 것이다. JavaScript 배열 메서드 `map()`을 주로 사용한다.

```jsx
const lessons = [
  { id: 'a', title: 'Props' },
  { id: 'b', title: 'State' },
  { id: 'c', title: 'Effect' }
];

export default function LessonList() {
  return (
    <ul>
      {lessons.map(lesson => (
        <li key={lesson.id}>{lesson.title}</li>
      ))}
    </ul>
  );
}
```

## 3. key는 왜 필요한가?
`key`는 React가 목록의 항목을 서로 구분하도록 돕는 식별자다. 목록의 순서가 바뀌거나 항목이 추가·삭제될 때 React가 어떤 요소인지 판단하는 데 사용된다. 일반적으로 데이터의 고유 ID를 사용하는 것이 좋다.

- `key`는 같은 목록 안의 형제 요소 사이에서 고유해야 한다.
- 매번 `Math.random()`으로 새 `key`를 만들면 항목을 안정적으로 식별하기 어렵다.
- 목록이 재정렬되거나 수정될 수 있다면 배열 인덱스를 `key`로 쓰는 것을 피한다.
- `key`는 React 내부 식별용이다. 컴포넌트에서 ID가 필요하면 별도 Props로 전달한다.

## 4. filter와 map을 함께 사용하기
조건에 맞는 항목만 먼저 고른 후 화면에 표시할 수 있다.

```jsx
const items = [
  { id: 1, name: 'React', completed: true },
  { id: 2, name: 'Node', completed: false },
  { id: 3, name: 'JSX', completed: true }
];

export default function CompletedList() {
  const completed = items.filter(item => item.completed);
  return (
    <ul>
      {completed.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

## 5. 실수하기 쉬운 부분
- `map()`으로 만든 JSX 목록에 안정적인 `key`를 제공한다.
- `filter()`는 배열에서 조건을 만족하는 항목을 선택하고, `map()`은 각 항목을 JSX로 변환한다.
- 조건부로 아예 아무것도 표시하지 않을 때는 `null`을 반환할 수 있다.

## 6. null과 빈 목록 처리
조건이 맞지 않을 때 컴포넌트에서 null을 반환하면 표시할 JSX가 없다. 반면 목록이 비어 있을 때는 사용자에게 빈 상태를 안내하는 UI를 제공할 수 있다. 목록 로딩 상태와 빈 결과 상태를 구별하면 화면의 의미가 명확해진다.

```jsx
function Results({ loading, courses }) {
  if (loading) return <p>불러오는 중...</p>;
  if (courses.length === 0) return <p>검색 결과가 없습니다.</p>;
  return <ul>{courses.map(c => <li key={c.id}>{c.title}</li>)}</ul>;
}
```
참고: https://react.dev/learn/conditional-rendering

## 7. map 콜백의 반환값
화살표 함수에서 표현식을 바로 사용하면 값이 반환된다. 함수 본문을 중괄호로 작성한다면 return을 명시해야 한다. 예를 들어 `items.map(item => { <li>{item.name}</li>; })`는 JSX를 반환하지 않아 목록이 보이지 않는다.

```jsx
function CourseList({ items }) {
  return <ul>{items.map(item => {
    return <li key={item.id}>{item.name}</li>;
  })}</ul>;
}
```
참고: https://react.dev/learn/rendering-lists

## 8. 여러 요소를 한 항목으로 묶기
목록 한 항목이 여러 태그로 구성되면 부모 요소로 묶거나 명시적인 Fragment에 key를 지정한다. 짧은 Fragment 문법 `<>...</>`는 key를 지정할 수 없다.

```jsx
import { Fragment } from 'react';
export default function Glossary({ terms }) {
  return <dl>{terms.map(term => (
    <Fragment key={term.id}>
      <dt>{term.word}</dt>
      <dd>{term.meaning}</dd>
    </Fragment>
  ))}</dl>;
}
```
참고: https://react.dev/learn/rendering-lists

## 9. index와 안정적인 key의 차이
key는 화면 위치가 아닌 항목의 정체성을 나타내야 한다. 목록 맨 앞에 새 항목이 삽입되면 index는 기존 항목에도 다른 번호를 할당한다. 상태가 있는 입력창을 목록에 표시할 때 잘못된 key를 사용하면 입력 내용이 다른 항목에 연결된 것처럼 보일 수 있다. 데이터 ID를 사용하면 순서가 바뀌어도 같은 항목을 식별할 수 있다. 새 항목 ID는 데이터를 생성할 때 부여하고 렌더링 중에 매번 생성하지 않는다.

```jsx
function LessonRow({ lessonId, title }) {
  return <li><label>{title}<input name={`note-${lessonId}`} /></label></li>;
}
function LessonList({ lessons }) {
  return <ul>{lessons.map(l => (
    <LessonRow key={l.id} lessonId={l.id} title={l.title} />
  ))}</ul>;
}
```
참고: https://react.dev/learn/rendering-lists

## 10. 조건과 목록을 연결한 실습
검색 문자열로 목록을 필터링하고, 조건에 따라 빈 상태 또는 결과를 반환한다. 필터 결과는 원본 자료와 검색어로 계산 가능하므로 별도 Effect로 복사하지 않는다.

```jsx
import { useState } from 'react';
const lessons = [{ id: 'p', title: 'Props' }, { id: 's', title: 'State' }, { id: 'e', title: 'Effect' }];
export default function LessonSearch() {
  const [query, setQuery] = useState('');
  const matches = lessons.filter(l => l.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <section>
    <input aria-label="개념 검색" value={query} onChange={e => setQuery(e.target.value)} />
    {matches.length === 0 ? <p>일치하는 개념이 없습니다.</p> :
      <ul>{matches.map(l => <li key={l.id}>{l.title}</li>)}</ul>}
  </section>;
}
```
이 예제는 공식 문서의 필터링과 조건부 표현 개념을 조합한 자체 작성 실습이다.

## 11. 추가 FAQ: 조건부·리스트 렌더링
- Q. 조건이 false면 아무것도 보여주고 싶지 않아요. A. 조건부 표현 또는 null 반환을 사용한다.
- Q. count && JSX에서 0이 표시되는 이유는? A. JavaScript의 AND 결과가 숫자 0이면 React는 그 숫자를 화면에 표시한다.
- Q. map과 filter는 무슨 차이인가요? A. filter는 조건에 맞는 항목을 고르고 map은 각각을 다른 값으로 변환한다.
- Q. key는 전역에서 유일해야 하나요? A. 같은 목록의 형제 사이에서 고유하면 된다.
- Q. key 값을 자식에서 읽을 수 있나요? A. React 내부용 속성이므로 ID가 필요하면 별도 Props를 전달한다.
- Q. map에서 중괄호를 사용했더니 아무것도 표시되지 않아요. A. 콜백에 return이 있는지 확인한다.


## 공식 문서 출처 및 이용 안내
- https://react.dev/learn/conditional-rendering
- https://react.dev/learn/rendering-lists

React 공식 문서(react.dev, React 문서 기여자)를 참고해 한국어로 요약·재구성한 학습 자료입니다. 코드 예시는 과제용으로 새로 작성했습니다. 공식 문서의 라이선스: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). 원문 라이선스: https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md
