import { isLocalhost } from '../api/nongsaro';
import { useNongsaroAPI } from '../hooks/useNongsaroAPI';

const Home = () => {
  const { apiData, loading, error, apiLoadingAreaRef, apiResultAreaRef } = useNongsaroAPI();

  return (
    <div>
      <h1>Home</h1>

      {loading && <p>데이터를 불러오는 중...</p>}

      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffe6e6',
          padding: '15px',
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* 로컬 환경 안내 */}
      {isLocalhost() && (
        <div style={{
          backgroundColor: '#e7f3ff',
          padding: '15px',
          borderRadius: '5px',
          margin: '10px 0',
          border: '1px solid #2196F3'
        }}>
          <strong>ℹ️ 로컬 개발 모드</strong>
          <p style={{ margin: '10px 0 0 0' }}>
            현재 localhost에서 실행 중입니다. API는 배포 환경에서만 호출됩니다.
            <br />
            <strong>테스트:</strong> GitHub Pages에 배포하여 테스트하세요.
          </p>
        </div>
      )}

      {/* API 결과 영역 */}
      <div id="nongsaroApiLoadingArea" ref={apiLoadingAreaRef}></div>
      <div id="nongsaroApiLoadingAreaResult" ref={apiResultAreaRef}></div>

      {/* API 데이터 표시 */}
      {apiData && (
        <div>
          <h2>API 결과:</h2>
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            {apiData}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Home;
