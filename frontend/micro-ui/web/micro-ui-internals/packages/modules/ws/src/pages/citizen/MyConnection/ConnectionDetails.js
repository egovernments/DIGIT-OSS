import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, CardSectionHeader, MultiLink, CardText } from "@egovernments/digit-ui-react-components";
import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation} from "react-router-dom";
//import PropertyDocument from "../../pageComponents/PropertyDocument";
import WSWFApplicationTimeline from "../../../pageComponents/WSWFApplicationTimeline";
import WSDocument from "../../../pageComponents/WSDocument";
import getPDFData from "../../../utils/getWSAcknowledgementData";

const ConnectionDetails = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const [showOptions, setShowOptions] = useState(false);
  const applicationNobyData = window.location.href.substring(window.location.href.indexOf("WS_"));
  const { state = {} } = useLocation();

async function getConnectionDetail({tenantId},order, mode="download") {
    let requestData = {...state }
    let response = await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: [requestData] }, "ws-consolidatedacknowlegment");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }
  
let dowloadOptions = [];
dowloadOptions.push({
  label: t("WS_CONNECTION_DETAILS"),
  onClick: () => getConnectionDetail({tenantId : state?.tenantId}),
},)

  //const application = data?.Properties[0];
  return (
    <React.Fragment>
      <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" }}>
      <Header>{t("WS_COMMON_CONNECTION_DETAIL")}</Header>
      {dowloadOptions && dowloadOptions.length > 0 && <MultiLink
          className="multilinkWrapper"
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}

        />}
      </div>
      <div className='hide-seperator'>
        <Card>
          <StatusTable>
            <Row className="border-none"  label={t("WS_MYCONNECTIONS_CONSUMER_NO")} text={state?.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_MYCONNECTIONS_SERVICE")} text={t(`WS_APPLICATION_TYPE_${state?.applicationType}`)} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_STATUS")} text={state?.status || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
          <CardSubHeader>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
          <StatusTable>
          <Row className="border-none"  label={t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL")} text={state?.connectionType || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_NO_OF_TAPS")} text={state?.noOfTaps} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_PIPE_SIZE")} text={state?.pipeSize || "NA"} textStyle={{ whiteSpace: "pre" }} />
            {state?.connectionType?.includes("WATER") && <div>
            <Row className="border-none"  label={t("WS_SERV_DETAIL_WATER_SOURCE")} text={state?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_WATER_SUB_SOURCE")} text={state?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")} text={state?.dateEffectiveFrom || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_METER_ID")} text={state?.meterId} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_ADDN_DETAIL_METER_INSTALL_DATE")} text={state?.meterInstallationDate || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_ADDN_DETAILS_INITIAL_METER_READING")} text={state?.additionalDetails?.initialMeterReading || "NA"} textStyle={{ whiteSpace: "pre" }} />
            </div>}
            <Link to={`/digit-ui/citizen/ws/consumption/details?applicationNo=${state?.connectionNo}`}>
            <LinkButton style={{textAlign:"left"}} label={t("WS_CONNECTION_DETAILS_VIEW_CONSUMPTION_LABEL")} />
            </Link>
          </StatusTable>
          <CardSubHeader>{t("WS_COMMON_PROPERTY_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none" label={t("WS_PROPERTY_ID_LABEL")} text={state?.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={state?.owners?.[0]?.name} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_CROSADD")} text={state?.property?.owners?.[0]?.correspondenceAddress} textStyle={{ whiteSpace: "pre" }} />
            <Link to={`/digit-ui/citizen/commonpt/view-property?propertyId=${state?.propertyId}&tenantId=${state?.tenantId}`}>
            <LinkButton style={{textAlign:"left"}} label={t("WS_VIEW_PROPERTY")} />
            </Link>
          </StatusTable>
          <CardSubHeader>{t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER")}</CardSubHeader>
          {state?.connectionHolders ? <div>
          <StatusTable>
            <Row className="border-none" label={t("WS_OWN_DETAIL_MOBILE_NO_LABEL")} text={state?.connectionHolders?.[0]?.mobileNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={state?.connectionHolders?.[0]?.name} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_GENDER_LABEL")} text={state?.connectionHolders?.[0]?.gender} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME")} text={state?.connectionHolders?.[0]?.fatherOrHusbandName} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_RELATION_LABEL")} text={state?.connectionHolders?.[0]?.relationship} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_CROSADD")} text={state?.connectionHolders?.[0]?.correspondenceAddress} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </div>:
        <CardText>{t("WS_PROPERTY_OWNER_SAME_AS_CONN_HOLDERS")}</CardText>}
        {state?.documents && state?.documents.map((doc, index) => (
          <div key={`doc-${index}`}>
         {<div><CardSectionHeader>{t(doc?.documentType?.split('.').slice(0,2).join('_'))}</CardSectionHeader>
          <StatusTable>
          {
           <WSDocument value={state?.documents} Code={doc?.documentType} index={index} /> }
          {state?.documents.length != index+ 1 ? <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/> : null}
          </StatusTable>
          </div>}
          </div>
        ))}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default ConnectionDetails;