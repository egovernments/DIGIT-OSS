import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, Loader, SubmitBar, Header } from "@egovernments/digit-ui-react-components";
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { getBPAFormData } from "../../../utils/index";

const getServiceType = () => {
  return `BPA_APPLICATIONTYPE_BUILDING_PLAN_SCRUTINY`;
};

const MyApplication = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [finalData, setFinalData] = useState([]);
  const [labelMessage, setLableMessage] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const userInfo = Digit.UserService.getUser();
  // const requestor = userInfo?.info?.mobileNumber;

  const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
  const userInfoData = userInfos ? JSON.parse(userInfos) : {};
  const userInfo = userInfoData?.value;
  const requestor = userInfo?.info?.mobileNumber;


  const { data, isLoading, revalidate } = Digit.Hooks.obps.useBPAREGSearch(tenantId, {}, {mobileNumber: requestor}, {cacheTime : 0});
  const { data: bpaData, isLoading: isBpaSearchLoading, revalidate: bpaRevalidate } = Digit.Hooks.obps.useBPASearch(tenantId, {
    requestor,
    mobileNumber: requestor,
    limit: 50 - (data?.Licenses?.length ? Number(data?.Licenses?.length) : 0),
    offset: 0,
  }, {enabled: !isLoading ? true : false});
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(Digit.ULBService.getStateId(), "BPA", ["RiskTypeComputation"]);

  const getBPAREGFormData = (data) => {
    let license = data;
    let intermediateData = {
      Correspondenceaddress:
        license?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress ||
        `${license?.tradeLicenseDetail?.address?.doorNo ? `${license?.tradeLicenseDetail?.address?.doorNo}, ` : ""} ${
          license?.tradeLicenseDetail?.address?.street ? `${license?.tradeLicenseDetail?.address?.street}, ` : ""
        }${license?.tradeLicenseDetail?.address?.landmark ? `${license?.tradeLicenseDetail?.address?.landmark}, ` : ""}${t(
          license?.tradeLicenseDetail?.address?.locality.code
        )}, ${t(license?.tradeLicenseDetail?.address?.city ? license?.tradeLicenseDetail?.address?.city.code : "")},${
          t(license?.tradeLicenseDetail?.address?.pincode) ? `${license.tradeLicenseDetail?.address?.pincode}` : " "
        }`,
      formData: {
        LicneseDetails: {
          PanNumber: license?.tradeLicenseDetail?.owners?.[0]?.pan,
          PermanentAddress: license?.tradeLicenseDetail?.owners?.[0]?.permanentAddress,
          email: license?.tradeLicenseDetail?.owners?.[0]?.emailId,
          gender: {
            code: license?.tradeLicenseDetail?.owners?.[0]?.gender,
            i18nKey: `COMMON_GENDER_${license?.tradeLicenseDetail?.owners?.[0]?.gender}`,
            value: license?.tradeLicenseDetail?.owners?.[0]?.gender,
          },
          mobileNumber: license?.tradeLicenseDetail?.owners?.[0]?.mobileNumber,
          name: license?.tradeLicenseDetail?.owners?.[0]?.name,
        },
        LicneseType: {
          LicenseType: {
            i18nKey: `TRADELICENSE_TRADETYPE_${license?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.split(".")[0]}`,
            role: [`BPA_${license?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.split(".")[0]}`],
            tradeType: license?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType,
          },
          ArchitectNo: license?.tradeLicenseDetail?.additionalDetail?.counsilForArchNo || null,
        },
      },
      isAddressSame:
        license?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress === license?.tradeLicenseDetail?.owners?.[0]?.permanentAddress ? true : false,
      result: {
        Licenses: [{ ...data }],
      },
      initiationFlow: true,
    };

    sessionStorage.setItem("BPAREGintermediateValue", JSON.stringify(intermediateData));
    history.push("/digit-ui/citizen/obps/stakeholder/apply/stakeholder-docs-required");
  };
  useEffect(() => {
    return () => {
      setFinalData([]);
      revalidate?.();
      bpaRevalidate?.();
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isBpaSearchLoading) {
      let searchConvertedArray = [];
      let sortConvertedArray = [];
      if (data?.Licenses?.length) {
        data?.Licenses?.forEach((license) => {
          license.sortNumber = 0;
          license.modifiedTime = license.auditDetails.lastModifiedTime;
          license.type = "BPAREG";
          searchConvertedArray.push(license);
        });
      }
      if (bpaData?.length) {
        bpaData?.forEach((bpaDta) => {
          bpaDta.sortNumber = 0;
          bpaDta.modifiedTime = bpaDta.auditDetails.lastModifiedTime;
          bpaDta.type = "BPA";
          searchConvertedArray.push(bpaDta);
        });
      }
      sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
        return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
      });
      setFinalData(sortConvertedArray);
      let userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
      const userInfoDetails = userInfos ? JSON.parse(userInfos) : {};
      if (userInfoDetails?.value?.info?.roles?.length == 1 && userInfoDetails?.value?.info?.roles?.[0]?.code == "CITIZEN") setLableMessage(true);
    }
  }, [isLoading, isBpaSearchLoading, bpaData, data]);

  if (isLoading || isBpaSearchLoading) {
    return <Loader />;
  }

  const getTotalCount = (LicensesLength, bpaDataLength) => {
    let count = 0;
    if (typeof LicensesLength == "number") {
      count = count + LicensesLength
    }

    if (typeof bpaDataLength == "number") {
      count = count + bpaDataLength
    }

    if (count > 0) return `(${count})`;
    else return ""
  }

  return (
    <Fragment>
      <Header styles={{marginLeft: "10px"}}>{`${t("BPA_MY_APPLICATIONS")} ${getTotalCount(data?.Licenses?.length, bpaData?.length)}`}</Header>
      {finalData?.map((application, index) => {
        if (application.type === "BPAREG") {
          return (
            <Card key={index}>
              <KeyNote keyValue={t("BPA_APPLICATION_NUMBER_LABEL")} note={application?.applicationNumber} />
              <KeyNote keyValue={t("BPA_LICENSE_TYPE")} note={t(`TRADELICENSE_TRADETYPE_${application?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0]}`)} />
              {application?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.includes('ARCHITECT') &&
                <KeyNote keyValue={t("BPA_COUNCIL_OF_ARCH_NO_LABEL")} note={application?.tradeLicenseDetail?.additionalDetail?.counsilForArchNo} />
              }
              <KeyNote keyValue={t("BPA_APPLICANT_NAME_LABEL")} note={application?.tradeLicenseDetail?.owners?.[0]?.name} />
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_STATUS")} note={t(`WF_ARCHITECT_${application?.status}`)} noteStyle={application?.status === "APPROVED" ? { color: "#00703C" } : { color: "#D4351C" }} />
              {application.status !== "INITIATED" ? <Link to={{ pathname: `/digit-ui/citizen/obps/stakeholder/${application?.applicationNumber}`, state: { tenantId: '' } }}>
                <SubmitBar label={t("TL_VIEW_DETAILS")} />
              </Link> :
                <SubmitBar label={t("BPA_COMP_WORKFLOW")} onSubmit={() => getBPAREGFormData(application)} />}
            </Card>
          )
        } else {
          return (
            <Card key={index}>
              <KeyNote keyValue={t("BPA_APPLICATION_NUMBER_LABEL")} note={application?.applicationNo} />
              <KeyNote keyValue={t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")} note={application?.businessService !== "BPA_OC" ? t(`WF_BPA_BUILDING_PLAN_SCRUTINY`) : t(`WF_BPA_BUILDING_OC_PLAN_SCRUTINY`)} />
              <KeyNote keyValue={t("BPA_COMMON_SERVICE")} note={t(`BPA_SERVICETYPE_NEW_CONSTRUCTION`)} />
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_STATUS")} note={t(`WF_BPA_${application?.state}`)} noteStyle={application?.status === "APPROVED" ? { color: "#00703C" } : { color: "#D4351C" }} />
              <KeyNote keyValue={t("BPA_COMMON_SLA")} note={typeof(application?.sla) == "string" && application?.sla?.includes("NA") ? t(`${`CS_NA`}`) : application?.sla} />
              {application.action === "SEND_TO_ARCHITECT" || application.status !== "INITIATED" ? <Link to={{ pathname: `/digit-ui/citizen/obps/bpa/${application?.applicationNo}`, state: { tenantId: '' } }}>
                <SubmitBar label={t("TL_VIEW_DETAILS")} />
              </Link> :
                <div>
                  {labelMessage ?
                    <Link to={{ pathname: `/digit-ui/citizen/obps/bpa/${application?.applicationNo}`, state: { tenantId: '' } }}>
                      <SubmitBar label={t("TL_VIEW_DETAILS")} />
                    </Link> : <SubmitBar label={t("BPA_COMP_WORKFLOW")} onSubmit={() => getBPAFormData(application, mdmsData, history, t)} />}
                </div>
              }
            </Card>
          )
        }
      })}

      <div style={{ marginLeft: "16px", marginTop: "16px", marginBottom: "46px" }}>
        <span>{`${t("BPA_NOT_ABLE_TO_FIND_APP_MSG")} `} </span>
        <span className="link">
          <Link to="/digit-ui/citizen/obps/search/obps-application">{t("BPA_CLICK_HERE_TO_SEARCH_LINK")}</Link>
        </span>
      </div>
    </Fragment>
  );
};

export default MyApplication;
