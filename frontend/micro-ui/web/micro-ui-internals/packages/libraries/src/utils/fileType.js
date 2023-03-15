const getFileTypeFromFileStoreURL = (filestoreURL) => {
    if(filestoreURL.includes(".pdf")) return "pdf"
    if(filestoreURL.includes(".jpg") || filestoreURL.includes(".jpeg") || filestoreURL.includes(".png") || filestoreURL.includes(".webp")) return "image"
    else return "image"
}

export default getFileTypeFromFileStoreURL