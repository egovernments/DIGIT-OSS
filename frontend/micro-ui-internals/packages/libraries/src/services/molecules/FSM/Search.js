import { FSMService } from "../../elements/FSM";

export const Search = {
  all: (tenantId) => {
    return FSMService.search(tenantId, { applicationNumber: "" });
  },

  application: (tenantId, applicationNumber, uuid, limit) => {
    return FSMService.search(tenantId, { applicationNumber, uuid, limit });
  },
};
