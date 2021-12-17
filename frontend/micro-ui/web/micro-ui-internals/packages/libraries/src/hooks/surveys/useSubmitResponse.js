import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "react-query";

const useSubmitResponse = (filters, config) => {
    return useMutation((filters) => Surveys.submitResponse(filters));
};

export default useSubmitResponse;
