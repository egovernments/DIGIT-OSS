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
      {/* {isopenlink &&<OpenLinkContainer />} */}
      {/* <div style={isopenlink?{marginTop:"60px", width:isCitizenUrl?"100%":"70%", marginLeft:"auto",marginRight:"auto"}:{}}> */}
      <Card>
        <CardHeader>{t(`BPA_NEW_BUILDING_HEADER`)}</CardHeader>
        {/* <CitizenInfoLabel style={{margin:"0px",textAlign:"center"}} textStyle={{color:"#0B0C0C"}} text={t(`BPA_DOCS_REQUIRED_TIME`)} showInfo={false} /> */}
        <CardText style={{ color: "#0B0C0C", marginTop: "12px", fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>{t(`BPA_NEW_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
        {isLoading ?
          <Loader /> :
          <Fragment>
            {data?.StakeholderRegistraition?.TradeTypetoRoleMapping?.[0]?.docTypes?.map((doc, index) => (
              <div>
                <div style={{ fontWeight: 700, marginBottom: "8px" }} key={index}>
                  <div style={{ display: "flex" }}>
                    <div style={{ minWidth: "20px" }}>{`${index + 1}.`}&nbsp;</div>
                    <div>{` ${t(`BPAREG_HEADER_${doc?.code.replace('.', '_')}`)}`}</div>
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ minWidth: "20px" }}></div>
                    {doc?.info ? <div style={{color: "#505A5F", fontSize: "16px"}}>{`${t(doc?.info.replace('.', '_'))}`}</div> : null}
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={onSelect} />
      </Card>
      <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`OBPS_DOCS_FILE_SIZE`)} className={"info-banner-wrap-citizen-override"} />
      </div>
      {/* </div> */}
    </Fragment>
  );
};

export default StakeholderDocsRequired; 