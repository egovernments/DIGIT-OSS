import React, { useState, useEffect, useRef } from "react";
import TimelineNewLic from "../../../../components/TimelineNewLic";
import TopBar from "../../../../../../../react-components/src/atoms/TopBar";
import ApllicantFormStep1 from "../Step1/Step1";
import ApllicantPuropseForm from "../Step2/Step2";
import LandScheduleForm from "../Step3/Step3";
import AppliedDetailForm from "../Step4/Step4";
import FeesChargesForm from "../Step5/Step5";

const CommonForm = () => {
  const [isStep1, setIsStep1] = useState(false);
  const [isStep2, setIsStep2] = useState(false);
  const [isStep3, setIsStep3] = useState(false);
  const [isStep4, setIsStep4] = useState(false);
  const [isStep5, setIsStep5] = useState(false);
  const [step, setStep] = useState(1);

  const handleStep1 = (data) => {
    console.log("true", data);
    setIsStep1(true);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(2);
  };
  const handlestep2 = (data) => {
    console.log("true", data);
    setIsStep2(true);
    setIsStep1(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(3);
  };
  const handlestep3 = (data) => {
    console.log("true", data);
    setIsStep3(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep4(false);
    setStep(4);
  };
  const handlestep4 = () => {
    setIsStep4(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep3(false);
    setStep(5);
  };
  const handlestep5 = () => {
    setIsStep5(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
  };
  return (
    <div>
      <TimelineNewLic currentStep={step} flow="NEWLICENSE" />
      {isStep1 ? (
        <ApllicantPuropseForm Step2Continue={handlestep2} />
      ) : isStep2 ? (
        <LandScheduleForm Step3Continue={handlestep3} />
      ) : isStep3 ? (
        <AppliedDetailForm Step4Continue={handlestep4} />
      ) : isStep4 ? (
        <FeesChargesForm Step5Continue={handlestep5} />
      ) : (
        <ApllicantFormStep1 Step1Continue={handleStep1} />
      )}
    </div>
  );
};
export default CommonForm;
