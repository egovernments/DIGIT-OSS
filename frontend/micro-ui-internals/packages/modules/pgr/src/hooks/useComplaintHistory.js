import { TelePhone, GreyOutText } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ConvertTimestampToDate } from "../../../../libraries/src/services/Utils/Date";
//import { WorkflowService } from "../@egovernments/digit-utils/services/WorkFlowService";

const useComplaintHistory = (processInstance, path) => {
  const [complaintHistory, setComplaintHistory] = useState([]);

  let { t } = useTranslation();

  const getNextState = async (obj) => {
    const key = obj.state.applicationStatus;
    let nextAction = await Digit.workflowService.getNextAction("pb", key);

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
        const assignedTo = t("CS_COMMON_COMPLAINT_ASSIGNED_TO");
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
            <div>{t(`CS_COMMON_COMPLAINT_RESOLVED`)}</div>
            {nextAction.map(({ action }, index) => (
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
          </React.Fragment>
        );
      case "CLOSEDAFTERRESOLUTION":
        return <span>{t("CS_COMMON_CLOSED_AFTER_RESOLUTION")}</span>;

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
    setComplaintHistory(history);
  }, [processInstance, getHistory]);

  return complaintHistory;
};

export default useComplaintHistory;
