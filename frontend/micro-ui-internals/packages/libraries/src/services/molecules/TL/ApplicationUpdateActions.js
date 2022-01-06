import { TLService } from "../../elements/TL";

const ApplicationUpdateActions = async (applicationData, tenantId) => {
  // ("find application update action here", applicationData, action, tenantId)
  try {
    const response = await TLService.update(applicationData, tenantId);
    //  ("find me here", response)
    return response;
  } catch (error) {
    //  ("find error here", error?.response);
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default ApplicationUpdateActions;
