import { Request } from "../services/Utils/Request";

class WorkFlowService {
  constructor() {
    this.init = (stateCode = "pb", businessServices = "PGR") => {
      return Request({
        url: Urls.WorkFlow,
        useCache: true,
        method: "POST",
        params: { tenantId: stateCode, businessServices },
        auth: true,
      });
    };

    this.getByBusinessId = (stateCode = "pb", businessIds, params = {}, history = true) => {
      return Request({
        url: Urls.WorkFlowProcessSearch,
        useCache: false,
        method: "POST",
        params: { tenantId: stateCode, businessIds: businessIds, ...params, history },
        auth: true,
      });
    };

    this.getNextAction = async (stateCode = "pb", currentState) => {
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
  }
}

export const workFlowServiceObj = new WorkFlowService();
