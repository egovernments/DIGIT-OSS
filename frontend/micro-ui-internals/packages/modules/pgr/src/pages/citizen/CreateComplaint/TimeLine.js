import { Card, CardSubHeader, CheckPoint, ConnectingCheckPoints, GreyOutText, TelePhone } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../../constants/Localization";
import PendingAtLME from "./timelineInstances/pendingAtLme";
import PendingForAssignment from "./timelineInstances/PendingForAssignment";
import PendingForReassignment from "./timelineInstances/PendingForReassignment";
import Reopen from "./timelineInstances/reopen";
import Resolved from "./timelineInstances/resolved";
import StarRated from "./timelineInstances/StarRated";

const TimeLine = ({ data, serviceRequestId, complaintWorkflow, rating }) => {
  const { t } = useTranslation();
  // let GetComplaintInstance = ({}) => {
  let { timeline } = data;

  const getCheckPoint = ({ status, caption, auditDetails, timeLineActions }) => {
    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return <PendingForReassignment text={t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)} />;

      case "PENDINGFORASSIGNMENT":
        return <PendingForAssignment complaintFiledDate={auditDetails.created} text={t(`CS_COMMON_COMPLAINT_FILED`)} />;

      case "PENDINGATLME":
        let { name, mobileNumber } = caption[0];
        const assignedTo = `${t("CS_COMMON_COMPLAINT_ASSIGNED_TO")}`;
        return <PendingAtLME name={name} mobile={mobileNumber} text={assignedTo} />;

      case "RESOLVED":
        return (
          <Resolved
            action={complaintWorkflow.action}
            nextActions={timeLineActions}
            rating={rating}
            serviceRequestId={serviceRequestId}
            reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
          />
        );
      case "CLOSEDAFTERRESOLUTION":
        return <React.Fragment>{t("CS_COMMON_CLOSEDAFTERRESOLUTION")}</React.Fragment>;

      default:
        return <React.Fragment>{status}</React.Fragment>;
    }
  };

  return (
    <React.Fragment>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_COMPLAINT_TIMELINE`)}</CardSubHeader>
      {timeline && timeline.length > 0 && (
        <ConnectingCheckPoints>
          {timeline.map(({ status, caption, auditDetails, timeLineActions }, index) => {
            return (
              <CheckPoint
                key={index}
                isCompleted={index === 0 ? true : false}
                customChild={getCheckPoint({ status, caption, auditDetails, timeLineActions })}
              />
            );
          })}
        </ConnectingCheckPoints>
      )}
    </React.Fragment>
  );
};

export default TimeLine;
