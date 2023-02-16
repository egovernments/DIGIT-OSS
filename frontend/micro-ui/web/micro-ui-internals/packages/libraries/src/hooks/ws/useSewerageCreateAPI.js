import { WSService } from "../../services/elements/WS";
import { useMutation } from "react-query";

const useSewerageCreateAPI = (businessService = "WATER") => {
    return useMutation((data) => WSService.create(data, businessService));
};

export default useSewerageCreateAPI;