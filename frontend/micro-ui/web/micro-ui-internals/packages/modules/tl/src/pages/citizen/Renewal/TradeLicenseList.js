import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { convertEpochToDateCitizen, getvalidfromdate } from "../../../utils/index";

const TradeLicenseList = ({ application }) => {
  sessionStorage.setItem("isDirectRenewal", true);
  const history = useHistory();
  const owners = application?.tradeLicenseDetail?.owners;
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");
  let mdmsFinancialYear = fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter(y => y.module === "TL") : [];
  let isrenewalspresent = false;

  async function apicall(application) {
    let res = await Digit.TLService.TLsearch({ tenantId: application.tenantId, filters: { licenseNumbers: application.licenseNumber } });
    let Licenses = res.Licenses;
    let FY = getvalidfromdate("", mdmsFinancialYear).finYearRange;
    Licenses && Licenses.map((ob) => {
      if (ob.financialYear === FY) {
        isrenewalspresent = true;
      }
    })
    if (isrenewalspresent && Licenses) {
      alert(t("TL_RENEWAL_PRESENT_ERROR"));
    }
    else if (Licenses) {
      history.push(`/digit-ui/citizen/tl/tradelicence/edit-application/action-edit/${application.applicationNumber}`);
    }
  }
  const onsubmit = () => {
    history.push(`/digit-ui/citizen/tl/tradelicence/renew-trade/${application.licenseNumber}/${application.tenantId}`);
  }
  return (
    <Card>
      <KeyNote keyValue={t("TL_LOCALIZATION_TRADE_NAME")} note={application.tradeName} />
      <KeyNote keyValue={t("TL_LICENSE_NUMBERL_LABEL")} note={application.licenseNumber} />
      <KeyNote keyValue={t("TL_LOCALIZATION_OWNER_NAME")} note={owners.map((owners, index) => (
        <div key="index">{index == owners.length - 1 ? owners?.name + "," : owners.name}</div>
      ))} />
      <KeyNote keyValue={t("TL_LOCALIZATION_LICENSE_STATUS")} note={application.status === "APPROVED" ? t("TL_ACTIVE_STATUS_MSG") + " " + convertEpochToDateCitizen(application.validTo) : t("TL_EXPIRED_STATUS_MSG") + convertEpochToDateCitizen(application.validTo) + " " + t("TL_EXPIRED_STATUS_MSG_1")} />
      <SubmitBar label={t("TL_RENEW_LABEL")} onSubmit={onsubmit} />
    </Card>
  );
};

export default TradeLicenseList;