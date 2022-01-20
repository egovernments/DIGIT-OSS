import { useQuery } from "react-query";

const alphabeticalSortFunctionForTenantsBasedOnName = (firstEl, secondEl) =>{
    if (firstEl.name.toUpperCase() < secondEl.name.toUpperCase() ) {
        return -1
    }
    if (firstEl.name.toUpperCase() > secondEl.name.toUpperCase() ) {
        return 1
    }
        return 0
}

export const useTenants = () => useQuery(["ALL_TENANTS"], () => Digit.SessionStorage.get("initData").tenants.sort(alphabeticalSortFunctionForTenantsBasedOnName))
