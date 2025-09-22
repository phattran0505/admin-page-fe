import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlobalStyles from './GlobalStyles/GlobalStyles.jsx';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyles>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalStyles>
  </StrictMode>
);
