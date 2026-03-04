import React, { useState } from 'react';

export default function StepPersonalInfo({
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
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
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
    onNext();
  }

  function clearError(key) {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <section aria-labelledby="step2-heading">
      <h2 id="step2-heading" ref={headingRef} tabIndex={-1} className="df-step-heading">
        Your information
      </h2>

      <div className="df-field-row">
        <div className="df-field-group">
          <label className="df-field-label" htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            type="text"
            autoComplete="given-name"
            className={`df-text-input ${errors.firstName ? 'df-input-error' : ''}`}
            value={formData.firstName}
            onChange={(e) => { updateFormData({ firstName: e.target.value }); clearError('firstName'); }}
            aria-required="true"
            aria-describedby={errors.firstName ? 'first-name-error' : undefined}
          />
          {errors.firstName && <span id="first-name-error" className="df-error-msg" role="alert">{errors.firstName}</span>}
        </div>

        <div className="df-field-group">
          <label className="df-field-label" htmlFor="last-name">Last Name</label>
          <input
            id="last-name"
            type="text"
            autoComplete="family-name"
            className={`df-text-input ${errors.lastName ? 'df-input-error' : ''}`}
            value={formData.lastName}
            onChange={(e) => { updateFormData({ lastName: e.target.value }); clearError('lastName'); }}
            aria-required="true"
            aria-describedby={errors.lastName ? 'last-name-error' : undefined}
          />
          {errors.lastName && <span id="last-name-error" className="df-error-msg" role="alert">{errors.lastName}</span>}
        </div>
      </div>

      <div className="df-field-group">
        <label className="df-field-label" htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`df-text-input ${errors.email ? 'df-input-error' : ''}`}
          value={formData.email}
          onChange={(e) => { updateFormData({ email: e.target.value }); clearError('email'); }}
          aria-required="true"
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <span id="email-error" className="df-error-msg" role="alert">{errors.email}</span>}
      </div>

      <div className="df-field-group">
        <label className="df-field-label" htmlFor="phone">
          Phone Number <span className="df-optional">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          className="df-text-input"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
        />
      </div>

      <div className="df-step-actions">
        <button type="button" className="df-btn df-btn-back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="df-btn df-btn-primary" onClick={handleNext}>
          Continue
        </button>
      </div>
    </section>
  );
}
