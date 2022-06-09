import { WSService } from "../../elements/WS";

const ApplicationUpdateActionsBillAmendUpdate = async (applicationData) => {
    try {
        const response = await WSService.updateBillAmend(applicationData);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.Errors[0].message);
    }
};

export default ApplicationUpdateActionsBillAmendUpdate;
