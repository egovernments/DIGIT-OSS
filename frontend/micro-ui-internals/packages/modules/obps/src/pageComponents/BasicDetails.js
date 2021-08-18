import React, { useState } from "react";
import { fromUnixTime, format } from 'date-fns';
import { Card, CardHeader, Label, SearchIconSvg, StatusTable, TextInput, Row, CardCaption, SubmitBar } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";

const BasicDetails = ({ formData, onSelect, config }) => {
  const [scrutinyNumber, setScrutinyNumber] = useState(formData?.data?.scrutinyNumber);
  const [isDisabled, setIsDisabled] = useState(formData?.data?.scrutinyNumber ? true : false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId.split(".")[0];
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(state, "BPA", ["RiskTypeComputation"]);
  const { data, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId, scrutinyNumber, {
    enabled: formData?.data?.scrutinyNumber ? true : false
  })

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      refetch();
    }
  }

  const handleSubmit = (event) => {
    onSelect(config?.key, { scrutinyNumber, applicantName: data?.planDetail?.planInformation?.applicantName, appliicantType: data?.appliactionType })
  }

  return (
    <div>
      <Timeline />
      <Label>{t(`OBPS_SEARCH_EDCR_NUMBER`)}</Label>
      <TextInput className="searchInput"
        onKeyPress={handleKeyPress}
        onChange={event => setScrutinyNumber({ edcrNumber: event.target.value })} value={scrutinyNumber?.edcrNumber} signature={true} signatureImg={<SearchIconSvg className="signature-img" onClick={() => refetch()} /> }
        disable={isDisabled}
        style={{ marginBottom: "10px" }}
      />
      {data && <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={data?.applicationDate ? format(new Date(data?.applicationDate), 'dd/MM/yyyy') : data?.applicationDate} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={data?.appliactionType}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={data?.applicationSubType} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={data?.planDetail?.planInformation?.occupancy}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, data?.planDetail?.plot?.area, data?.planDetail?.blocks)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={data?.planDetail?.planInformation?.applicantName} />
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