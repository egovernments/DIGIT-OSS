import { Card, CardSubHeader, CheckPoint, ConnectingCheckPoints, GreyOutText, Loader, TelePhone } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../constants/Localization";
import PendingAtLME from "./timelineInstances/pendingAtLme";
import PendingForAssignment from "./timelineInstances/PendingForAssignment";
import PendingForReassignment from "./timelineInstances/PendingForReassignment";
import Reopen from "./timelineInstances/reopen";
import Resolved from "./timelineInstances/resolved";
import StarRated from "./timelineInstances/StarRated";

const TimeLine = ({ isLoading, data, serviceRequestId, complaintWorkflow, rating }) => {
  const { t } = useTranslation();
  // let GetComplaintInstance = ({}) => {

  // console.log("find complaintWorkflow here", complaintWorkflow)
  if (isLoading) {
    return <Loader />;
  }

  let { timeline } = data;
  console.log(
    "find timeline",
    timeline.map(({ performedAction }) => performedAction)
  );

  const getCheckPoint = ({ status, caption, auditDetails, timeLineActions, index, performedAction }) => {
    console.log("find performedAction", performedAction);

    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return <PendingForReassignment text={t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)} />;

      case "PENDINGFORASSIGNMENT":
        return (
          <PendingForAssignment
            complaintFiledDate={auditDetails.created}
            text={performedAction === "REOPEN" ? t(`CS_COMMON_COMPLAINT_REOPENED`) : t(`CS_COMMON_COMPLAINT_FILED`)}
          />
        );

      case "PENDINGFORASSIGNMENT_AFTERREOPEN":
        return <PendingForAssignment text={t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)} />;

      case "PENDINGATLME":
        let { name, mobileNumber } = caption && caption.length > 0 ? caption[0] : { name: "", mobileNumber: "" };
        const assignedTo = `${t("CS_COMMON_COMPLAINT_ASSIGNED_TO")}`;
        return <PendingAtLME name={name} mobile={mobileNumber} text={assignedTo} />;

      case "RESOLVED":
        return (
          <Resolved
            action={complaintWorkflow.action}
            nextActions={index <= 1 && timeLineActions}
            rating={index <= 1 && rating}
            serviceRequestId={serviceRequestId}
            reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
          />
        );
      case "CLOSEDAFTERRESOLUTION":
        return <React.Fragment>{t("CS_COMMON_CLOSEDAFTERRESOLUTION")}</React.Fragment>;

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

      default:
        return <React.Fragment>{status}</React.Fragment>;
    }
  };

  return (
    <React.Fragment>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_COMPLAINT_TIMELINE`)}</CardSubHeader>
      {timeline && timeline.length > 0 ? (
        <ConnectingCheckPoints>
          {timeline.map(({ status, caption, auditDetails, timeLineActions, performedAction }, index) => {
            console.log(performedAction);
            if (status === "PENDINGFORASSIGNMENT" && index === 0) {
              return (
                <React.Fragment key={index}>
                  <CheckPoint
                    isCompleted={index === 0 ? true : false}
                    customChild={getCheckPoint({
                      status: "PENDINGFORASSIGNMENT_AFTERREOPEN",
                      caption,
                      auditDetails,
                      timeLineActions,
                      index,
                      performedAction,
                    })}
                  />
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={index}>
                  <CheckPoint
                    isCompleted={index === 0 ? true : false}
                    customChild={getCheckPoint({ status, caption, auditDetails, timeLineActions, index, performedAction })}
                  />
                </React.Fragment>
              );
            }
          })}
        </ConnectingCheckPoints>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default TimeLine;
