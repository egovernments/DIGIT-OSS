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
  let { timeline } = data;
  console.log("timeline:", timeline);
  console.log(" complaintWorkflow.action:", complaintWorkflow.action);

  const getCheckPoint = ({ status, caption, auditDetails, timeLineActions }) => {
    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return <PendingForReassignment text={t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)} />;

      case "PENDINGFORASSIGNMENT":
        let complaintFiledDate = ConvertTimestampToDate(auditDetails.createdTime);
        return <PendingForAssignment complaintFiledDate={complaintFiledDate} text={t(`CS_COMMON_COMPLAINT_FILED`)} />;

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
            reopenDate={ConvertTimestampToDate(auditDetails.lastModifiedTime)}
          />
        );

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
        {console.log("timeline", timeline)}
        {timeline && timeline.length > 0 && (
          <ConnectingCheckPoints>
            {timeline.map(({ status, caption, auditDetails, timeLineActions }, index) => {
              console.log("timeline.length:", status, timeline.length - 1, index);
              {
                return (
                  <CheckPoint
                    isCompleted={index === 0 ? true : false}
                    customChild={getCheckPoint({ status, caption, auditDetails, timeLineActions })}
                  ></CheckPoint>
                );
              }
            })}
          </ConnectingCheckPoints>
        )}
      </Card>
    </React.Fragment>
  );
};

export default TimeLine;
