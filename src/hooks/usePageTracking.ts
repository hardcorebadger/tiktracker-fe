import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/services/mixpanel';

export const usePageTracking = (pageName: string) => {
  const location = useLocation();

  useEffect(() => {
    track('Viewed Page', {
      page: pageName,
      path: location.pathname,
      url: window.location.href,
      referrer: document.referrer || 'direct',
      search_query: location.search,
      hash: location.hash
    });
  }, [location, pageName]);
}; 