import { ConvertTimestampToDate } from "@egovernments/digit-ui-libraries/src/services/Utils/Date";
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
  let { timeline, nextActions, auditDetails } = data;
  console.log("timeline:", timeline, "nextActions:", nextActions);

  const getCheckPoint = ({ status, caption, auditDetails }) => {
    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return <PendingForReassignment text={t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)} />;

      case "PENDINGFORASSIGNMENT":
        let complaintFiledDate = ConvertTimestampToDate(auditDetails.createdTime);
        return <PendingForAssignment complaintFiledDate={complaintFiledDate} text={t(`CS_COMMON_COMPLAINT_FILED`)} />;

      case "PENDINGATLME":
        let { name, mobileNumber } = caption[0];
        const assignedTo = `${t("CS_COMMON_COMPLAINT_ASSIGNED_TO")} to`;
        return <PendingAtLME name={name} mobile={mobileNumber} text={assignedTo} />;

      case "RESOLVED":
        console.log("complaint.workflow.action:", nextActions);
        {
          complaintWorkflow.action === "RESOLVE" && !rating && (
            <React.Fragment>
              <Resolved nextActions={nextActions} serviceRequestId={serviceRequestId} text={t(`CS_COMMON_COMPLAINT_RESOLVED`)} />
            </React.Fragment>
          );
        }
        {
          complaintWorkflow.action === "RATE" && (
            <React.Fragment>
              <StarRated text={t("CS_ADDCOMPLAINT_YOU_RATED")} rating={rating} />{" "}
            </React.Fragment>
          );
        }
        {
          complaintWorkflow === "REOPEN" && <Reopen text={t(`CS_COMMON_COMPLAINT_REOPENED`)} reopenDate={auditDetails.lastModifiedTime} />;
        }

      case "CLOSEDAFTERRESOLUTION":
        return <span>{t("CS_COMMON_CLOSEDAFTERRESOLUTION")}</span>;

      default:
        return <span>{status}</span>;
    }
  };

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_COMPLAINT_TIMELINE`)}</CardSubHeader>
        {timeline && timeline.length > 0 && (
          <ConnectingCheckPoints>
            {timeline.map(({ status, caption, auditDetails }, index) => {
              {
                return getCheckPoint({ status, caption, auditDetails });
              }

              // return <CheckPoint key={index} customChild={history.text} isCompleted={true} />;
            })}
          </ConnectingCheckPoints>
        )}
      </Card>
    </React.Fragment>
  );
};

export default TimeLine;
