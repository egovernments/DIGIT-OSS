import { useQuery } from "react-query";

export const useTenants = () => useQuery(["ALL_TENANTS"], () => Digit.SessionStorage.get("initData").tenants)
