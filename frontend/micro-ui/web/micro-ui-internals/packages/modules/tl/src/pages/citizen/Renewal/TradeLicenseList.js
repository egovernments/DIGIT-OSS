import { Card, KeyNote, SubmitBar, Toast } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { convertEpochToDateCitizen, getvalidfromdate } from "../../../utils/index";
import {TLSearch} from "../../../../../../libraries/src/services/molecules/TL/Search";
import cloneDeep from "lodash/cloneDeep";

const TradeLicenseList = ({ application }) => {
  sessionStorage.setItem("isDirectRenewal", true);
  const history = useHistory();
  const owners = application?.tradeLicenseDetail?.owners;
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [allowedToNextYear, setAllowedToNextYear] = useState(false);
  const [oldRenewalAppNo, setoldRenewalAppNo] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [latestRenewalYearofAPP, setlatestRenewalYearofAPP] = useState("");
  const [numOfApplications, setNumberOfApplications] = useState([]);
  const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");
  let mdmsFinancialYear = fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter((y) => y.module === "TL") : [];
  let isrenewalspresent = false;

  async function apicall(application) {
    let res = await Digit.TLService.TLsearch({ tenantId: application.tenantId, filters: { licenseNumbers: application.licenseNumber } });
    let Licenses = res.Licenses;
    let FY = getvalidfromdate("", mdmsFinancialYear).finYearRange;
    Licenses &&
      Licenses.map((ob) => {
        if (ob.financialYear === FY) {
          isrenewalspresent = true;
        }
      });
    if (isrenewalspresent && Licenses) {
      alert(t("TL_RENEWAL_PRESENT_ERROR"));
    } else if (Licenses) {
      history.push(`/digit-ui/citizen/tl/tradelicence/edit-application/action-edit/${application.applicationNumber}`);
    }
  }

  const getToastMessages = () => {
    if(isrenewalspresent){
      setShowToast({ error: true, label: `${t("TL_RENEWAL_PRESENT_ERROR")}` });
    }
    else if(allowedToNextYear == false && oldRenewalAppNo && application?.status !== "MANUALEXPIRED")
    {
      setShowToast({ error: true, label: `${t("TL_ERROR_TOAST_RENEWAL_1")} ${oldRenewalAppNo} ${t("TL_ERROR_TOAST_RENEWAL_2")}` });
    }
    else if(application?.status === "CANCELLED")
    {
      setShowToast({ error: true, label: `${t("TL_ERROR_TOAST_RENEWAL_CANCEL")}` });
    }
    else if(/* latestRenewalYearofAPP &&  */application?.status === "MANUALEXPIRED")
    {
      setShowToast({ error: true, label: `${t("TL_ERROR_TOAST_MUTUALLY_EXPIRED")}` });
    }
  }

  const onsubmit = async() => {
    const licenseNumbers = application?.licenseNumber;
    const filters = { licenseNumbers, offset: 0 };
    let numOfApplications = await TLSearch.numberOfApplications(application?.tenantId, filters);
    let allowedToNextYear= false;
    isrenewalspresent = false;
    let latestRenewalYearofAPP = "";
    let financialYear = cloneDeep(application?.financialYear);
      const financialYearDate = financialYear?.split('-')[1];
      const finalFinancialYear = `20${Number(financialYearDate)}-${Number(financialYearDate)+1}`
      const latestFinancialYear = Math.max.apply(Math, numOfApplications?.filter(ob => ob.licenseNumber === application?.licenseNumber)?.map(function(o){return parseInt(o.financialYear.split("-")[0])}))
      const isAllowedToNextYear = numOfApplications?.filter(data => (data.financialYear == finalFinancialYear && data?.status !== "REJECTED"));
    let FY = getvalidfromdate("", mdmsFinancialYear).finYearRange;
    numOfApplications &&
    numOfApplications.map((ob) => {
        if (ob.financialYear === FY) {
          isrenewalspresent = true;
        }
      });
      if (isAllowedToNextYear?.length > 0){
         setAllowedToNextYear(false);
         setoldRenewalAppNo(isAllowedToNextYear?.[0]?.applicationNumber);
      }
      if(!(application?.financialYear.includes(`${latestFinancialYear}`))) {
        latestRenewalYearofAPP = application?.financialYear;
        setlatestRenewalYearofAPP(application?.financialYear);
      }
      if (!isAllowedToNextYear || isAllowedToNextYear?.length == 0){
        allowedToNextYear = true;
        setAllowedToNextYear(true);
      }
    setNumberOfApplications(numOfApplications)
    if(isrenewalspresent || allowedToNextYear == false || application?.status === "CANCELLED" || (application?.status === "MANUALEXPIRED" /* && latestRenewalYearofAPP */))
    getToastMessages();
    else
    history.push(`/digit-ui/citizen/tl/tradelicence/renew-trade/${application.licenseNumber}/${application.tenantId}`);
  };
  return (
    <React.Fragment>
    <Card>
      <KeyNote keyValue={t("TL_LOCALIZATION_TRADE_NAME")} note={application.tradeName} />
      <KeyNote keyValue={t("TL_LICENSE_NUMBERL_LABEL")} note={application.licenseNumber} />
      <KeyNote
        keyValue={t("TL_LOCALIZATION_OWNER_NAME")}
        note={owners.map((owners, index) => (
          <div key="index">{index == owners.length - 1 ? owners?.name + "," : owners.name}</div>
        ))}
      />
      <KeyNote
        keyValue={t("TL_LOCALIZATION_LICENSE_STATUS")}
        note={
          application.status === "APPROVED"
            ? t("TL_ACTIVE_STATUS_MSG") + " " + convertEpochToDateCitizen(application.validTo)
            : t("TL_EXPIRED_STATUS_MSG") + convertEpochToDateCitizen(application.validTo) + " " + t("TL_EXPIRED_STATUS_MSG_1")
        }
      />
      <SubmitBar label={t("TL_RENEW_LABEL")} onSubmit={onsubmit} />
    </Card>
    {showToast && (
        <Toast
          isDleteBtn={true}
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default TradeLicenseList;
