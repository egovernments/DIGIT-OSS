import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "react-query";

const useUpdateSurvey = (filters, config) => {
  return useMutation((filters) => Surveys.update(filters));
};

export default useUpdateSurvey;
