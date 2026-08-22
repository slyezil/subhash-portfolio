import ReactGA from 'react-ga4';

export const GA_ENABLED = Boolean(import.meta.env.VITE_GA_ID);

export function initializeAnalytics() {
  if (!GA_ENABLED) return;
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

export function sendPageView(path, title) {
  if (!GA_ENABLED) return;
  ReactGA.send({ hitType: 'pageview', page: path, title });
}
