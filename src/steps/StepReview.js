import React from 'react';

const PAYMENT_LABELS = {
  card: 'Credit / Debit Card',
  paypal: 'PayPal',
  'apple-pay': 'Apple Pay',
  'google-pay': 'Google Pay',
  ach: 'Bank Transfer (ACH)',
};

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="df-review-row">
      <dt className="df-review-row__label">{label}</dt>
      <dd className="df-review-row__value">{value}</dd>
      {onEdit && (
        <button
          type="button"
          className="df-review-edit"
          onClick={onEdit}
          aria-label={`Edit ${label}`}
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default function StepReview({
  config,
  formData,
  effectiveAmount,
  onEdit,
  onSubmit,
  STEPS,
  headingRef,
}) {
  const fundLabel =
    config.funds && config.funds.length > 0
      ? config.funds.find((f) => f.code === formData.fund)?.label || 'General Fund'
      : 'General Fund';

  const amountDisplay = `$${effectiveAmount.toFixed(2)} ${
    formData.frequency === 'monthly' ? '/ month' : 'one-time'
  }`;

  const donorDisplay = `${formData.firstName} ${formData.lastName} · ${formData.email}`;

  return (
    <section aria-labelledby="step5-heading">
      <h2 id="step5-heading" ref={headingRef} tabIndex={-1} className="df-step-heading">
        Review your gift
      </h2>

      <dl className="df-review-card">
        <ReviewRow
          label="Gift amount"
          value={amountDisplay}
          onEdit={() => onEdit(STEPS.GIVING_SETUP)}
        />
        {config.funds && config.funds.length > 1 && (
          <ReviewRow
            label="Fund"
            value={fundLabel}
            onEdit={() => onEdit(STEPS.GIVING_SETUP)}
          />
        )}
        <ReviewRow
          label="Donor"
          value={donorDisplay}
          onEdit={() => onEdit(STEPS.PERSONAL_INFO)}
        />
        {formData.dedicationType && formData.honoreeName && (
          <ReviewRow
            label={formData.dedicationType === 'honor' ? 'In Honor Of' : 'In Memory Of'}
            value={formData.honoreeName}
            onEdit={() => onEdit(STEPS.HONOR_MEMORY)}
          />
        )}
        <ReviewRow
          label="Payment"
          value={PAYMENT_LABELS[formData.paymentMethod] || formData.paymentMethod}
          onEdit={() => onEdit(STEPS.PAYMENT)}
        />
      </dl>

      <p className="df-legal">{config.legalDisclosure}</p>

      <button type="button" className="df-btn df-btn-primary" onClick={onSubmit}>
        {config.ctaReview}
      </button>
    </section>
  );
}
