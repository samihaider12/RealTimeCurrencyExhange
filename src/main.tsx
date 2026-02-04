import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import "./DataBase/fireBase";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AuthProvider>
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
   </AuthProvider>
);