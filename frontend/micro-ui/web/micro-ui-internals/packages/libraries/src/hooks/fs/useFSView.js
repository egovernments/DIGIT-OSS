import { useQuery, useMutation } from "react-query";
import FSService from "../../services/atoms/FSServices";


export const useFSView = (tenantId, config = {}) => {
    return useMutation((data) => FSService.get(data, tenantId));
};

export default useFSView;
