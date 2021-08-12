import React, { Fragment } from "react";
import { Card, CardHeader, CardLabel, CardText, CitizenInfoLabel, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const DocsRequired = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId.split(".")[0];
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(state, "BPA", "DocumentTypes");
  return (
    <Card>
      <CardHeader>{t(`OBPS_NEW_BUILDING_PERMIT`)}</CardHeader>
      {/* TODO: Change text styles */}
      <CitizenInfoLabel text={`You need 15 minutes`} showInfo={false} />
      <CardText>{t(`OBPS_NEW_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
      {isLoading ? 
        <Loader /> :
        <Fragment>
          {data?.[0]?.docTypes?.map((doc, index) => (
            <CardLabel key={index}>{t(doc?.code.replace('.', '_'))}</CardLabel>
          ))}
        </Fragment>
      }
      <SubmitBar label={t(`CS_COMMON_NEXT`)} />
      <CitizenInfoLabel text={`Maximum file size allowed is 5MB.`} />
    </Card>
  );
};

export default DocsRequired;