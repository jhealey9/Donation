// Required config keys — missing any will log a clear console error
export const REQUIRED_CONFIG_KEYS = ['presetAmounts', 'ctaStep1'];

export function validateConfig(config) {
  const missing = REQUIRED_CONFIG_KEYS.filter((key) => !(key in config));
  if (missing.length > 0) {
    console.error(
      `[DonationForm] Missing required config keys: ${missing.join(', ')}. ` +
        'Form may not function correctly. See documentation for the full config schema.'
    );
  }
}

// ─── Default configuration ───────────────────────────────────────────────────
// Every key here is overridable by passing a config prop to <DonationForm />.
// Marketers control all of these through their CMS config object — no code
// changes required for routine campaign updates.

const defaultConfig = {
  // ── Step 1: Giving Setup ──────────────────────────────────────────────────
  // 'monthly' makes monthly giving the default/hero choice (recommended)
  defaultFrequency: 'monthly',
  defaultAmount: 50,
  presetAmounts: [25, 50, 100, 250],

  // Impact lines: keyed by preset amount. Shown when that amount is selected.
  impactLines: {
    25: 'provides clean water for a family for 1 month',
    50: 'feeds 12 families for a month',
    100: "supports a child's education for a semester",
    250: 'funds a community health worker for 1 month',
  },

  // Fund options. Empty array = single auto-selected fund (selector hidden).
  // Example: [{ code: 'GEN', label: 'General Fund' }, { code: 'EDU', label: 'Education' }]
  funds: [],

  // Primary CTA on Step 1
  ctaStep1: 'Give Now',

  // ── Premium offer (optional) ──────────────────────────────────────────────
  // Set to null to hide. Display only — fulfillment is external.
  // Example:
  // premiumOffer: {
  //   threshold: 100,
  //   headline: 'Receive a free devotional guide',
  //   description: "Give $100 or more and we'll mail you our annual devotional as a thank-you.",
  //   imageUrl: null,
  // },
  premiumOffer: null,

  // ── Monthly upsell ────────────────────────────────────────────────────────
  // Shown only to donors who selected one-time giving, before payment.
  upsellEnabled: true,
  upsellHeadline: 'Make your gift go further',
  upsellMessage:
    'Monthly donors provide reliable support that helps us plan ahead and serve more people. Will you consider making your gift recurring?',
  upsellCTA: 'Yes, make it monthly',
  upsellDecline: 'No thanks, keep my one-time gift',

  // ── Payment ───────────────────────────────────────────────────────────────
  // Provide your CyberSource Flex Microform key for card capture.
  // cyberSourceFlexMicroformKey: null,

  // ── Step 5: Review & submit ───────────────────────────────────────────────
  ctaReview: 'Complete My Gift',
  legalDisclosure:
    'Your donation is tax-deductible to the extent permitted by law. No goods or services were provided in exchange for this contribution.',

  // ── Step 6: Confirmation ──────────────────────────────────────────────────
  confirmationHeadline: 'Thank you for your generosity!',
  confirmationMessage: 'Your gift is making a real difference in the lives of those we serve.',
  // Optional next-step CTA. Example: { label: 'Share your gift', url: 'https://example.org/share' }
  confirmationCTA: null,

  // ── Analytics (GTM dataLayer compatible) ─────────────────────────────────
  analytics: {
    conversionEvent: 'donation_complete',
    stepViewEvent: 'donation_step_view',
    errorEvent: 'donation_error',
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  // 'form-left'  → form on left, campaign content on right
  // 'form-right' → form on right, campaign content on left
  layout: 'form-left',
};

export default defaultConfig;
