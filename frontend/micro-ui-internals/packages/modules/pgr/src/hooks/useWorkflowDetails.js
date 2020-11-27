import React, { useState, useEffect } from "react";

const useWorkflowDetails = ({ tenantId, id }) => {
  const [workflowDetails, setWorkflowDetails] = useState({});

  useEffect(() => {
    (async () => {
      const workflow = await Digit.workflowService.getByBusinessId(tenantId, id);

      if (workflow && workflow.ProcessInstances) {
        const processInstances = workflow.ProcessInstances.sort((a, b) => a.auditDetails.createdTime - b.auditDetails.createdTime);
        console.log("workflow123", processInstances);
        const details = {
          timeline: processInstances.map((state) => ({
            status: state.state.applicationStatus,
            caption: state.assignes ? state.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
          })),
          nextActions: processInstances[processInstances.length - 1].state.actions
            ? processInstances[processInstances.length - 1].state.actions.map((action) => action.action)
            : null,
        };

        setWorkflowDetails(details);
        console.log("details", details);
      } else {
        console.warn("error fetching workflow services");
      }
    })();
  }, [tenantId, id]);

  return workflowDetails;
};

export default useWorkflowDetails;
