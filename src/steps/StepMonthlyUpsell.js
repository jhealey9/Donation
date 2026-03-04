import React from 'react';

export default function StepMonthlyUpsell({
  config,
  effectiveAmount,
  onUpgrade,
  onDecline,
  headingRef,
}) {
  return (
    <section aria-labelledby="upsell-heading" className="df-upsell">
      <div className="df-upsell__icon" aria-hidden="true">
        ♻
      </div>
      <h2
        id="upsell-heading"
        ref={headingRef}
        tabIndex={-1}
        className="df-step-heading"
      >
        {config.upsellHeadline}
      </h2>
      <p className="df-upsell__message">{config.upsellMessage}</p>

      <div className="df-upsell__comparison" aria-label="Gift comparison">
        <div className="df-upsell__amount-box">
          <span className="df-upsell__box-label">Your one-time gift</span>
          <span className="df-upsell__box-value">
            ${effectiveAmount > 0 ? effectiveAmount.toFixed(0) : '—'}
          </span>
        </div>
        <div className="df-upsell__arrow" aria-hidden="true">→</div>
        <div className="df-upsell__amount-box df-upsell__amount-box--monthly">
          <span className="df-upsell__box-label">As a monthly gift</span>
          <span className="df-upsell__box-value">
            ${effectiveAmount > 0 ? effectiveAmount.toFixed(0) : '—'}
            <span className="df-upsell__freq">/mo</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="df-btn df-btn-primary df-btn-full"
        onClick={onUpgrade}
      >
        {config.upsellCTA}
      </button>
      <button
        type="button"
        className="df-btn df-btn-ghost df-btn-full"
        onClick={onDecline}
      >
        {config.upsellDecline}
      </button>
    </section>
  );
}
