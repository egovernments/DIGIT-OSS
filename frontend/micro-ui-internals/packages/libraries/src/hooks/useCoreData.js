import { useSelector } from "react-redux";

const useCoreData = () => {
  const state = useSelector((state) => state["common"]);

  return state;
};

export default useCoreData;
