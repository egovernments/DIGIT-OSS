import React, { useEffect, useState } from "react";
import { fromUnixTime, format } from "date-fns";
import {
  Card,
  CardHeader,
  Label,
  SearchIconSvg,
  Toast,
  StatusTable,
  TextInput,
  Row,
  CardCaption,
  SubmitBar,
  Loader,
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";
import { scrutinyDetailsData } from "../utils";

const BasicDetails = ({ formData, onSelect, config }) => {
  const [showToast, setShowToast] = useState(null);
  const [basicData, setBasicData] = useState(formData?.data?.edcrDetails || null);
  const [scrutinyNumber, setScrutinyNumber] = useState(formData?.data?.scrutinyNumber);
  const [isDisabled, setIsDisabled] = useState(formData?.data?.scrutinyNumber ? true : false);
  const { t } = useTranslation();
  const stateCode = Digit.ULBService.getStateId();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["RiskTypeComputation"]);
  const riskType = Digit.Utils.obps.calculateRiskType(
    mdmsData?.BPA?.RiskTypeComputation,
    basicData?.planDetail?.plot?.area,
    basicData?.planDetail?.blocks
  );

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      if (!scrutinyNumber?.edcrNumber) return;
      const details = await scrutinyDetailsData(scrutinyNumber?.edcrNumber, stateCode);
      if (details?.type == "ERROR") {
        setShowToast({ message: details?.message });
        setBasicData(null);
      }
      if (details?.edcrNumber) {
        setBasicData(details);
        setShowToast(null);
      }
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const handleSearch = async (event) => {
    const details = await scrutinyDetailsData(scrutinyNumber?.edcrNumber, stateCode);
    if (details?.type == "ERROR") {
      setShowToast({ message: details?.message });
      setBasicData(null);
    }
    if (details?.edcrNumber) {
      setBasicData(details);
      setShowToast(null);
    }
  };

  const handleSubmit = (event) => {
    onSelect(config?.key, {
      scrutinyNumber,
      applicantName: basicData?.planDetail?.planInformation?.applicantName,
      occupancyType: basicData?.planDetail?.planInformation?.occupancy,
      applicationType: basicData?.appliactionType,
      serviceType: basicData?.applicationSubType,
      applicationDate: basicData?.applicationDate,
      riskType: Digit.Utils.obps.calculateRiskType(
        mdmsData?.BPA?.RiskTypeComputation,
        basicData?.planDetail?.plot?.area,
        basicData?.planDetail?.blocks
      ),
      edcrDetails: basicData,
    });
  };

  let disableVlaue = sessionStorage.getItem("isEDCRDisable");
  disableVlaue = JSON.parse(disableVlaue);

  const getDetails = async () => {
    const details = await scrutinyDetailsData(scrutinyNumber?.edcrNumber, stateCode);
    if (details?.type == "ERROR") {
      setShowToast({ message: details?.message });
      setBasicData(null);
    }
    if (details?.edcrNumber) {
      setBasicData(details);
      setShowToast(null);
    }
  };

  if (disableVlaue) {
    let edcrApi = sessionStorage.getItem("isEDCRAPIType");
    edcrApi = edcrApi ? JSON.parse(edcrApi) : false;
    if (!edcrApi || !basicData) {
      sessionStorage.setItem("isEDCRAPIType", JSON.stringify(true));
      getDetails();
    }
  }

  return (
    <div>
      {showToast && <Toast error={true} label={t(`${showToast?.message}`)} onClose={closeToast} isDleteBtn={true} />}
      <Timeline />
      <div className={isMobile ? "obps-search" : ""} style={!isMobile ? { margin: "8px" } : {}}>
        <Label>{t(`OBPS_SEARCH_EDCR_NUMBER`)}</Label>
        <TextInput
          className="searchInput"
          onKeyPress={handleKeyPress}
          onChange={event => setScrutinyNumber({ edcrNumber: event.target.value })} 
          value={scrutinyNumber?.edcrNumber} 
          signature={true} 
          signatureImg={!disableVlaue && <SearchIconSvg className="signature-img" onClick={!disableVlaue && scrutinyNumber?.edcrNumber ? () => handleSearch() : null} />}
          disable={disableVlaue}
          style={{ marginBottom: "10px" }}
        />
      </div>
      {basicData && (
        <Card>
          <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
          <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
          <StatusTable>
            <Row
              className="border-none"
              label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)}
              text={basicData?.applicationDate ? format(new Date(basicData?.applicationDate), "dd/MM/yyyy") : basicData?.applicationDate}
            />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={t(`WF_BPA_${basicData?.appliactionType}`)} />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={t(basicData?.applicationSubType)} />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={basicData?.planDetail?.planInformation?.occupancy} />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={t(`WF_BPA_${riskType}`)} />
            <Row
              className="border-none"
              label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)}
              text={basicData?.planDetail?.planInformation?.applicantName}
            />
          </StatusTable>
          {riskType ? <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={handleSubmit} disabled={!scrutinyNumber?.edcrNumber?.length} /> : <Loader />}
        </Card>
      )}
    </div>
  );
};

export default BasicDetails;
