import React, { useState, useEffect, useRef } from 'react';
import './DonationForm.css';
import defaultConfig, { validateConfig } from './defaultConfig';
import { pushEvent } from './analytics';
import StepGivingSetup from './steps/StepGivingSetup';
import StepPersonalInfo from './steps/StepPersonalInfo';
import StepHonorMemory from './steps/StepHonorMemory';
import StepMonthlyUpsell from './steps/StepMonthlyUpsell';
import StepPayment from './steps/StepPayment';
import StepReview from './steps/StepReview';
import StepConfirmation from './steps/StepConfirmation';

// ─── Step identifiers ─────────────────────────────────────────────────────────
export const STEPS = {
  GIVING_SETUP: 0,
  PERSONAL_INFO: 1,
  HONOR_MEMORY: 2,
  MONTHLY_UPSELL: 3,
  PAYMENT: 4,
  REVIEW: 5,
  CONFIRMATION: 6,
};

// Progress bar labels (excludes upsell and confirmation — they're not numbered)
const PROGRESS_LABELS = ['Gift Details', 'Your Info', 'Dedication', 'Payment', 'Review'];

// Maps each STEP to a 0-based progress index (-1 = not in progress bar)
const STEP_TO_PROGRESS = {
  [STEPS.GIVING_SETUP]: 0,
  [STEPS.PERSONAL_INFO]: 1,
  [STEPS.HONOR_MEMORY]: 2,
  [STEPS.MONTHLY_UPSELL]: 3, // visually sits at "Payment"
  [STEPS.PAYMENT]: 3,
  [STEPS.REVIEW]: 4,
  [STEPS.CONFIRMATION]: -1,
};

// ─── Component ────────────────────────────────────────────────────────────────
function DonationForm({ config: userConfig = {} }) {
  // Merge user config over defaults. This is the single source of truth for all
  // marketer-configurable values.
  const config = { ...defaultConfig, ...userConfig };

  // Validate config on mount — logs clear errors for missing required keys.
  useEffect(() => {
    validateConfig(config);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState(STEPS.GIVING_SETUP);

  const defaultFund =
    config.funds && config.funds.length >= 1 ? config.funds[0].code : 'GEN';

  const [formData, setFormData] = useState({
    // Step 1
    frequency: config.defaultFrequency,
    amount: config.defaultAmount,
    customAmount: '',
    fund: defaultFund,
    // Step 2
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 3
    dedicationType: null, // null | 'honor' | 'memory'
    honoreeName: '',
    honoreeRelationship: '',
    notificationType: 'none', // 'none' | 'email' | 'mail'
    notificationEmail: '',
    notificationAddress: '',
    // Step 4
    paymentMethod: 'card', // 'card' | 'paypal' | 'apple-pay' | 'google-pay' | 'ach'
    cardToken: null,
    achRouting: '',
    achAccount: '',
    // Submission
    transactionId: null,
  });

  const headingRef = useRef(null);

  function updateFormData(updates) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  // ── Effective amount ────────────────────────────────────────────────────────
  function getEffectiveAmount() {
    return formData.customAmount
      ? parseFloat(formData.customAmount) || 0
      : formData.amount || 0;
  }

  // ── Step sequence ───────────────────────────────────────────────────────────
  // Built dynamically — upsell is injected only for one-time donors when enabled.
  function getStepSequence() {
    const seq = [STEPS.GIVING_SETUP, STEPS.PERSONAL_INFO, STEPS.HONOR_MEMORY];
    if (formData.frequency === 'one-time' && config.upsellEnabled) {
      seq.push(STEPS.MONTHLY_UPSELL);
    }
    seq.push(STEPS.PAYMENT, STEPS.REVIEW, STEPS.CONFIRMATION);
    return seq;
  }

  function nextStep() {
    const seq = getStepSequence();
    const idx = seq.indexOf(step);
    if (idx < seq.length - 1) {
      setStep(seq[idx + 1]);
    }
  }

  function prevStep() {
    const seq = getStepSequence();
    const idx = seq.indexOf(step);
    if (idx > 0) {
      setStep(seq[idx - 1]);
    }
  }

  // ── Analytics: fire step_view on each step transition ──────────────────────
  useEffect(() => {
    if (step !== STEPS.CONFIRMATION) {
      pushEvent(config.analytics.stepViewEvent, { step });
    }
    // Move focus to step heading for accessibility (WCAG 2.1 AA)
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Submission ──────────────────────────────────────────────────────────────
  function handleSubmit() {
    const txId = 'TXN-' + Date.now();
    updateFormData({ transactionId: txId });
    // Conversion event is fired inside StepConfirmation on mount (after state
    // updates propagate), so we just advance to confirmation here.
    setStep(STEPS.CONFIRMATION);
  }

  const effectiveAmount = getEffectiveAmount();
  const progressIndex = STEP_TO_PROGRESS[step] ?? -1;

  // ── Confirmation renders without progress bar or card chrome ───────────────
  if (step === STEPS.CONFIRMATION) {
    return (
      <div className={`df-wrapper df-layout-${config.layout}`}>
        <div className="df-card df-card--confirmation">
          <StepConfirmation
            config={config}
            formData={formData}
            effectiveAmount={effectiveAmount}
            headingRef={headingRef}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`df-wrapper df-layout-${config.layout}`}>
      <div className="df-card">
        {/* ── Progress indicator ────────────────────────────────────────── */}
        {progressIndex >= 0 && (
          <nav className="df-progress" aria-label="Form progress">
            {PROGRESS_LABELS.map((label, i) => (
              <div
                key={label}
                className={[
                  'df-progress-step',
                  i < progressIndex ? 'completed' : '',
                  i === progressIndex ? 'active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={i === progressIndex ? 'step' : undefined}
              >
                <span className="df-progress-dot" aria-hidden="true">
                  {i < progressIndex ? '✓' : i + 1}
                </span>
                <span className="df-progress-label">{label}</span>
              </div>
            ))}
          </nav>
        )}

        {/* ── Steps ────────────────────────────────────────────────────── */}
        {step === STEPS.GIVING_SETUP && (
          <StepGivingSetup
            config={config}
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            effectiveAmount={effectiveAmount}
            headingRef={headingRef}
          />
        )}

        {step === STEPS.PERSONAL_INFO && (
          <StepPersonalInfo
            config={config}
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
            headingRef={headingRef}
          />
        )}

        {step === STEPS.HONOR_MEMORY && (
          <StepHonorMemory
            config={config}
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
            headingRef={headingRef}
          />
        )}

        {step === STEPS.MONTHLY_UPSELL && (
          <StepMonthlyUpsell
            config={config}
            formData={formData}
            effectiveAmount={effectiveAmount}
            onUpgrade={() => {
              updateFormData({ frequency: 'monthly' });
              nextStep();
            }}
            onDecline={nextStep}
            headingRef={headingRef}
          />
        )}

        {step === STEPS.PAYMENT && (
          <StepPayment
            config={config}
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
            headingRef={headingRef}
          />
        )}

        {step === STEPS.REVIEW && (
          <StepReview
            config={config}
            formData={formData}
            effectiveAmount={effectiveAmount}
            onEdit={setStep}
            onSubmit={handleSubmit}
            STEPS={STEPS}
            headingRef={headingRef}
          />
        )}
      </div>
    </div>
  );
}

export default DonationForm;
