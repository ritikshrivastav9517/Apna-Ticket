// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { StrictMode } from 'react';
// import App from './App.jsx';
// import './index.css';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AuthProvider from './context/AuthContext.jsx'; // AuthProvider import karein

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* App ko wrap karein */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)