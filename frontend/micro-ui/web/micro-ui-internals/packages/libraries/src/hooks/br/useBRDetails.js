import { useQuery } from "react-query";
import BRService from "../../services/elements/BR";

const useBRDetails = (t, tenantId, applicationNumber, config = {}) => {
  return useQuery(
    ["BR_SEARCH", tenantId, applicationNumber],
    () => BRService.search(t, tenantId, applicationNumber),
    config
  );
};

export default useBRDetails;
