declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn("Google Analytics Measurement ID no configurado");
    return;
  }

  // Cargar Google Analytics de forma diferida para no bloquear el renderizado
  const script1 = document.createElement("script");
  script1.async = true;
  script1.defer = true; // Agregar defer para cargar después del parse
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  // Usar requestIdleCallback si está disponible para cargar en tiempo libre
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        document.head.appendChild(script1);
      },
      { timeout: 2000 }
    );
  } else {
    // Fallback: cargar después de un pequeño delay
    setTimeout(() => {
      document.head.appendChild(script1);
    }, 100);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
};

export const trackPageView = (path: string, title?: string) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", eventName, eventParams);
};

export const trackConversion = (
  conversionName: string,
  value?: number,
  currency = "COP"
) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", "conversion", {
    send_to: GA_MEASUREMENT_ID,
    event_category: "conversion",
    event_label: conversionName,
    value: value,
    currency: currency,
  });
};

export const trackOutboundLink = (url: string, linkText?: string) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", "click", {
    event_category: "outbound",
    event_label: linkText || url,
    transport_type: "beacon",
  });
};

export const trackFormInteraction = (
  formName: string,
  action: "start" | "submit" | "error",
  errorMessage?: string
) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", "form_interaction", {
    event_category: "form",
    event_label: formName,
    action: action,
    ...(errorMessage && { error_message: errorMessage }),
  });
};

export const trackTimeOnPage = (timeInSeconds: number, pagePath: string) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", "timing_complete", {
    name: "time_on_page",
    value: Math.round(timeInSeconds * 1000),
    event_category: "engagement",
    event_label: pagePath,
  });
};

export const trackScrollDepth = (percentage: number, pagePath: string) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", "scroll", {
    event_category: "engagement",
    event_label: `${percentage}%`,
    value: percentage,
    page_path: pagePath,
  });
};
