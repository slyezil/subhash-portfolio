import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendPageView } from '../analytics';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    sendPageView(location.pathname + location.search, document.title);
  }, [location]);
};

export default usePageTracking;
