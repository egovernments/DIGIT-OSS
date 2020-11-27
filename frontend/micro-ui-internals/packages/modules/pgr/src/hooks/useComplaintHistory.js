import { TelePhone, GreyOutText, Rating } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ConvertTimestampToDate } from "../../../../libraries/src/services/Utils/Date";
//import { WorkflowService } from "../@egovernments/digit-utils/services/WorkFlowService";

// const useComplaintHistory = (processInstance, path) => {
// const [complaintHistory, setComplaintHistory] = useState([]);

const getNextState = async (obj, path, t, complaint) => {
  // let { t } = useTranslation();
  const key = obj.state.applicationStatus;
  const GetAction = (action) => t(`CS_COMMON_${action}`);

  switch (key) {
    case "PENDINGFORREASSIGNMENT":
      return <React.Fragment>{t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)}</React.Fragment>;

    case "PENDINGFORASSIGNMENT":
      let complaintFiledDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
      return (
        complaintFiledDate && (
          <React.Fragment>
            {t(`CS_COMMON_COMPLAINT_FILED`)}
            <GreyOutText>{complaintFiledDate}</GreyOutText>
          </React.Fragment>
        )
      );

    case "PENDINGATLME":
      let assignes = obj.assignes != null && obj.assignes[0];
      let { name, mobileNumber } = assignes;
      const assignedTo = `${t("CS_COMMON_COMPLAINT_ASSIGNED_TO")} to`;
      return (
        name &&
        mobileNumber && (
          <React.Fragment>
            <TelePhone mobile={mobileNumber} text={`${assignedTo} ${name}`} />
          </React.Fragment>
        )
      );
    case "RESOLVED":
      // let nextAction = obj.nextActions;
      let nextAction = await Digit.workflowService.getNextAction("pb", key);
      let reopenDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
      return (
        <React.Fragment>
          {complaint.workflow.action === "REOPEN" ? (
            <div>{t(`CS_COMMON_COMPLAINT_REOPENED`)}</div>
          ) : (
            (<div>{t(`CS_COMMON_COMPLAINT_RESOLVED`)}</div>)()
          )}
          {complaint.workflow.action !== "REOPEN" &&
            !complaint.service.rating &&
            nextAction.map(({ action }, index) => (
              <Link key={index} to={`${path}/${action.toLowerCase()}/${obj.businessId}`}>
                <span
                  style={{
                    color: "#F47738",
                    marginLeft: index !== 0 ? "0.5rem" : "0",
                  }}
                >
                  {GetAction(action)}
                </span>
              </Link>
            ))}
          {console.log("complaint.service.rating:", complaint.service.rating)}
          {complaint.workflow.action !== "REOPEN" && complaint.service.rating && (
            <div>
              <Rating text="You rated" withText={true} currentRating={complaint.service.rating} maxRating={5} />
            </div>
          )}
          {complaint.workflow.action === "REOPEN" && (
            <React.Fragment>
              <GreyOutText>{reopenDate}</GreyOutText>
            </React.Fragment>
          )}
        </React.Fragment>
      );
    case "CLOSEDAFTERRESOLUTION":
      return <span>{t("CS_COMMON_CLOSEDAFTERRESOLUTION")}</span>;

    default:
    // code block
  }
};

const getComplaintHistory = (processInstance, path, t, complaint) => {
  if (Object.keys(processInstance).length > 0) {
    let { ProcessInstances } = processInstance;
    let history = ProcessInstances.map(async (instance) => {
      return {
        applicationStatus: instance.state.applicationStatus,
        text: await getNextState(instance, path, t, complaint),
      };
    });
    return history;
  }
};

//const history = getHistory(processInstance);

// useEffect(() => {
//   const history = getHistory(processInstance);
//   setComplaintHistory(history);
// }, [processInstance, getHistory]);

export default getComplaintHistory;
