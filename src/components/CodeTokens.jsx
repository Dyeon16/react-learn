// 코드 블록 안에서 문법 하이라이팅용으로 쓰는 작은 토큰 컴포넌트들.
// 디자인 캔버스 시안에서 쓴 색 그대로 사용한다 (GitHub Dark 계열).
export const Kw = ({ children }) => <span className="tok-keyword">{children}</span>;
export const Fn = ({ children }) => <span className="tok-func">{children}</span>;
export const Tag = ({ children }) => <span className="tok-tag">{children}</span>;
export const Comp = ({ children }) => <span className="tok-component">{children}</span>;
export const Attr = ({ children }) => <span className="tok-attr">{children}</span>;
export const Str = ({ children }) => <span className="tok-string">{children}</span>;
export const Num = ({ children }) => <span className="tok-number">{children}</span>;

export function CodeBlock({ children }) {
  return <pre className="code-block">{children}</pre>;
}
