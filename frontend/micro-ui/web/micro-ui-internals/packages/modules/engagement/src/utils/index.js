export const aphabeticalSortFunctionForTenantsBasedOnName = (firstEl, secondEl) =>{
    if (firstEl.name.toUpperCase() < secondEl.name.toUpperCase() ) {
        return -1
    }
    if (firstEl.name.toUpperCase() > secondEl.name.toUpperCase() ) {
        return 1
    }
        return 0
}

export const areEqual = (stringA, stringB) => {
    if (!stringA || !stringB) return false;
    if (stringA?.trim()?.toLowerCase() === stringB?.trim()?.toLowerCase()) {
      return true;
    }
    return false;
  }