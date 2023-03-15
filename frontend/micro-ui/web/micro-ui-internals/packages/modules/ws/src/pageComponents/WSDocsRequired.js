import React, { Fragment } from "react";
import { Card, CardHeader, SubmitBar, CitizenInfoLabel, CardText, Loader, CardSubHeader, BackButton, BreadCrumb, Header, CardLabel, CardSectionHeader, CardCaption, ActionBar, PrintBtnCommon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

const WSDocsRequired = ({ onSelect, userType, onSkip, config }) => {
  const { t } = useTranslation();
  const history = useHistory()
  const match = useRouteMatch();
  const tenantId = Digit.ULBService.getStateId();
  const goNext = () => {
    onSelect("DocsReq", "");
  }

  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");
  sessionStorage.removeItem("FORMSTATE_ERRORS");

  const { isLoading: wsDocsLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId);

  if (userType === "citizen") {
    return (
      <Fragment>
        <Card>
          <CardHeader>{t(`WS_COMMON_APPL_NEW_CONNECTION`)}</CardHeader>
          <CitizenInfoLabel style={{ margin: "0px", textAlign: "center" }} textStyle={{ color: "#0B0C0C" }} text={t(`WS_DOCS_REQUIRED_TIME`)} showInfo={false} />
          <CardText style={{ color: "#0B0C0C", marginTop: "12px" }}>{t(`WS_NEW_CONNECTION_TEST_1`)}</CardText>
          <CardText style={{ color: "#0B0C0C", marginTop: "12px" }}>{t(`WS_NEW_CONNECTION_TEST_2`)}</CardText>
          <CardSubHeader>{t("WS_DOC_REQ_SCREEN_LABEL")}</CardSubHeader>
          <CardText style={{ color: "#0B0C0C", marginTop: "12px" }}>{t(`WS_NEW_CONNECTION_TEST_3`)}</CardText>
          {wsDocsLoading ?
            <Loader /> :
            <Fragment>
              {wsDocs?.Documents?.map((doc, index) => (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "8px" }} key={index}>
                    <div style={{ display: "flex" }}>
                      <div>{`${index + 1}.`}&nbsp;</div>
                      <div>{` ${t(doc?.code.replace('.', '_'))}`}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px", marginLeft: "18px" }}>
                    {doc?.dropdownData?.map((value, index) => doc?.dropdownData?.length !== index + 1 ? <span>{`${t(value?.i18nKey)}, `}</span> : <span>{`${t(value?.i18nKey)}`}</span>)}
                  </div>
                </div>
              ))}
            </Fragment>
          }
          <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
        </Card>
      </Fragment>
    );
  }

  const printDiv = () => {
    let content = document.getElementById("documents-div").innerHTML;
    //APK button to print required docs
    if(window.mSewaApp && window.mSewaApp.isMsewaApp()){
      window.mSewaApp.downloadBase64File(window.btoa(content), t("WS_REQ_DOCS"));
    }
    else{
    let printWindow = window.open("", "");
    printWindow.document.write(`<html><body>${content}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    }
  };
  

  return (
    <div style={{ margin: "16px" }}>
      <div>
        <Header styles={{ fontSize: "32px", marginLeft: "18px", display: "flex", justifyContent: "space-between", marginRight: "12px" }}>
          <div>
            {t("WS_WATER_AND_SEWERAGE_NEW_CONNECTION_LABEL")}
          </div>
          <div onClick={printDiv} style={{cursor: "pointer", display: "flex"}}>
            <PrintBtnCommon /><div style={{fontSize: "24px", fontWeight: "400", color: "#0B0C0C"}}>{"Print"}</div>
          </div>
        </Header>
      </div>
      <Card >
        {wsDocsLoading ?
          <Loader /> :
            <div id="documents-div">
            {wsDocs?.Documents?.map((doc, index) => (
              <div key={index} style={{ marginTop: "16px" }}>
                <CardSectionHeader style={{ marginBottom: "16px", lineHeight: "28px", fontSize: "24px" }}>{t(doc?.code.replace('.', '_'))}</CardSectionHeader>
                {doc.dropdownData && doc.dropdownData.length > 1 && <p style={{ lineHeight: "24px", fontSize: "16px" }}>{t(`${doc?.code.replace('.', '_')}_DESCRIPTION`)}</p>}
                <div style={{ margin: "16px 0", lineHeight: "18px", fontSize: "16px" }}>
                  {doc?.dropdownData?.map((value, idx) => <p style={{ fontWeight: "bold", lineHeight: "32px" }}>{`${idx + 1}. ${t(value?.i18nKey)}`}</p>)}
                </div>
                <p style={{fontSize: "16px"}}>{t(`${doc?.code.replace('.', '_')}_BELOW_DESCRIPTION`)}</p>
              </div>
            ))}
          </div>
        }
        <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          {
            <SubmitBar
              label={t("ACTION_TEST_APPLY")}
              onSubmit={() => {
                history.push(match.path.replace("create-application", "new-application"));
              }}
              style={{ margin: "10px 10px 0px 0px" }}
              disabled={wsDocsLoading ? true : false}
            />}
        </ActionBar>
      </Card>
    </div>
  )
};

export default WSDocsRequired;