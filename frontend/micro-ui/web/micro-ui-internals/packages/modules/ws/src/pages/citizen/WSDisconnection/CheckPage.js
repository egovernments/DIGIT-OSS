import {
    Card, CardHeader, CardSubHeader, CardText,
    CitizenInfoLabel, LinkButton, Row, StatusTable, SubmitBar, EditIcon, Header, CardSectionHeader
  } from "@egovernments/digit-ui-react-components";
  import React from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory, useRouteMatch, Link } from "react-router-dom";
  import DisconnectTimeline from "../../../components/DisconnectTimeline";
  import WSDocument from "../../../pageComponents/WSDocument";
  
  const CheckPage = ({ onSubmit, value }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch();
    const { ConnectionHolderDetails, plumberPreference, serviceName, waterConectionDetails, sewerageConnectionDetails, documents, cpt } = value;
    let routeLink = `/digit-ui/citizen/ws/disconnect-application`;
    if(window.location.href.includes("/edit-application/"))
    routeLink=`/digit-ui/citizen/ws/edit-disconnect-application`

    function routeTo(jumpTo) {
        location.href=jumpTo;
    }
   
    let propAddArr = [];
  if (cpt && cpt?.details && Object.keys(cpt?.details).length>0) {
    if (cpt?.details?.address?.doorNo) {
      propAddArr.push(cpt?.details?.address?.doorNo);
    }
    if (cpt?.details?.address?.street) {
      propAddArr.push(cpt?.details?.address?.street);
    }
    if (cpt?.details?.address?.landmark) {
      propAddArr.push(cpt?.details?.address?.landmark);
    }
    if (cpt?.details?.address?.locality?.code) {
      propAddArr.push(t(Digit.Utils.pt.getMohallaLocale(cpt?.details?.address?.locality?.code, cpt?.details?.tenantId)));
    }
    if (cpt?.details?.tenantId) {
      propAddArr.push(t(Digit.Utils.pt.getCityLocale(cpt?.details?.tenantId)));
    }
    if (cpt?.details?.address?.pincode) {
      propAddArr.push(cpt?.details?.address?.pincode);
    }
  }

  return(
    <React.Fragment>
    <Header styles={{fontSize:"32px"}}>{t("WS_COMMON_SUMMARY")}</Header>
    <DisconnectTimeline currentStep={3} />
  
    <Card style={{paddingRight:"16px"}}>
      <CardHeader styles={{fontSize:"28px"}}>{t("WS_DISCONNECTION_APPLICATION_DETAILS")}</CardHeader>
      <LinkButton
        label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
        style={{ width: "100px", display:"inline" }}
        onClick={() => routeTo(`${routeLink}/application-form`)}
      />
      <StatusTable>
        <Row className="border-none" textStyle={{marginRight:"-10px"}} label={t("WS_DISCONNECTION_CONSUMER_NUMBER")} text={ConnectionHolderDetails?.consumerNumber}/>
        <Row className="border-none" label={t("WS_DISCONNECTION_TYPE")} text={ConnectionHolderDetails?.name}/>
        <Row className="border-none" label={t("WS_DISCONNECTION_PROPOSED_DATE")} text={t(ConnectionHolderDetails?.gender?.i18nKey)}/>
        <Row className="border-none" label={t("WS_DISCONNECTION_REASON")} text={ConnectionHolderDetails?.guardian}/>         
      </StatusTable>
    </Card>
 
    <Card style={{paddingRight:"16px"}}>
        <CardHeader styles={{fontSize:"28px"}}>{t("WS_COMMON_DOCUMENT_DETAILS")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/documents-upload`)}
          />
        {documents && documents?.documents.map((doc, index) => (
          <div key={`doc-${index}`}>
         {<div><CardSectionHeader>{t(doc?.documentType?.split('.').slice(0,2).join('_'))}</CardSectionHeader>
          <StatusTable>
          {
           <WSDocument value={value} Code={doc?.documentType} index={index} /> }
          {documents?.documents.length != index+ 1 ? <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/> : null}
          </StatusTable>
          </div>}
          </div>
        ))}
        <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
      </Card>
    </React.Fragment>
    )
  }
  export default CheckPage;
  