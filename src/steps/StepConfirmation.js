import React, { useEffect } from 'react';

export default function StepConfirmation({ config, formData, effectiveAmount, headingRef }) {
  // Fire analytics conversion event on mount
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: config.analytics.conversionEvent,
      amount: effectiveAmount,
      frequency: formData.frequency,
      fund: formData.fund,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
    });

    // Move focus to heading for accessibility
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section aria-labelledby="confirmation-heading" className="df-confirmation">
      <div className="df-confirmation__icon" aria-hidden="true">✓</div>

      <h2
        id="confirmation-heading"
        ref={headingRef}
        tabIndex={-1}
        className="df-step-heading"
      >
        {config.confirmationHeadline}
      </h2>

      <p className="df-confirmation__message">{config.confirmationMessage}</p>

      {/* ── Gift summary ─────────────────────────────────────────────────── */}
      <div className="df-confirmation__summary">
        <div className="df-confirmation__row">
          <span>Gift amount</span>
          <strong>
            ${effectiveAmount.toFixed(2)}
            {formData.frequency === 'monthly' ? ' / month' : ''}
          </strong>
        </div>
        <div className="df-confirmation__row">
          <span>Frequency</span>
          <strong>{formData.frequency === 'monthly' ? 'Monthly' : 'One-time'}</strong>
        </div>
        {formData.transactionId && (
          <div className="df-confirmation__row">
            <span>Transaction</span>
            <strong>{formData.transactionId}</strong>
          </div>
        )}
      </div>

      {/* ── Recurring billing note ───────────────────────────────────────── */}
      {formData.frequency === 'monthly' && (
        <p className="df-confirmation__recurring-note">
          Your first charge has been processed. Future gifts will be charged on this
          date each month. You may cancel at any time by contacting us.
        </p>
      )}

      {/* ── Honoree acknowledgment ───────────────────────────────────────── */}
      {formData.dedicationType && formData.honoreeName && (
        <p className="df-confirmation__honoree">
          This gift is dedicated{' '}
          {formData.dedicationType === 'honor' ? 'in honor of' : 'in memory of'}{' '}
          <strong>{formData.honoreeName}</strong>.
        </p>
      )}

      {/* ── Optional next-step CTA ───────────────────────────────────────── */}
      {config.confirmationCTA && (
        <a
          href={config.confirmationCTA.url}
          className="df-btn df-btn-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {config.confirmationCTA.label}
        </a>
      )}
    </section>
  );
}
