
import { useQuery } from "react-query";



const refObj = (tenantId, filters) => {
  let consumerCodes = filters?.consumerCodes;
  // delete filters.consumerCodes;

  return {
   
  };
};

export const useApplicationsForBusinessServiceSearch = ({ tenantId, businessService, filters }, config = {}) => {
  let _key = businessService?.toLowerCase().split(".")[0];
  if (window.location.href.includes("mcollect")) {
    _key = "mcollect";
  }
  if (window.location.href.includes("TL")) {
    _key = "TL";
  } 
  if (window.location.href.includes("BPAREG")) {
    _key = businessService
  }
  if (window.location.href.includes("BPA.")) {
    _key = "BPA"
  }

  /* key from application ie being used as consumer code in bill */
  const { searchFn, key, label } = refObj(tenantId, filters)[_key];
  const applications = useQuery(["applicationsForBillDetails", { tenantId, businessService, filters, searchFn }], searchFn, {
    ...config,
  });

  return { ...applications, key, label };
};
