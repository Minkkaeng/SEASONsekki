import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import { setupNongsaroAPI, isLocalhost } from './api/nongsaro';

function App() {
  useEffect(() => {
    // 농사로 API 초기화 (배포 환경에서만)
    setupNongsaroAPI()
      .then((initialized) => {
        if (initialized) {
          console.log('✅ 농사로 API 준비 완료');
        }
      })
      .catch((error) => {
        if (!isLocalhost()) {
          console.error('농사로 API 초기화 실패:', error);
        }
      });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
