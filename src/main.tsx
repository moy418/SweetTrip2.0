import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Validate configuration on startup
import { validateConfig } from './config'

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

try {
  validateConfig()
} catch (error) {
  console.error('Configuration validation failed:', error)
  // Show user-friendly error message
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Configuration Error</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">Please check your environment variables configuration.</p>
        <p style="color: #9ca3af; font-size: 0.875rem;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  `
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



