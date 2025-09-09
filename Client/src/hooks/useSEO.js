import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackWebVitals } from '../utils/analytics';


export const useSEO = (pageData = {}) => {
  const location = useLocation();

  useEffect(() => {
    const title = pageData.title || document.title;
    trackPageView(location.pathname, title);

    if (typeof window !== 'undefined') {
      trackWebVitals();
    }

    if (pageData.title) {
      document.title = pageData.title;
    }


    window.scrollTo(0, 0);
  }, [location.pathname, pageData.title]);
};


export const useUserTracking = () => {
  const trackClick = (elementName, additionalData = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        element_name: elementName,
        ...additionalData
      });
    }
  };

  const trackFormStart = (formName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_start', {
        form_name: formName
      });
    }
  };

  const trackFormComplete = (formName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_complete', {
        form_name: formName
      });
    }
  };

  const trackSearch = (searchTerm, resultCount = 0) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        result_count: resultCount
      });
    }
  };

  return {
    trackClick,
    trackFormStart,
    trackFormComplete,
    trackSearch
  };
};


export const useErrorTracking = () => {
  useEffect(() => {
    const handleError = (error) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason);
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
};
