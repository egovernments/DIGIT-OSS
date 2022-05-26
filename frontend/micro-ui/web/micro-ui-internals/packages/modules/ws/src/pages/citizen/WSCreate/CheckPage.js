import {
    Card, CardHeader, CardSubHeader, CardText,
    CitizenInfoLabel, LinkButton, Row, StatusTable, SubmitBar, EditIcon, Header
  } from "@egovernments/digit-ui-react-components";
  import React from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory, useRouteMatch } from "react-router-dom";
  import Timeline from "../../../components/Timeline";
  
  const CheckPage = ({ onSubmit, value }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch();
    const { ConnectionHolderDetails, plumberPreference, serviceName, waterConectionDetails, sewerageConnectionDetails, documents } = value;
    let routeLink = `/digit-ui/citizen/ws/create-application`;

    function routeTo(jumpTo) {
        location.href=jumpTo;
    }
   

  return(
    <React.Fragment>
    <Timeline currentStep={4} />
    <Header>{t("WS_COMMON_SUMMARY")}</Header>
    <Card style={{paddingRight:"16px"}}>
    <CardHeader>{t(`WS_BASIC_DETAILS_HEADER`)}</CardHeader>
        <StatusTable>
          <Row className="border-none"  label={t("WS_PROPERTY_ID_LABEL")} text={"PT-767-23-0654553"}/>
          <Row className="border-none" label={t("WS_OWNERS_NAME_LABEL")} text={t(`NS Prasad`)} />
          <Row className="border-none" label={t("WS_COMMON_TABLE_COL_ADDRESS")} text={"NA"} />
          <Row className="border-none" label={t("WS_CONNECTION_DETAILS_STATUS_LABEL")} text={"NA"}/>
        </StatusTable>
    </Card>
    <Card style={{paddingRight:"16px"}}>
    <CardHeader>{t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER")}</CardHeader>
    <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display:"inline" }}
          onClick={() => routeTo(`${routeLink}/connection-holder`)}
        />
        <StatusTable>
          <Row className="border-none" label={t("WS_OWN_MOBILE_NO")} text={ConnectionHolderDetails?.mobileNumber}/>
          <Row className="border-none" label={t("WS_OWN_DETAIL_NAME")} text={ConnectionHolderDetails?.name}/>
          <Row className="border-none" label={t("WS_OWN_DETAIL_GENDER_LABEL")} text={t(ConnectionHolderDetails?.gender?.i18nKey)}/>
          <Row className="border-none" label={t("WS_FATHERS_HUSBAND_NAME")} text={ConnectionHolderDetails?.guardian}/>
          <Row className="border-none" label={t("WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL")} text={t(ConnectionHolderDetails?.relationship?.i18nKey)} />
          <Row className="border-none" label={t("WS_OWN_DETAIL_CROSADD")} text={ConnectionHolderDetails?.address} />
          <Row className="border-none" label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} text={t(ConnectionHolderDetails?.specialCategoryType?.i18nKey)} />
    </StatusTable>
    </Card>
    <Card style={{paddingRight:"16px"}}>
    <CardHeader>{t("WS_COMMON_CONNECTION_DETAIL")}</CardHeader>
    <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display:"inline" }}
          onClick={() => routeTo(`${routeLink}/service-name`)}
        />
        <StatusTable>
          <Row className="border-none" label={t("WS_SERVICE_NAME_LABEL")} text={t(serviceName?.i18nKey)}/>
          <Row className="border-none" label={t("WS_SERV_DETAIL_CONN_TYPE")} text={"Metered"}  />
          <Row className="border-none" label={t("WS_NO_OF_TAPS")} text={waterConectionDetails?.proposedTaps} />
          <Row className="border-none" label={t("WS_SERV_DETAIL_PIPE_SIZE")} text={t(waterConectionDetails?.proposedPipeSize?.i18nKey)} />
          <Row className="border-none" label={t("WS_NO_OF_WATER_CLOSETS_LABEL")}   text={sewerageConnectionDetails?.proposedWaterClosets} />
          <Row className="border-none" label={t("WS_SERV_DETAIL_NO_OF_TOILETS")} text={sewerageConnectionDetails?.proposedToilets} />
          <Row className="border-none" label={t("WS_SERV_DETAIL_WATER_SOURCE")}  text={"NA"} />
          <Row className="border-none" label={t("WS_SERV_DETAIL_WATER_SUB_SOURCE")} text={"NA"} />
        </StatusTable>
    </Card>
    <Card style={{paddingRight:"16px"}}>
        <CardHeader>{t("WS_COMMON_DOCUMENT_DETAILS")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/document-details`)}
          />
        {documents && documents.map((doc, index) => (
          <div key={`doc-${index}`}>
         {<div><CardSectionHeader>{t(doc?.documentType?.split('.').slice(0,2).join('_'))}</CardSectionHeader>
          <StatusTable>
          {/* NEED TO BE DONE AFTER FILETSORE API IS FIXED
           <WSDocument value={isEditApplication?[...PrevStateDocuments,...documents.documents]:value} Code={doc?.documentType} index={index} isNOC={false}/>  */}
          {documents?.length != index+ 1 ? <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/> : null}
          </StatusTable>
          </div>}
          </div>
        ))}
      </Card>
      <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
    </React.Fragment>
    )
  }
  export default CheckPage;
  