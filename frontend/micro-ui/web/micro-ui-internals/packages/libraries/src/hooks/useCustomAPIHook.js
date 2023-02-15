import { useQuery, useQueryClient } from "react-query";
import { CustomService } from "../services/elements/CustomService";

/**
 * Custom hook which can gives the privacy functions to access
 *
 * @author jagankumar-egov
 *
 * Feature :: Privacy
 *
 * @example
 *         const { privacy , updatePrivacy } = Digit.Hooks.usePrivacyContext()
 *
 * @returns {Object} Returns the object which contains privacy value and updatePrivacy method
 */
const useCustomAPIHook = (url, params, body, plainAccessRequest, options = {}) => {
  const client = useQueryClient();
  //api name, querystr, reqbody
  const { isLoading, data } = useQuery(
    ["CUSTOM", { ...params, ...body, ...plainAccessRequest }].filter((e) => e),
    () => CustomService.getResponse({ url, params, ...body, plainAccessRequest }),
    options
  );
  return {
    isLoading,
    data,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: ["CUSTOM", { ...params, ...body, ...plainAccessRequest }] });
    },
  };
};

export default useCustomAPIHook;
