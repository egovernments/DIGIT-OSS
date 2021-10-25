export const aphabeticalSortFunctionForTenantsBasedOnName = (firstEl, secondEl) => {
    if (firstEl.name.toUpperCase() < secondEl.name.toUpperCase()) {
        return -1
    }
    if (firstEl.name.toUpperCase() > secondEl.name.toUpperCase()) {
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

/** For testing multiple file upload */
export const isNestedArray = (documents) =>{
    if(!documents || !documents.length) return false
    if(Array.isArray(documents) && documents.length){
        const firstItem = Array.isArray(documents[0])
        if(firstItem){
            return true
        }
    }
    return false
}

/**
 * 
 * Becasue, for displaying file name while editing, dev manipulated documents array(nesting) 
 * hence flattening it again to make correct request
 */
export const reduceDocsArray = (documentsArray) => {
    if(!documentsArray || !documentsArray.length) return [];
    return documentsArray.reduce((acc, files) => {
        let fileObj = {};
        const [_, { file, fileStoreId }] = files;
        fileObj['fileName'] = file?.name;
        fileObj['documentType'] = file?.type;
        fileObj['fileStoreId'] = fileStoreId?.fileStoreId;
        acc.push(fileObj);
        return acc
    }, [])
    
}