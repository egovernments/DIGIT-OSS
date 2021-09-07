import React, { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, CardLabel, CardText, CitizenInfoLabel, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const DocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const history = useHistory();
  const [docsList, setDocsList] = useState([]);
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", "DocumentTypes");

  const goNext = () => {
    if(history?.location?.state?.edcrNumber) {
      onSelect("edcrNumber", {edcrNumber: history?.location?.state?.edcrNumber});
    } else {
      onSelect();
    } 
  }

  useEffect(() => {
    if (!isLoading) {
      const rest = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
      const serviceType = rest.split('/').pop();
      const applicationTypeUrl = rest.substring(0, rest.lastIndexOf("/"));
      const applicationType = applicationTypeUrl.split('/').pop();
      let unique = [], distinct = [], uniqueData = [], uniqueList = [];
      for (let i = 0; i < data.length; i++) {
        if (!unique[data[i].applicationType] && !unique[data[i].ServiceType]) {
          distinct.push(data[i].applicationType);
          unique[data[i].applicationType] = data[i];
        }
      }
      Object.values(unique).map(indData => {
        if (indData?.applicationType == applicationType?.toUpperCase() && indData?.ServiceType == serviceType?.toUpperCase()) {
          uniqueList.push(indData?.docTypes);
        }
        setDocsList(uniqueList);
      })
    }
  }, [!isLoading]);

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
            {docsList?.[0]?.map((doc, index) => (
              <CardLabel style={{ fontWeight: 700 }} key={index}>{`${index + 1}. ${t(doc?.code.replace('.', '_'))}`}</CardLabel>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
      <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`OBPS_DOCS_FILE_SIZE`)} />
    </Fragment>
  );
};

export default DocsRequired;