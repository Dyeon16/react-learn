// 페이지별 추천 질문 칩. 버튼 텍스트는 하드코딩이지만, 클릭하면 실제 /chat API로 전송된다.
export const STARTER_QUESTIONS = {
  start: [
    'React는 왜 써요?',
    '컴포넌트가 정확히 뭐예요?',
    'state가 바뀌면 왜 화면이 다시 그려져요?',
  ],
  components: [
    'Props는 자식 컴포넌트에서 바꿀 수 있어요?',
    'Props와 State의 차이는?',
    '컴포넌트 이름은 꼭 대문자여야 해요?',
  ],
  state: [
    'useState는 왜 비동기처럼 동작해요?',
    'useState와 useRef 차이는?',
    '상태 업데이트가 비동기인 이유는?',
  ],
  events: [
    'onClick={handleSave()}라고 쓰면 왜 안돼요?',
    'onClick={fn()}과 onClick={fn} 차이는?',
    '이벤트 전파는 어떻게 막아요?',
  ],
  conditional: [
    'key에 배열 인덱스를 써도 되나요?',
    'key는 왜 꼭 넣어야 해요?',
    'if문 대신 삼항연산자 꼭 써야 하나요?',
  ],
  effect: [
    '의존성 배열을 비워두면 어떻게 돼요?',
    'useEffect는 아무 때나 써도 되나요?',
    '의존성 배열을 비워두면 뭐가 달라져요?',
  ],
};
