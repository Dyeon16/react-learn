# Effect와 useEffect

## 학습 목표
- Effect가 필요한 상황을 알아본다.
- `useEffect`의 의존성 배열과 정리(cleanup) 함수를 설명한다.
- 이벤트 처리와 Effect의 차이를 이해한다.

## 1. Effect란?
Effect는 React 컴포넌트를 React 바깥의 시스템과 동기화할 때 사용하는 기능이다. 예를 들면 브라우저 타이머, 외부 라이브러리, 연결·구독 설정 등이 있다. 일반적인 화면 표시 로직은 렌더링에서 계산하고, 버튼 클릭에 직접 반응하는 로직은 이벤트 핸들러에서 처리한다. 모든 코드에 `useEffect`가 필요한 것은 아니다.

## 2. useEffect 기본 문법
다음 예제는 타이머를 설정하고, 컴포넌트가 사라질 때 타이머를 정리한다.

```jsx
import { useEffect, useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <p>경과 시간: {seconds}초</p>;
}
```

Effect 본문은 화면 변경이 반영된 뒤 실행된다. `return`으로 반환한 함수는 정리 함수로, Effect가 다시 실행되기 전 또는 컴포넌트가 사라질 때 호출되어 이전 작업을 정리한다.

## 3. 의존성 배열의 의미
- `useEffect(() => { ... })`: 렌더링 결과가 반영될 때마다 실행된다.
- `useEffect(() => { ... }, [])`: 일반적으로 마운트 때 설정하고 언마운트 때 정리한다. 개발 모드의 Strict Mode에서는 설정·정리를 추가로 시험할 수 있다.
- `useEffect(() => { ... }, [roomId])`: 처음 렌더링한 뒤 실행되고 이후 `roomId` 값이 달라지면 정리 후 다시 실행된다.

```jsx
useEffect(() => {
  document.title = `현재 페이지: ${pageName}`;
}, [pageName]);
```

Effect에서 읽는 반응형 값은 일반적으로 의존성 배열에 포함해야 한다. 의존성 배열을 단순히 비워서 경고를 없애려고 하면 오래된 값을 참조하는 문제가 생길 수 있다.

## 4. Effect가 필요하지 않은 경우
State나 Props만으로 계산할 수 있는 값을 다른 State에 복사하기 위해 Effect를 만들 필요는 없는 경우가 많다.

```jsx
function FullName({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;
  return <p>{fullName}</p>;
}
```

이 경우에는 `fullName`을 매번 계산하면 되고 별도 `useEffect`나 State를 만들 필요가 없다.

## 5. 주의할 점
- Effect 안에서 상태를 무조건 반복 변경하면 불필요한 재렌더링이나 무한 반복이 생길 수 있다.
- 타이머, 구독, 연결 같은 작업은 정리 함수를 통해 해제할 수 있도록 만든다.
- 개발 환경의 Strict Mode에서 Effect가 추가 실행되는 현상은 정리 로직을 점검하기 위한 동작일 수 있다.
- 사용자가 버튼을 클릭해서 실행되는 동작은 우선 이벤트 핸들러로 작성할 수 있는지 확인한다.

## 6. 의존성 배열은 실행 횟수 지정 버튼이 아니다
Effect가 사용하는 Props, State, 컴포넌트 내부의 반응형 값은 의존성에 반영해야 한다. React는 각 의존성을 이전 값과 Object.is로 비교한다. 배열이나 객체를 렌더링마다 새로 생성하여 의존성으로 삼으면 내용이 같아도 다시 실행될 수 있다. 외부 연결에만 필요한 객체라면 Effect 안에서 만들 수 있다.

```jsx
import { useEffect } from 'react';
export default function RoomTitle({ roomId }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `학습방 ${roomId}`;
    return () => { document.title = previousTitle; };
  }, [roomId]);
  return <p>현재 학습방: {roomId}</p>;
}
```
참고: https://react.dev/learn/removing-effect-dependencies

## 7. 외부 이벤트 등록과 정리
브라우저 이벤트를 직접 구독해야 한다면 등록과 해제를 한 Effect에 묶는다. 다음 예제는 창 크기를 읽고 resize 이벤트가 발생할 때 갱신한다. 컴포넌트 제거 시 동일한 핸들러를 해제한다.

```jsx
import { useState, useEffect } from 'react';
export default function WindowWidth() {
  const [width, setWidth] = useState(null);
  useEffect(() => {
    function updateWidth() { setWidth(window.innerWidth); }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return <p>창 너비: {width ?? '측정 중'} px</p>;
}
```
이 예제는 브라우저에서 실행되는 학습용 코드다. 실제 외부 저장소 구독에는 React의 전용 Hook을 검토할 수도 있다.
참고: https://react.dev/learn/synchronizing-with-effects

## 8. 데이터 요청과 이전 응답 무시
검색어나 ID 변경에 따라 외부 API에서 데이터를 가져오는 경우, 이전 요청이 더 늦게 완료되어 화면을 덮어쓰지 않도록 주의한다. 다음 예제는 실제 서비스 API 경로가 아니라 예시 `/api/lessons/`를 사용한다. 정리 함수에서 이전 요청의 결과를 무시한다.

```jsx
import { useEffect, useState } from 'react';
export default function Lesson({ id }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let ignore = false;
    setData(null);
    setError('');
    async function load() {
      try {
        const res = await fetch(`/api/lessons/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('요청 실패');
        const result = await res.json();
        if (!ignore) setData(result);
      } catch (err) {
        if (!ignore) setError(err.message);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);
  return <p>{error || data?.title || '불러오는 중'}</p>;
}
```
실제 앱에서는 프레임워크의 데이터 로딩이나 캐시 도구가 더 적절할 수 있다. Effect 콜백 자체를 async 함수로 만들면 Promise가 반환되므로 정리 함수 반환 규칙과 맞지 않는다. 위처럼 내부 async 함수를 사용한다.
참고: https://react.dev/reference/react/useEffect

## 9. 무한 반복과 불필요한 Effect 진단
Effect에서 상태를 설정하고 그 상태 변경이 다시 같은 Effect의 의존성을 바꾸면 반복 실행될 수 있다. 예를 들어 `useEffect(() => setCount(count + 1), [count])`는 count가 계속 바뀌므로 종료 조건 없이 반복된다. 버튼 클릭 횟수를 늘리려는 목적이라면 이벤트 핸들러에서 처리한다. 목록 필터링처럼 기존 값으로 계산 가능한 결과는 렌더링 중 계산한다.

```jsx
function LessonFilter({ lessons, keyword }) {
  const visible = lessons.filter(l => l.title.includes(keyword));
  return <p>검색 결과 {visible.length}개</p>;
}
```
참고: https://react.dev/learn/you-might-not-need-an-effect

## 10. 추가 FAQ: Effect와 useEffect
- Q. 빈 배열이면 무조건 한 번만 실행되나요? A. 마운트마다 설정되며 개발 Strict Mode에서 추가 설정·정리 검사가 일어날 수 있다.
- Q. cleanup은 언마운트 때만 실행되나요? A. 의존성 변경으로 다음 설정을 시작하기 전에도 이전 정리 함수가 실행된다.
- Q. 클릭할 때 서버에 저장하려면 Effect가 필요한가요? A. 클릭 자체가 원인이라면 이벤트 핸들러에서 처리하는 것이 적절하다.
- Q. 의존성 경고를 없애기 위해 배열을 비워도 되나요? A. 실제로 읽는 반응형 값이 남아 있다면 오래된 값을 사용하는 문제가 생긴다.
- Q. 의존성에 객체가 있으면 왜 자꾸 실행되나요? A. 렌더링마다 새 객체를 생성하면 참조가 달라질 수 있다.
- Q. Effect에서 반환하는 값은 무엇인가요? A. 필요한 경우 정리 함수를 반환하며, 정리할 것이 없다면 반환하지 않는다.


## 공식 문서 출처 및 이용 안내
- https://react.dev/learn/synchronizing-with-effects
- https://react.dev/learn/you-might-not-need-an-effect
- https://react.dev/learn/removing-effect-dependencies
- https://react.dev/learn/lifecycle-of-reactive-effects
- https://react.dev/reference/react/useEffect

React 공식 문서(react.dev, React 문서 기여자)를 참고해 한국어로 요약·재구성한 학습 자료입니다. 코드 예시는 과제용으로 새로 작성했습니다. 공식 문서의 라이선스: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). 원문 라이선스: https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md
