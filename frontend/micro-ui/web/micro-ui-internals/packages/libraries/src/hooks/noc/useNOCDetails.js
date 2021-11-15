import { NOCSearch } from "../../services/molecules/NOC/Search";
import { useQuery } from "react-query";

const useNOCDetails = (t, tenantId, applicationNumber, config = {}, userType) => {
  let EditRenewalApplastModifiedTime = Digit.SessionStorage.get("EditRenewalApplastModifiedTime");
  return useQuery(
    ["APPLICATION_SEARCH", "NOC_SEARCH", applicationNumber, userType, EditRenewalApplastModifiedTime],
    () => NOCSearch.applicationDetails(t, tenantId, applicationNumber, userType),
    config
  );
};

export default useNOCDetails;