import { Engagement } from "../../services/elements/Engagement";
import { useMutation } from "react-query";

const useCreateDocument = (filters, config) => {
  return useMutation((filters) => Engagement.create(filters));
};

export default useCreateDocument;
