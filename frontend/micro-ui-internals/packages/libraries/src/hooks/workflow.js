import { useQuery } from "react-query";

const getWorkflowDetails = async ({ tenantId, id, moduleCode, role }) => {
  console.log("getWorkflowDetails", tenantId, id, moduleCode, role);
  const workflow = await Digit.workflowService.getByBusinessId(tenantId, id);
  const businessServiceResponse = (await Digit.workflowService.init(tenantId, moduleCode)).BusinessServices[0].states;
  if (workflow && workflow.ProcessInstances) {
    const processInstances = workflow.ProcessInstances;
    const nextStates = processInstances[0].nextActions.map((action) => ({ action: action.action, nextState: action.nextState }));
    const nextActions = nextStates.map((id) => ({
      action: id.action,
      state: businessServiceResponse.find((state) => state.uuid === id.nextState),
    }));
    const actionRolePair = nextActions?.map((action) => ({
      action: action.action,
      roles: action.state.actions?.map((action) => action.roles).join(","),
    }));

    if (processInstances.length > 0) {
      const details = {
        timeline: processInstances.map((instance) => ({
          status: instance.state.applicationStatus,
          caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
          auditDetails: {
            created: Digit.DateUtils.ConvertTimestampToDate(instance.auditDetails.createdTime),
            lastModified: Digit.DateUtils.ConvertTimestampToDate(instance.auditDetails.lastModifiedTime),
          },
          timeLineActions: instance.state.actions
            ? instance.state.actions.filter((action) => action.roles.includes(role)).map((action) => action.action)
            : null,
        })),
        nextActions: actionRolePair,
      };
      if (role !== "CITIZEN") {
        details.timeline.push({
          status: "COMPLAINT_FILED",
        });
      }
      return details;
    }
  } else {
    console.warn("error fetching workflow services");
    throw new Error("error fetching workflow services");
  }
  return {};
};

const useWorkflowDetails = ({ tenantId, id, moduleCode, role = "CITIZEN" }) => {
  const { isLoading, error, isError, data } = useQuery(["workFlowDetails", tenantId, id, moduleCode, role], () =>
    getWorkflowDetails({ tenantId, id, moduleCode, role })
  );
  return { isLoading, error, isError, data };
};

export default useWorkflowDetails;
