import { WorksService } from "../../elements/Works";

const ApplicationUpdateActionsLOI = async (applicationData, businessService) => {
    try {
        const response = await WorksService.updateLOI(applicationData, businessService);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.Errors[0].message);
    }
};

export default ApplicationUpdateActionsLOI;
