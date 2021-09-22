import { Card, CardSubHeader, CheckPoint, ConnectingCheckPoints, GreyOutText, Loader, DisplayPhotos } from "@egovernments/digit-ui-react-components";
import React, {Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../constants/Localization";
import PendingAtLME from "./timelineInstances/pendingAtLme";
import PendingForAssignment from "./timelineInstances/PendingForAssignment";
import PendingForReassignment from "./timelineInstances/PendingForReassignment";
import Reopen from "./timelineInstances/reopen";
import Resolved from "./timelineInstances/resolved";
import Rejected from "./timelineInstances/rejected";
import StarRated from "./timelineInstances/StarRated";

const TimeLine = ({ isLoading, data, serviceRequestId, complaintWorkflow, rating, zoomImage }) => {
  const { t } = useTranslation();
  // let GetComplaintInstance = ({}) => {

  // console.log("find complaintWorkflow here", complaintWorkflow, data)
  // if (isLoading) {
  //   return <Loader />;
  // }

  let { timeline } = data;

  useEffect(() => {
    const auditDetails = timeline?.filter((status, index, array) => {
      // console.log("find audit details index and status here", status, index);
      if (index === array.length - 1 && status.status === "PENDINGFORASSIGNMENT") {
        return true;
      } else {
        return false;
      }
    });
    // console.log("find audit details here", auditDetails);
    timeline?.push({
      auditDetails: { created: auditDetails.created, lastModified: auditDetails.lastModified },
      performedAction: "FILED",
      status: "COMPLAINT_FILED",
    });
  }, [timeline]);

  // console.log("find timeline here", timeline);

  const getCommentsInCustomChildComponent = ({comment, thumbnailsToShow}) => {
    debugger
    return <>
    {comment ? <div>{comment?.map( e => 
      <div className="TLComments">
        <h3>{t("WF_COMMON_COMMENTS")}</h3>
        <p>{e}</p>
      </div>
    )}</div> : null}
    {thumbnailsToShow?.thumbs?.length > 0 ? <div className="TLComments">
      <h3>{t("CS_COMMON_DOCUMENTS")}</h3>
      <DisplayPhotos srcs={thumbnailsToShow.thumbs} onClick={(src, index) => zoomImage(thumbnailsToShow, index)} />
    </div> : null}
    </>
  }

  const getCheckPoint = ({ status, caption, auditDetails, timeLineActions, index, array, performedAction, comment, thumbnailsToShow }) => {
    // console.log("find getChechPoint data here", status, index)
    const isCurrent = 0 === index;
    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return <CheckPoint isCompleted={isCurrent} key={index} label={t(`CS_COMMON_PENDINGFORASSIGNMENT`)} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;

      case "PENDINGFORASSIGNMENT":
        return <PendingForAssignment key={index} isCompleted={isCurrent} text={t("CS_COMMON_PENDINGFORASSIGNMENT")} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;

      case "PENDINGFORASSIGNMENT_AFTERREOPEN":
        return <PendingForAssignment isCompleted={isCurrent} key={index} text={t(`CS_COMMON_PENDINGFORASSIGNMENT`)} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;

      case "PENDINGATLME":
        let { name, mobileNumber } = caption && caption.length > 0 ? caption[0] : { name: "", mobileNumber: "" };
        const assignedTo = `${t("CS_COMMON_COMPLAINT_ASSIGNED_TO")}`;
        return <PendingAtLME isCompleted={isCurrent} key={index} name={name} mobile={mobileNumber} text={assignedTo} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;

      case "RESOLVED":
        return (
          <Resolved
            key={index}
            isCompleted={isCurrent}
            action={complaintWorkflow.action}
            nextActions={index <= 1 && timeLineActions}
            rating={index <= 1 && rating}
            serviceRequestId={serviceRequestId}
            reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
            customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})}
          />
        );
      case "REJECTED":
        return (
          <Rejected
            key={index}
            isCompleted={isCurrent}
            action={complaintWorkflow.action}
            nextActions={index <= 1 && timeLineActions}
            rating={index <= 1 && rating}
            serviceRequestId={serviceRequestId}
            reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
            customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})}
          />
        );
      case "CLOSEDAFTERRESOLUTION":
        return <CheckPoint isCompleted={isCurrent} key={index} label={t("CS_COMMON_CLOSEDAFTERRESOLUTION")} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;

      // case "RESOLVE":
      // return (
      //   <Resolved
      //     action={complaintWorkflow.action}
      //     nextActions={timeLineActions}
      //     rating={rating}
      //     serviceRequestId={serviceRequestId}
      //     reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
      //   />
      // );
      case "COMPLAINT_FILED":
        return <CheckPoint isCompleted={isCurrent} key={index} label={t("CS_COMMON_COMPLAINT_FILED")} info={auditDetails.created} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;

      default:
        return <CheckPoint isCompleted={isCurrent} key={index} label={t(`CS_COMMON_${status}`)} customChild={getCommentsInCustomChildComponent({comment, thumbnailsToShow})} />;
    }
  };

  return (
    <React.Fragment>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_COMPLAINT_TIMELINE`)}</CardSubHeader>
      {timeline && timeline.length > 0 ? (
        <ConnectingCheckPoints>
          {timeline.map(({ status, caption, auditDetails, timeLineActions, performedAction, wfComment: comment, thumbnailsToShow }, index, array) => {
            return getCheckPoint({ status, caption, auditDetails, timeLineActions, index, array, performedAction, comment, thumbnailsToShow });
          })}
        </ConnectingCheckPoints>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default TimeLine;
