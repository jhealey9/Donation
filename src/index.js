import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DonationForm from './DonationForm';

// ─── Example campaign config ──────────────────────────────────────────────────
// In production, this object is passed via a data-config attribute or window
// scope so marketers can change it in their CMS without touching code.
// Every key here overrides the matching default in defaultConfig.js.
const campaignConfig = {
  defaultFrequency: 'monthly',
  defaultAmount: 50,
  presetAmounts: [25, 50, 100, 250],
  impactLines: {
    25: 'provides emergency supply kits for 5 families for 3 days',
    50: 'delivers clean water and shelter materials to 10 survivors',
    100: 'funds a first responder team for a full day in the field',
    250: 'equips a mobile medical unit to treat 50 disaster survivors',
  },
  ctaStep1: 'Give Now',
  upsellEnabled: true,
  upsellHeadline: 'Double your impact every month',
  upsellMessage:
    'Disasters don\'t stop — and neither should your support. Monthly donors give us the stability to pre-position supplies before the next crisis hits. Will you make your gift recurring?',
  upsellCTA: 'Yes, give monthly',
  upsellDecline: 'No thanks, keep my one-time gift',
  ctaReview: 'Complete My Gift',
  confirmationHeadline: 'Your gift is on its way.',
  confirmationMessage: 'Thank you. Your generosity is already helping families rebuild their lives after disaster.',
  layout: 'form-left',
  // Uncomment to add a premium offer:
  // premiumOffer: {
  //   threshold: 100,
  //   headline: 'Receive a free devotional guide',
  //   description: "Give $100 or more and we'll mail you our annual devotional as a thank-you.",
  //   imageUrl: null,
  // },
  // Uncomment to add fund designation:
  // funds: [
  //   { code: 'GEN', label: 'Where Most Needed' },
  //   { code: 'WAT', label: 'Clean Water' },
  //   { code: 'EDU', label: 'Education' },
  // ],
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DonationForm config={campaignConfig} />
  </React.StrictMode>
);
