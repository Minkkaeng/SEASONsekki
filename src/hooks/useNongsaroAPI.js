import { useEffect, useRef, useState } from 'react';
import { callNongsaroAPI, isLocalhost } from '../api/nongsaro';

/**
 * 농사로 API를 사용하는 커스텀 훅
 * @returns {Object} { apiData, loading, error, apiLoadingAreaRef, apiResultAreaRef }
 */
export const useNongsaroAPI = () => {
  const apiLoadingAreaRef = useRef(null);
  const apiResultAreaRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로컬 환경에서는 API 호출하지 않음
    if (isLocalhost()) {
      return;
    }

    let observer = null;
    let timeout = null;
    let isMounted = true;

    // DOM이 완전히 렌더링될 때까지 대기
    const ensureDOMReady = (callback) => {
      if (apiLoadingAreaRef.current) {
        callback();
      } else {
        // DOM이 준비될 때까지 대기
        setTimeout(() => {
          if (apiLoadingAreaRef.current) {
            callback();
          } else {
            console.warn('API 결과 영역을 찾을 수 없습니다.');
            if (isMounted) {
              setError('API 결과 영역을 찾을 수 없습니다.');
              setLoading(false);
            }
          }
        }, 100);
      }
    };

    // DOM이 준비된 후 실행
    ensureDOMReady(() => {
      try {
        setLoading(true);

        // API 호출
        callNongsaroAPI();
        console.log('농사로 API 호출 시작');

        // 결과 영역 변경 감지
        observer = new MutationObserver(() => {
          if (isMounted && apiLoadingAreaRef.current && apiLoadingAreaRef.current.innerHTML) {
            const htmlContent = apiLoadingAreaRef.current.innerHTML;
            if (htmlContent.trim()) {
              setApiData(htmlContent);
              setLoading(false);
            }
          }
        });

        if (apiLoadingAreaRef.current) {
          observer.observe(apiLoadingAreaRef.current, {
            childList: true,
            subtree: true
          });
        }

        // 타임아웃
        timeout = setTimeout(() => {
          if (isMounted) {
            setLoading(false);
            setError('API 응답 시간이 초과되었습니다.');
          }
        }, 5000);
      } catch (err) {
        console.error('농사로 API 호출 중 오류:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      if (observer) {
        observer.disconnect();
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return {
    apiData,
    loading,
    error,
    apiLoadingAreaRef,
    apiResultAreaRef
  };
};
