import React, { useState } from 'react';
import './DonationForm.css';

const PRESET_AMOUNTS = [10, 25, 50, 100];

function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const effectiveAmount = selectedAmount !== null
    ? selectedAmount
    : parseFloat(customAmount) || 0;

  function validate() {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Enter a valid email address.';
    if (effectiveAmount <= 0)
      newErrors.amount = 'Please select or enter a donation amount.';
    return newErrors;
  }

  function handlePreset(amount) {
    setSelectedAmount(amount);
    setCustomAmount('');
  }

  function handleCustomAmount(e) {
    setSelectedAmount(null);
    setCustomAmount(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="donation-form-wrapper">
        <div className="donation-card success-card">
          <div className="success-icon">✓</div>
          <h2>Thank You, {name}!</h2>
          <p>
            Your {frequency === 'monthly' ? 'monthly' : 'one-time'} donation of{' '}
            <strong>${effectiveAmount.toFixed(2)}</strong> has been received.
          </p>
          <p className="success-sub">A confirmation will be sent to <strong>{email}</strong>.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSubmitted(false);
              setSelectedAmount(null);
              setCustomAmount('');
              setFrequency('one-time');
              setName('');
              setEmail('');
            }}
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-form-wrapper">
      <div className="donation-card">
        <h1 className="form-title">Make a Donation</h1>
        <p className="form-subtitle">Your generosity makes a difference.</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Frequency */}
          <div className="field-group">
            <div className="frequency-toggle">
              <button
                type="button"
                className={`toggle-btn ${frequency === 'one-time' ? 'active' : ''}`}
                onClick={() => setFrequency('one-time')}
              >
                One-Time
              </button>
              <button
                type="button"
                className={`toggle-btn ${frequency === 'monthly' ? 'active' : ''}`}
                onClick={() => setFrequency('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="field-group">
            <label className="field-label">Donation Amount</label>
            <div className="preset-amounts">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                  onClick={() => handlePreset(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="custom-amount-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                className={`custom-amount-input ${errors.amount ? 'input-error' : ''}`}
                placeholder="Custom amount"
                value={customAmount}
                min="1"
                onChange={handleCustomAmount}
              />
            </div>
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>

          {/* Personal Info */}
          <div className="field-group">
            <label className="field-label" htmlFor="donor-name">Full Name</label>
            <input
              id="donor-name"
              type="text"
              className={`text-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="donor-email">Email Address</label>
            <input
              id="donor-email"
              type="email"
              className={`text-input ${errors.email ? 'input-error' : ''}`}
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Summary & Submit */}
          {effectiveAmount > 0 && (
            <div className="donation-summary">
              You are donating{' '}
              <strong>${effectiveAmount.toFixed(2)}</strong>{' '}
              {frequency === 'monthly' ? 'per month' : 'today'}.
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Donate {effectiveAmount > 0 ? `$${effectiveAmount.toFixed(2)}` : ''}
            {frequency === 'monthly' ? '/mo' : ''}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationForm;
