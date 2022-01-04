import { useQueryClient } from "react-query";

export const useRevalidateQuery = async (key) => {
  const client = useQueryClient();
  return client.refetchQueries(key);
};
