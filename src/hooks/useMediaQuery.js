import { useEffect, useState } from 'react';

// CSS 미디어 쿼리와 같은 조건을 JS에서도 쓰기 위한 훅 (예: 좁은 화면에서만 챗봇을 서랍으로)
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
