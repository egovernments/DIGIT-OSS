import { FSMService } from "../../elements/FSM";

export const Search = {
  all: (tenantId) => {
    return FSMService.search(tenantId, { applicationNumber: null });
  },

  application: (tenantId, applicationNumber) => {
    return FSMService.search(tenantId, { applicationNumber: applicationNumber });
  },
};
