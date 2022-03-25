import { TLSearch } from "../../services/molecules/TL/Search";
import { useQuery } from "react-query";

const useApplicationDetail = (t, tenantId, applicationNumber, config = {}, userType) => {
  let EditRenewalApplastModifiedTime = Digit.SessionStorage.get("EditRenewalApplastModifiedTime");
  return useQuery(
    ["APPLICATION_SEARCH", "TL_SEARCH", applicationNumber, userType, EditRenewalApplastModifiedTime],
    () => TLSearch.applicationDetails(t, tenantId, applicationNumber, userType),
    config
  );
};

export default useApplicationDetail;
