
import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (ph) => {
            if (process.env.NODE_ENV === 'development') ph.opt_out_capturing();
        },
    });
}

export const Analytics = {
    track: (eventName: string, properties?: Record<string, unknown>) => {
        if (typeof window !== 'undefined') {
            posthog.capture(eventName, properties);
        }
    },
    identify: (userId: string, properties?: Record<string, unknown>) => {
        if (typeof window !== 'undefined') {
            posthog.identify(userId, properties);
        }
    },
};
