import { CustomService } from "./CustomService";


const ApplicationUpdateActionsCustom = async ({ url, body }) => {
    try {
        //here need to update this object to send
        const response = await CustomService.getResponse({ url, body,useCache:false,setTimeParam:false });
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.Errors[0].message);
    }
};

export default ApplicationUpdateActionsCustom; 
