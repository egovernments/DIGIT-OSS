import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "react-query";

const useShowResults = (filters, config) => {
  return useMutation((filters) => Surveys.showResults(filters));
};

export default useShowResults;
