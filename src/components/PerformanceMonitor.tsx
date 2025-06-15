'use client'

import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    const measurePerformance = () => {
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const metrics: Partial<PerformanceMetrics> = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        };

        // Get paint metrics
        paint.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        // Get LCP if available
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.largestContentfulPaint = lastEntry.startTime;
            
            // Log performance metrics in development for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log('Performance Metrics:', metrics);
            }
            
            observer.disconnect();
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Send metrics to analytics (if you add analytics later)
        // sendToAnalytics(metrics);
      } else {
        // Wait for load event
        window.addEventListener('load', measurePerformance, { once: true });
      }
    };

    measurePerformance();
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
