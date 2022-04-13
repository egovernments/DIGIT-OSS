import { FSMService } from "../services/elements/FSM";
import { PTService } from "../services/elements/PT";
import { useQuery } from "react-query";
import { MCollectService } from "../services/elements/MCollect";

const fsmApplications = async (tenantId, filters) => {
  return (await FSMService.search(tenantId, { ...filters, limit: 10000 })).fsm;
};

const ptApplications = async (tenantId, filters) => {
  return (await PTService.search({ tenantId, filters })).Properties;
};

const advtApplications = async (tenantId, filters) => {
  return (await MCollectService.search_bill({ tenantId, filters })).Bills;
};
const tlApplications = async (tenantId, filters) => {
  return (await TLService.search_bill({ tenantId, filters })).Bills;
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
    mcollect: {
      searchFn: () => advtApplications(tenantId, filters),
      key: "consumerCode",
      label: "UC_CHALLAN_NO",
    },
    ws: {
      searchFn: () => advtApplications(tenantId, filters),
      key: "consumerCode",
      label: "WS_MYCONNECTIONS_CONSUMER_NO",
    },
    sw: {
      searchFn: () => advtApplications(tenantId, filters),
      key: "consumerCode",
      label: "WS_MYCONNECTIONS_CONSUMER_NO",
    },
    TL: {
      searchFn: () => tlApplications(tenantId, filters),
      key: "consumerCode",
      label: "REFERENCE_NO",
    },
    BPAREG: {
      searchFn: () => tlApplications(tenantId, filters),
      key: "consumerCode",
      label: "REFERENCE_NO",
    },
    BPA: {
      searchFn: () => tlApplications(tenantId, filters),
      key: "consumerCode",
      label: "REFERENCE_NO",
    },
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
