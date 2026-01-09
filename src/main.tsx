import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Tente remover o .tsx aqui se estiver dando erro

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)