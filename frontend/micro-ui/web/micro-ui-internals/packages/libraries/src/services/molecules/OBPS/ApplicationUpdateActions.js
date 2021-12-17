import { OBPSService } from "../../elements/OBPS";

const ApplicationUpdateActions = async (applicationData, tenantId) => {
  try {
    const response = await OBPSService.update(applicationData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default ApplicationUpdateActions;
