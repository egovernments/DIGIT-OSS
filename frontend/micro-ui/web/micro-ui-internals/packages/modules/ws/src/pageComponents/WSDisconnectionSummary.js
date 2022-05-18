import React, { Fragment } from "react";
import { Card, CardHeader, SubmitBar, CitizenInfoLabel, CardText, Loader, CardSubHeader, BackButton, BreadCrumb, Header, CardLabel, CardSectionHeader, CardCaption, ActionBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

const WSDisconnectionSummary = ({ onSelect, userType, onSkip, config }) => {
  const { t } = useTranslation();
  const history = useHistory()
  const match = useRouteMatch();
  const tenantId = Digit.ULBService.getStateId();
  const goNext = () => {
    onSelect("DocsReq", "");
  }

  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");

  const { isLoading: wsDocsLoading, data: wsDocs } =  Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId, 'DisconnectionDocuments');

  if (userType === "citizen") {
    return (
      <Fragment>
        <Card>
          <CardHeader>{t(`WS_DISCONNECTION_SUMMARY`)}</CardHeader>          
          <CardLabel>
          {t('WS_CUSTOMER_NUMBER')}
          <span style={{float:'right'}}>PG-WS-2021-09-29-006024</span>
        </CardLabel>

        <CardLabel>
          {t('WS_CUSTOMER_NUMBER')}
          <span style={{float:'right'}}>PG-WS-2021-09-29-006024</span>
        </CardLabel>
         
          <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
        </Card>
      </Fragment>
    );
  }

  return (
    <div style={{ margin: "16px" }}>
       
      <Card >
        {wsDocsLoading ?
          <Loader /> :
          <Fragment>
            
          </Fragment>
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

export default WSDisconnectionSummary;