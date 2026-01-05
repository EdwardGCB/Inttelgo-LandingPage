import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  initGA,
  trackPageView,
  trackTimeOnPage,
  trackScrollDepth,
} from "@/lib/analytics";

/**
 * Hook para inicializar Google Analytics y rastrear cambios de página
 */
export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar GA solo una vez
    initGA();
  }, []);

  useEffect(() => {
    // Rastrear cada cambio de ruta
    if (location.pathname) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);
};

/**
 * Hook para rastrear tiempo en página
 */
export const usePageTimeTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = (Date.now() - startTime) / 1000; // en segundos
      if (timeSpent > 0) {
        trackTimeOnPage(timeSpent, location.pathname);
      }
    };
  }, [location.pathname]);
};

/**
 * Hook para rastrear profundidad de scroll
 */
export const useScrollTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackedDepths = new Set<number>();
    const scrollThresholds = [25, 50, 75, 90, 100];

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );

      scrollThresholds.forEach((threshold) => {
        if (scrollPercentage >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          trackScrollDepth(threshold, location.pathname);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
};
