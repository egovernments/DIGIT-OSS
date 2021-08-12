import React, { useState } from "react";
import { fromUnixTime, format } from 'date-fns';
import { Card, CardHeader, Label, SearchIconSvg, StatusTable, TextInput, Row, CardCaption, SubmitBar } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";

const BasicDetails = ({ formData, onSelect }) => {
  const [scrutinyNumber, setScrutinyNumber] = useState(formData?.edcrNumber);
  const [isDisabled, setIsDisabled] = useState(formData?.edcrNumber ? true : false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId, scrutinyNumber, {
    enabled: false
  })

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      refetch();
    }
  }

  return (
    <div>
      <Timeline />
      <Label>{t(`OBPS_SEARCH_EDCR_NUMBER`)}</Label>
      <TextInput className="searchInput" onKeyPress={handleKeyPress} onChange={event => setScrutinyNumber({ edcrNumber: event.target.value })} value={scrutinyNumber?.edcrNumber} signature={true} signatureImg={<SearchIconSvg className="signature-img" /> } />
      {data && <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={data?.applicationDate ? format(new Date(data?.applicationDate), 'dd/MM/yyyy') : data?.applicationDate} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={data?.appliactionType}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={data?.planDetail?.planInformation?.serviceType} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={data?.planDetail?.planInformation?.occupancy}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text="Medium" />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={data?.planDetail?.planInformation?.applicantName} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SPECIAL_CATEGORY_LABEL`)} text={'None'}/>
        </StatusTable>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={onSelect} />
      </Card>
      }
    </div>
  )
}

export default BasicDetails;
// DCR82021FCBZ0