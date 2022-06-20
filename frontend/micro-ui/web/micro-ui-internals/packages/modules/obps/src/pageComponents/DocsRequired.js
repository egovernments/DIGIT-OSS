import React, { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, CardLabel, CardText, CitizenInfoLabel, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const DocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const history = useHistory();
  const { applicationType: applicationType, serviceType: serviceType } = useParams();
  const [docsList, setDocsList] = useState([]);
  const [uiFlow, setUiFlow] = useState([]);
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", "DocumentTypes");
  const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateCode, "common-masters", ["DocumentType"]);
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["RiskTypeComputation"]);
  const userInfo = Digit.UserService.getUser();
  const queryObject = { 0: { tenantId: stateCode }, 1: { id: userInfo?.info?.id } };
  const { data: LicenseData, isLoading:LicenseDataLoading } = Digit.Hooks.obps.useBPAREGSearch(tenantId, queryObject);
  const checkingUrl = window.location.href.includes("ocbpa");
  sessionStorage.removeItem("clickOnBPAApplyAfterEDCR");

  const { data:homePageUrlLinks , isLoading: homePageUrlLinksLoading } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["homePageUrlLinks"]);


  const goNext = () => {
    if(JSON.parse(sessionStorage.getItem("BPAintermediateValue")) !== null)
    {
    let formData = JSON.parse(sessionStorage.getItem("BPAintermediateValue"))
    sessionStorage.setItem("BPAintermediateValue",null);
    onSelect("",formData);
    }
    else
    onSelect("uiFlow", uiFlow);
  }

  useEffect(() => {
    let architectName = "", isDone = true;
    for (let i = 0; i < LicenseData?.Licenses?.length; i++) {
      if (LicenseData?.Licenses?.[i]?.status === "APPROVED" && isDone) {
        isDone = false;
        architectName = LicenseData?.Licenses?.[i]?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0] || "ARCHITECT";
        sessionStorage.setItem("BPA_ARCHITECT_NAME", JSON.stringify(architectName));
      }
    }
  }, [LicenseData])

  useEffect(() => {
    if (!homePageUrlLinksLoading) {
      const windowUrl = window.location.href.split('/');
      const serviceType = windowUrl[windowUrl.length - 2];
      const applicationType = windowUrl[windowUrl.length - 3];
      homePageUrlLinks?.BPA?.homePageUrlLinks?.map(linkData => {
        if(applicationType?.toUpperCase() === linkData?.applicationType && serviceType?.toUpperCase() === linkData?.serviceType) {
          setUiFlow({
            flow: linkData?.flow,
            applicationType: linkData?.applicationType,
            serviceType: linkData?.serviceType
          });
        }
      });
    }
  }, [!homePageUrlLinksLoading]);

  useEffect(() => {
    if (!isLoading) {
      let unique = [], distinct = [], uniqueData = [], uniqueList = [];
      const windowUrl = window.location.href.split('/');
      const serviceType = windowUrl[windowUrl.length - 2];
      const applicationType = windowUrl[windowUrl.length - 3];
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
        uniqueList?.[0]?.forEach(doc => {
          let code = doc.code; doc.dropdownData = [];
          commonDocs?.["common-masters"]?.DocumentType?.forEach(value => {
            let values = value.code.slice(0, code.length);
            if (code === values) {
              doc.hasDropdown = true;
              value.i18nKey = value.code;
              doc.dropdownData.push(value);
            }
          });
        });
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
        <CardHeader>{checkingUrl ? t(`BPA_OOCUPANCY_CERTIFICATE_APP_LABEL`) : t(`OBPS_NEW_BUILDING_PERMIT`)}</CardHeader>
        {/* TODO: Change text styles */}
        {/* <CitizenInfoLabel style={{margin:"0px"}} textStyle={{color:"#0B0C0C"}} text={t(`OBPS_DOCS_REQUIRED_TIME`)} showInfo={false} /> */}
        <CardText style={{ color: "#0B0C0C", marginTop: "12px", fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>{t(`OBPS_NEW_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
        {isLoading ?
          <Loader /> :
          <Fragment>
            {docsList?.[0]?.map((doc, index) => (
              <div>
                <div style={{ fontWeight: 700, marginBottom: "8px" }} key={index}>
                  <div style={{ display: "flex" }}>
                    <div>{`${index + 1}.`}&nbsp;</div>
                    <div>{` ${t(doc?.code.replace('.', '_'))}`}</div>
                  </div>
                </div>
                <div style={{marginBottom: "16px"}}>
                  {doc?.dropdownData?.map((value, index) => doc?.dropdownData?.length !== index + 1 ? <span>{`${t(value?.i18nKey)}, `}</span> : <span>{`${t(value?.i18nKey)}`}</span> )}
                </div>
              </div>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
      <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`OBPS_DOCS_FILE_SIZE`)} className={"info-banner-wrap-citizen-override"}/>
    </Fragment>
  );
};

export default DocsRequired;