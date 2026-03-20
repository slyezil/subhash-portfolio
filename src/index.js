import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ReactGA from 'react-ga4';
ReactGA.initialize('G-M10HLWVLQH');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);