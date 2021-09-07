import React, { useEffect, useState } from "react";
import { fromUnixTime, format } from 'date-fns';
import { Card, CardHeader, Label, SearchIconSvg, Toast, StatusTable, TextInput, Row, CardCaption, SubmitBar, Loader } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";

const BasicDetails = ({ formData, onSelect, config }) => {
  const [showToast, setShowToast] = useState(null);
  const [basicData, setBasicData] = useState(null)
  const [scrutinyNumber, setScrutinyNumber] = useState(formData?.data?.scrutinyNumber);
  const [isDisabled, setIsDisabled] = useState(formData?.data?.scrutinyNumber ? true : false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId.split(".")[0];
  //TODO will change this is future
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(state, "BPA", ["RiskTypeComputation"]);
  const { data, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId, scrutinyNumber, {
    enabled: formData?.data?.scrutinyNumber ? true : false
  })

  const { data: bpaData, isLoading: isSearchLoading, refetch: refetchBPASearch } = Digit.Hooks.obps.useBPASearch(tenantId, scrutinyNumber, {
    enabled: formData?.data?.scrutinyNumber ? true : false
  })

  useEffect(() => {
    if (data === undefined || bpaData === undefined) return;
    const result = bpaData?.find(bpa => {
      return bpa?.edcrNumber === scrutinyNumber?.edcrNumber
    });
    result !== undefined ? setShowToast(true) : setBasicData(data);
  }, [data, bpaData])

  useEffect(() => {
    setTimeout(closeToast, 5000);
  }, showToast)

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setBasicData(null);
      refetch();
      refetchBPASearch()
    }
  }

  const closeToast = () => {
    setShowToast(null);
  };

  const handleSearch = (event) => {
    setBasicData(null)
    refetch();
    refetchBPASearch();
  }

  const handleSubmit = (event) => {
    onSelect(config?.key, { scrutinyNumber, applicantName: data?.planDetail?.planInformation?.applicantName, occupancyType:data?.planDetail?.planInformation?.occupancy, applicationType: data?.appliactionType, serviceType: data?.applicationSubType, applicationDate: data?.applicationDate, riskType: Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, data?.planDetail?.plot?.area, data?.planDetail?.blocks)  })
  }

  if (isMdmsLoading) {
    return <Loader />
  }

  return (
    <div>
      {showToast && <Toast
        error={true}
        label={t(`APPLICATION_NUMBER_ALREADY_EXISTS`)}
        onClose={closeToast}
      />
      }
      <Timeline />
      <div className="obps-search">
        <Label>{t(`OBPS_SEARCH_EDCR_NUMBER`)}</Label>
        <TextInput className="searchInput"
          onKeyPress={handleKeyPress}
          onChange={event => setScrutinyNumber({ edcrNumber: event.target.value })} value={scrutinyNumber?.edcrNumber} signature={true} signatureImg={<SearchIconSvg className="signature-img" onClick={() => handleSearch()} /> }
          disable={isDisabled}
          style={{ marginBottom: "10px" }}
        />
      </div>
      {(isSearchLoading || isLoading) && <Loader /> }
      {basicData && <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={basicData?.applicationDate ? format(new Date(basicData?.applicationDate), 'dd/MM/yyyy') : basicData?.applicationDate} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={t(`WF_BPA_${basicData?.appliactionType}`)}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={t(basicData?.applicationSubType)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={basicData?.planDetail?.planInformation?.occupancy}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={t(`WF_BPA_${Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, basicData?.planDetail?.plot?.area, basicData?.planDetail?.blocks)}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={basicData?.planDetail?.planInformation?.applicantName} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SPECIAL_CATEGORY_LABEL`)} text={'None'}/>
        </StatusTable>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={handleSubmit} />
      </Card>
      }
    </div>
  )
}

export default BasicDetails;
// DCR82021FCBZ0