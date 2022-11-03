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
const useCustomAPIHook = (url, params, body,plainAccessRequest, options = {}) => {
  const client = useQueryClient();
  //api name, querystr, reqbody
  const {isLoading,data} = useQuery(["CUSTOM", params, body,plainAccessRequest], () => CustomService.getResponse({ url, params, body,plainAccessRequest }), options);
  return { isLoading,data, revalidate: () => client.invalidateQueries(["CUSTOM", params, body,plainAccessRequest]) };
};

export default useCustomAPIHook;
