import { ComponentType } from 'react';
import { usePageTracking } from '@/hooks/usePageTracking';

export const withPageTracking = <P extends object>(
  WrappedComponent: ComponentType<P>,
  pageName: string
) => {
  return function WithPageTracking(props: P) {
    usePageTracking(pageName);
    return <WrappedComponent {...props} />;
  };
}; 