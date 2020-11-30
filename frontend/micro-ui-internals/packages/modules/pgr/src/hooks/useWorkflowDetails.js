import React, { useState, useEffect } from "react";

const useWorkflowDetails = ({ tenantId, id }) => {
  const [workflowDetails, setWorkflowDetails] = useState({});
  let role = Digit.SessionStorage.get("role") || "CITIZEN"; // ToDo:store in session storage
  // let actions =
  // (selectedState.actions &&
  //   selectedState.actions.filter((state) => {
  //     return state.roles.includes(role);
  //   })) ||
  // [];
  useEffect(() => {
    (async () => {
      const workflow = await Digit.workflowService.getByBusinessId((tenantId = "pb.amritsar"), id);
      if (workflow && workflow.ProcessInstances) {
        // const processInstances = workflow.ProcessInstances.sort((a, b) => a.auditDetails.createdTime - b.auditDetails.createdTime);
        const processInstances = workflow.ProcessInstances;
        console.log("workflow123", processInstances);
        if (processInstances.length > 0) {
          const details = {
            timeline: processInstances.map((state) => ({
              status: state.state.applicationStatus,
              caption: state.assignes ? state.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
              auditDetails: state.auditDetails,
              timeLineActions: state.state.actions
                ? state.state.actions.filter((action) => action.roles.includes(role)).map((action) => action.action)
                : null,
            })),
            nextActions: processInstances[processInstances.length - 1].state.actions
              ? processInstances[processInstances.length - 1].state.actions.map((action) => action.action)
              : null,
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
