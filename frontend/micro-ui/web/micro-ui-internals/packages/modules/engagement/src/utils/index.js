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

export const getFileUrl = async (fileStoreId) => {
    try {
        const response = await Digit.UploadServices.Filefetch([fileStoreId], Digit.ULBService.getStateId());
        if (response?.data?.fileStoreIds?.length > 0) {
            const url = response.data.fileStoreIds[0]?.url
            if (url.includes('.jpg') || url.includes('.png')) {
                const arr = url.split(',');
                const [original, large, medium, small] = arr;
                return original;
            }
            return response.data.fileStoreIds[0]?.url;
        }
    } catch (err) {
        console.error("Failed to Fetch from filestore", err);
    }
}

export const openUploadedDocument = async (filestoreId, name) => {

    if (!filestoreId || !filestoreId.length) { alert('No Document exists!'); return; }
    const w = window.open('', '_blank');
    const url = await getFileUrl(filestoreId)
    w.location = url;
    w.document.title = name;
}

export const openDocumentLink = (docLink, title) => {
    if (!docLink || !docLink.length) { alert('No Document Link exists!'); return; }
    const w = window.open("", '_blank');
    w.location = docLink;
    w.document.title = title;
}

export const downloadDocument = async (filestoreId, title) => {
    if (!filestoreId || !filestoreId.length) { alert('No Document exists!'); return; }

    const fileUrl = await getFileUrl(filestoreId);
    if (fileUrl) {
        Digit.Utils.downloadPDFFromLink(fileUrl);
    } else {
        console.error("Invalid Filestoreid or no file found to download");
    }
}

/** For testing multiple file upload */
export const isNestedArray = (documents) => {
    if (!documents || !documents.length) return false
    if (Array.isArray(documents) && documents.length) {
        const firstItem = Array.isArray(documents[0])
        if (firstItem) {
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
    if (!documentsArray || !documentsArray.length) return [];
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

export const getFileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return (
        parseFloat((size / Math.pow(k, i)).toFixed(2)) +
        ' ' +
        sizes[i]
    );
};

export const documentUploadMessage = (t, fileStoreId, editMode) => {
    if (!fileStoreId) return t(`CS_ACTION_NO_FILEUPLOADED`);
    return editMode ? fileStoreId?.fileStoreId?.length ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`) : fileStoreId ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)
}

