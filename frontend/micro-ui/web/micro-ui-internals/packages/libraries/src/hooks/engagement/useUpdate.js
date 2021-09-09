import { Engagement } from "../../services/elements/Engagement";
import { useMutation } from "react-query";

const useUpdateDocument = (filters, config) => {
  return useMutation((filters) => Engagement.update(filters));
};

export default useUpdateDocument;
