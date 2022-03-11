import React, { Fragment } from "react";
import { Card, CardHeader, SubmitBar, CitizenInfoLabel, CardText, Loader, CardSubHeader, BackButton, BreadCrumb, Header, CardLabel, CardSectionHeader, CardCaption } from "@egovernments/digit-ui-react-components";
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

  const { isLoading: wsDocsLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId);

  const containerStyle = {
    margin: "16px",
  };

  const wsEmpDocs = {
    "Documents": [
      {
        "code": "OWNER.IDENTITYPROOF",
        "documentType": "OWNER",
        "required": true,
        "active": true,
        "hasDropdown": true,
        "dropdownData": [
          {
            "code": "OWNER.IDENTITYPROOF.AADHAAR",
            "active": true,
            "i18nKey": "OWNER_IDENTITYPROOF_AADHAAR"
          },
          {
            "code": "OWNER.IDENTITYPROOF.VOTERID",
            "active": true,
            "i18nKey": "OWNER_IDENTITYPROOF_VOTERID"
          },
          {
            "code": "OWNER.IDENTITYPROOF.DRIVING",
            "active": true,
            "i18nKey": "OWNER_IDENTITYPROOF_DRIVING"
          },
          {
            "code": "OWNER.IDENTITYPROOF.PAN",
            "active": true,
            "i18nKey": "OWNER_IDENTITYPROOF_PAN"
          },
          {
            "code": "OWNER.IDENTITYPROOF.PASSPORT",
            "active": true,
            "i18nKey": "OWNER_IDENTITYPROOF_PASSPORT"
          }
        ],
        "description": "OWNER.ADDRESSPROOF.IDENTITYPROOF_DESCRIPTION",
        "i18nKey": "OWNER_IDENTITYPROOF"
      },
      {
        "code": "OWNER.ADDRESSPROOF",
        "documentType": "OWNER",
        "required": true,
        "active": true,
        "hasDropdown": true,
        "dropdownData": [
          {
            "code": "OWNER.ADDRESSPROOF.ELECTRICITYBILL",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_ELECTRICITYBILL"
          },
          {
            "code": "OWNER.ADDRESSPROOF.DL",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_DL"
          },
          {
            "code": "OWNER.ADDRESSPROOF.VOTERID",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_VOTERID"
          },
          {
            "code": "OWNER.ADDRESSPROOF.AADHAAR",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_AADHAAR"
          },
          {
            "code": "OWNER.ADDRESSPROOF.PAN",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_PAN"
          },
          {
            "code": "OWNER.ADDRESSPROOF.PASSPORT",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_PASSPORT"
          }
        ],
        "description": "OWNER.ADDRESSPROOF.ADDRESSPROOF_DESCRIPTION",
        "i18nKey": "OWNER_ADDRESSPROOF"
      },
      {
        "code": "USAGE_PROOF",
        "documentType": "ELECTRICITY_BILL",
        "active": true,
        "required": true,
        "hasDropdown": true,
        "dropdownData": [
          {
            "code": "ELECTRICITY_BILL",
            "active": true,
            "i18nKey": "ELECTRICITY_BILL"
          }
        ],
        "description": "ELECTRICITY_BILL_DESCRIPTION",
        "i18nKey": "ELECTRICITY_BILL"
      },
      {
        "code": "PLUMBER_REPORT_PROOF",
        "documentType": "PLUMBER_REPORT_DRAWING",
        "active": true,
        "required": true,
        "hasDropdown": true,
        "dropdownData": [
          {
            "code": "PLUMBER_REPORT_DRAWING",
            "active": true,
            "i18nKey": "PLUMBER_REPORT_DRAWING"
          }
        ],
        "description": "PLUMBER_REPORT_DRAWING_DESCRIPTION",
        "i18nKey": "PLUMBER_REPORT_DRAWING"
      },
      {
        "code": "CONSTRUCTION_PROOF",
        "documentType": "BUILDING_PLAN_OR_COMPLETION_CERTIFICATE",
        "active": true,
        "required": false,
        "hasDropdown": true,
        "dropdownData": [
          {
            "code": "BUILDING_PLAN_OR_COMPLETION_CERTIFICATE",
            "active": true,
            "i18nKey": "BUILDING_PLAN_OR_COMPLETION_CERTIFICATE"
          }
        ],
        "description": "BUILDING_PLAN_OR_COMPLETION_CERTIFICATE_DESCRIPTION",
        "i18nKey": "BUILDING_PLAN_OR_COMPLETION_CERTIFICATE"
      },
      {
        "code": "OCCUPANCY_PROOF",
        "documentType": "PROPERTY_TAX_RECIEPT",
        "active": true,
        "required": false,
        "hasDropdown": true,
        "dropdownData": [
          {
            "code": "PROPERTY_TAX_RECIEPT",
            "active": true,
            "i18nKey": "PROPERTY_TAX_RECIEPT"
          }
        ],
        "description": "PROPERTY_TAX_RECIEPT_DESCRIPTION",
        "i18nKey": "PROPERTY_TAX_RECIEPT"
      }
    ]
  }

  if (userType === "citizen") {
    return (
      <Fragment>
        <Card>
          <CardHeader>{t(`WS_COMMON_APPL_NEW_CONNECTION`)}</CardHeader>
          <CitizenInfoLabel style={{ margin: "0px" }} textStyle={{ color: "#0B0C0C" }} text={t(`OBPS_DOCS_REQUIRED_TIME`)} showInfo={false} />
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

  return (
    <div style={containerStyle}>
      <Header>{t("Water and Sewerage - New Connection")}</Header>
      <Card>
        {wsDocsLoading ?
          <Loader /> :
          <Fragment>
            {wsEmpDocs?.Documents?.map((doc, index) => (
              <div style={{ marginTop: "16px" }}>
                <CardSectionHeader>{t(doc?.code.replace('.', '_'))}</CardSectionHeader>
                {doc.dropdownData && doc.dropdownData.length > 1 && <p style={{ lineHeight: "32px" }}>{t("WS_DOCS_REQ_MULT_DOCS_DESC")}</p>}
                <div style={{ margin: "16px 0" }}>
                  {doc?.dropdownData?.map((value, idx) => <p style={{ fontWeight: "bold", lineHeight: "32px" }}>{`${idx + 1}. ${t(value?.i18nKey)}`}</p>)}
                </div>
                <p>{t(doc.code.toLowerCase().includes("owner") ? "WS_DOCS_REQ_MULT_APPLICANTS_DESC" : "WS_DOCS_REQ_MULT_REG_DESC")}</p>
              </div>
            ))}
          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={() => {
          history.push(match.path.replace("create-application", "new-application"));
        }} />
      </Card>
    </div>
  )
};

export default WSDocsRequired;