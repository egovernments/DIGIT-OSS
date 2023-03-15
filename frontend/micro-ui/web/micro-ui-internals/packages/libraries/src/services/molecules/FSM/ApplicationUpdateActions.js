import { FSMService } from "../../elements/FSM";

const ApplicationUpdateActions = async (applicationData, tenantId) => {
  try {
    const response = await FSMService.update(applicationData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default ApplicationUpdateActions;
