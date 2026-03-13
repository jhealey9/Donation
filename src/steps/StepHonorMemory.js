import React from 'react';

export default function StepHonorMemory({
  config,
  formData,
  updateFormData,
  onNext,
  onBack,
  headingRef,
}) {
  const { dedicationType } = formData;

  function toggle(type) {
    updateFormData({ dedicationType: dedicationType === type ? null : type });
  }

  return (
    <section aria-labelledby="step3-heading">
      <h2 id="step3-heading" ref={headingRef} tabIndex={-1} className="df-step-heading">
        Dedicate your gift
      </h2>
      <p className="df-step-subtitle">
        Optionally honor or remember someone special with this gift.
      </p>

      {/* ── Dedication type selector ────────────────────────────────────── */}
      <div className="df-dedication-types" role="group" aria-label="Dedication type">
        <button
          type="button"
          className={`df-dedication-btn ${dedicationType === 'honor' ? 'active' : ''}`}
          onClick={() => toggle('honor')}
          aria-pressed={dedicationType === 'honor'}
        >
          In Honor Of
        </button>
        <button
          type="button"
          className={`df-dedication-btn ${dedicationType === 'memory' ? 'active' : ''}`}
          onClick={() => toggle('memory')}
          aria-pressed={dedicationType === 'memory'}
        >
          In Memory Of
        </button>
      </div>

      {/* ── Dedication fields (shown when a type is selected) ───────────── */}
      {dedicationType && (
        <div className="df-dedication-fields">
          <div className="df-field-group">
            <label className="df-field-label" htmlFor="honoree-name">
              {dedicationType === 'honor' ? "Honored person's name" : 'In memory of'}
            </label>
            <input
              id="honoree-name"
              type="text"
              className="df-text-input"
              value={formData.honoreeName}
              onChange={(e) => updateFormData({ honoreeName: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="df-field-group">
            <label className="df-field-label" htmlFor="honoree-relationship">
              Relationship <span className="df-optional">(optional)</span>
            </label>
            <input
              id="honoree-relationship"
              type="text"
              className="df-text-input"
              placeholder="e.g. My grandmother"
              value={formData.honoreeRelationship}
              onChange={(e) => updateFormData({ honoreeRelationship: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="df-field-group">
            <fieldset className="df-fieldset">
              <legend className="df-field-label">Send a notification?</legend>
              <div className="df-radio-group">
                {[
                  { value: 'none', label: 'No notification' },
                  { value: 'email', label: 'By email' },
                  { value: 'mail', label: 'By mail' },
                ].map(({ value, label }) => (
                  <label key={value} className="df-radio-label">
                    <input
                      type="radio"
                      name="notificationType"
                      value={value}
                      checked={formData.notificationType === value}
                      onChange={() => updateFormData({ notificationType: value })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {formData.notificationType === 'email' && (
            <div className="df-field-group">
              <label className="df-field-label" htmlFor="notification-email">
                Notification email address
              </label>
              <input
                id="notification-email"
                type="email"
                className="df-text-input"
                value={formData.notificationEmail}
                onChange={(e) => updateFormData({ notificationEmail: e.target.value })}
                autoComplete="email"
              />
            </div>
          )}

          {formData.notificationType === 'mail' && (
            <div className="df-field-group">
              <label className="df-field-label" htmlFor="notification-address">
                Mailing address
              </label>
              <input
                id="notification-address"
                type="text"
                className="df-text-input"
                placeholder="Full mailing address"
                value={formData.notificationAddress}
                onChange={(e) => updateFormData({ notificationAddress: e.target.value })}
                autoComplete="street-address"
              />
            </div>
          )}
        </div>
      )}

      <div className="df-step-actions">
        <button type="button" className="df-btn df-btn-back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="df-btn df-btn-primary" onClick={onNext}>
          Continue
        </button>
      </div>

      {/* Skip preserves entered data — user can return and find fields intact */}
      <button
        type="button"
        className="df-btn df-btn-ghost df-btn-full df-honor-skip"
        onClick={onNext}
      >
        Skip this step
      </button>
    </section>
  );
}
