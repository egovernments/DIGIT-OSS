import { TelePhone } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ConvertTimestampToDate } from "../../../../libraries/src/services/Utils/Date";
import { PGR_BASE } from "../constants/Routes";
//import { WorkflowService } from "../@egovernments/digit-utils/services/WorkFlowService";

const useComplaintHistory = (processInstance) => {
  const [complaintHistory, setComplaintHistory] = useState([]);

  let { t } = useTranslation();

  const getNextState = async (obj) => {
    const key = obj.state.applicationStatus;
    let nextAction = await Digit.workflowService.getNextAction("pb", key);

    const GetAction = (action) => t(`CS_COMMON_${action}`);

    switch (key) {
      case "PENDINGFORREASSIGNMENT":
        return (
          <React.Fragment>
            <div>
              <strong>{t(`CS_COMMON_COMPLAINT_PENDINGFORASSINMENT`)}</strong>
            </div>
          </React.Fragment>
        );
      case "PENDINGFORASSIGNMENT":
        let complaintFiledDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
        return (
          complaintFiledDate && (
            <React.Fragment>
              <div>
                <strong>{t(`CS_COMMON_COMPLAINT_FILED`)}</strong>
              </div>
              <div>{complaintFiledDate}</div>
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
              <span>
                {/* {t(`CS_COMMON_COMPLAINT_ASSIGNED_TO`)} {name} <a href={`tel:${mobileNumber}`}>{mobileNumber}</a> */}
                <TelePhone mobile={mobileNumber} text={`${assignedTo} ${name}`} />
              </span>
            </React.Fragment>
          )
        );
      case "RESOLVED":
        return (
          <React.Fragment>
            <div>
              <strong> {t(`CS_COMMON_COMPLAINT_RESOLVED`)}</strong>
            </div>
            {nextAction.map(({ action }, index) => (
              <Link key={index} to={`${PGR_BASE}${action.toLowerCase()}/${obj.businessId}`}>
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
    setComplaintHistory(history);
  }, [processInstance, getHistory]);

  return complaintHistory;
};

export default useComplaintHistory;
