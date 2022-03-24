export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
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

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getPattern = type => {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
    case "Amount":
      return /^[0-9]{0,8}$/i;
    case "NonZeroAmount":
      return /^[1-9][0-9]{0,7}$/i;
    case "DecimalNumber":
      return /^\d{0,8}(\.\d{1,2})?$/i;
    //return /(([0-9]+)((\.\d{1,2})?))$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[-@.\/#&+\w\s]*$/
    //return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,100}$/i;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,5}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "Landline":
      return /^[0-9]{11}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^.{1,15}$/i;
    case "DocumentNo":
      return /^[0-9]{1,15}$/i;
    case "eventName":
      return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "cancelChallan":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
    case "AadharNo":
      //return /^\d{4}\s\d{4}\s\d{4}$/;
      return /^([0-9]){12}$/;
    case "ChequeNo":
      return /^(?!0{6})[0-9]{6}$/;
    case "Comments":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "OldLicenceNo":
      return /^[a-zA-Z0-9-/]{0,64}$/;
  }
};

export const getFiles = async (filesArray, tenant) => {
  const response = await Digit.UploadServices.Filefetch(filesArray, tenant);
  response?.data?.fileStoreIds?.[0]?.url ? window.open(response?.data?.fileStoreIds?.[0]?.url) : null;
}

export const createPayloadOfWS = async (data) => {

  data?.cpt?.details?.owners?.forEach(owner => {
    if(owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress
  })

  let payload = {
    water: data?.ConnectionDetails?.[0]?.water,
    sewerage: data?.ConnectionDetails?.[0]?.sewerage,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails ? [{
      correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
      fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
      gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
      mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
      name: data?.ConnectionHolderDetails?.[0]?.name || "",
      ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
      relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
      sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails
    }] : null,
    service: (data?.ConnectionDetails?.[0]?.water && !data?.ConnectionDetails?.[0]?.sewerage) ? "Water" : (!data?.ConnectionDetails?.[0]?.water && data?.ConnectionDetails?.[0]?.sewerage) ? "Sewerage" : "Water And Sewerage",
    property: data?.cpt?.details,
    propertyId: data?.cpt?.details?.propertyId,
    roadCuttingArea: null,
    noOfTaps: null,
    noOfWaterClosets: null,
    noOfToilets: null,
    additionalDetails: {
      initialMeterReading: null,
      detailsProvidedBy: "",
      locality: data?.cpt?.details?.address?.locality?.code,
    },
    tenantId: data?.cpt?.details?.address?.tenantId,
    processInstance: {
      action: "INITIATE"
    },
    channel: "CFC_COUNTER"
  }
  sessionStorage.setItem("WS_DOCUMENTS_INOF", JSON.stringify(data?.DocumentsRequired?.documents));
  sessionStorage.setItem("WS_PROPERTY_INOF", JSON.stringify(data?.cpt?.details));
  return payload;
}

export const updatePayloadOfWS = async (data) => {
  let payload = {
    ...data,
    processInstance: {
      ...data?.processInstance,
      action: "SUBMIT_APPLICATION"
    },
    documents: JSON.parse(sessionStorage.getItem("WS_DOCUMENTS_INOF")),
    property: JSON.parse(sessionStorage.getItem("WS_PROPERTY_INOF")),
    connectionType: "Non Metered"
  }
  return payload;
}
