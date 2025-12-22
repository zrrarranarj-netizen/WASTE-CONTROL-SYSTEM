import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Initializes and mounts the React application.
 * Ensures the 'root' element exists in the DOM.
 */
const initApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("FATAL: Could not find root element with ID 'root'.");
    // Fallback attempt after a short delay for slow DOM engines (common in some older WebViews)
    setTimeout(() => {
      const retryElement = document.getElementById('root');
      if (retryElement) {
        const root = ReactDOM.createRoot(retryElement);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
      }
    }, 100);
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Ensure mounting happens after the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}