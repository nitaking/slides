import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import './pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './index.css';

import { App } from './App';
import { AgentationToolbar } from './components/AgentationToolbar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* GitHub Pages でのリロード 404 を避けるため HashRouter を採用 */}
    <HashRouter>
      <App />
      <AgentationToolbar />
    </HashRouter>
  </StrictMode>,
);
