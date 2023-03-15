import { OBPSService } from "../../elements/OBPS";

const BPAREGApplicationUpdateActions = async (applicationData, tenantId) => {
  try {
    const response = await OBPSService.BPAREGupdate(applicationData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default BPAREGApplicationUpdateActions;
