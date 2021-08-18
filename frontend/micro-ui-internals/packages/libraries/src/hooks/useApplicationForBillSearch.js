import { FSMService } from "../services/elements/FSM";
import { PTService } from "../services/elements/PT";
import { useQuery } from "react-query";

const fsmApplications = async (tenantId, filters) => {
  return (await FSMService.search(tenantId, { ...filters, limit: 10000 })).fsm;
};

const ptApplications = async (tenantId, filters) => {
  return (await PTService.search({ tenantId, filters })).Properties;
};

const refObj = (tenantId, filters) => {
  let consumerCodes = filters?.consumerCodes;
  // delete filters.consumerCodes;

  return {
    pt: {
      searchFn: () => ptApplications(null, { ...filters, propertyIds: consumerCodes }),
      key: "propertyId",
      label: "PT_UNIQUE_PROPERTY_ID",
    },
    fsm: {
      searchFn: () => fsmApplications(tenantId, filters),
      key: "applicationNo",
      label: "FSM_APPLICATION_NO",
    },
  };
};

export const useApplicationsForBusinessServiceSearch = ({ tenantId, businessService, filters }, config = {}) => {
  const _key = businessService?.toLowerCase().split(".")[0];

  /* key from application ie being used as consumer code in bill */
  const { searchFn, key, label } = refObj(tenantId, filters)[_key];
  const applications = useQuery(["applicationsForBillDetails", { tenantId, businessService, filters, searchFn }], searchFn, {
    ...config,
  });

  return { ...applications, key, label };
};
