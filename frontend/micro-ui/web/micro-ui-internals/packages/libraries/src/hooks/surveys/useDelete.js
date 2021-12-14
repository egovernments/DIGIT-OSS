import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "react-query";

const useDeleteSurveys = (filters, config) => {
  return useMutation((filters) => Surveys.delete(filters));
};

export default useDeleteSurveys;
