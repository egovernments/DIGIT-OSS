import React, { useState, useEffect } from "react";

const useWorkflowDetails = ({ tenantId, id }) => {
  const [workflowDetails, setWorkflowDetails] = useState({});

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
