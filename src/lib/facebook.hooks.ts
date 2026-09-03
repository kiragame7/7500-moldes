import { useEffect } from 'react';
import { sendFacebookConversionEvent } from './facebook.functions';

export const useFacebookConversions = () => {
  const trackEvent = async (eventName: string, customData?: Record<string, any>) => {
    const eventId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // 1. Client-side Pixel Tracking (if fbq is available)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, customData, { eventID: eventId });
    }

    // 2. Server-side Conversions API Tracking
    try {
      const fbc = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1] : undefined;
      const fbp = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1] : undefined;

      await sendFacebookConversionEvent({
        data: {
          eventName,
          eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
          eventId,
          userData: {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            fbc,
            fbp,
          },
          customData,
        }
      });
    } catch (error) {
      console.error('Failed to send conversion event:', error);
    }
  };

  useEffect(() => {
    // track PageView automatically if desired, or let __root handle it.
    // Pixel PageView is handled in __root script, but CAPI PageView could be added here.
  }, []);

  return { trackEvent };
};
