import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { FeatureFlagsProvider } from './hooks/useFeatureFlags';

/**
 * Application entry point.
 * StrictMode is enabled to surface potential issues during development.
 */
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root not found. Check index.html.');
}

createRoot(root).render(
  <StrictMode>
    <FeatureFlagsProvider>
      <App />
    </FeatureFlagsProvider>
  </StrictMode>
);
