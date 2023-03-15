import React, { useEffect, useState } from "react";
import { fromUnixTime, format } from 'date-fns';
import { Card, CardHeader, Label, SearchIconSvg, Toast, StatusTable, TextInput, Row, CardCaption, SubmitBar, Loader } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";
import { ocScrutinyDetailsData } from "../utils";

const OCBasicDetails = ({ formData, onSelect, config }) => {
  const [showToast, setShowToast] = useState(null);
  // const [basicData, setBasicData] = useState(formData?.data?.edcrDetails || null);
  const [scrutinyNumber, setScrutinyNumber] = useState(formData?.data?.scrutinyNumber);
  const isMobile = window.Digit.Utils.browser.isMobile();
  const [isDisabled, setIsDisabled] = useState(formData?.data?.scrutinyNumber ? true : false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const [bpaData, setBpaData] = useState(formData?.data?.bpaData || {});
  const [data, setData] = useState(formData?.data?.edcrDetails || null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(state, "BPA", ["RiskTypeComputation"]);
  const riskType = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, data?.planDetail?.plot?.area, data?.planDetail?.blocks);

  useEffect(() => {
    // setTimeout(closeToast, 5000);
  }, showToast);


  const getOCEDCRTotalDetails = async () => {
    setData(null);
    setBpaData(null);
    setIsLoadingApplication(true);
    const details = await ocScrutinyDetailsData(scrutinyNumber?.edcrNumber, state);
    setIsLoadingApplication(false);
    if (details?.type == "ERROR") {
      setShowToast({ key: "true", message: details?.message });
      setData(null);
      setBpaData(null);
    }

    let otherData = details?.otherDetails;
    let ocData = details?.ocEdcrDetails;

    if (otherData && ocData && ocData?.tenantId && otherData?.edcrDetails?.[0]?.tenantId) {
      if (otherData?.edcrDetails?.[0]?.tenantId != ocData?.tenantId) {
        setShowToast({ key: "true", message: "BPA_INVALID_PERMIT_CITY" });
        return;
      } else if (otherData?.bpaApprovalResponse?.[0]?.edcrNumber === ocData?.edcrNumber && ((otherData?.bpaResponse?.[0]?.status != "REJECTED") && (otherData?.bpaResponse?.[0]?.status != "PERMIT REVOCATION") || (otherData?.bpaResponse?.[0]?.status != "INITIATED"))) {
        setShowToast({ key: "true", message: "APPLICATION_NUMBER_ALREADY_EXISTS" });
        return;
      } else {
        sessionStorage.setItem("checkForProcced", JSON.stringify(false));
        setShowToast(null);
        setData(data);
      }
    }

    if (details?.ocEdcrDetails?.edcrNumber) {
      setData(details?.ocEdcrDetails);
      setBpaData(details?.otherDetails);
      setShowToast(null);
    }
  }

  const handleKeyPress = async (event) => {
    if(!(scrutinyNumber?.edcrNumber?.startsWith("OC")))
    setShowToast({ key: "true", message: t("BPA_INVALID_OCEDCR_NO"), labelName: "Please enter the valid OCeDCR Number." });
    else{
    if (event.key === "Enter") {
      const handleData = await getOCEDCRTotalDetails();
    }
  }
  }


  const closeToast = () => {
    setShowToast(null);
  };

  const noTocloseToast = () => {
    setShowToast(null);
  };

  const yesTocloseToast = () => {
    sessionStorage.setItem("checkForProcced", JSON.stringify(true));
    handleSubmit();
  };

  const handleSearch = async (event) => {
    if(!(scrutinyNumber?.edcrNumber?.startsWith("OC")))
    setShowToast({ key: "true", message: t("BPA_INVALID_OCEDCR_NO"), labelName: "Please enter the valid OCeDCR Number." });
    else{
    const handleData = await getOCEDCRTotalDetails();
    }
  }

  const getDetails = async () => {
    const handleData = await getOCEDCRTotalDetails();
  }

  let disableVlaue = sessionStorage.getItem("isEDCRDisable");
  disableVlaue = JSON.parse(disableVlaue);

  useEffect(() => {
    if (disableVlaue) {
      let edcrApi = sessionStorage.getItem("isEDCRAPIType");
      edcrApi = edcrApi ? JSON.parse(edcrApi) : false;
      if (!edcrApi || !data) {
        sessionStorage.setItem("isEDCRAPIType", JSON.stringify(true));
        getDetails();
      }
    }
  }, [])

  const handleSubmit = (event) => {
    let isProccedToNextStep = false;
    if (bpaData && data) {
      const bpaEdcrDetails = bpaData?.edcrDetails?.[0] || {};
      const ocBpaEdcrDetails = data || {};
      const ocEdcrKathaNo = ocBpaEdcrDetails?.planDetail?.planInformation?.khataNo;
      const edcrKathaNo = bpaEdcrDetails?.planDetail?.planInformation?.khataNo;
      const ocEdcrPlotNo = ocBpaEdcrDetails?.planDetail?.planInformation?.plotNo;
      const edcrPlotNo = bpaEdcrDetails?.planDetail?.planInformation?.plotNo;

      const riskTypes = { LOW: 0, MEDIUM: 1, HIGH: 2 };
      const ocEdcrRiskType = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, ocBpaEdcrDetails?.planDetail?.plot?.area, data?.planDetail?.blocks);
      const edcrRisktype = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, bpaEdcrDetails?.planDetail?.plot?.area, data?.planDetail?.blocks);


      if (ocEdcrKathaNo && edcrKathaNo && ocEdcrPlotNo && edcrPlotNo) {
        if (ocEdcrPlotNo == edcrPlotNo && ocEdcrKathaNo == edcrKathaNo) {
          isProccedToNextStep = true;
        } else {
          if (ocEdcrKathaNo != edcrKathaNo && ocEdcrPlotNo == edcrPlotNo) {
            isProccedToNextStep = false;
            setShowToast({ key: "true", message: "Khata number from permit order XXXX(permit order number) is not matching with the khata number from occupancy certificate. You cannot proceed with the application" });
          } else if (ocEdcrPlotNo != edcrPlotNo && ocEdcrKathaNo == edcrKathaNo) {
            isProccedToNextStep = false;
            setShowToast({ key: "true", message: "Plot number from permit order XXXX(permit order number) is not matching with the Plot number from occupancy certificate. You cannot proceed with the application" });
          } else if (ocEdcrPlotNo != edcrPlotNo && ocEdcrKathaNo != edcrKathaNo) {
            isProccedToNextStep = false;
            setShowToast({ key: "true", message: "Khata No and plot No from permit order XXXX(permit order number) is not matching with the Khata No and plot No from occupancy certificate. You cannot proceed with the application" });
          }
          return false;
        }
      }

      if (riskTypes[edcrRisktype] < riskTypes[ocEdcrRiskType]) {
        isProccedToNextStep = false;
        setShowToast({ key: "true", message: t("BPA_RISK_TYPE_VALIDATION_ERROR"), labelName: "The Risk type from permit order XXXX(permit order number) to occupancy certificate application is changed from Low to high .You cannot proceed with the application." });
      }
      else if (riskTypes[edcrRisktype] > riskTypes[ocEdcrRiskType]) {
        isProccedToNextStep = JSON.parse(sessionStorage.getItem("checkForProcced"))
        setShowToast({ warning: "true", message: t("BPA_RISK_TYPE_VALIDATION_WARNING"), labelName: "The Risk type in permit order XXXX is high where as the risk type in occupancy is Low , do you want to continue" });
      }
      else {
        isProccedToNextStep = true;
      }
    }

    if (isProccedToNextStep) {
      onSelect(
        config?.key,
        {
          scrutinyNumber, applicantName: data?.planDetail?.planInformation?.applicantName,
          occupancyType: data?.planDetail?.planInformation?.occupancy,
          applicationType: data?.appliactionType, serviceType: data?.applicationSubType,
          applicationDate: data?.applicationDate,
          riskType: Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation,
            data?.planDetail?.plot?.area, data?.planDetail?.blocks),
          bpaData: bpaData,
          edcrDetails: data
        }
      )
    }
  }

  if (isMdmsLoading) {
    return <Loader />
  }

  return (
    <div>
      <Timeline currentStep={1} flow="OCBPA" />
      <div className={isMobile ? "obps-search" : ""} style={!isMobile ? { maxWidth: "960px", minWidth: "640px", marginRight: "auto" } : {}}>
        <Label>{t(`OBPS_SEARCH_EDCR_NUMBER`)}</Label>
        <TextInput className="searchInput"
          onKeyPress={handleKeyPress}
          onChange={event => setScrutinyNumber({ edcrNumber: event.target.value })} value={scrutinyNumber?.edcrNumber} signature={true} signatureImg={!disableVlaue && <SearchIconSvg className="signature-img" onClick={!disableVlaue && scrutinyNumber?.edcrNumber ? () => handleSearch() : null} />}
          disable={isDisabled}
          style={{ marginBottom: "10px" }}
        />
      </div>
      {isLoadingApplication ? <Loader /> : null}
      {data && <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={data?.applicationDate ? format(new Date(data?.applicationDate), 'dd/MM/yyyy') : data?.applicationDate} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={t(`WF_BPA_${data?.appliactionType}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={t(data?.applicationSubType)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={data?.planDetail?.planInformation?.occupancy} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={t(`WF_BPA_${Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, data?.planDetail?.plot?.area, data?.planDetail?.blocks)}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={data?.planDetail?.planInformation?.applicantName} />
        </StatusTable>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={handleSubmit} />
      </Card>
      }
      {showToast && <Toast
        error={showToast?.key ? true : false}
        warning={showToast?.warning ? true : false}
        label={t(showToast?.message)}
        isDleteBtn={true}
        onClose={closeToast}
        onNo={noTocloseToast}
        onYes={yesTocloseToast}
        isWarningButtons={true}
      />
      }
    </div>
  )
}

export default OCBasicDetails;