import {
  BreakLine,
  Card,
  CardSectionHeader,
  CardSubHeader,
  CheckPoint,
  CollapseAndExpandGroups,
  ConnectingCheckPoints,
  ViewImages,
  Loader,
  Row,
  StatusTable,
  Table,
} from "@egovernments/digit-ui-react-components";
import { values } from "lodash";
import React, { Fragment, useCallback, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BPADocuments from "./BPADocuments";
import InspectionReport from "./InspectionReport";
import NOCDocuments from "./NOCDocuments";
import PermissionCheck from "./PermissionCheck";
import PropertyDocuments from "./PropertyDocuments";
import PropertyEstimates from "./PropertyEstimates";
import PropertyFloors from "./PropertyFloors";
import PropertyOwners from "./PropertyOwners";
import ScruntinyDetails from "./ScruntinyDetails";
import SubOccupancyTable from "./SubOccupancyTable";
import TLCaption from "./TLCaption";
import TLTradeAccessories from "./TLTradeAccessories";
import TLTradeUnits from "./TLTradeUnits";
//import WSAdditonalDetails from "./WSAdditonalDetails";
import WSFeeEstimation from "./WSFeeEstimation";
//import WSInfoLabel from "../../../ws/src/pageComponents/WSInfoLabel";
import DocumentsPreview from "./DocumentsPreview";
import InfoDetails from "./InfoDetails";
import ViewBreakup from "./ViewBreakup";
import SubWorkTableDetails from "./SubWorkTableDetails";



function ApplicationDetailsContent({
  applicationDetails,
  workflowDetails,
  isDataLoading,
  applicationData,
  businessService,
  timelineStatusPrefix,
  showTimeLine = true,
  statusAttribute = "status",
  paymentsList,
  oldValue,
  isInfoLabel = false,
  noBoxShadow = false,
  sectionHeadStyle = false,
  modify,
  setSaveAttendanceState
}) {
  const { t } = useTranslation();
  const [localSearchParams, setLocalSearchParams] = useState(() => ({}));
  

  const handleDateRangeChange = useCallback((data) => {
    setLocalSearchParams(() => ({ ...data }));
  }, []);

  function OpenImage(imageSource, index, thumbnailsToShow) {
    window.open(thumbnailsToShow?.fullImage?.[0], "_blank");
  }

  const convertEpochToDateDMY = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.state === "OPEN" || (checkpoint.status === "INITIATED" && !window.location.href.includes("/obps/"))) {
      const caption = {
        date: convertEpochToDateDMY(applicationData?.auditDetails?.createdTime),
        source: applicationData?.channel || "",
      };
      return <TLCaption data={caption} />;
    } else if (window.location.href.includes("/obps/") || window.location.href.includes("/noc/") || window.location.href.includes("/ws/")) {
      //From BE side assigneeMobileNumber is masked/unmasked with connectionHoldersMobileNumber and not assigneeMobileNumber
      const privacy = { uuid: checkpoint?.assignes?.[0]?.uuid, fieldName: ["connectionHoldersMobileNumber"], model: "WaterConnectionOwner" };
      const caption = {
        date: checkpoint?.auditDetails?.lastModified,
        name: checkpoint?.assignes?.[0]?.name,
        mobileNumber:
          applicationData?.processInstance?.assignes?.[0]?.uuid === checkpoint?.assignes?.[0]?.uuid &&
          applicationData?.processInstance?.assignes?.[0]?.mobileNumber
            ? applicationData?.processInstance?.assignes?.[0]?.mobileNumber
            : checkpoint?.assignes?.[0]?.mobileNumber,
        comment: t(checkpoint?.comment),
        wfComment: checkpoint.wfComment,
        thumbnailsToShow: checkpoint?.thumbnailsToShow,
      };
      return <TLCaption data={caption} OpenImage={OpenImage} privacy={privacy} />;
    } else {
      const caption = {
        date: `${Digit.DateUtils?.ConvertTimestampToDate(checkpoint.auditDetails.lastModifiedEpoch)} ${Digit.DateUtils?.ConvertEpochToTimeInHours(
          checkpoint.auditDetails.lastModifiedEpoch
        )} ${Digit.DateUtils?.getDayfromTimeStamp(checkpoint.auditDetails.lastModifiedEpoch)}`,
        // name: checkpoint?.assigner?.name,
        name: checkpoint?.assignes?.[0]?.name,
        // mobileNumber: checkpoint?.assigner?.mobileNumber,
        wfComment: checkpoint?.wfComment,
        mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
      };

      return <TLCaption data={caption} />;
    }
  };

  const getTranslatedValues = (dataValue, isNotTranslated) => {
    if (dataValue) {
      return !isNotTranslated ? t(dataValue) : dataValue;
    } else {
      return t("NA");
    }
  };

  const checkLocation =
    window.location.href.includes("employee/tl") || window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc");
  const isNocLocation = window.location.href.includes("employee/noc");
  const isBPALocation = window.location.href.includes("employee/obps");
  let isWS = window.location.href.includes("employee/ws") || window.location.href.includes("employee/works")|| window.location.href.includes("employee/project") || window.location.href.includes("employee/estimate") ;

  

  const getRowStyles = (tab="") => {
    
    if (window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc")) {
      return { justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "#0B0C0C" };
    } else if (checkLocation) {
      return { justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "#0B0C0C" };
    }
    else if ( tab==="fieldSurvey")  {
        return {
          justifyContent: "space-between", flexDirection:"column"
        }
    }
     else {
      return {};
    }
    
  };
  const getTextStyles = (tab="") => {
    if ( tab==="fieldSurvey" ) {
      return {
        marginTop:"1rem",
        marginBottom:"1rem"
      }
    }
    else {
      return {};
    }

  };
  const getLabelStyles = (tab = "") => {
    if ( tab === "fieldSurvey") {
      return {
        width:"100%"
      }
    }
    else {
      return {};
    }

  };

  const getTableStyles = () => {
    if (window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc")) {
      return { position: "relative", marginTop: "19px" };
    } else if (checkLocation) {
      return { position: "relative", marginTop: "19px" };
    } else {
      return {};
    }
  };

  const getMainDivStyles = () => {
    if (
      window.location.href.includes("employee/obps") ||
      window.location.href.includes("employee/noc") ||
      window.location.href.includes("employee/ws") ||
      window.location.href.includes("employee/works") ||
      window.location.href.includes("employee/contracts")
    ) {
      return { lineHeight: "19px", maxWidth: "950px", minWidth: "280px" };
    } else if (checkLocation) {
      return { lineHeight: "19px", maxWidth: "600px", minWidth: "280px" };
    } else {
      return {};
    }
  };

  const getTextValue = (value) => {
    if (value?.skip) return value.value;
    else if (value?.isUnit) return value?.value ? `${getTranslatedValues(value?.value, value?.isNotTranslated)} ${t(value?.isUnit)}` : t("N/A");
    else if (value?.value === "Approved") return <span style={{"color":"#0B6623"}}>{ `${getTranslatedValues(value?.value, value?.isNotTranslated)}`}</span>
    else if (value?.value === "Rejected") return <span style={{"color":"#FF0000"}}>{t(value?.value)}</span>
    else return value?.value ? getTranslatedValues(value?.value, value?.isNotTranslated) : t("N/A");
  };

  const getClickInfoDetails = () => {
    if (window.location.href.includes("disconnection") || window.location.href.includes("application")) {
      return "WS_DISCONNECTION_CLICK_ON_INFO_LABEL";
    } else {
      return "WS_CLICK_ON_INFO_LABEL";
    }
  };

  const getClickInfoDetails1 = () => {
    if (window.location.href.includes("disconnection") || window.location.href.includes("application")) {
      return "WS_DISCONNECTION_CLICK_ON_INFO1_LABEL";
    } else {
      return "";
    }
  };

  const getCardStyles = () => {
    let styles = { position: "relative" }
    if (noBoxShadow) styles = { ...styles, boxShadow: "none" };
    return styles;
  };

  return (
    <CollapseAndExpandGroups groupElements={applicationDetails?.CollapseConfig?.collapseAll} groupHeader={applicationDetails?.CollapseConfig?.groupHeader} headerLabel={applicationDetails?.CollapseConfig?.headerLabel} headerValue={applicationDetails?.CollapseConfig?.headerValue}>
    <Card style={getCardStyles()} className={"employeeCard-override"}>
      {isInfoLabel ? (
        <InfoDetails
          t={t}
          userType={false}
          infoBannerLabel={"CS_FILE_APPLICATION_INFO_LABEL"}
          infoClickLable={"WS_CLICK_ON_LABEL"}
          infoClickInfoLabel={getClickInfoDetails()}
          infoClickInfoLabel1={getClickInfoDetails1()}
        />
      ) : null}
      {applicationDetails?.applicationDetails?.map((detail, index) => (
        <CollapseAndExpandGroups groupElements={detail?.expandAndCollapse?.groupComponents} groupHeader={detail?.expandAndCollapse?.groupHeader} headerLabel={detail?.expandAndCollapse?.headerLabel} headerValue={detail?.expandAndCollapse?.headerValue} customClass={detail?.expandAndCollapse?.customClass}>
          <React.Fragment key={index}>
          <div style={getMainDivStyles()}>
            {index === 0 && !detail.asSectionHeader ? (
              <CardSubHeader style={{ marginBottom: "16px", fontSize: "24px" }}>{t(detail.title)}</CardSubHeader>
            ) : (
              <React.Fragment>
                <CardSectionHeader
                  style={
                    index == 0 && checkLocation
                      ? { marginBottom: "16px", fontSize: "24px" } :
                      (sectionHeadStyle ? sectionHeadStyle : { marginBottom: "16px", marginTop: "32px", fontSize: "24px" })
                  }
                >
                  {isNocLocation ? `${t(detail.title)}` : t(detail.title)}
                  {detail?.Component ? <detail.Component /> : null}
                </CardSectionHeader>
              </React.Fragment>
            )}
            {/* TODO, Later will move to classes */}
            {/* Here Render the table for adjustment amount details detail.isTable is true for that table*/}
            {/* {detail?.isTable && (
              <table style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
                <tr style={{ textAlign: "left" }}>
                  {detail?.headers.map((header) => (
                    <th style={{ padding: "10px" }}>{t(header)}</th>
                  ))}
                </tr>

                {detail?.tableRows.map((row,index)=>{
                if(index===detail?.tableRows.length - 1){
                  return <>
                    <hr style={{ width: "370%",marginTop:"15px" }} className="underline" />
                    <tr>
                      {row.map(element => <td style={{ textAlign: "left" }}>{t(element)}</td>)}
                    </tr>
                    </>
                }
                return <tr>
                  {row.map(element => <td style={{ paddingTop:"20px",textAlign:"left" }}>{t(element)}</td>)}
                </tr>})}
              </table>
            )} */}
            {detail?.isTable && <SubWorkTableDetails data={detail} />}

            <StatusTable style={getTableStyles()}>
              {detail?.title &&
                !detail?.title.includes("NOC") &&
                detail?.values?.map((value, index) => {
                  if (value.map === true && value.value !== "N/A") {
                    return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" privacy={value?.privacy} />} />;
                  }
                  if (value?.isLink == true) {
                    return (
                      <Row
                        key={t(value.title)}
                        label={
                          window.location.href.includes("tl") || window.location.href.includes("ws") ? (
                            <div style={{ width: "200%" }}>
                              <Link to={value?.to}>
                                <span className="link" style={{ color: "#F47738" }}>
                                  {t(value?.title)}
                                </span>
                              </Link>
                            </div>
                          ) : isNocLocation || isBPALocation ? (
                            `${t(value.title)}`
                          ) : (
                            t(value.title)
                          )
                        }
                        text={
                          <div>
                            <Link to={value?.to}>
                              <span className="link" style={{ color: "#F47738" }}>
                                {value?.value}
                              </span>
                            </Link>
                          </div>
                        }
                        last={index === detail?.values?.length - 1}
                        caption={value.caption}
                        className="border-none"
                        rowContainerStyle={getRowStyles()}
                      />
                    );
                  }
                  return (
                    <Row
                      key={t(value.title)}
                      label={isWS ? `${t(value.title)}:` : t(value.title)}
                      text={value?.isImages ? <ViewImages fileStoreIds={value?.fileStoreIds}
                        tenantId={value?.tenant}
                        onClick={() => { }} />: getTextValue(value)}
                      last={index === detail?.values?.length - 1}
                      caption={value.caption}
                      className="border-none"
                      /* privacy object set to the Row Component */
                      privacy={value?.privacy}
                      // TODO, Later will move to classes
                      rowContainerStyle={getRowStyles(detail?.tab)}
                      textStyle={getTextStyles(detail?.tab)}
                      labelStyle={getLabelStyles(detail?.tab)}
                    />
                  );
                })}
            </StatusTable>
          </div>
   
          
          {detail?.additionalDetails?.table
            ? detail?.additionalDetails?.table?.weekTable?.tableHeader && (
                <>
                  <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px", fontSize: "24px" }}>
                    {t(detail?.additionalDetails?.table?.weekTable?.tableHeader)}
                  </CardSectionHeader>
                </>
              )
            : null}
            
          {detail?.additionalDetails?.inspectionReport && (
            <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} paymentsList={paymentsList} />
          )}
          {applicationDetails?.applicationData?.additionalDetails?.fieldinspection_pending?.length > 0 && detail?.additionalDetails?.fiReport && (
            <InspectionReport fiReport={applicationDetails?.applicationData?.additionalDetails?.fieldinspection_pending} />
          )}
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
          {detail?.additionalDetails?.permissions && workflowDetails?.data?.nextActions?.length > 0 && (
            <PermissionCheck applicationData={applicationDetails?.applicationData} t={t} permissions={detail?.additionalDetails?.permissions} />
          )}
          {detail?.additionalDetails?.obpsDocuments && (
            <BPADocuments
              t={t}
              applicationData={applicationDetails?.applicationData}
              docs={detail.additionalDetails.obpsDocuments}
              bpaActionsDetails={workflowDetails}
            />
          )}
          {detail?.additionalDetails?.noc && (
            <NOCDocuments
              t={t}
              isNoc={true}
              NOCdata={detail.values}
              applicationData={applicationDetails?.applicationData}
              docs={detail.additionalDetails.noc}
              noc={detail.additionalDetails?.data}
              bpaActionsDetails={workflowDetails}
            />
          )}
          {detail?.additionalDetails?.scruntinyDetails && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.buildingExtractionDetails && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.subOccupancyTableDetails && (
            <SubOccupancyTable edcrDetails={detail?.additionalDetails} applicationData={applicationDetails?.applicationData} />
          )}
          {detail?.additionalDetails?.documentsWithUrl && <DocumentsPreview documents={detail?.additionalDetails?.documentsWithUrl} />}
          {detail?.additionalDetails?.documents && <PropertyDocuments documents={detail?.additionalDetails?.documents} />}
          {detail?.additionalDetails?.taxHeadEstimatesCalculation && (
            <PropertyEstimates taxHeadEstimatesCalculation={detail?.additionalDetails?.taxHeadEstimatesCalculation} />
          )}
          {/* {detail?.isWaterConnectionDetails && <WSAdditonalDetails wsAdditionalDetails={detail} oldValue={oldValue} />} */}
          {detail?.additionalDetails?.redirectUrl && (
            <div style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "400", padding: "10px 0px" }}>
              <Link to={detail?.additionalDetails?.redirectUrl?.url}>
                <span className="link" style={{ color: "#F47738" }}>
                  {detail?.additionalDetails?.redirectUrl?.title}
                </span>
              </Link>
            </div>
          )}
          {detail?.additionalDetails?.estimationDetails && <WSFeeEstimation wsAdditionalDetails={detail} workflowDetails={workflowDetails} />}
          {detail?.additionalDetails?.estimationDetails && <ViewBreakup wsAdditionalDetails={detail} workflowDetails={workflowDetails} />}
        </React.Fragment>
        </CollapseAndExpandGroups>
      ))}
      {showTimeLine && workflowDetails?.data?.timeline?.length > 0 && (
        <React.Fragment>
          {workflowDetails?.breakLineRequired === undefined ? <BreakLine /> : workflowDetails?.breakLineRequired ? <BreakLine /> : null}
          {(workflowDetails?.isLoading || isDataLoading) && <Loader />}
          {!workflowDetails?.isLoading && !isDataLoading && (
            <Fragment>
              <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
                {/* {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")} */}
                {t("WORKS_WORKFLOW_HISTORY")}
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
                              `${timelineStatusPrefix}${
                                checkpoint?.performedAction === "EDIT" ? `${checkpoint?.performedAction}_ACTION` : checkpoint?.[statusAttribute]
                              }`
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
    </CollapseAndExpandGroups>
  );
}

export default ApplicationDetailsContent;
