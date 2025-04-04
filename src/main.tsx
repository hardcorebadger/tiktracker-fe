import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initMixpanel } from './services/mixpanel';

// Initialize Mixpanel with token from environment variables
const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN;
if (!mixpanelToken) {
  console.warn('Mixpanel token not found in environment variables');
} else {
  initMixpanel(mixpanelToken);
}

createRoot(document.getElementById("root")!).render(<App />);
