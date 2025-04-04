import mixpanel from 'mixpanel-browser';

// Initialize mixpanel
export const initMixpanel = (token: string) => {
  mixpanel.init(token, {
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: 'localStorage',
    ignore_dnt: true
  });
};

// Track an event
export const track = (name: string, props?: Record<string, unknown>) => {
  console.log('Tracking event in Mixpanel:', name, props);
  mixpanel.track(name, props);
};

// Identify a user
export const identify = (userId: string) => {
  mixpanel.identify(userId);
};

// Set user properties
export const setUserProperties = (props: Record<string, unknown>) => {
  mixpanel.people.set(props);
};

// Reset user
export const reset = () => {
  mixpanel.reset();
};

// Opt out of tracking if needed (for GDPR compliance)
export const optOut = () => {
  mixpanel.opt_out_tracking();
};

// Opt back into tracking
export const optIn = () => {
  mixpanel.opt_in_tracking();
}; 