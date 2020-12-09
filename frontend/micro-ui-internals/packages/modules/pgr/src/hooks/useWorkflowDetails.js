import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useWorkflowDetails = ({ tenantId, id }) => {
  const [workflowDetails, setWorkflowDetails] = useState({});
  let role = Digit.SessionStorage.get("role") || "CITIZEN"; // ToDo:store in session storage
  const appState = useSelector((state) => state);
  console.log("appppppppppppppppppp state ", appState);
  // let actions =
  // (selectedState.actions &&
  //   selectedState.actions.filter((state) => {
  //     return state.roles.includes(role);
  //   })) ||
  // [];
  useEffect(() => {
    (async () => {
      //TO do. get tenant id
      const workflow = await Digit.workflowService.getByBusinessId((tenantId = "pb.amritsar"), id);
      if (workflow && workflow.ProcessInstances) {
        // const processInstances = workflow.ProcessInstances.sort((a, b) => a.auditDetails.createdTime - b.auditDetails.createdTime);
        const processInstances = workflow.ProcessInstances;
        const nextStates = processInstances[0].nextActions.map((action) => action.nextState);
        const nextActions = nextStates.map((id) => {
          (async () => {
            console.log("idddddd", id);
            // await Digit.workflowService.getNextAction((tenantId = "pb.amritsar"), id)
          })();
        });
        console.log("workflow details 123", processInstances, nextStates, nextActions);
        if (processInstances.length > 0) {
          const details = {
            timeline: processInstances.map((state) => ({
              status: state.state.applicationStatus,
              caption: state.assignes ? state.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
              auditDetails: {
                created: Digit.DateUtils.ConvertTimestampToDate(state.auditDetails.createdTime),
                lastModified: Digit.DateUtils.ConvertTimestampToDate(state.auditDetails.lastModifiedTime),
              },
              timeLineActions: state.state.actions
                ? state.state.actions.filter((action) => action.roles.includes(role)).map((action) => action.action)
                : null,
            })),
            nextActions: {
              actions: processInstances[0].nextActions ? processInstances[0].nextActions.map((action) => action.action) : null,
              roles: processInstances[0].nextActions.map((action) => action.roles),
            },
          };
          setWorkflowDetails(details);
        }
      } else {
        console.warn("error fetching workflow services");
      }
    })();
  }, [tenantId, id]);

  return workflowDetails;
};

export default useWorkflowDetails;
