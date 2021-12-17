import { Engagement } from "../../services/elements/Engagement";
import { useMutation } from "react-query";

const useDelteDocument = (filters, config) => {
  return useMutation((filters) => Engagement.delete(filters));
};

export default useDelteDocument;
