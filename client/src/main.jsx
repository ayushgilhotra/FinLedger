import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#161d2e',
              color: '#e8edf5',
              border: '1px solid rgba(255,255,255,0.07)',
            },
            success: {
              iconTheme: {
                primary: '#0dd9c4',
                secondary: '#080c14',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4d6d',
                secondary: '#080c14',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
