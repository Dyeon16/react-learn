# react-learn 백엔드 (RAG)

기획서 구성: CloudFront `/api/*` → API Gateway(HTTP API, Throttling) → Lambda → Bedrock Knowledge Bases
(Titan Text Embeddings V2 + S3 Vectors) → Claude Haiku 4.5 (global 추론 프로파일)

| 리소스 | 이름 / ID |
|---|---|
| 웹사이트 버킷 (private, OAC) | `react-learn-web-917246555749` |
| CloudFront | `E1W2R37PLAMJ4T` (`d3d4mgek5e8eo7.cloudfront.net`), OAC `E1GZV0SEFAHR9Q` |
| RAG 문서 버킷 (private) | `react-learn-rag-docs-917246555749` (prefix `documents/`) |
| S3 Vectors | 버킷 `react-learn-vectors` / 인덱스 `react-learn-react-docs` (1024, cosine) |
| Knowledge Base | `react-learn-kb` = `CQDAFOUMG8`, 데이터 소스 `react-learn-docs` = `XSE09RONPJ` |
| IAM 역할 | `react-learn-kb-role`, `react-learn-api-role` (정책: `iam/`) |
| Lambda | `react-learn-api` (Node.js 22, arm64) — 코드: `api/index.mjs` |
| HTTP API | `react-learn-api` = `maxu6ee1q7`, `POST /api/chat`, `$default` 스로틀 2 rps / burst 5 |
| CloudWatch | 대시보드 `react-learn-dashboard` (`monitoring/dashboard.json`), 로그 `/aws/lambda/react-learn-api` |

## API

`POST /api/chat` `{"question": "..."}` (1~500자)

- 200 `{"answer", "sources": [{"title","url"}], "grounded"}` — 근거가 없으면 `grounded:false`와 고정 안내 문구
- 400 입력 오류 · 429 요청 제한 · 500 서버 오류
- CloudFront가 붙이는 `x-origin-verify` 헤더가 없으면 403 (execute-api 직접 호출 차단)

## 운영 명령 (Git Bash)

```bash
export MSYS_NO_PATHCONV=1
AWS="/c/Program Files/Amazon/AWSCLIV2/aws"

# RAG 문서 갱신 → 동기화
"$AWS" s3 sync rag-documents/ s3://react-learn-rag-docs-917246555749/documents/ --exclude README.md --delete --region ap-northeast-2
"$AWS" bedrock-agent start-ingestion-job --knowledge-base-id CQDAFOUMG8 --data-source-id XSE09RONPJ --region ap-northeast-2

# Lambda 코드 배포
python -c "import zipfile;z=zipfile.ZipFile('api.zip','w',zipfile.ZIP_DEFLATED);z.write('backend/api/index.mjs','index.mjs');z.close()"
"$AWS" lambda update-function-code --function-name react-learn-api --zip-file fileb://api.zip --region ap-northeast-2
```

`ORIGIN_VERIFY_SECRET`은 Lambda 환경 변수와 CloudFront 오리진 커스텀 헤더에만 있고 저장소에는 넣지 않는다.
