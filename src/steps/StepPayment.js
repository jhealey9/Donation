import React, { useState } from 'react';

// Digital wallet availability — checked once at load time.
// Only available methods are surfaced (never shown as disabled per PRD).
const supportsApplePay =
  typeof window !== 'undefined' &&
  window.ApplePaySession &&
  window.ApplePaySession.canMakePayments &&
  window.ApplePaySession.canMakePayments();

const supportsGooglePay =
  typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

function buildMethods() {
  const methods = [{ id: 'card', label: 'Card' }];
  if (supportsApplePay) methods.push({ id: 'apple-pay', label: 'Apple Pay' });
  if (supportsGooglePay) methods.push({ id: 'google-pay', label: 'Google Pay' });
  methods.push({ id: 'paypal', label: 'PayPal' });
  methods.push({ id: 'ach', label: 'Bank Transfer' });
  return methods;
}

const PAYMENT_METHODS = buildMethods();

export default function StepPayment({
  config,
  formData,
  updateFormData,
  onNext,
  onBack,
  headingRef,
}) {
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (formData.paymentMethod === 'ach') {
      if (!formData.achRouting.trim())
        errs.achRouting = 'Routing number is required.';
      if (!formData.achAccount.trim())
        errs.achAccount = 'Account number is required.';
    }
    return errs;
  }

  function handleNext() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    // In production, card token comes from CyberSource Flex Microform callback.
    // Mock a token here so the review step has something to display.
    if (formData.paymentMethod === 'card' && !formData.cardToken) {
      updateFormData({ cardToken: 'MOCK_TOKEN_' + Date.now() });
    }
    onNext();
  }

  return (
    <section aria-labelledby="step4-heading">
      <h2 id="step4-heading" ref={headingRef} tabIndex={-1} className="df-step-heading">
        Payment
      </h2>

      {/* ── Method selector ─────────────────────────────────────────────── */}
      <div className="df-payment-tabs" role="tablist" aria-label="Payment method">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            className={`df-payment-tab ${formData.paymentMethod === m.id ? 'active' : ''}`}
            aria-selected={formData.paymentMethod === m.id}
            onClick={() => updateFormData({ paymentMethod: m.id })}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Payment fields by method ─────────────────────────────────────── */}
      <div className="df-payment-panel" role="tabpanel">
        {formData.paymentMethod === 'card' && (
          <div className="df-card-fields">
            {/* In production: mount CyberSource Flex Microform into these iframes.
                Configure `cyberSourceFlexMicroformKey` in the form config and call
                FLEX.microform({ styles: {...} }) once Step 4 is reached. */}
            <p className="df-payment-note">
              Card data is captured securely via{' '}
              <strong>CyberSource Flex Microform</strong>. Provide your{' '}
              <code>cyberSourceFlexMicroformKey</code> in the form config to
              activate card capture.
            </p>
            <div
              className="df-flex-microform-placeholder"
              aria-label="Card number field (Flex Microform)"
            >
              <div className="df-flex-microform-field">
                <span>Card Number</span>
                <span className="df-payment-note--muted">Flex Microform</span>
              </div>
              <div className="df-flex-microform-row">
                <div className="df-flex-microform-field">
                  <span>Expiry</span>
                </div>
                <div className="df-flex-microform-field">
                  <span>CVV</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {formData.paymentMethod === 'paypal' && (
          <div className="df-wallet-container">
            <p className="df-payment-note">
              You'll be redirected to PayPal to authorize your gift.
            </p>
            {/* In production: render PayPal Smart Payment Button here (loaded lazily) */}
            <button type="button" className="df-btn df-btn-paypal">
              Continue with PayPal
            </button>
          </div>
        )}

        {formData.paymentMethod === 'apple-pay' && (
          <div className="df-wallet-container">
            {/* In production: trigger ApplePaySession on click */}
            <button
              type="button"
              className="df-btn df-btn-apple-pay"
              aria-label="Pay with Apple Pay"
            >
              Pay with Apple Pay
            </button>
          </div>
        )}

        {formData.paymentMethod === 'google-pay' && (
          <div className="df-wallet-container">
            {/* In production: render Google Pay button (loaded lazily) */}
            <button
              type="button"
              className="df-btn df-btn-google-pay"
              aria-label="Pay with Google Pay"
            >
              Pay with Google Pay
            </button>
          </div>
        )}

        {formData.paymentMethod === 'ach' && (
          <div className="df-ach-fields">
            <div className="df-field-group">
              <label className="df-field-label" htmlFor="ach-routing">
                Routing Number
              </label>
              <input
                id="ach-routing"
                type="text"
                inputMode="numeric"
                className={`df-text-input ${errors.achRouting ? 'df-input-error' : ''}`}
                value={formData.achRouting}
                onChange={(e) => {
                  updateFormData({ achRouting: e.target.value });
                  if (errors.achRouting) setErrors((p) => ({ ...p, achRouting: undefined }));
                }}
                aria-describedby={errors.achRouting ? 'ach-routing-error' : undefined}
              />
              {errors.achRouting && (
                <span id="ach-routing-error" className="df-error-msg" role="alert">
                  {errors.achRouting}
                </span>
              )}
            </div>
            <div className="df-field-group">
              <label className="df-field-label" htmlFor="ach-account">
                Account Number
              </label>
              <input
                id="ach-account"
                type="text"
                inputMode="numeric"
                className={`df-text-input ${errors.achAccount ? 'df-input-error' : ''}`}
                value={formData.achAccount}
                onChange={(e) => {
                  updateFormData({ achAccount: e.target.value });
                  if (errors.achAccount) setErrors((p) => ({ ...p, achAccount: undefined }));
                }}
                aria-describedby={errors.achAccount ? 'ach-account-error' : undefined}
              />
              {errors.achAccount && (
                <span id="ach-account-error" className="df-error-msg" role="alert">
                  {errors.achAccount}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Security trust bar ───────────────────────────────────────────── */}
      <div className="df-trust-bar" aria-label="Security assurances">
        <span className="df-trust-item">
          <span className="df-trust-icon" aria-hidden="true">🔒</span>
          256-bit SSL
        </span>
        <span className="df-trust-item">PCI DSS compliant</span>
        <span className="df-trust-item">Secure checkout</span>
      </div>

      <div className="df-step-actions">
        <button type="button" className="df-btn df-btn-back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="df-btn df-btn-primary" onClick={handleNext}>
          Review My Gift
        </button>
      </div>
    </section>
  );
}
