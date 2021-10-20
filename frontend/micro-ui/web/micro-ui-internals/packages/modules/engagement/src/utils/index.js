export const aphabeticalSortFunctionForTenantsBasedOnName = (firstEl, secondEl) =>{
    if (firstEl.name.toUpperCase() < secondEl.name.toUpperCase() ) {
        return -1
    }
    if (firstEl.name.toUpperCase() > secondEl.name.toUpperCase() ) {
        return 1
    }
        return 0
}