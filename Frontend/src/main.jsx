import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import axios from "axios"; // Axios ko import kiya
import "./style.scss";

// 🌟 FIX: Global setting jo har ek frontend request ke sath automatically cookies transfer karegi
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);