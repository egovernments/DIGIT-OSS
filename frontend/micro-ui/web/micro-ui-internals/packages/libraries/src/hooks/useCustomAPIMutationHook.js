import { useQueryClient, useMutation } from "react-query";
import { CustomService } from "../services/elements/CustomService";

/**
 * Custom hook which can make api call and format response
 *
 * @author jagankumar-egov
 *
 *
 * @example
 * 
 const requestCriteria = [
      "/user/_search",             // API details
    {},                            //requestParam
    {data : {uuid:[Useruuid]}},    // requestBody
    {} ,                           // privacy value 
    {                              // other configs
      enabled: privacyState,
      cacheTime: 100,
      select: (data) => {
                                    // format data
        return  _.get(data, loadData?.jsonPath, value);
      },
    },
  ];
  const mutation = Digit.Hooks.useCustomAPIMutationHook(...requestCriteria);


while mutating use the following format 

mutation.mutate({
          params: {},
          body: { "payload": {
                   // custom data
                } 
          }},
          {
            onError : ()=> { // custom logic},
            onSuccess : ()=> { // custom logic}
          }
        );

 *
 * @returns {Object} Returns the object which contains data and isLoading flag
 */

const useCustomAPIMutationHook = ({ url, params, body, config = {}, plainAccessRequest, changeQueryName = "Random" }) => {
  const client = useQueryClient();

  const { isLoading, data, isFetching, ...rest } = useMutation(
    (data) => CustomService.getResponse({ url, params: { ...params, ...data?.params }, body: { ...body, ...data?.body }, plainAccessRequest }),
    {
      cacheTime: 0,
      ...config,
    }
  );
  return {
    ...rest,
    isLoading,
    isFetching,
    data,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },
  };
};

export default useCustomAPIMutationHook;
