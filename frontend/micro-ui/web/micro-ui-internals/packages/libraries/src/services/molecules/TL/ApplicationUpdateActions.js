import { TLService } from "../../elements/TL";

const ApplicationUpdateActions = async (applicationData, tenantId) => {
  try {
    const response = await TLService.update(applicationData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default ApplicationUpdateActions;
