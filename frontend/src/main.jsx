import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { IdeasProvider } from './context/IdeasContext.jsx';
import './styles/app.css';
import './registerServiceWorker.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IdeasProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IdeasProvider>
  </StrictMode>,
);
