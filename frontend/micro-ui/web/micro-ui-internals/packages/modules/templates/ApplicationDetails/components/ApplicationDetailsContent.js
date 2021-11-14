import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  BreakLine,
  Card,
  CardSubHeader,
  StatusTable,
  Row,
  Loader,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  Rating,
  ActionLinks,
} from "@egovernments/digit-ui-react-components";
import TLCaption from "./TLCaption";
import { Link } from "react-router-dom";
import PropertyDocuments from "./PropertyDocuments";
import PropertyFloors from "./PropertyFloors";
import PropertyEstimates from "./PropertyEstimates";
import PropertyOwners from "./PropertyOwners";
import TLTradeUnits from "./TLTradeUnits";
import TLTradeAccessories from "./TLTradeAccessories";
import ScruntinyDetails from "./ScruntinyDetails";
import NOCDocuments from "./NOCDocuments";
import SubOccupancyTable from "./SubOccupancyTable";
import OBPSDocument from "../../../obps/src/pageComponents/OBPSDocuments";
import PermissionCheck from "./PermissionCheck";
import BPADocuments from "./BPADocuments";

function ApplicationDetailsContent({ applicationDetails, workflowDetails, isDataLoading, applicationData, businessService, timelineStatusPrefix }) {
  const { t } = useTranslation();


  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.state === "OPEN" || checkpoint.status === "INITIATED") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData?.auditDetails?.createdTime),
        source: applicationData?.channel || "",
      };
      return <TLCaption data={caption} />;
    } else {
      const caption = {
        date: Digit.DateUtils?.ConvertTimestampToDate(applicationData?.auditDetails?.lastModifiedTime),
        // name: checkpoint?.assigner?.name,
        name: checkpoint?.assignes?.[0]?.name,
        // mobileNumber: checkpoint?.assigner?.mobileNumber,
        mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
      };
      return <TLCaption data={caption} />;
    }
  };

  const getTranslatedValues = (dataValue, isNotTranslated) => {
    if(dataValue) {
      return !isNotTranslated ? t(dataValue) : dataValue
    } else {
      return t("NA")
    }
  };

  // console.log(applicationDetails?.applicationDetails, "inside app details content");
  const checkLocation = window.location.href.includes("employee/tl") || window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc");
  const isNocLocation = window.location.href.includes("noc/application-overview");
  const isBPALocation = window.location.href.includes("employee/obps");
  return (
    <Card style={{ position: "relative" }}>
      {applicationDetails?.applicationDetails?.map((detail, index) => (
        <React.Fragment key={index}>
          <div style={checkLocation ? { lineHeight: "19px", maxWidth: "600px", minWidth: "280px" } : {}}>
            {index === 0 && !detail.asSectionHeader ? (
              <CardSubHeader style={{ marginBottom: "16px" }}>{t(detail.title)}</CardSubHeader>
            ) : (
              <React.Fragment>
                <CardSectionHeader style={(index == 0 && checkLocation) ? { marginBottom: "16px" } : { marginBottom: "16px", marginTop: "32px" }}>
                  {isNocLocation ? `${t(detail.title)}:` : t(detail.title)}
                  {detail?.Component ? <detail.Component /> : null}
                </CardSectionHeader>
              </React.Fragment>
            )}
            {/* TODO, Later will move to classes */}
            <StatusTable style={checkLocation ? { position: "relative", marginTop: "19px" } : {}}>
              {detail?.title && !(detail?.title.includes("NOC" )) && detail?.values?.map((value, index) => {
                if (value.map === true && value.value !== "N/A") {
                  return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
                }
                return (
                  <Row
                    key={t(value.title)}
                    label={(isNocLocation || isBPALocation) ? `${t(value.title)}:` : t(value.title)}
                    text={value?.skip ? value.value : (getTranslatedValues(value?.value , value?.isNotTranslated) || "N/A")}
                    last={index === detail?.values?.length - 1}
                    caption={value.caption}
                    className="border-none"
                    // TODO, Later will move to classes
                    rowContainerStyle={
                      checkLocation ? { justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "#0B0C0C" } : {}
                    }
                  />
                );
              })}
            </StatusTable>
          </div>
          {detail?.belowComponent && <detail.belowComponent />}
          {detail?.additionalDetails?.inspectionReport && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {/* {detail?.additionalDetails?.FIdocuments && detail?.additionalDetails?.values?.map((doc,index) => (
            <div key={index}>
            {doc.isNotDuplicate && <div> 
             <StatusTable>
             <Row label={t(doc?.documentType)}></Row>
             <OBPSDocument value={detail?.additionalDetails?.values} Code={doc?.documentType} index={index}/> 
             <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
             </StatusTable>
             </div>}
             </div>
          )) } */}
          {detail?.additionalDetails?.floors && <PropertyFloors floors={detail?.additionalDetails?.floors} />}
          {detail?.additionalDetails?.owners && <PropertyOwners owners={detail?.additionalDetails?.owners} />}
          {detail?.additionalDetails?.units && <TLTradeUnits units={detail?.additionalDetails?.units} />}
          {detail?.additionalDetails?.accessories && <TLTradeAccessories units={detail?.additionalDetails?.accessories} />}
          {detail?.additionalDetails?.permissions && <PermissionCheck applicationData={applicationDetails?.applicationData} t={t} permissions={detail?.additionalDetails?.permissions} />}
          {detail?.additionalDetails?.obpsDocuments && <BPADocuments t={t} applicationData={applicationDetails?.applicationData} docs={detail.additionalDetails.obpsDocuments} bpaActionsDetails={workflowDetails} />}
          {detail?.additionalDetails?.noc && <NOCDocuments t={t} isNoc={true} NOCdata = {detail.values} applicationData={applicationDetails?.applicationData} docs={detail.additionalDetails.noc} noc={detail.additionalDetails?.data} bpaActionsDetails={workflowDetails}/>}
          {detail?.additionalDetails?.scruntinyDetails && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.buildingExtractionDetails && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.subOccupancyTableDetails && <SubOccupancyTable edcrDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.documents && <PropertyDocuments documents={detail?.additionalDetails?.documents} />}
          {detail?.additionalDetails?.taxHeadEstimatesCalculation && (
            <PropertyEstimates taxHeadEstimatesCalculation={detail?.additionalDetails?.taxHeadEstimatesCalculation} />
          )}
        </React.Fragment>
      ))}
      {workflowDetails?.data?.timeline?.length > 0 && (
        <React.Fragment>
          <BreakLine />
          {(workflowDetails?.isLoading || isDataLoading) && <Loader />}
          {!workflowDetails?.isLoading && !isDataLoading && (
            <Fragment>
              <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
                {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
              </CardSectionHeader>
              {workflowDetails?.data?.timeline && workflowDetails?.data?.timeline?.length === 1 ? (
                <CheckPoint
                  isCompleted={true}
                  label={t(`${timelineStatusPrefix}${workflowDetails?.data?.timeline[0]?.state}`)}
                  customChild={getTimelineCaptions(workflowDetails?.data?.timeline[0])}
                />
              ) : (
                <ConnectingCheckPoints>
                  {workflowDetails?.data?.timeline &&
                    workflowDetails?.data?.timeline.map((checkpoint, index, arr) => {
                      return (
                        <React.Fragment key={index}>
                          <CheckPoint
                            keyValue={index}
                            isCompleted={index === 0}
                            info={checkpoint.comment}
                            label={t(
                              `${timelineStatusPrefix}${checkpoint?.performedAction === "REOPEN" ? checkpoint?.performedAction : checkpoint.status}`
                            )}
                            customChild={getTimelineCaptions(checkpoint)}
                          />
                        </React.Fragment>
                      );
                    })}
                </ConnectingCheckPoints>
              )}
            </Fragment>
          )}
        </React.Fragment>
      )}
    </Card>
  );
}

export default ApplicationDetailsContent;
