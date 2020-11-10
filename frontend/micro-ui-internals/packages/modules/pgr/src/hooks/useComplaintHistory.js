import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
//import { WorkflowService } from "../@egovernments/digit-utils/services/WorkFlowService";

const useComplaintHistory = (processInstance) => {
  const [complaintHistory, setComplaintHistory] = useState([]);

  let { t } = useTranslation();

  const getNextState = async (obj) => {
    const key = obj.state.applicationStatus;
    let nextAction = await Digit.workflowService.getNextAction("pb", key);

    const GetAction = (action) => t(`CS_COMMON_${action}`);

    switch (key) {
      case "PENDINGATLME":
        let assignes = obj.assignes != null && obj.assignes[0];
        let { name, mobileNumber } = assignes;
        return (
          name &&
          mobileNumber && (
            <React.Fragment>
              <span>
                assigned to {name} {mobileNumber}
              </span>
            </React.Fragment>
          )
        );
      case "RESOLVED":
        return (
          <React.Fragment>
            {nextAction.map(({ action }, index) => (
              <Link to={`/${action.toLowerCase()}/${obj.businessId}`}>
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
          </React.Fragment>
        );
      case "CLOSEDAFTERRESOLUTION":
        return <span>Complaint Resolved</span>;

      default:
      // code block
    }
  };

  const getHistory = useCallback((processInstance) => {
    if (Object.keys(processInstance).length > 0) {
      let { ProcessInstances } = processInstance;
      let history = ProcessInstances.map(async (instance) => {
        return {
          applicationStatus: instance.state.applicationStatus,
          text: await getNextState(instance),
        };
      });
      return history;
    }
  }, []);

  useEffect(() => {
    const history = getHistory(processInstance);
    console.log("history--->", history);
    setComplaintHistory(history);
  }, [processInstance, getHistory]);

  return complaintHistory;
};

export default useComplaintHistory;
