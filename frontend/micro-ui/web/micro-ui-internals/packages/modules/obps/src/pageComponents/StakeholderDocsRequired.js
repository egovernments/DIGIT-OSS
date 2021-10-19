import React, { Fragment, useEffect } from "react";
import { Card, CardHeader, CardLabel, CardSubHeader, CardText, CitizenInfoLabel, Loader, SubmitBar,NavBar,OpenLinkContainer, BackButton } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const StakeholderDocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const history = useHistory();
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateId, "StakeholderRegistraition", "TradeTypetoRoleMapping");
  let isopenlink = window.location.href.includes("/openlink/");
  const isCitizenUrl = Digit.Utils.browser.isMobile()?true:false;

  useEffect(()=>{
    if(tenantId)
    Digit.LocalizationService.getLocale({modules: [`rainmaker-bpareg`], locale: Digit.StoreData.getCurrentLanguage(), tenantId: `${tenantId}`});
  },[tenantId])
  

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <Fragment>
      <div className={isopenlink? "OpenlinkContainer":""}>
      {isopenlink &&<OpenLinkContainer />}
      <div style={isopenlink?{marginTop:"60px", width:isCitizenUrl?"100%":"70%", marginLeft:"auto",marginRight:"auto"}:{}}>
      {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
      <Card>
        <CardHeader>{t(`BPA_NEW_BUILDING_HEADER`)}</CardHeader>
        <CitizenInfoLabel style={{margin:"0px",textAlign:"center"}} textStyle={{color:"#0B0C0C"}} text={t(`BPA_DOCS_REQUIRED_TIME`)} showInfo={false} />
        <CardText style={{ color: "#0B0C0C", marginTop: "12px" }}>{t(`BPA_NEW_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
        {isLoading ?
          <Loader /> :
          <Fragment>
            {data?.StakeholderRegistraition?.TradeTypetoRoleMapping?.[0]?.docTypes?.map((doc, index) => (
              <div key={index}>
              <CardLabel style={{fontWeight:700}}>{`${index + 1}. `}</CardLabel>
              <CardLabel style={{ fontWeight: 700, marginTop:"-39px", marginLeft:"20px" }}>{`${t(doc?.code.replace('.', '_'))}`}</CardLabel>
              </div>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={onSelect} />
      </Card>
      <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`OBPS_DOCS_FILE_SIZE`)} />
      </div>
      </div>
    </Fragment>
  );
};

export default StakeholderDocsRequired; 