import useCustomMDMS  from "../useCustomMDMS";
import { useQuery, useQueryClient } from "react-query";
import { WSService } from "../../services/elements/WS";
import { checkPrivacy } from "../../utils/privacy";

const useToCheckPrivacyEnablement = (({ privacy = {}, config }) => {
    const { isLoading, data:privacyData } = useCustomMDMS(
      Digit.ULBService.getStateId(),
      "DataSecurity",
      [{ name: "SecurityPolicy" }],
      {
        select: (data) => data?.DataSecurity?.SecurityPolicy?.find((elem) => elem?.model == privacy?.model) || {},
      }
    );

    if(checkPrivacy(privacyData, { ...privacy }))
    return true
    else
    return false
  })

  export default useToCheckPrivacyEnablement;