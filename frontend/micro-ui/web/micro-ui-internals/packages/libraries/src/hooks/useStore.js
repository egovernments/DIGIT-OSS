import { useQuery } from "react-query";
import StoreData from "../services/molecules/StoreData";

const useStore = {
  getInitData: () =>
    useQuery(["STORE_DATA"], () => StoreData.getInitData(), {
      staleTime: Infinity,
    }),
};

export default useStore;
