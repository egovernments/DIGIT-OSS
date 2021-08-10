import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";
import cloneDeep from "lodash/cloneDeep";

export const WorkflowService = {
  init: (stateCode, businessServices) => {
    return Request({
      url: Urls.WorkFlow,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode, businessServices },
      auth: true,
    });
  },

  getByBusinessId: (stateCode, businessIds, params = {}, history = true) => {
    return Request({
      url: Urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: { tenantId: stateCode, businessIds: businessIds, ...params, history },
      auth: true,
    });
  },

  getDetailsById: async ({ tenantId, id, moduleCode, role }) => {
    // console.log("getWorkflowDetails", tenantId, id, moduleCode, role);
    // console.log(Digit);
    const workflow = await Digit.WorkflowService.getByBusinessId(tenantId, id);
    const applicationProcessInstance = cloneDeep(workflow?.ProcessInstances);
    const businessServiceResponse = (await Digit.WorkflowService.init(tenantId, moduleCode))?.BusinessServices[0]?.states;
    if (workflow && workflow.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      const nextStates = processInstances[0]?.nextActions.map((action) => ({ action: action?.action, nextState: action.nextState }));
      const nextActions = nextStates.map((id) => ({
        action: id.action,
        state: businessServiceResponse?.find((state) => state.uuid === id.nextState),
      }));

      /* To check state is updatable and provide edit option*/
      const currentState = businessServiceResponse?.find((state) => state.uuid === processInstances[0]?.state.uuid);
      if (currentState && currentState?.isStateUpdatable) {
        if (moduleCode === "FSM" || moduleCode === "FSM_VEHICLE_TRIP" || moduleCode === "PGR") null;
        else nextActions.push({ action: "EDIT", state: currentState });
      }

      const getStateForUUID = (uuid) => businessServiceResponse?.find((state) => state.uuid === uuid);

      const actionState = businessServiceResponse
        ?.filter((state) => state.uuid === processInstances[0]?.state.uuid)
        .map((state) => {
          let _nextActions = state.actions?.map?.((ac) => {
            let actionResultantState = getStateForUUID(ac.nextState);
            let assignees = actionResultantState?.actions?.reduce?.((acc, act) => {
              return [...acc, ...act.roles];
            }, []);
            return { ...actionResultantState, assigneeRoles: assignees, action: ac.action, roles: ac.roles };
          });
          return { ...state, nextActions: _nextActions, roles: state?.action, roles: state?.actions?.reduce((acc, el) => [...acc, ...el.roles], []) };
        })?.[0];

      const actionRolePair = nextActions?.map((action) => ({
        action: action?.action,
        roles: action.state?.actions?.map((action) => action.roles).join(","),
      }));

      if (processInstances.length > 0) {
        const timeline = processInstances
          .filter((e) => e.action !== "COMMENT")
          .map((instance, ind) => {
            const checkPoint = {
              performedAction: instance.action,
              status: instance.state.applicationStatus,
              state: instance.state.state,
              assigner: instance?.assigner,
              rating: instance?.rating,
              comment: instance?.comment,
              documents: instance?.documents,
              caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
              auditDetails: {
                created: Digit.DateUtils.ConvertTimestampToDate(instance.auditDetails.createdTime),
                lastModified: Digit.DateUtils.ConvertTimestampToDate(instance.auditDetails.lastModifiedTime),
              },
              timeLineActions: instance.nextActions
                ? instance.nextActions.filter((action) => action.roles.includes(role)).map((action) => action?.action)
                : null,
            };
            return checkPoint;
          });

        const nextActions = actionRolePair;

        if (role !== "CITIZEN" && moduleCode === "PGR") {
          timeline.push({
            status: "COMPLAINT_FILED",
          });
        }

        if (timeline[timeline.length - 1].status !== "CREATED" && moduleCode === "FSM")
          timeline.push({
            status: "CREATED",
          });

        const details = {
          timeline,
          nextActions,
          actionState,
          applicationBusinessService: workflow?.ProcessInstances?.[0]?.businessService,
          processInstances: applicationProcessInstance,
        };
        return details;
      }
    } else {
      console.warn("error fetching workflow services");
      throw new Error("error fetching workflow services");
    }
    return {};
  },

  getAllApplication: (tenantId, filters) => {
    return Request({
      url: Urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: { tenantId, ...filters },
      auth: true,
    });
  },
};
