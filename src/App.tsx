import { Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { TalkDetail } from './pages/TalkDetail';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/slide/:id" element={<TalkDetail />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
