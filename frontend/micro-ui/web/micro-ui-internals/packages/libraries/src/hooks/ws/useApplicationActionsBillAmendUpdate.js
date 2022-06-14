import { useMutation } from "react-query";
import ApplicationUpdateActionsBillAmendUpdate from "../../services/molecules/WS/ApplicationUpdateActionsBillAmendUpdate";

const useApplicationActionsBillAmendUpdate = () => {
    return useMutation((applicationData) => ApplicationUpdateActionsBillAmendUpdate(applicationData));
};

export default useApplicationActionsBillAmendUpdate;
