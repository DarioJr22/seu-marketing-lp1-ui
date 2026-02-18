/**
 * Google Analytics 4 Helper
 * Centraliza o envio de eventos customizados para o GA4
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Verifica se o GA está carregado e configurado
 */
function isGAReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && !!GA_MEASUREMENT_ID;
}

/**
 * Envia um evento customizado para o Google Analytics
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!isGAReady()) return;

  window.gtag('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  });
}

// ===== Eventos Específicos =====

/** Quando um lead é enviado pelo formulário de contato */
export function trackLeadSubmit(source: string): void {
  trackEvent('form_submit_lead', {
    event_category: 'engagement',
    event_label: source,
    source,
  });
}

/** Quando um agendamento é feito */
export function trackAppointmentSubmit(service: string): void {
  trackEvent('form_submit_appointment', {
    event_category: 'engagement',
    event_label: service,
    service,
  });
}

/** Quando um projeto do portfólio é visualizado */
export function trackPortfolioView(projectTitle: string, category: string): void {
  trackEvent('portfolio_view', {
    event_category: 'content',
    event_label: projectTitle,
    project_title: projectTitle,
    category,
  });
}

/** Cliques nos CTAs principais */
export function trackCTAClick(ctaName: string, location: string): void {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    cta_name: ctaName,
    location,
  });
}

/** Clique no widget WhatsApp */
export function trackWhatsAppClick(action: string): void {
  trackEvent('whatsapp_click', {
    event_category: 'engagement',
    event_label: action,
    action,
  });
}

/** Pageview customizado (complementar ao automático) */
export function trackPageView(pagePath: string, pageTitle: string): void {
  if (!isGAReady()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle,
  });
}
