export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };
  export const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
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
  
  export const DownloadReceipt = async (consumerCode, tenantId, businessService, pdfKey = "consolidatedreceipt") => {
    tenantId = tenantId ? tenantId : Digit.ULBService.getCurrentTenantId();
    await Digit.Utils.downloadReceipt(consumerCode, businessService, "consolidatedreceipt", tenantId);
  };
  
  /*   method to get filename  from fielstore url*/
  export const pdfDocumentName = (documentLink = "", index = 0) => {
    let documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || `Document - ${index + 1}`;
    return documentName;
  };
  
  export const getTransaltedLocality = (data) => {
    let localityVariable = data?.tenantId?.replaceAll(".","_") || stringReplaceAll(data?.tenantId,".","_");
    return (localityVariable.toUpperCase()+"_REVENUE_"+data?.locality?.code);
  }

  export const getQueryStringParams = (query) => {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params, param) => {
        let [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {})
      : {};
  };

export  const getAddress = (address, t) => {
    return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
      address?.landmark ? `${address?.landmark}, ` : ""
    }${ address.locality.code ?  t(address?.locality.code) : ""}, ${ address.city.code ?  t(address?.city.code) : ""},${address?.pincode ? `${address.pincode}` : " "}`
} 

