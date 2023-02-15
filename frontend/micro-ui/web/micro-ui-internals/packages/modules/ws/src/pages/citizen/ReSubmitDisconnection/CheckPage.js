import {
    Card, CardHeader, CardSubHeader, CardText,
    CitizenInfoLabel, LinkButton, Row, StatusTable, SubmitBar, EditIcon, Header, CardSectionHeader, Loader
  } from "@egovernments/digit-ui-react-components";
  import React, { useState } from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory, useRouteMatch, Link } from "react-router-dom";
  import DisconnectTimeline from "../../../components/DisconnectTimeline";
  import WSDocument from "../../../pageComponents/WSDocument";
import { convertDateToEpoch, convertEpochToDate, createPayloadOfWSReSubmitDisconnection,  } from "../../../utils";
  
  const CheckPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch();
    const value = Digit.SessionStorage.get("WS_DISCONNECTION");
    const [documents, setDocuments] = useState( value.WSDisconnectionForm.documents || []);
    let routeLink = `/digit-ui/citizen/ws/resubmit-disconnect-application`;
    if(window.location.href.includes("/resubmit"))
    routeLink=`/digit-ui/citizen/ws/resubmit-disconnect-application`

    function routeTo(jumpTo) {
        location.href=jumpTo;
    }
    const [isEnableLoader, setIsEnableLoader] = useState(false);
  
    const {
      isLoading: updatingWaterApplicationLoading,
      isError: updateWaterApplicationError,
      data: updateWaterResponse,
      error: updateWaterError,
      mutate: waterUpdateMutation,
    } = Digit.Hooks.ws.useWSApplicationActions("WATER");
  
    const {
      isLoading: updatingSewerageApplicationLoading,
      isError: updateSewerageApplicationError,
      data: updateSewerageResponse,
      error: updateSewerageError,
      mutate: sewerageUpdateMutation,
    } = Digit.Hooks.ws.useWSApplicationActions("SEWERAGE");
    
    const closeToastOfError = () => { setShowToast(null); };

    const onSubmit = async (data) => {
      const payload = await createPayloadOfWSReSubmitDisconnection(data, value, value.serviceType);
      if(payload?.WaterConnection?.water){
        if (waterUpdateMutation) {
          setIsEnableLoader(true);
          await waterUpdateMutation(payload, {
            onError: (error, variables) => {
              setIsEnableLoader(false);
              setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
              setTimeout(closeToastOfError, 5000);
            },
            onSuccess: async (data, variables) => {
                Digit.SessionStorage.set("WS_DISCONNECTION", { ...value?.applicationData, ...value?.WSDisconnectionForm , DisconnectionResponse: data?.WaterConnection?.[0]});
                history.push(`/digit-ui/citizen/ws/disconnect-acknowledge?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`);
            },
          });
        }
      }
      else if(payload?.SewerageConnection?.sewerage){
        if (sewerageUpdateMutation) {
          setIsEnableLoader(true);
          await sewerageUpdateMutation(payload, {
            onError: (error, variables) => {
              setIsEnableLoader(false);
              setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
              setTimeout(closeToastOfError, 5000);
            },
            onSuccess: async (data, variables) => {
                Digit.SessionStorage.set("WS_DISCONNECTION", {...value?.applicationData, ...value?.WSDisconnectionForm , DisconnectionResponse: data?.SewerageConnections?.[0]});
                history.push(`/digit-ui/citizen/ws/disconnect-acknowledge?applicationNumber=${data?.SewerageConnections?.[0]?.applicationNo}`);
            },
          });
        }
      }
    } ;

  if(isEnableLoader) {
    return <Loader/>
  }

  return(
    <React.Fragment>
    <Header styles={{fontSize:"32px"}}>{t("WS_COMMON_SUMMARY")}</Header>
    <DisconnectTimeline currentStep={3} />
  
    <Card style={{paddingRight:"16px"}}>
      <div style={{display: "inline"}}>
      <CardHeader styles={{fontSize:"28px"}}>{t("WS_DISCONNECTION_APPLICATION_DETAILS")}</CardHeader>
      <LinkButton
        label={<EditIcon style={{ marginTop: "-20px", float: "right", position: "relative", bottom: "32px" }} />}
        style={{ width: "100px", display:"inline" }}
        onClick={() => routeTo(`${routeLink}/application-form`)}
      />
      </div>
      <StatusTable>
        <Row className="border-none" label={t("WS_DISCONNECTION_CONSUMER_NUMBER")} text={value.connectionNo || value?.applicationData?.connectionNo}/>
        <Row className="border-none" label={t("WS_DISCONNECTION_TYPE")} text={t(value.WSDisconnectionForm.type.value.i18nKey)}/>
        <Row className="border-none" label={t("WS_DISCONNECTION_PROPOSED_DATE")} text={convertEpochToDate(convertDateToEpoch(value.WSDisconnectionForm.date))}/>
        <Row className="border-none" label={t("WS_DISCONNECTION_REASON")} text={value.WSDisconnectionForm.reason.value}/>         
      </StatusTable>
    </Card>
 
    <Card style={{paddingRight:"16px"}}>
      <div style={{display: "inline"}}>
        <CardHeader styles={{fontSize:"28px"}}>{t("WS_COMMON_DOCUMENT_DETAILS")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-20px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/documents-upload`)}
          />
          </div>
        {documents && documents?.map((doc, index) => (
          <div key={`doc-${index}`}>
         {<div><CardSectionHeader>{t(doc?.documentType?.split('.').slice(0,2).join('_'))}</CardSectionHeader>
          <StatusTable>
          {
           <WSDocument value={{documents: value.WSDisconnectionForm}} Code={doc?.documentType} index={index} showFileName={true}/> }
          {documents?.length != index+ 1 ? <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/> : null}
          </StatusTable>
          </div>}
          </div>
        ))}
        <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={() => onSubmit(value?.WSDisconnectionForm)} />
      </Card>
    </React.Fragment>
    )
  }
  export default CheckPage;
  