import React, { useState } from "react";
import { Card, CardHeader, Label, SearchIconSvg, StatusTable, TextInput, Row, CardCaption, SubmitBar } from "@egovernments/digit-ui-react-components";
import Timeline from "./Timeline";
import { useTranslation } from "react-i18next";

const BasicDetails = () => {
  const [scrutinyNumber, setScrutinyNumber] = useState(null);
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
          <Row label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={data?.applicationDate} />
          <Row label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={data?.appliactionType}/>
          <Row label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={'New Construction'}/>
          <Row label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={'Residential'}/>
          <Row label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text="Medium" />
          <Row label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={'Nawal Kumar'}/>
          <Row label={t(`BPA_BASIC_DETAILS_SPECIAL_CATEGORY_LABEL`)} text={'None'}/>
        </StatusTable>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} />
      </Card>
      }
    </div>
  )
}

export default BasicDetails;
