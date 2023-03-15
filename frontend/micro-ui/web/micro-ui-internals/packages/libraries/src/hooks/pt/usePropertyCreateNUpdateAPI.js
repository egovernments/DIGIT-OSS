import { PTService } from "../../services/elements/PT";
import { useMutation } from "react-query";

const usePropertyCreateNUpdateAPI = (tenantId, update = false) => {
  let mutation = useMutation(async (data) => { 
    const createdProp = await PTService.create(data, tenantId)
    if(createdProp?.ResponseInfo && createdProp?.ResponseInfo?.status === "successful") {
      if(update) {
        await PTService.update(createdProp?.Properties[0], tenantId)
      }
    }
  });

  return mutation;
};

export default usePropertyCreateNUpdateAPI;
