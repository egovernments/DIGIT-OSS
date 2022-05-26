import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "react-query";

const useCreateSurveys = (filters, config) => {
  return useMutation((filters) => Surveys.create(filters));
};

export default useCreateSurveys;
