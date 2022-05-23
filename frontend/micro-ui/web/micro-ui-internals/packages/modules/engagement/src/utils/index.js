import isToday from "date-fns/isToday";
export const alphabeticalSortFunctionForTenantsBasedOnName = (firstEl, secondEl) => {
  if (firstEl.name.toUpperCase() < secondEl.name.toUpperCase()) {
    return -1;
  }
  if (firstEl.name.toUpperCase() > secondEl.name.toUpperCase()) {
    return 1;
  }
  return 0;
};

export const areEqual = (stringA, stringB) => {
  if (!stringA || !stringB) return false;
  if (stringA?.trim()?.toLowerCase() === stringB?.trim()?.toLowerCase()) {
    return true;
  }
  return false;
};

export const getFileUrl = async (fileStoreId) => {
  try {
    const response = await Digit.UploadServices.Filefetch([fileStoreId], Digit.ULBService.getStateId());
    if (response?.data?.fileStoreIds?.length > 0) {
      const url = response.data.fileStoreIds[0]?.url;
      if (url.includes(".jpg") || url.includes(".png")) {
        const arr = url.split(",");
        const [original, large, medium, small] = arr;
        return original;
      }
      return response.data.fileStoreIds[0]?.url;
    }
  } catch (err) {
  }
};

export const openUploadedDocument = async (filestoreId, name) => {
  if (!filestoreId || !filestoreId.length) {
    alert("No Document exists!");
    return;
  }
  const w = window.open("", "_blank");
  const url = await getFileUrl(filestoreId);
  if (window.mSewaApp && window.mSewaApp.isMsewaApp()) {
    window.open(url, "_blank");
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  } else {
    w.location = url;
    w.document.title = name;
  }
};

export const openDocumentLink = (docLink, title) => {
  if (!docLink || !docLink.length) {
    alert("No Document Link exists!");
    return;
  }
  if (window.mSewaApp && window.mSewaApp.isMsewaApp()) {
    window.open(docLink, "_blank");
    setTimeout(() => {
      window.location.href = docLink;
    }, 1000);
  } else {
    const w = window.open("", "_blank");
    w.location = docLink;
    w.document.title = title;
  }
};

export const downloadDocument = async (filestoreId, title) => {
  if (!filestoreId || !filestoreId.length) {
    alert("No Document exists!");
    return;
  }

  const fileUrl = await getFileUrl(filestoreId);
  if (fileUrl) {
    Digit.Utils.downloadPDFFromLink(fileUrl);
  } else {
  }
};

/** For testing multiple file upload */
export const isNestedArray = (documents) => {
  if (!documents || !documents.length) return false;
  if (Array.isArray(documents) && documents.length) {
    const firstItem = Array.isArray(documents[0]);
    if (firstItem) {
      return true;
    }
  }
  return false;
};

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
    fileObj["fileName"] = file?.name;
    fileObj["documentType"] = file?.type;
    fileObj["fileStoreId"] = fileStoreId?.fileStoreId;
    acc.push(fileObj);
    return acc;
  }, []);
};

export const getFileSize = (size) => {
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const documentUploadMessage = (t, fileStoreId, editMode) => {
  if (!fileStoreId) return t(`CS_ACTION_NO_FILEUPLOADED`);
  return editMode
    ? fileStoreId?.fileStoreId?.length
      ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}`
      : t(`CS_ACTION_NO_FILEUPLOADED`)
    : fileStoreId
    ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}`
    : t(`CS_ACTION_NO_FILEUPLOADED`);
};

export const checkValidFileType = (fileType) => {
  if (!fileType) return false;
  const allowedFileType = /(.*?)(jpg|jpeg|png|image|pdf|msword|openxmlformats)$/i;
  if (allowedFileType.test(fileType)) {
    return true;
  }
  return false;
};

/**
 *
 * So, this was really painful. While using DatePicker we set date as yyyymmdd and downside is it picks time as beginning of the day or 5:30 am and
 * the api expects not just date but also time to be greater than actuall time right hence this.
 *
 * what's really funny is I was testing this few days back at around 2:00 am and api was working fine(you can now understand why) no date errors, but then QA came back with invalid date issue and then it was all a spin roll from there. ALAS!
 */
export const handleTodaysDate = (dateString) => {
  let dateObject = new Date(dateString);
  if (isToday(dateObject)) {
    const todaysDate = new Date();
    dateObject = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), 23, 59);
  }
  return dateObject.getTime();
};

//@saurabh @jagan we should actually be doing this in the TextImput Component where we setDate
export const convertDateToMaximumPossibleValue = (dateObject) => {
  return new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), 23, 59);
};
