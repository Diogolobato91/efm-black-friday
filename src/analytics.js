// Intent instrumentation only. No provider, cookie, storage or network request.
const eventNames = new Set(['language_select', 'plan_select', 'rhythm_select', 'whatsapp_click']);
const sections = new Set([
  'header', 'hero', 'benefits', 'bonus', 'malta', 'how-it-works', 'plans',
  'referral', 'faq', 'final', 'sticky', 'footer', 'plan-finder', 'selected-plan', 'sticky-desktop',
]);
const languages = new Set(['english', 'spanish']);
const plans = new Set(['basic', 'pro', 'premium']);
let analyticsConsent = false;

/** Consent is transient and denied by default; granting does not replay events. */
export function setAnalyticsConsent(granted) {
  analyticsConsent = granted === true;
}

/**
 * Emits one local event per explicit UI action. Returns false for invalid input.
 * Strict allowlists prevent accidental inclusion of free text, URLs or PII.
 * Call once from the owning interaction handler, never from both link and parent.
 */
export function trackEvent(name, properties = {}) {
  if (!properties || !eventNames.has(name)
    || !sections.has(properties.section)
    || !languages.has(properties.language)
    || !plans.has(properties.plan)
    || (name === 'rhythm_select' && properties.section !== 'plan-finder')) return false;

  const payload = Object.freeze({
    event: name,
    section: properties.section,
    language: properties.language,
    plan: properties.plan,
  });

  if (typeof window === 'undefined') return false;

  // Instrumentation failure must never block the WhatsApp link or UI state.
  try {
    window.dispatchEvent(new CustomEvent('efm:analytics', { detail: payload }));
  } catch {
    // CustomEvent is optional in non-browser rendering/test environments.
  }

  if (analyticsConsent && Array.isArray(window.dataLayer)) {
    try {
      window.dataLayer.push({ ...payload });
    } catch {
      // An external integration cannot interrupt the conversion path.
    }
  }
  return true;
}
