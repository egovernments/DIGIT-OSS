import { TelePhone, GreyOutText, Rating } from "@egovernments/digit-ui-react-components";
import { ActionLinks } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ConvertTimestampToDate } from "../../../../libraries/src/services/Utils/Date";
//import { WorkflowService } from "../@egovernments/digit-utils/services/WorkFlowService";

// const useComplaintHistory = (processInstance, path) => {
// const [complaintHistory, setComplaintHistory] = useState([]);

const GetTranslatedAction = (action, t) => t(`CS_COMMON_${action}`);

const GetReopenInstance = (obj, t) => {
  let reopenDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
  return (
    <React.Fragment>
      <div>{t(`CS_COMMON_COMPLAINT_REOPENED`)}</div>
      <GreyOutText>{reopenDate}</GreyOutText>
    </React.Fragment>
  );
};

const getResolvedInstance = async (obj, path, t, key) => {
  let nextAction = await Digit.workflowService.getNextAction("pb", key);

  let actions = nextAction.map(({ action }, index) => (
    <Link key={index} to={`${path}/${action.toLowerCase()}/${obj.businessId}`}>
      <ActionLinks>{GetTranslatedAction(action, t)}</ActionLinks>
    </Link>
  ));
  return (
    <div>
      {t(`CS_COMMON_COMPLAINT_RESOLVED`)} <div>{actions}</div>
    </div>
  );
};

const getNextState = async (obj, path, t, complaint) => {
  // let { t } = useTranslation();
  const key = obj.state.applicationStatus;

  const getRatingInstance = (rating) => <Rating text="You rated" withText={true} currentRating={rating} maxRating={5} onFeedback={() => {}} />;

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
      return (
        <React.Fragment>
          {complaint.workflow.action === "RESOLVE" && !complaint.service.rating && (
            <React.Fragment> {await getResolvedInstance(obj, path, t, key)} </React.Fragment>
          )}
          {complaint.workflow.action === "REOPEN" && <React.Fragment>{GetReopenInstance(obj, t)} </React.Fragment>}
          {complaint.workflow.action === "RATE" && <React.Fragment> {getRatingInstance(complaint.service.rating)} </React.Fragment>}
        </React.Fragment>
      );
    case "CLOSEDAFTERRESOLUTION":
      return <span>{t("CS_COMMON_CLOSEDAFTERRESOLUTION")}</span>;

    default:
    // code block
  }
};

const getComplaintHistory = async (processInstance, path, t, complaint) => {
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

const getTimeLineFromProcessInstance = async (processInstance, path, t, complaint) => {
  let timelineList = [];
  let timeline = await getComplaintHistory(processInstance, path, t, complaint);
  console.log("timeline:", timeline);
  if (timeline) {
    timelineList = await Promise.all(timeline);
    console.log("timelineList:", timelineList);
  }

  return timelineList;
};

//const history = getHistory(processInstance);

// useEffect(() => {
//   const history = getHistory(processInstance);
//   setComplaintHistory(history);
// }, [processInstance, getHistory]);

export default getTimeLineFromProcessInstance;
