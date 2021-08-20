import { Card, CardCaption, TextInput, CardHeader, Label, StatusTable, Row, SubmitBar, Loader, FormStep } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Timeline from "../components/Timeline";

const PlotDetails = ({ formData, onSelect, config }) => {
  const { t } = useTranslation();
  const [holdingNumber, setHoldingNumber] = useState("");
  const [registrationDetails, setRegistrationDetails] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data, isLoading } = Digit.Hooks.obps.useScrutinyDetails("pb.amritsar", formData?.data?.scrutinyNumber)
  
  const handleSubmit = (data) => {
    onSelect(config?.key, { ...data });
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Timeline />
      <FormStep config={config} onSelect={handleSubmit} childrenAtTheBottom={false} t={t} _defaultValues={formData?.data}>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BOUNDARY_PLOT_AREA_LABEL`)} text={data?.planDetail?.planInformation?.plotArea} />
          <Row className="border-none" label={t(`BPA_BOUNDARY_PLOT_NO_LABEL`)} text={data?.planDetail?.planInformation?.plotNo} />
          <Row className="border-none" label={t(`BPA_BOUNDARY_KHATA_NO_LABEL`)} text={data?.planDetail?.planInformation?.khataNo}/>
        </StatusTable>
      </FormStep>
    </div>
  )
};

export default PlotDetails;