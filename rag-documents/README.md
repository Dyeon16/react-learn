# React RAG 학습 문서 확장판

## 업로드 방법
- `documents/` 안의 Markdown 5개와 `.metadata.json` 5개만 RAG 원본 S3 버킷의 기존 데이터 소스 경로에 올립니다. 이 README는 업로드하지 않습니다.
- 파일 이름은 기존 자료와 동일합니다. 기존 파일을 같은 S3 키로 덮어쓴 뒤 Knowledge Bases에서 Sync를 실행합니다. 다른 경로로 중복 업로드하지 마세요.
- CLI 예시: `aws s3 sync ./documents/ s3://YOUR-BUCKET/YOUR-PREFIX/ --region ap-northeast-2` (버킷 및 prefix 교체).
- 임베딩 및 검색 테스트 후 프런트엔드 연결을 진행합니다.

## 출처 처리
AWS S3 데이터 소스의 공식 간편 메타데이터 형식(문자열 값)을 사용합니다. 기존 title, topic, source_url 필드는 유지했습니다. source_url은 대표 링크이고 source_urls는 참고한 여러 공식 페이지를 ` | `로 구분한 문자열입니다. 프런트엔드에서 여러 링크를 표시하려면 구분자로 분리하세요. 개별 문서 조각별 정확한 링크가 자동 보장되지는 않으므로 대표 링크를 유일한 근거라고 표시하지 말고 참고한 주제 문서의 공식 자료로 표시하세요. 각 본문에도 세부 주제별 참고 링크와 라이선스 안내를 넣었습니다.

AWS 참고: https://docs.aws.amazon.com/bedrock/latest/userguide/s3-data-source-connector.html
React 문서 라이선스: https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md

## 검색 테스트 질문 (업로드하지 않는 관리자용)
| 질문 | 기대 근거 |
|---|---|
| Props로 함수를 전달할 수 있나요? | components-props / event-handling |
| JSX에서 여러 태그를 반환하려면? | components-props |
| setCount(count+1)을 세 번 실행하면? | state-usestate |
| 상태 배열 안 객체를 수정하려면? | state-usestate |
| useEffect cleanup은 언제 동작해? | effect-useeffect |
| useEffect가 무한 실행되는 이유는? | effect-useeffect |
| 체크박스의 값을 읽으려면? | event-handling |
| preventDefault와 stopPropagation 차이는? | event-handling |
| 목록의 key에 index를 쓰면 어떤 문제가 생겨? | conditional-list-rendering |
| map을 썼는데 화면에 아무것도 안 나와요 | conditional-list-rendering |
| Next.js App Router 설정 방법은? | 범위 밖: 답변 불가 안내 |
| AWS EC2 인스턴스 생성 방법은? | 범위 밖: 답변 불가 안내 |

검색 결과와 인용 메타데이터, 코드의 정확성을 확인합니다. 코드 예시는 독립 실습용이며 일부 함수 조각은 해당 절의 설명과 함께 사용해야 합니다. AWS 실제 동기화 및 브라우저 실행은 아직 검증하지 않았습니다.
