import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, KeyNote, Loader, SubmitBar, Header } from "@egovernments/digit-ui-react-components";
import { Fragment } from "react";
import { Link } from "react-router-dom";

const getServiceType = () => {
  return `BPA_APPLICATIONTYPE_BUILDING_PLAN_SCRUTINY`
}

const MyApplication = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data, isLoading } = Digit.Hooks.obps.useBPASearch(tenantId, { limit: -1, offset: 0 });

  if (isLoading) {
    return <Loader />
  }
  return (
    <Fragment>
      <Header>{`${t("BPA_MY_APPLICATIONS")} (${data?.length})`}</Header>
      {data.map((application, index) => (
        <Card key={index}>
          <KeyNote keyValue={t("BPA_COMMON_APP_NO")} note={application?.applicationNo} />
          <KeyNote keyValue={t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")} note={t(`WF_BPA_BUILDING_PLAN_SCRUTINY`)} />
          <KeyNote keyValue={t("BPA_COMMON_SERVICE")} note={t(`BPA_SERVICETYPE_NEW_CONSTRUCTION`)} />
          <KeyNote keyValue={t("TL_COMMON_TABLE_COL_STATUS")} note={t(`WF_BPA_${application?.state}`)} />
          <KeyNote keyValue={t("BPA_COMMON_SLA")} note={application?.sla} />
          <Link to={{ pathname: ``, state: { tenantId: '' } }}>
            <SubmitBar label={t("TL_VIEW_DETAILS")} />
          </Link>
        </Card>
      ))}
    </Fragment>
  )
};

export default MyApplication;