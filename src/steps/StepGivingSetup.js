import React, { useState } from 'react';

export default function StepGivingSetup({
  config,
  formData,
  updateFormData,
  onNext,
  effectiveAmount,
  headingRef,
}) {
  const [errors, setErrors] = useState({});

  const selectedPreset = formData.customAmount ? null : formData.amount;
  const impactLine =
    selectedPreset && config.impactLines && config.impactLines[selectedPreset]
      ? config.impactLines[selectedPreset]
      : null;

  function handlePreset(amount) {
    updateFormData({ amount, customAmount: '' });
    if (errors.amount) setErrors({});
  }

  function handleCustom(e) {
    updateFormData({ amount: null, customAmount: e.target.value });
    if (errors.amount) setErrors({});
  }

  function validate() {
    const errs = {};
    const amt = formData.customAmount ? parseFloat(formData.customAmount) : formData.amount;
    if (!amt || amt <= 0) errs.amount = 'Please select or enter a donation amount.';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onNext();
  }

  const ctaAmount = effectiveAmount > 0 ? ` — $${effectiveAmount.toFixed(0)}` : '';
  const ctaFreq = formData.frequency === 'monthly' && effectiveAmount > 0 ? '/mo' : '';

  return (
    <section aria-labelledby="step1-heading">
      <h2 id="step1-heading" ref={headingRef} tabIndex={-1} className="df-step-heading">
        Choose your gift
      </h2>

      {/* ── Frequency toggle ────────────────────────────────────────────── */}
      <div className="df-field-group">
        <div className="df-frequency-toggle" role="group" aria-label="Giving frequency">
          <button
            type="button"
            className={`df-toggle-btn df-toggle-monthly ${
              formData.frequency === 'monthly' ? 'active' : ''
            }`}
            onClick={() => updateFormData({ frequency: 'monthly' })}
            aria-pressed={formData.frequency === 'monthly'}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`df-toggle-btn df-toggle-onetime ${
              formData.frequency === 'one-time' ? 'active' : ''
            }`}
            onClick={() => updateFormData({ frequency: 'one-time' })}
            aria-pressed={formData.frequency === 'one-time'}
          >
            One-Time
          </button>
        </div>
        {formData.frequency === 'monthly' && (
          <p className="df-frequency-hint" aria-live="polite">
            Join thousands of monthly donors making a lasting impact.
          </p>
        )}
      </div>

      {/* ── Amount selection ────────────────────────────────────────────── */}
      <div className="df-field-group">
        <label className="df-field-label" id="amount-label">
          Donation Amount
        </label>
        <div
          className="df-preset-amounts"
          role="group"
          aria-labelledby="amount-label"
        >
          {config.presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`df-amount-btn ${selectedPreset === amount ? 'active' : ''}`}
              onClick={() => handlePreset(amount)}
              aria-pressed={selectedPreset === amount}
            >
              ${amount}
            </button>
          ))}
        </div>
        <div
          className={`df-custom-amount-wrapper ${errors.amount ? 'df-input-error-border' : ''}`}
        >
          <span className="df-currency-symbol" aria-hidden="true">
            $
          </span>
          <input
            type="number"
            id="custom-amount"
            className="df-custom-amount-input"
            placeholder="Other amount"
            value={formData.customAmount}
            min="1"
            onChange={handleCustom}
            aria-label="Custom donation amount"
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
        </div>
        {errors.amount && (
          <span id="amount-error" className="df-error-msg" role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      {/* ── Impact line ─────────────────────────────────────────────────── */}
      {impactLine && (
        <div className="df-impact-line" aria-live="polite">
          Your gift of{' '}
          <strong>
            ${selectedPreset}
            {formData.frequency === 'monthly' ? '/mo' : ''}
          </strong>{' '}
          {impactLine}.
        </div>
      )}

      {/* ── Fund selector (only when multiple funds configured) ──────────── */}
      {config.funds && config.funds.length > 1 && (
        <div className="df-field-group">
          <label className="df-field-label" htmlFor="fund-select">
            Designate your gift
          </label>
          <select
            id="fund-select"
            className="df-select"
            value={formData.fund}
            onChange={(e) => updateFormData({ fund: e.target.value })}
          >
            {config.funds.map((f) => (
              <option key={f.code} value={f.code}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Premium offer (optional, display only) ──────────────────────── */}
      {config.premiumOffer && (
        <div
          className={`df-premium-offer ${
            effectiveAmount >= config.premiumOffer.threshold
              ? 'df-premium-offer--earned'
              : ''
          }`}
          aria-label="Premium gift offer"
        >
          {config.premiumOffer.imageUrl && (
            <img
              src={config.premiumOffer.imageUrl}
              alt=""
              className="df-premium-offer__img"
              aria-hidden="true"
            />
          )}
          <div className="df-premium-offer__body">
            <p className="df-premium-offer__headline">
              {config.premiumOffer.headline}
            </p>
            <p className="df-premium-offer__desc">
              {config.premiumOffer.description}
            </p>
          </div>
          {effectiveAmount >= config.premiumOffer.threshold && (
            <span className="df-premium-offer__badge" aria-label="Offer unlocked">
              ✓ Unlocked
            </span>
          )}
        </div>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <button type="button" className="df-btn df-btn-primary" onClick={handleSubmit}>
        {config.ctaStep1}
        {ctaAmount}
        {ctaFreq}
      </button>
    </section>
  );
}
