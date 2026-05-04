import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 由于是Chrome扩展，直接挂载到body
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
