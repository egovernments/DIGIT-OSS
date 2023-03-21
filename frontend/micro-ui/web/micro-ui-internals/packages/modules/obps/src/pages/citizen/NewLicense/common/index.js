import React, { useState, useEffect } from "react";
import TimelineNewLic from "../../../../components/TimelineNewLic";
import ApllicantFormStep1 from "../Step1/Step1";
import ApllicantPuropseForm from "../Step2/Step2";
import LandScheduleForm from "../Step3/Step3";
import AppliedDetailForm from "../Step4/Step4";
import FeesChargesForm from "../Step5/Step5";
import { useLocation } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

const CommonForm = () => {
  const location = useLocation();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [isStep1, setIsStep1] = useState(false);
  const [isStep2, setIsStep2] = useState(false);
  const [isStep3, setIsStep3] = useState(false);
  const [isStep4, setIsStep4] = useState(false);
  const [isStep5, setIsStep5] = useState(false);
  const [step, setStep] = useState(1);
  const [getId, setId] = useState("");
  const [userData, setUserData] = useState(null);
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
    setUserData(userInfo);
    setIsStep1(true);
    setIsStep2(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(2);
  };

  const handlestep2 = (licData) => {
    setIsStep2(true);
    setIsStep1(false);
    setIsStep3(false);
    setIsStep4(false);
    setIsStep5(false);
    setStep(3);
  };

  const handlestep3 = (licData) => {
    setIsStep3(true);
    setIsStep1(false);
    setIsStep2(false);
    setIsStep4(false);
    setStep(4);
  };

  const handlestep4 = (licData, sucuredData) => {
    setSucuredData(sucuredData);
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

  const handleWorkflow = async (payload) => {
    return;
    try {
      const Resp = await axios.post("/tl-services/new/_create", payload);
    } catch (error) {
      return error?.message;
    }
  };

  const changeSteps = (value) => {
    const token = window?.localStorage?.getItem("token");
    if (value == 1 && stepActive?.step1) {
      // step 1
      // const postDistrict = {
      //   pageName: "ApplicantInfo",
      //   action: "INITIATE",
      //   applicationNumber: getId,
      //   createdBy: userInfo?.id,
      //   updatedBy: userInfo?.id,
      //   LicenseDetails: getLicData?.ApplicantInfo,
      //   RequestInfo: {
      //     apiId: "Rainmaker",
      //     ver: "v1",
      //     ts: 0,
      //     action: "_search",
      //     did: "",
      //     key: "",
      //     msgId: "090909",
      //     requesterId: "",
      //     authToken: token,
      //     userInfo: userInfo,
      //   },
      // };
      // handleWorkflow(postDistrict);
      handleStep();
    } else if (value == 2 && stepActive.step2) {
      // step 2
      const postDistrict = {
        pageName: "ApplicantPurpose",
        action: "INITIATE",
        applicationNumber: getId,
        createdBy: userInfo?.id,
        updatedBy: userInfo?.id,
        LicenseDetails: {
          ApplicantPurpose: getLicData?.ApplicantPurpose,
        },
        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: token,
          userInfo: userInfo,
        },
      };
      handleWorkflow(postDistrict);
      handleStep1(getId, userData, getLicData);
    } else if (value == 3 && stepActive.step3) {
      // step 3
      const postDistrict = {
        pageName: "LandSchedule",
        action: "PURPOSE",
        applicationNumber: getId,
        createdBy: userInfo?.id,
        updatedBy: userInfo?.id,
        LicenseDetails: {
          LandSchedule: getLicData?.LandSchedule,
        },
        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: token,
          userInfo: userInfo,
        },
      };
      handleWorkflow(postDistrict);
      handlestep2(getLicData);
    } else if (value == 4 && stepActive.step4) {
      // step 4
      const postDistrict = {
        pageName: "DetailsofAppliedLand",
        action: "LANDSCHEDULE",
        applicationNumber: getId,
        createdBy: userInfo?.id,
        updatedBy: userInfo?.id,
        LicenseDetails: getLicData?.DetailsofAppliedLand,
        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: token,
          userInfo: userInfo,
        },
      };
      handleWorkflow(postDistrict);
      handlestep3(getLicData);
    } else if (value == 5 && stepActive.step5) {
      // step 5
      const postDistrict = {
        pageName: "FeesAndCharges",
        action: "LANDDETAILS",
        applicationNumber: getId,
        createdBy: userInfo?.id,
        updatedBy: userInfo?.id,
        LicenseDetails: getLicData?.FeesAndCharges,
        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: token,
          userInfo: userInfo,
        },
      };
      handleWorkflow(postDistrict);
      handlestep4(getLicData, securedData);
    }
  };

  useEffect(() => {
    console.log("getLicData====", getLicData);
    if (_.isEmpty(getLicData)) setStepActive({ step1: true, step2: false, step3: false, step4: false, step5: false });
    if (!_.isEmpty(getLicData?.ApplicantInfo)) setStepActive({ step1: true, step2: true, step3: false, step4: false, step5: false });
    if (!_.isEmpty(getLicData?.ApplicantPurpose)) setStepActive({ step1: true, step2: true, step3: true, step4: false, step5: false });
    if (!_.isEmpty(getLicData?.LandSchedule)) setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: false });
    if (!_.isEmpty(getLicData?.DetailsofAppliedLand)) setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: true });
  }, [getLicData]);

  const getApplicantUserData = async (id) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      apiId: "Rainmaker",
      msgId: "1669293303096|en_IN",
      authToken: token,
    };
    try {
      const Resp = await axios.post(`/tl-services/new/licenses/object/_getByApplicationNumber?applicationNumber=${id}`, payload);
      const appNumber = Resp?.data?.applicationStatus;
      const licData = Resp?.data?.LicenseDetails?.[0];
      setLicData(licData);
      if (appNumber === "INITIATED") {
        setIsStep1(true);
        setIsStep2(false);
        setIsStep3(false);
        setIsStep4(false);
        setIsStep5(false);
        setStep(2);
        setStepActive({ step1: true, step2: true, step3: false, step4: false, step5: false });
      }
      if (appNumber === "PURPOSE") {
        setIsStep2(true);
        setIsStep1(false);
        setIsStep3(false);
        setIsStep4(false);
        setIsStep5(false);
        setStep(3);
        setStepActive({ step1: true, step2: true, step3: true, step4: false, step5: false });
      }
      if (appNumber === "LANDSCHEDULE") {
        setIsStep3(true);
        setIsStep1(false);
        setIsStep2(false);
        setIsStep4(false);
        setStep(4);
        setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: false });
      }
      if (appNumber === "LANDDETAILS") {
        setIsStep4(true);
        setIsStep1(false);
        setIsStep2(false);
        setIsStep3(false);
        setStep(5);
        setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: true });
      }
      if (appNumber === "FEESANDCHARGES") {
        setIsStep4(true);
        setIsStep1(false);
        setIsStep2(false);
        setIsStep3(false);
        setStep(5);
        setStepActive({ step1: true, step2: true, step3: true, step4: true, step5: true });
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    if (id) getApplicantUserData(id);
    setId(id?.toString());
  }, []);

  return (
    <div>
      <TimelineNewLic currentStep={step} changeSteps={changeSteps} flow="NEWLICENSE" />
      {isStep1 ? (
        <ApllicantPuropseForm userData={userData} getId={getId} Step2Continue={handlestep2} Step2Back={handleBack} />
      ) : isStep2 ? (
        <LandScheduleForm getId={getId} userData={userData} Step3Continue={handlestep3} Step3Back={handleBack2} />
      ) : isStep3 ? (
        <AppliedDetailForm getId={getId} userData={userData} Step4Continue={handlestep4} step4Back={handleBack3} />
      ) : isStep4 ? (
        <FeesChargesForm securedData={securedData} getId={getId} userData={userData} Step5Continue={handlestep5} step5Back={handleBack4} />
      ) : (
        <ApllicantFormStep1 getId={getId} userData={userData} Step1Continue={handleStep1} />
      )}
    </div>
  );
};
export default CommonForm;
