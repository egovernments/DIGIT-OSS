import { useQuery } from "react-query";

const useStaticData = (tenantId) => {
    return useQuery(["MODULE_LEVEL_HOME_PAGE_STATIC_DATA", tenantId], () => Digit.MDMSService.getStaticDataJSON(tenantId));
  };

export default useStaticData;