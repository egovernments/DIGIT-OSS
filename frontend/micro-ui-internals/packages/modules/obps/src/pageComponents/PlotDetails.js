import { Card, CardCaption, TextInput, CardHeader, Label, StatusTable, Row, SubmitBar, Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Timeline from "../components/Timeline";

const PlotDetails = ({ formData, onSelect, key }) => {
  const { t } = useTranslation();
  const [holdingNumber, setHoldingNumber] = useState("");
  const [registrationDetails, setRegistrationDetails] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data, isLoading } = Digit.Hooks.obps.useScrutinyDetails(tenantId, formData?.data?.scrutinyNumber)
  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Timeline />
      <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_PLOT_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row label={t(`BPA_BOUNDARY_PLOT_AREA_LABEL`)} text={data?.planDetail?.planInformation?.plotArea} />
          <Row label={t(`BPA_BOUNDARY_PLOT_NO_LABEL`)} text={data?.planDetail?.planInformation?.plotNo} />
          <Row label={t(`BPA_BOUNDARY_KHATA_NO_LABEL`)} text={data?.planDetail?.planInformation?.khataNo}/>
        </StatusTable>
        <Label>{t(`BPA_BOUNDARY_HOLDING_NO_LABEL`)}</Label>
        <TextInput type="text" value={holdingNumber} onChange={e => setHoldingNumber(e.target.value)} />
        <Label>{t(`BPA_BOUNDARY_LAND_REG_DETAIL_LABEL`)}</Label>
        <TextInput type="text" value={registrationDetails} onChange={e => setRegistrationDetails(e.target.value)}  />
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={onSelect} />
      </Card>
    </div>
  )
};

export default PlotDetails;