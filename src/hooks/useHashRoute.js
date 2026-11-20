import { useEffect, useState } from 'react';

// react-router 같은 외부 라우팅 라이브러리 없이, URL 해시(#경로)만으로 탭을 전환한다.
// 새로고침해도 같은 페이지가 유지되고, 공유 가능한 링크(#state 등)도 생긴다.
export function useHashRoute(defaultPath) {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || defaultPath);

  useEffect(() => {
    function onHashChange() {
      setPath(window.location.hash.slice(1) || defaultPath);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [defaultPath]);

  function navigate(next) {
    if (next !== path) {
      window.location.hash = next;
    }
    setPath(next);
  }

  return [path, navigate];
}
