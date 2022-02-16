import React, { Fragment } from "react";
import { Card, CardHeader, SubmitBar, CitizenInfoLabel, CardText, Loader, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const WSDocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const goNext = () => {
    onSelect("DocsReq", "");
  }

  const { isLoading: wsDocsLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId);

  return (
    <Fragment>
      <Card>
        <CardHeader>{t(`WS_COMMON_APPL_NEW_CONNECTION`)}</CardHeader>
        <CitizenInfoLabel style={{margin:"0px"}} textStyle={{color:"#0B0C0C"}} text={t(`OBPS_DOCS_REQUIRED_TIME`)} showInfo={false} />
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
                <div style={{marginBottom: "16px",marginLeft:"18px"}}>
                  {doc?.dropdownData?.map((value, index) => doc?.dropdownData?.length !== index + 1 ? <span>{`${t(value?.i18nKey)}, `}</span> : <span>{`${t(value?.i18nKey)}`}</span> )}
                </div>
              </div>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
    </Fragment>
  );
};

export default WSDocsRequired;