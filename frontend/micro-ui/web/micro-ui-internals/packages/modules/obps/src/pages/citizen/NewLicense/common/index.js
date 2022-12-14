import React, { useState, useEffect } from "react";
import TimelineNewLic from "../../../../components/TimelineNewLic";
import ApllicantFormStep1 from "../Step1/Step1";
import ApllicantPuropseForm from "../Step2/Step2";
import LandScheduleForm from "../Step3/Step3";
import AppliedDetailForm from "../Step4/Step4";
import FeesChargesForm from "../Step5/Step5";
import _ from "lodash";

const CommonForm = () => {
  const [isStep1, setIsStep1] = useState(false);
  const [isStep2, setIsStep2] = useState(false);
  const [isStep3, setIsStep3] = useState(false);
  const [isStep4, setIsStep4] = useState(false);
  const [isStep5, setIsStep5] = useState(false);
  const [step, setStep] = useState(1);
  const [getId, setId] = useState("");
  const [userData, setUserData] = useState(null);
  const [getCheck, setCheck] = useState(null);
  const [getLicData, setLicData] = useState(null);
  const [securedData, setSucuredData] = useState(null);
  const [stepActive, setStepActive] = useState({ step1: false, step2: false, step3: false, step4: false, step5: false });

  const handleStep = () => {
    setIsStep1(false);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(1);
  };

  const handleStep1 = (id, userInfo, licData) => {
    setId(id);
    setLicData(licData);
    setUserData(userInfo);
    setIsStep1(true);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(2);
  };

  const handlestep2 = (licData) => {
    setLicData(licData);
    setIsStep2(true);
    setIsStep1(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(3);
  };

  const handlestep3 = (licData) => {
    setLicData(licData);
    setIsStep3(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep4(false);
    setStep(4);
  };

  const handlestep4 = (licData, sucuredData) => {
    setSucuredData(sucuredData);
    setLicData(licData);
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

  const handleBack4 = () => {
    setIsStep1(false);
    setIsStep2(false);
    setIsStep3(true);
    setIsStep4(false);
    setIsStep5(false);
    setStep(3);
  };

  const changeSteps = (value) => {
    if (value == 1 && stepActive?.step1) handleStep();
    else if (value == 2 && stepActive.step2) handleStep1(getId, userData, getLicData);
    else if (value == 3 && stepActive.step3) handlestep2(getLicData);
    else if (value == 4 && stepActive.step4) handlestep3(getLicData);
    else if (value == 5 && stepActive.step5) handlestep4(getLicData, securedData);
  };

  useEffect(() => {
    if (_.isEmpty(getLicData)) setStepActive({ step1: true, step2: false, step3: false, step4: false, step5: false });
    if (!_.isEmpty(getLicData?.ApplicantInfo)) setStepActive({ step1: true, step2: true, step3: false, step4: false, step5: false });
    if (!_.isEmpty(getLicData?.ApplicantPurpose)) setStepActive({ step1: true, step2: true, step3: true, step4: false, step5: false });
    if (!_.isEmpty(getLicData?.LandSchedule)) setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: false });
    if (!_.isEmpty(getLicData?.DetailsofAppliedLand)) setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: true });
  }, [getLicData]);

  return (
    <div>
      <TimelineNewLic currentStep={step} setCheck={setCheck} changeSteps={changeSteps} flow="NEWLICENSE" />
      {isStep1 ? (
        <ApllicantPuropseForm getLicData={getLicData} userData={userData} getId={getId} Step2Continue={handlestep2} Step2Back={handleBack} />
      ) : isStep2 ? (
        <LandScheduleForm getLicData={getLicData} getId={getId} userData={userData} Step3Continue={handlestep3} Step3Back={handleBack2} />
      ) : isStep3 ? (
        <AppliedDetailForm getLicData={getLicData} getId={getId} userData={userData} Step4Continue={handlestep4} step4Back={handleBack3} />
      ) : isStep4 ? (
        <FeesChargesForm
          securedData={securedData}
          getId={getId}
          getLicData={getLicData}
          userData={userData}
          Step5Continue={handlestep5}
          step5Back={handleBack4}
        />
      ) : (
        <ApllicantFormStep1 getLicData={getLicData} getId={getId} userData={userData} Step1Continue={handleStep1} />
      )}
    </div>
  );
};
export default CommonForm;
