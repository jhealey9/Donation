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
    25: 'provides clean water for a family for 1 month',
    50: 'feeds 12 families for a month',
    100: "supports a child's education for a semester",
    250: 'funds a community health worker for 1 month',
  },
  ctaStep1: 'Give Now',
  upsellEnabled: true,
  upsellHeadline: 'Make your gift go further',
  upsellMessage:
    'Monthly donors provide reliable support that helps us plan ahead and serve more people. Will you consider making your gift recurring?',
  upsellCTA: 'Yes, make it monthly',
  upsellDecline: 'No thanks, keep my one-time gift',
  ctaReview: 'Complete My Gift',
  confirmationHeadline: 'Thank you for your generosity!',
  confirmationMessage: 'Your gift is making a real difference.',
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
