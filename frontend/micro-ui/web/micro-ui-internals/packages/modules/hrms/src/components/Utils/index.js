
export const pdfDownloadLink = (documents = {}, fileStoreId = "", format = "") => {
  /* Need to enhance this util to return required format*/

  let downloadLink = documents[fileStoreId] || "";
  let differentFormats = downloadLink?.split(",") || [];
  let fileURL = "";
  differentFormats.length > 0 &&
    differentFormats.map((link) => {
      if (!link.includes("large") && !link.includes("medium") && !link.includes("small")) {
        fileURL = link;
      }
    });
  return fileURL;
};

/*   method to get filename  from fielstore url*/
export const pdfDocumentName = (documentLink = "", index = 0) => {
  let documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || `Document - ${index + 1}`;
  return documentName;
};

/* methid to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

export const convertEpochFormateToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};

const objectsEqual = (o1, o2) => Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every((p) => o1[p] === o2[p]);

export const arraysEqual = (a1, a2) => a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));


/* function returns only the city which user has access to  */
/* exceptional incase of state level user , where return all cities*/
export const getCityThatUserhasAccess = (cities = []) => {
  const userInfo = Digit.UserService.getUser();
  let roleObject = {};
  userInfo?.info?.roles.map((roleData) => { roleObject[roleData?.code] = roleObject[roleData?.code] ? [...roleObject[roleData?.code], roleData?.tenantId] : [roleData?.tenantId] });
  const tenant = Digit.ULBService.getCurrentTenantId();
  if (roleObject[Digit.Utils?.hrmsRoles?.[0]].includes(Digit.ULBService.getStateId())) {
    return cities;
  }
  return cities.filter(city => roleObject[Digit.Utils?.hrmsRoles?.[0]]?.includes(city?.code));
}