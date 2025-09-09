
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

export const GTM_ID = 'GTM-XXXXXXX';

export const FB_PIXEL_ID = 'XXXXXXXXXXXXXXXXX';

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

export const trackFormSubmission = (formName) => {
  trackEvent('form_submit', {
    form_name: formName,
  });
};

export const trackSearch = (searchTerm) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

export const trackDownload = (fileName) => {
  trackEvent('file_download', {
    file_name: fileName,
  });
};
