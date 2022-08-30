import { WSService } from "../../elements/WS";

const ApplicationUpdateActions = async (applicationData, businessService) => {
  try {
    const response = await WSService.update(applicationData, businessService);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default ApplicationUpdateActions;
