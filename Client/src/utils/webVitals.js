
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { trackEvent } from './analytics';

function sendToAnalytics({ name, delta, value, id }) {
  trackEvent('web_vitals', {
    metric_name: name,
    metric_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    metric_id: id,
  });
}

export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
}

export function trackPageLoadTime() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        trackEvent('page_load_time', {
          load_time: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        });
      }
    });
  }
}

export function trackApiResponseTime(endpoint, responseTime) {
  trackEvent('api_response_time', {
    endpoint: endpoint,
    response_time: Math.round(responseTime),
  });
}
