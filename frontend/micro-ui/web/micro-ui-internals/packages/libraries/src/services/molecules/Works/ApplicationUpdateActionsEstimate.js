import { WorksService } from "../../elements/Works";

const ApplicationUpdateActionsEstimate = async (applicationData, businessService) => {
    try {
        const response = await WorksService.updateEstimate(applicationData, businessService);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.Errors[0].message);
    }
};

export default ApplicationUpdateActionsEstimate; 
