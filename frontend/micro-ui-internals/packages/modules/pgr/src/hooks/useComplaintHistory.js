import { TelePhone, GreyOutText, Rating } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ConvertTimestampToDate } from "../../../../libraries/src/services/Utils/Date";
//import { WorkflowService } from "../@egovernments/digit-utils/services/WorkFlowService";

// const useComplaintHistory = (processInstance, path) => {
// const [complaintHistory, setComplaintHistory] = useState([]);

const getNextState = (obj, path, t, complaint) => {
  console.log("obj:", complaint);
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
      let nextAction = obj.nextActions;
      return (
        <React.Fragment>
          <div>{t(`CS_COMMON_COMPLAINT_RESOLVED`)}</div>

          {!complaint.service.rating &&
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

          {complaint.service.rating && (
            <div>
              <Rating text="You rated" withText={true} currentRating={3} maxRating={5} />
            </div>
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
    let history = ProcessInstances.map((instance) => {
      return {
        applicationStatus: instance.state.applicationStatus,
        text: getNextState(instance, path, t, complaint),
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
