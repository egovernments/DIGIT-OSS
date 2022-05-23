import { WSService } from "../../services/elements/WS";
import { useMutation } from "react-query";

const useMeterReadingCreateAPI = (businessService = "WS") => {
    return useMutation((data) => WSService.meterConnectioncreate(data, businessService));
};

export default useMeterReadingCreateAPI; 