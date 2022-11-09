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
  const [getId, setId] = useState("");

  const handleStep1 = (data, id) => {
    setId(id.toString());
    setIsStep1(true);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(2);
  };
  const handlestep2 = (data, id) => {
    setId(id.toString());
    setIsStep2(true);
    setIsStep1(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(3);
  };

  const handleBack = () => {
    setIsStep1(false);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(1);
  };
  const handleBack2 = () => {
    setIsStep1(true);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(2);
  };

  const handleBack3 = () => {
    setIsStep1(false);
    setIsStep2(true);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(3);
  };

  const handlestep3 = (data, id) => {
    console.log("true", data);
    setId(id.toString());
    setIsStep3(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep4(false);
    setStep(4);
  };
  const handlestep4 = (data, id) => {
    console.log("true", data);
    setId(id.toString());
    setIsStep4(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep3(false);
    setStep(5);
  };
  const handlestep5 = (data, id) => {
    console.log("true", data);
    setId(id.toString());
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
        <ApllicantPuropseForm getId={getId} Step2Continue={handlestep2} Step2Back={handleBack} />
      ) : isStep2 ? (
        <LandScheduleForm getId={getId} Step3Continue={handlestep3} Step3Back={handleBack2} />
      ) : isStep3 ? (
        <AppliedDetailForm getId={getId} Step4Continue={handlestep4} step4Back={handleBack3} />
      ) : isStep4 ? (
        <FeesChargesForm getId={getId} Step5Continue={handlestep5} />
      ) : (
        <ApllicantFormStep1 getId={getId} Step1Continue={handleStep1} />
      )}
    </div>
  );
};
export default CommonForm;
