import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);