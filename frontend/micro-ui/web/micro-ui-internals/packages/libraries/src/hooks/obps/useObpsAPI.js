import { OBPSService } from "../../services/elements/OBPS";
import { useMutation } from "react-query";

const updateNOCAPI = async (data, tenantId) => {
  try {
    const response = await OBPSService.updateNOC(data, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].code);
  }
}

const updateAPI = async (data, tenantId) => {
  try {
    const response = await OBPSService.update(data, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].code);
  }
}

const useObpsAPI = (tenantId, type = false) => {
  if (type) {
    return useMutation((data) => updateNOCAPI(data, tenantId));
  } 
  else {
    return useMutation((data) => updateAPI(data, tenantId));
  }
};

export default useObpsAPI;