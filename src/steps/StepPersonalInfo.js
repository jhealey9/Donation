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

  function Field({ id, label, type = 'text', fieldKey, required = true, autoComplete, placeholder }) {
    return (
      <div className="df-field-group">
        <label className="df-field-label" htmlFor={id}>
          {label}
          {!required && <span className="df-optional"> (optional)</span>}
        </label>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`df-text-input ${errors[fieldKey] ? 'df-input-error' : ''}`}
          value={formData[fieldKey]}
          onChange={(e) => {
            updateFormData({ [fieldKey]: e.target.value });
            if (errors[fieldKey]) setErrors((prev) => ({ ...prev, [fieldKey]: undefined }));
          }}
          aria-required={required}
          aria-describedby={errors[fieldKey] ? `${id}-error` : undefined}
        />
        {errors[fieldKey] && (
          <span id={`${id}-error`} className="df-error-msg" role="alert">
            {errors[fieldKey]}
          </span>
        )}
      </div>
    );
  }

  return (
    <section aria-labelledby="step2-heading">
      <h2 id="step2-heading" ref={headingRef} tabIndex={-1} className="df-step-heading">
        Your information
      </h2>

      <div className="df-field-row">
        <Field
          id="first-name"
          label="First Name"
          fieldKey="firstName"
          autoComplete="given-name"
        />
        <Field
          id="last-name"
          label="Last Name"
          fieldKey="lastName"
          autoComplete="family-name"
        />
      </div>

      <Field
        id="email"
        label="Email Address"
        type="email"
        fieldKey="email"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <Field
        id="phone"
        label="Phone Number"
        type="tel"
        fieldKey="phone"
        autoComplete="tel"
        required={false}
        placeholder="+1 (555) 000-0000"
      />

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
