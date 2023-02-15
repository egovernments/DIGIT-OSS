import { WSService } from "../../services/elements/WS";
import { useMutation } from "react-query";

const useWSUpdateAPI = (businessService = "WATER") => {
    return useMutation((data) =>  WSService.update(data, businessService));
};

export default useWSUpdateAPI;