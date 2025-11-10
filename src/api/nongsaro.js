/**
 * 농사로 API 관리
 */

// API 설정
const API_CONFIG = {
  apiKey: "20251110ZVNVMTCVO8WOHEZTSVUW",
  serviceName: "localSpcprd",
  operationName: "selectAreaSidoLst",
  htmlArea: "nongsaroApiLoadingArea"
};

/**
 * 로컬 환경인지 확인
 */
export const isLocalhost = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

/**
 * 스크립트가 로드될 때까지 대기
 * @param {Function} callback - 성공 시 호출되는 콜백 함수
 * @param {number} maxRetries - 최대 재시도 횟수
 * @param {number} currentRetry - 현재 재시도 횟수
 */
export const waitForScript = (callback, maxRetries = 10, currentRetry = 0) => {
  if (typeof window.nongsaroOpenApiRequest !== 'undefined') {
    callback();
  } else {
    const nextRetry = currentRetry + 1;
    if (nextRetry < maxRetries) {
      setTimeout(() => waitForScript(callback, maxRetries, nextRetry), 500);
    } else {
      console.error('nongsaroOpenApiRequest가 로드되지 않았습니다.');
      throw new Error('농사로 API 라이브러리가 로드되지 않았습니다.');
    }
  }
};

/**
 * 농사로 API 초기화
 */
export const initNongsaroAPI = () => {
  if (typeof window.nongsaroOpenApiRequest === 'undefined') {
    return false;
  }

  // API 설정
  window.nongsaroOpenApiRequest.apiKey = API_CONFIG.apiKey;
  window.nongsaroOpenApiRequest.serviceName = API_CONFIG.serviceName;
  window.nongsaroOpenApiRequest.operationName = API_CONFIG.operationName;
  window.nongsaroOpenApiRequest.htmlArea = API_CONFIG.htmlArea;
  window.nongsaroOpenApiRequest.callback = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');

  return true;
};

/**
 * 농사로 API 호출
 * 참고: openapi_nongsaro.js가 document.ready에서 자동으로 actionNongsaroOpenApi()를 호출함
 * 따라서 설정만 완료하면 자동으로 API가 호출됨
 */
export const callNongsaroAPI = () => {
  if (typeof window.nongsaroOpenApiRequest === 'undefined') {
    throw new Error('농사로 API가 초기화되지 않았습니다.');
  }

  // openapi_nongsaro.js는 document.ready에서 자동으로 actionNongsaroOpenApi()를 호출함
  // 따라서 명시적으로 호출할 필요가 없지만, 혹시 모를 경우를 대비해 시도
  if (typeof window.actionNongsaroOpenApi === 'function') {
    window.actionNongsaroOpenApi();
  } else {
    // openapi_nongsaro.js가 자동으로 호출하므로 로그만 남김
    console.log('농사로 API 설정 완료. openapi_nongsaro.js가 자동으로 호출합니다.');
  }
};

/**
 * 농사로 API 초기화 및 준비
 * @returns {Promise<boolean>} 초기화 성공 여부
 */
export const setupNongsaroAPI = () => {
  return new Promise((resolve, reject) => {
    // 로컬 환경에서는 초기화하지 않음
    if (isLocalhost()) {
      console.log('로컬 환경: API 초기화를 건너뜁니다.');
      resolve(false);
      return;
    }

    try {
      // 스크립트 로드 대기
      waitForScript(() => {
        // API 초기화
        const initialized = initNongsaroAPI();
        if (initialized) {
          console.log('농사로 API 초기화 완료');
          resolve(true);
        } else {
          reject(new Error('농사로 API 초기화 실패'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

