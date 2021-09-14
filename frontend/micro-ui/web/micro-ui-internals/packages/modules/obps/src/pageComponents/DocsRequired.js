import React, { Fragment } from "react";
import { Card, CardHeader, CardLabel, CardText, CitizenInfoLabel, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const DocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const history = useHistory();
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(state, "BPA", "DocumentTypes");

  const goNext = () => {
    if(history?.location?.state?.edcrNumber) {
      onSelect("edcrNumber", {edcrNumber: history?.location?.state?.edcrNumber});
    } else {
      onSelect();
    } 
  }

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>{t(`OBPS_NEW_BUILDING_PERMIT`)}</CardHeader>
        {/* TODO: Change text styles */}
        <CitizenInfoLabel text={t(`OBPS_DOCS_REQUIRED_TIME`)} showInfo={false} />
        <CardText style={{ color: "#0B0C0C", marginTop: "12px" }}>{t(`OBPS_NEW_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
        {isLoading ?
          <Loader /> :
          <Fragment>
            {data?.[0]?.docTypes?.map((doc, index) => (
              <CardLabel style={{ fontWeight: 700 }} key={index}>{`${index + 1}. ${t(doc?.code.replace('.', '_'))}`}</CardLabel>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
      <CitizenInfoLabel text={t(`OBPS_DOCS_FILE_SIZE`)} />
    </Fragment>
  );
};

export default DocsRequired;