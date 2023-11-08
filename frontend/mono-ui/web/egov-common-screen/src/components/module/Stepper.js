import React, { useState } from 'react';

const Stepper = ({ steps, initialStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <div>Current Step: {currentStep + 1}</div>
      <div>{steps[currentStep]}</div>
      <button onClick={handlePrev} disabled={currentStep === 0}>
        Previous
      </button>
      <button onClick={handleNext} disabled={currentStep === steps.length - 1}>
        Next
      </button>
    </div>
  );
};

export default Stepper;
