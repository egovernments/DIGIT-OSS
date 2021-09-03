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
  const { data, isLoading } = Digit.Hooks.obps.useBPAREGSearch(tenantId, { limit: -1, offset: 0 });

  if (isLoading) {
    return <Loader />
  }
  return (
    <Fragment>
      <Header>{`${t("BPA_MY_APPLICATIONS")} (${data?.Licenses?.length})`}</Header>
      {data?.Licenses?.map((application, index) => (
        <Card key={index}>
          <KeyNote keyValue={t("BPA_LICENSE_TYPE")} note={t(`TRADELICENSE_TRADETYPE_${application?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0]}`)} />
          {application?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.includes('ARCHITECT') &&
            <KeyNote keyValue={t("BPA_COUNCIL_FOR_ARCH_NO_LABEL")} note={application?.tradeLicenseDetail?.additionalDetail?.counsilForArchNo} />
          }
          <KeyNote keyValue={t("BPA_COMMON_NAME_LABEL")} note={application?.tradeLicenseDetail?.owners?.[0]?.name} />
          <KeyNote keyValue={t("TL_COMMON_TABLE_COL_STATUS")} note={t(`WF_ARCHITECT_${application?.status}`)} />
          {/* <KeyNote keyValue={t("BPA_COMMON_SLA")} note={application?.sla} /> */}
          <Link to={{ pathname: ``, state: { tenantId: '' } }}>
            <SubmitBar label={t("TL_VIEW_DETAILS")} />
          </Link>
        </Card>
      ))}
    </Fragment>
  )
};

export default MyApplication;