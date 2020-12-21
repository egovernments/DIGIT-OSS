import { Request } from "../services/Utils/Request";
import Urls from "../services/urls";
class WorkFlowService {
  constructor() {
    this.init = (stateCode, businessServices) => {
      return Request({
        url: Urls.WorkFlow,
        useCache: true,
        method: "POST",
        params: { tenantId: stateCode, businessServices },
        auth: true,
      });
    };

    this.getByBusinessId = (stateCode, businessIds, params = {}, history = true) => {
      return Request({
        url: Urls.WorkFlowProcessSearch,
        useCache: false,
        method: "POST",
        params: { tenantId: stateCode, businessIds: businessIds, ...params, history },
        auth: true,
      });
    };

    this.getNextAction = async (stateCode, currentState) => {
      let role = Storage.get("role") || "CITIZEN";
      let res = await this.init(stateCode, "PGR");
      let selectedState = res.BusinessServices[0].states.filter((state) => {
        return state.state === currentState;
      })[0];
      let actions =
        (selectedState.actions &&
          selectedState.actions.filter((state) => {
            return state.roles.includes(role);
          })) ||
        [];
      return actions;
    };

    this.getDetailsById = async ({ tenantId, id, moduleCode, role }) => {
      console.log("getWorkflowDetails=====================>>>>>>>>", tenantId, id, moduleCode, role);
      const workflow = await this.getByBusinessId(tenantId, id);
      const businessServiceResponse = (await this.init(tenantId, moduleCode)).BusinessServices[0].states;
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
  }
}

export const workFlowServiceObj = new WorkFlowService();
