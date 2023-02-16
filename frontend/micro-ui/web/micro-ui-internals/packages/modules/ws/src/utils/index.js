export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str && str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

export const mdmsData = async (tenantId, t) => {
  const result = await Digit.MDMSService.getMultipleTypes(tenantId, "tenant", ["tenants", "citymodule"]);

  const filteredResult = result?.tenant.tenants.filter((e) => e.code === tenantId);

  const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  const ulbGrade = filteredResult?.[0]?.city?.ulbGrade.replaceAll(" ", "_");

  const obj = {
    header: t(`TENANT_TENANTS_${headerLocale}`) + ` ` + t(`ULBGRADE_${ulbGrade}`),
    subHeader: filteredResult?.[0].address,
    description: `${filteredResult?.[0]?.contactNumber} | ${filteredResult?.[0]?.domainUrl} | ${filteredResult?.[0]?.emailId}`,
  };
  return obj;
};

export const convertEpochToDateDMY = (dateEpoch, isModify = false) => {
  if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    return "NA";
  }
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  // return `${day}-${month}-${year}`;
  return isModify ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
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

/*   method to get filename  from fielstore url*/
export const DownloadReceipt = async (consumerCode, tenantId, businessService, pdfKey = "consolidatedreceipt") => {
  tenantId = tenantId ? tenantId : Digit.ULBService.getCurrentTenantId();
  await Digit.Utils.downloadReceipt(consumerCode, businessService, "consolidatedreceipt", tenantId);
};
export const pdfDocumentName = (documentLink = "", index = 0) => {
  let documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || `Document - ${index + 1}`;
  return documentName;
};

export const getTransaltedLocality = (data) => {
  let localityVariable = data?.tenantId?.replaceAll(".", "_") || stringReplaceAll(data?.tenantId, ".", "_");
  return localityVariable.toUpperCase() + "_REVENUE_" + data?.locality?.code;
};

export const getQueryStringParams = (query) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params, param) => {
        let [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {})
    : {};
};

export const getAddress = (address, t) => {
  return `${address?.doorNo ? `${address?.doorNo}, ` : ""}${address?.street ? `${address?.street}, ` : ""}${
    address?.landmark ? `${address?.landmark}, ` : ""
  }${address?.locality?.code ? t(`TENANTS_MOHALLA_${address?.locality?.code}`) : ""}${
    address?.city?.code || address?.city ? `, ${t(address?.city.code || address?.city)}` : ""
  }${address?.pincode ? `, ${address.pincode}` : " "}`;
};

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

export const convertDateToEpochNew = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[3] - 1, parts[2]));

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

export const convertEpochToDates = (dateEpoch) => {
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${month}/${day}/${year}`;
  } else {
    return null;
  }
};

export const getPattern = (type) => {
  switch (type) {
    case "WSOnlyNumbers":
      return /^[0-9]*$/i;
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
    case "MobileNoWithPrivacy":
      return /^[6789][*]{7}[0-9]{2}|[6789][0-9]{9}$/i;
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
      return /^[-@.\/#&+\w\s]*$/;
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
};

export const createPayloadOfWS = async (data) => {
  data?.cpt?.details?.owners?.forEach((owner) => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress;
  });

  let payload = {
    water: data?.ConnectionDetails?.[0]?.water,
    sewerage: data?.ConnectionDetails?.[0]?.sewerage,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: !data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails
      ? [
          {
            correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
            fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
            gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
            mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
            name: data?.ConnectionHolderDetails?.[0]?.name || "",
            ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
            relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
            sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails,
          },
        ]
      : null,
    service:
      data?.ConnectionDetails?.[0]?.water && !data?.ConnectionDetails?.[0]?.sewerage
        ? "Water"
        : !data?.ConnectionDetails?.[0]?.water && data?.ConnectionDetails?.[0]?.sewerage
        ? "Sewerage"
        : "Water And Sewerage",
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
      action: "INITIATE",
    },
    channel: "CFC_COUNTER",
  };
  sessionStorage.setItem("WS_DOCUMENTS_INOF", JSON.stringify(data?.DocumentsRequired?.documents));
  sessionStorage.setItem("WS_PROPERTY_INOF", JSON.stringify(data?.cpt?.details));
  /* use customiseCreateFormData hook to make some chnages to the water object */
  payload = Digit?.Customizations?.WS?.customiseCreatePayloadOfWS ? Digit?.Customizations?.WS?.customiseCreatePayloadOfWS(data, payload) : payload;
  return payload;
};

export const updatePayloadOfWS = async (data, type) => {
  let payload = {
    ...data,
    processInstance: {
      ...data?.processInstance,
      action: "SUBMIT_APPLICATION",
    },
    documents: JSON.parse(sessionStorage.getItem("WS_DOCUMENTS_INOF")),
    property: JSON.parse(sessionStorage.getItem("WS_PROPERTY_INOF")),
    connectionType: type === "WATER" ? data?.connectionType : "Non Metered",
  };
  /* use customiseCreateFormData hook to make some chnages to the water object */
  payload = Digit?.Customizations?.WS?.customiseUpdatePayloadOfWS
    ? Digit?.Customizations?.WS?.customiseUpdatePayloadOfWS(data, payload, type)
    : payload;

  return payload;
};

export const convertToWSUpdate = (data) => {
  let formdata = {
    WaterConnection: {
      ...data?.WaterConnectionResult?.WaterConnection?.[0],
      documents: [...data?.documents?.documents],
      processInstance: {
        action: "SUBMIT_APPLICATION",
      },
    },
  };
  /* use customiseCreateFormData hook to make some chnages to the water object */
  formdata = Digit?.Customizations?.WS?.customiseWSUpdate ? Digit?.Customizations?.WS?.customiseWSUpdate(data, formdata) : formdata;

  return formdata;
};

export const convertToEditWSUpdate = (data) => {
  let waterResult = data?.WaterConnectionResult?.WaterConnection?.[0];
  let formdata = {
    WaterConnection: {
      id: data?.isEditApplication ? data?.id : waterResult?.id,
      tenantId: data?.isEditApplication ? data?.tenantId : waterResult?.tenantId,
      propertyId: data?.isEditApplication ? data?.propertyId : waterResult?.propertyId,
      applicationNo: data?.isEditApplication ? data?.applicationNo : waterResult?.applicationNo,
      applicationStatus: data?.isEditApplication ? data?.applicationStatus : waterResult?.applicationStatus,
      status: data?.isEditApplication ? data?.status : waterResult?.status,
      connectionNo: (data?.isEditApplication ? data?.connectionNo : waterResult?.connectionNo) || null,
      oldConnectionNo: null,
      documents: [...data?.documents?.documents],
      plumberInfo: data?.isEditApplication ? data?.plumberInfo : waterResult?.plumberInfo || [],
      roadType: null,
      roadCuttingArea: null,
      roadCuttingInfo: [],
      connectionExecutionDate: (data?.isEditApplication ? data?.connectionExecutionDate : waterResult?.connectionExecutionDate) || null,
      connectionCategory: null,
      connectionType: (data?.isEditApplication ? data?.connectionType : waterResult?.connectionType) || null,
      additionalDetails: data?.isEditApplication ? { ...data?.additionalDetails } : { ...waterResult?.additionalDetails },
      auditDetails: data?.isEditApplication ? data?.auditDetails : waterResult?.auditDetails,
      processInstance: data?.isEditApplication
        ? {
            ...data?.processInstance,
            action: "RESUBMIT_APPLICATION",
          }
        : {
            ...waterResult?.processInstance,
            action: "SUBMIT_APPLICATION",
          },
      applicationType: data?.isEditApplication ? data?.applicationType : "MODIFY_WATER_CONNECTION",
      dateEffectiveFrom: convertDateToEpoch(Date.now() + 86400000),
      connectionHolders: data?.isEditApplication ? (!data?.ConnectionHolderDetails?.isOwnerSame
      ? [
          {
            correspondenceAddress: data?.ConnectionHolderDetails?.address || "",
            fatherOrHusbandName: data?.ConnectionHolderDetails?.guardian || "",
            gender: data?.ConnectionHolderDetails?.gender?.code || "",
            mobileNumber: data?.ConnectionHolderDetails?.mobileNumber || "",
            name: data?.ConnectionHolderDetails?.name || "",
            ownerType: data?.ConnectionHolderDetails?.specialCategoryType?.code || "",
            relationship: data?.ConnectionHolderDetails?.relationship?.code || "",
            sameAsPropertyAddress: data?.ConnectionHolderDetails?.sameAsOwnerDetails,
          },
        ]
      : null) : waterResult?.connectionHolders,
      oldApplication: false,
      channel: "CITIZEN",
      waterSource: (data?.isEditApplication ? data?.waterSource : waterResult?.waterSource) || null,
      meterId: (data?.isEditApplication ? data?.meterId : waterResult?.meterId) || null,
      meterInstallationDate: (data?.isEditApplication ? data?.meterInstallationDate : waterResult?.meterInstallationDate) || null,
      proposedPipeSize: data?.waterConectionDetails?.proposedPipeSize?.code,
      proposedTaps: data?.waterConectionDetails?.proposedTaps,
      pipeSize: (data?.isEditApplication ? data?.pipeSize : waterResult?.pipeSize) || null,
      noOfTaps: (data?.isEditApplication ? data?.noOfTaps : waterResult?.noOfTaps) || null,
      waterSourceSubSource: null,
      waterSubSource: (data?.isEditApplication ? data?.waterSubSource : waterResult?.waterSubSource) || null,
      property: data?.isEditApplication ? { ...data?.property } : { ...waterResult?.property },
      water: data?.applicationType?.includes("WATER") ? true : false,
      sewerage: data?.applicationType?.includes("WATER") ? true : false,
      service: data?.isEditApplication ? data?.serviceName?.code : waterResult?.serviceName?.code,
      reviewDocData: [
        // {
        //     "title": "WS_OWNER.IDENTITYPROOF.AADHAAR",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486955487fBbBCkGcdp.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=935dfb4f76083dc3ab7cf0f50aaa0c1c52731e535cf662473118a4118dcc8d87",
        //     "linkText": "View",
        //     "name": "fBbBCkGcdp.png"
        // },
        // {
        //     "title": "WS_OWNER.ADDRESSPROOF.ELECTRICITYBILL",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486960218pBQoKhcLup.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=ed55fd96ec6d54421a6ed4b1734f9a951c54061cbd8bdd4bf3ed676935fc6b2f",
        //     "linkText": "View",
        //     "name": "pBQoKhcLup.png"
        // },
        // {
        //     "title": "WS_ELECTRICITY_BILL",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486965232AirZwKrIUG.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=db098ee216984d9f413eed0bdb42d8b7a3b61794bc9261d92db2476300064323",
        //     "linkText": "View",
        //     "name": "AirZwKrIUG.png"
        // },
        // {
        //     "title": "WS_PLUMBER_REPORT_DRAWING",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486969233XZrstDVnbf.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=6a21266b1aa4352113b115e41dd075b47e20e7989e8b8fee7114957ee26193eb",
        //     "linkText": "View",
        //     "name": "XZrstDVnbf.png"
        // },
        // {
        //     "title": "WS_BUILDING_PLAN_OR_COMPLETION_CERTIFICATE",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486973093GAbDOLwmFf.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=6c6eff841623980714ddb4db3bd69219ae0398675f563c5bc73ed799763d2785",
        //     "linkText": "View",
        //     "name": "GAbDOLwmFf.png"
        // },
        // {
        //     "title": "WS_PROPERTY_TAX_RECIEPT",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486975966JOdiYvhKXM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=00c949dbb7c66fe67ecee67de401202011ed2fc8c66ec5677230b1a1aa389f9e",
        //     "linkText": "View",
        //     "name": "JOdiYvhKXM.png"
        // }
        ...data?.documents?.documents,
      ],
      proposedWaterClosets: data?.sewerageConnectionDetails?.proposedWaterClosets,
      proposedToilets: data?.sewerageConnectionDetails?.proposedToilets,
      comment: "",
      wfDocuments: [],
      assignee: [],
      action: data?.isEditApplication ? "RESUBMIT_APPLICATION" : "SUBMIT_APPLICATION",
      assignes: [],
    },
  };
  /* use customiseCreateFormData hook to make some chnages to the water object */
  formdata = Digit?.Customizations?.WS?.customiseEditWSUpdate ? Digit?.Customizations?.WS?.customiseEditWSUpdate(data, formdata) : formdata;

  return formdata;
};

export const convertToEditSWUpdate = (data) => {
  let SewerageResult = data?.SewerageConnectionResult?.SewerageConnections?.[0];
  let formdata = {
    SewerageConnection: {
      id: data?.isEditApplication ? data?.id : SewerageResult?.id,
      tenantId: data?.isEditApplication ? data?.tenantId : SewerageResult?.tenantId,
      propertyId: data?.isEditApplication ? data?.propertyId : SewerageResult?.propertyId,
      applicationNo: data?.isEditApplication ? data?.applicationNo : SewerageResult?.applicationNo,
      applicationStatus: data?.isEditApplication ? data?.applicationStatus : SewerageResult?.applicationStatus,
      status: data?.isEditApplication ? data?.status : SewerageResult?.status,
      connectionNo: (data?.isEditApplication ? data?.connectionNo : SewerageResult?.connectionNo) || null,
      oldConnectionNo: null,
      documents: [...data?.documents?.documents],
      plumberInfo: data?.isEditApplication ? data?.plumberInfo : SewerageResult?.plumberInfo || [],
      roadType: null,
      roadCuttingArea: null,
      roadCuttingInfo: [],
      connectionExecutionDate: (data?.isEditApplication ? data?.connectionExecutionDate : SewerageResult?.connectionExecutionDate) || null,
      connectionCategory: null,
      connectionType: (data?.isEditApplication ? data?.connectionType : SewerageResult?.connectionType) || null,
      additionalDetails: data?.isEditApplication ? { ...data?.additionalDetails } : { ...SewerageResult?.additionalDetails },
      auditDetails: data?.isEditApplication ? data?.auditDetails : SewerageResult?.auditDetails,
      processInstance: data?.isEditApplication
        ? {
            ...data?.processInstance,
            action: "RESUBMIT_APPLICATION",
          }
        : {
            ...SewerageResult?.processInstance,
            action: "SUBMIT_APPLICATION",
          },
      applicationType: data?.isEditApplication ? data?.applicationType : "MODIFY_WATER_CONNECTION",
      dateEffectiveFrom: convertDateToEpoch(Date.now() + 86400000),
      connectionHolders: data?.isEditApplication ? (!data?.ConnectionHolderDetails?.isOwnerSame
        ? [
            {
              correspondenceAddress: data?.ConnectionHolderDetails?.address || "",
              fatherOrHusbandName: data?.ConnectionHolderDetails?.guardian || "",
              gender: data?.ConnectionHolderDetails?.gender?.code || "",
              mobileNumber: data?.ConnectionHolderDetails?.mobileNumber || "",
              name: data?.ConnectionHolderDetails?.name || "",
              ownerType: data?.ConnectionHolderDetails?.specialCategoryType?.code || "",
              relationship: data?.ConnectionHolderDetails?.relationship?.code || "",
              sameAsPropertyAddress: data?.ConnectionHolderDetails?.sameAsOwnerDetails,
            },
          ]
        : null) : SewerageResult?.connectionHolders,
      oldApplication: false,
      channel: "CITIZEN",
      waterSource: (data?.isEditApplication ? data?.waterSource : SewerageResult?.waterSource) || null,
      meterId: (data?.isEditApplication ? data?.meterId : SewerageResult?.meterId) || null,
      meterInstallationDate: (data?.isEditApplication ? data?.meterInstallationDate : SewerageResult?.meterInstallationDate) || null,
      proposedPipeSize: data?.waterConectionDetails?.proposedPipeSize?.code,
      proposedTaps: data?.waterConectionDetails?.proposedTaps,
      pipeSize: (data?.isEditApplication ? data?.pipeSize : SewerageResult?.pipeSize) || null,
      noOfTaps: (data?.isEditApplication ? data?.noOfTaps : SewerageResult?.noOfTaps) || null,
      waterSourceSubSource: null,
      waterSubSource: (data?.isEditApplication ? data?.waterSubSource : SewerageResult?.waterSubSource) || null,
      property: data?.isEditApplication ? { ...data?.property } : { ...SewerageResult?.property },
      water: data?.applicationType?.includes("WATER") ? true : false,
      sewerage: data?.applicationType?.includes("WATER") ? true : false,
      service: data?.isEditApplication ? data?.serviceName?.code : SewerageResult?.serviceName?.code,
      reviewDocData: [
        // {
        //     "title": "WS_OWNER.IDENTITYPROOF.AADHAAR",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486955487fBbBCkGcdp.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=935dfb4f76083dc3ab7cf0f50aaa0c1c52731e535cf662473118a4118dcc8d87",
        //     "linkText": "View",
        //     "name": "fBbBCkGcdp.png"
        // },
        // {
        //     "title": "WS_OWNER.ADDRESSPROOF.ELECTRICITYBILL",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486960218pBQoKhcLup.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=ed55fd96ec6d54421a6ed4b1734f9a951c54061cbd8bdd4bf3ed676935fc6b2f",
        //     "linkText": "View",
        //     "name": "pBQoKhcLup.png"
        // },
        // {
        //     "title": "WS_ELECTRICITY_BILL",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486965232AirZwKrIUG.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=db098ee216984d9f413eed0bdb42d8b7a3b61794bc9261d92db2476300064323",
        //     "linkText": "View",
        //     "name": "AirZwKrIUG.png"
        // },
        // {
        //     "title": "WS_PLUMBER_REPORT_DRAWING",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486969233XZrstDVnbf.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=6a21266b1aa4352113b115e41dd075b47e20e7989e8b8fee7114957ee26193eb",
        //     "linkText": "View",
        //     "name": "XZrstDVnbf.png"
        // },
        // {
        //     "title": "WS_BUILDING_PLAN_OR_COMPLETION_CERTIFICATE",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486973093GAbDOLwmFf.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=6c6eff841623980714ddb4db3bd69219ae0398675f563c5bc73ed799763d2785",
        //     "linkText": "View",
        //     "name": "GAbDOLwmFf.png"
        // },
        // {
        //     "title": "WS_PROPERTY_TAX_RECIEPT",
        //     "link": "https://egov-rainmaker.s3-ap-south-1.amazonaws.com/pb/WS/April/9/1649486975966JOdiYvhKXM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20220409%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220409T070847Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=00c949dbb7c66fe67ecee67de401202011ed2fc8c66ec5677230b1a1aa389f9e",
        //     "linkText": "View",
        //     "name": "JOdiYvhKXM.png"
        // }
        ...data?.documents?.documents,
      ],
      proposedWaterClosets: data?.sewerageConnectionDetails?.proposedWaterClosets,
      proposedToilets: data?.sewerageConnectionDetails?.proposedToilets,
      comment: "",
      wfDocuments: [],
      assignee: [],
      action: data?.isEditApplication ? "RESUBMIT_APPLICATION" : "SUBMIT_APPLICATION",
      assignes: [],
    },
  };
  /* use customiseCreateFormData hook to make some chnages to the water object */
  formdata = Digit?.Customizations?.WS?.customiseEditSWUpdate ? Digit?.Customizations?.WS?.customiseEditSWUpdate(data, formdata) : formdata;
  return formdata;
};

export const convertToSWUpdate = (data) => {
  let formdata = {
    SewerageConnection: {
      ...data?.SewerageConnectionResult?.SewerageConnections?.[0],
      connectionType: "Non Metered",
      documents: [...data?.documents?.documents],
      processInstance: {
        action: "SUBMIT_APPLICATION",
      },
    },
  };
  /* use customiseCreateFormData hook to make some chnages to the water object */
  formdata = Digit?.Customizations?.WS?.customiseSWUpdate ? Digit?.Customizations?.WS?.customiseSWUpdate(data, formdata) : formdata;
  return formdata;
};
export const createPayloadOfWSDisconnection = async (data, storeData, service) => {
  const user = Digit.UserService.getType();
  let plumberInfo = [];
  if (storeData?.applicationData?.plumberInfo?.length > 0) {
    // let plumberInfoDetails = storeData?.applicationData?.plumberInfo?.[0];
    // if (plumberInfoDetails?.id) delete plumberInfoDetails?.id;
    // plumberInfo = [plumberInfoDetails];

    let plumberInfoData = {};
    if (storeData?.applicationData?.plumberInfo?.[0]?.licenseNo) plumberInfoData.licenseNo = storeData?.applicationData?.plumberInfo?.[0]?.licenseNo;
    if (storeData?.applicationData?.plumberInfo?.[0]?.mobileNumber)
      plumberInfoData.mobileNumber = storeData?.applicationData?.plumberInfo?.[0]?.mobileNumber;
    if (storeData?.applicationData?.plumberInfo?.[0]?.id)
      plumberInfoData.id = storeData?.applicationData?.plumberInfo?.[0]?.id;
    if (storeData?.applicationData?.plumberInfo?.[0]?.name) plumberInfoData.name = storeData?.applicationData?.plumberInfo?.[0]?.name;
    plumberInfo = [plumberInfoData];
  }

  let wsPayload = {
    WaterConnection: {
      id: storeData?.applicationData?.id,
      applicationNo: storeData?.applicationData?.applicationNo,
      applicationStatus: storeData?.applicationData?.applicationStatus,
      status: storeData?.applicationData?.status,
      connectionNo: storeData?.applicationData?.connectionNo,
      connectionHolders: storeData?.applicationData?.connectionHolders,
      applicationType: "NEW_WATER_CONNECTION",
      dateEffectiveFrom: convertDateToEpoch(data?.date),
      isdisconnection: true,
      isDisconnectionTemporary: data?.type?.value?.code === "Temporary" || data?.type?.value?.code === "TEMPORARY" ? true : false,
      disconnectionReason: data?.reason.value,
      documents: data?.documents,
      water: true,
      sewerage: false,
      proposedTaps: storeData?.applicationData?.proposedTaps && Number(storeData?.applicationData?.proposedTaps),
      proposedPipeSize: storeData?.applicationData?.proposedPipeSize?.size && Number(storeData?.applicationData?.proposedPipeSize?.size),
      service: "Water",
      property: storeData?.applicationData?.property,
      propertyId: storeData?.applicationData?.propertyId,
      oldConnectionNo: null,
      plumberInfo: plumberInfo?.length > 0 ? plumberInfo : null,
      roadCuttingInfo: storeData?.applicationData?.roadCuttingInfo,
      roadCuttingArea: null,
      roadType: null,
      connectionExecutionDate: storeData?.applicationData?.connectionExecutionDate,
      noOfTaps: storeData?.applicationData?.noOfTaps,
      additionalDetails: storeData?.applicationData?.additionalDetails,
      tenantId: storeData?.applicationData?.tenantId,
      connectionType: storeData.applicationData.connectionType || null,
      waterSource: storeData.applicationData.waterSource || null,
      processInstance: {
        ...storeData?.applicationData?.processInstance,
        action: "INITIATE",
      },
      channel: user === "citizen" ? "CITIZEN" : "CFC_COUNTER",
    },
    disconnectRequest: true,
  };

  if (storeData.applicationData.connectionType) {
    if (storeData.applicationData.meterInstallationDate)
      wsPayload.WaterConnection.meterInstallationDate = storeData.applicationData.meterInstallationDate;
    if (storeData.applicationData.meterId) wsPayload.WaterConnection.meterId = storeData.applicationData.meterId;
  }

  let swPayload = {
    SewerageConnection: {
      id: storeData?.applicationData?.id,
      applicationNo: storeData?.applicationData?.applicationNo,
      applicationStatus: storeData?.applicationData?.applicationStatus,
      status: storeData?.applicationData?.status,
      connectionNo: storeData?.applicationData?.connectionNo,
      connectionHolders: storeData?.applicationData?.connectionHolders,
      applicationType: "NEW_WATER_CONNECTION",
      dateEffectiveFrom: convertDateToEpoch(data?.date),
      isdisconnection: true,
      isDisconnectionTemporary: data?.type?.value?.code === "Temporary" ? true : false,
      disconnectionReason: data?.reason.value,
      documents: data?.documents,
      water: false,
      sewerage: true,
      proposedWaterClosets: storeData?.applicationData?.proposedWaterClosets && Number(storeData?.applicationData?.proposedWaterClosets),
      proposedToilets: storeData?.applicationData?.proposedToilets && Number(storeData?.applicationData?.proposedToilets),
      service: "Sewerage",
      property: storeData?.applicationData?.property,
      propertyId: storeData?.applicationData?.propertyId,
      oldConnectionNo: null,
      plumberInfo: plumberInfo?.length > 0 ? plumberInfo : null,
      roadCuttingInfo: storeData?.applicationData?.roadCuttingInfo,
      roadCuttingArea: null,
      roadType: null,
      connectionExecutionDate: storeData?.applicationData?.connectionExecutionDate,
      noOfWaterClosets: storeData?.applicationData?.noOfWaterClosets,
      noOfToilets: storeData?.applicationData?.noOfToilets,
      additionalDetails: storeData?.applicationData?.additionalDetails,
      tenantId: storeData?.applicationData?.tenantId,
      // connectionType: storeData.applicationData.connectionType || null,
      connectionType: "Non Metered",
      waterSource: storeData.applicationData.waterSource || null,
      processInstance: {
        ...storeData?.applicationData?.processInstance,
        action: "INITIATE",
      },
      channel: user === "citizen" ? "CITIZEN" : "CFC_COUNTER",
    },
    disconnectRequest: true,
  };

  // if (storeData.applicationData.connectionType) {
  //   if (storeData.applicationData.meterInstallationDate) swPayload.SewerageConnection.meterInstallationDate = storeData.applicationData.meterInstallationDate;
  //   if (storeData.applicationData.meterId) swPayload.SewerageConnection.meterId = storeData.applicationData.meterId;
  // }

  let returnObject = service === "WATER" ? wsPayload : swPayload;
  /* use customiseCreateFormData hook to make some chnages to the water object */
  returnObject = Digit?.Customizations?.WS?.customiseCreatePayloadOfWSDisconnection
    ? Digit?.Customizations?.WS?.customiseCreatePayloadOfWSDisconnection(data, returnObject, service)
    : returnObject;

  return returnObject;
};
export const createPayloadOfWSReSubmitDisconnection = async (data, storeData, service) => {
  const user = Digit.UserService.getType();
  let wsPayload = {
    WaterConnection: {
      ...storeData?.applicationData,
      dateEffectiveFrom: convertDateToEpoch(data?.date),
      isDisconnectionTemporary: data?.type?.value?.code === "Temporary" ? true : false,
      disconnectionReason: data?.reason.value,
      documents: data?.documents,
      water: true,
      sewerage: false,
      service: "Water",
      processInstance: {
        ...storeData?.applicationData?.processInstance,
        action: "RESUBMIT_APPLICATION",
      },
      channel: "CITIZEN",
    },
     disconnectRequest: true
  };

  if (storeData.applicationData.connectionType) {
    if (storeData.applicationData.meterInstallationDate)
      wsPayload.WaterConnection.meterInstallationDate = storeData.applicationData.meterInstallationDate;
    if (storeData.applicationData.meterId) wsPayload.WaterConnection.meterId = storeData.applicationData.meterId;
  }

  let swPayload = {
    SewerageConnection: {
      ...storeData?.applicationData,
      dateEffectiveFrom: convertDateToEpoch(data?.date),
      isdisconnection: true,
      isDisconnectionTemporary: data?.type?.value?.code === "Temporary" ? true : false,
      disconnectionReason: data?.reason.value,
      documents: data?.documents,
      water: false,
      sewerage: true,
      service: "Sewerage",
      processInstance: {
        ...storeData?.applicationData?.processInstance,
        action: "RESUBMIT_APPLICATION",
      },
      channel: "CITIZEN",
    },
     disconnectRequest: true
  };

  // if (storeData.applicationData.connectionType) {
  //   if (storeData.applicationData.meterInstallationDate) swPayload.SewerageConnection.meterInstallationDate = storeData.applicationData.meterInstallationDate;
  //   if (storeData.applicationData.meterId) swPayload.SewerageConnection.meterId = storeData.applicationData.meterId;
  // }

  let returnObject = service === "WATER" ? wsPayload : swPayload;
  /* use customiseCreateFormData hook to make some chnages to the water object */
  returnObject = Digit?.Customizations?.WS?.customiseCreatePayloadOfWSReSubmitDisconnection
    ? Digit?.Customizations?.WS?.customiseCreatePayloadOfWSReSubmitDisconnection(data, returnObject, service)
    : returnObject;

  return returnObject;
};

export const updatePayloadOfWSDisconnection = async (data, type) => {
  let payload = {
    ...data,
    plumberInfo : data?.plumberInfo?.[0] ? [{...data?.plumberInfo?.[0], id:null}] : data?.plumberInfo,
    applicationType: type === "WATER" ? "DISCONNECT_WATER_CONNECTION" : "DISCONNECT_SEWERAGE_CONNECTION",
    processInstance: {
      ...data?.processInstance,
      businessService: type === "WATER" ? "DisconnectWSConnection" : "DisconnectSWConnection",
      action: "SUBMIT_APPLICATION",
    },
  };
  /* use customiseCreateFormData hook to make some chnages to the water object */
  payload = Digit?.Customizations?.WS?.customiseUpdatePayloadOfWSDisconnection
    ? Digit?.Customizations?.WS?.customiseUpdatePayloadOfWSDisconnection(data, payload, type)
    : payload;
  return payload;
};

export const getOwnersforPDF = (property, t) => {
  let interarray = [];
  let finalarray = [];
  property?.owners?.map((ob, index) => {
    interarray = [
      { title: t(`WS_OWNER - ${index}`), value: "" },
      { title: t("WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"), value: ob?.mobileNumber || "N/A" },
      { title: t("WS_MYCONNECTIONS_OWNER_NAME"), value: ob?.name || "N/A" },
      {
        title: t("WS_OWNER_DETAILS_EMAIL_LABEL"),
        value: ob?.emailId || "N/A",
      },
      {
        title: t("WS_OWN_DETAIL_GENDER_LABEL"),
        value: ob?.gender || "N/A",
      },
      { title: t("WS_OWN_DETAIL_DOB_LABEL"), value: "N/A" },
      { title: t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"), value: ob?.fatherOrHusbandName || "N/A" },
      { title: t("WS_OWN_DETAIL_RELATION_LABEL"), value: ob?.relationship || "N/A" },
      { title: t("WS_CONN_HOLDER_OWN_DETAIL_CROSADD"), value: ob?.correspondenceAddress || "N/A" },
      { title: t("WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"), value: "none" },
    ];
    finalarray = finalarray.concat(interarray);
  });
  return finalarray;
};

export const getDocumentsForPDF = (app, t) => {
  let finaldocarray = [];
  app?.documents?.map((doc) => {
    finaldocarray.push({
      title: t(doc?.documentType),
      value: doc?.fileName,
    });
  });
};

export const getPDFData = (application, data, tenantInfo, t) => {
  return {
    t: t,
    tenantId: tenantInfo?.code,
    name: `${t(tenantInfo?.i18nKey)} ${t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`)}`,
    email: tenantInfo?.emailId,
    phoneNumber: tenantInfo?.contactNumber,
    heading: t(`WS_${application?.applicationType}`),
    breakPageLimit: 4,
    details: [
      {
        title: t("CS_TITLE_APPLICATION_DETAILS"),
        values: [{ title: t("WS_COMMON_APPLICATION_NO_LABEL"), value: application?.applicationNo }],
      },
      {
        title: t("WS_COMMON_PROPERTY_DETAILS"),
        values: [
          { title: t("WS_PROPERTY_ID_LABEL"), value: application?.propertyId || "N/A" },
          { title: t("WS_PROPERTY_TYPE_LABEL"), value: data?.cpt?.details?.propertyType || "N/A" },
          { title: t("WS_PROPERTY_USAGE_TYPE_LABEL"), value: data?.cpt?.details?.usageCategory || "N/A" },
          { title: t("WS_PROPERTY_SUB_USAGE_TYPE_LABEL"), value: "N/A" },
          { title: t("WS_PROP_DETAIL_PLOT_SIZE_LABEL"), value: data?.cpt?.details?.superBuiltUpArea || "N/A" },
          { title: t("WS_PROPERTY_NO_OF_FLOOR_LABEL"), value: data?.cpt?.details?.noOfFloors || "N/A" },
          { title: t("WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC"), value: data?.cpt?.details?.additionalDetails?.isRainwaterHarvesting },
        ],
      },
      {
        title: t("WS_COMMON_PROP_LOC_DETAIL_HEADER"),
        values: [
          { title: t("WS_PROP_DETAIL_CITY"), value: data?.cpt?.details?.address?.city },
          { title: t("WS_PROP_DETAIL_DHNO"), value: data?.cpt?.details?.address?.doorNo },
          { title: t("WS_PROP_DETAIL_BUILD_NAME_LABEL"), value: data?.cpt?.details?.address?.buildingName },
          { title: t("WS_PROP_DETAIL_STREET_NAME"), value: data?.cpt?.details?.address?.street },
          { title: t("WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"), value: data?.cpt?.details?.address?.locality?.name },
        ],
      },
      {
        title: t("WS_TASK_PROP_OWN_HEADER"),
        values: getOwnersforPDF(data?.cpt?.details, t),
      },
      {
        ...(application?.applicationType.includes("WATER")
          ? {
              title: t("WS_COMMON_CONNECTION_DETAILS"),
              values: [
                {
                  title: t("WS_APPLY_FOR"),
                  value: application?.applicationType.includes("WATER") ? t("WS_WATER") : t("WS_SEWERAGE"),
                },
                {
                  title: t("WS_CONN_DETAIL_NO_OF_TAPS"),
                  value: application?.proposedTaps,
                },
                {
                  title: t("WS_CONN_DETAIL_PIPE_SIZE"),
                  value: application?.proposedPipeSize,
                },
              ],
            }
          : {
              title: t("WS_COMMON_CONNECTION_DETAILS"),
              values: [
                {
                  title: t("WS_APPLY_FOR"),
                  value: application?.applicationType.includes("WATER") ? t("WS_WATER") : t("WS_SEWERAGE"),
                },
                {
                  title: t("WS_CONN_DETAIL_NO_OF_TOILETS"),
                  value: application?.proposedToilets,
                },
                {
                  title: t("WS_CONN_DETAIL_WATER_CLOSETS"),
                  value: application?.proposedWaterClosets,
                },
              ],
            }),
      },
      {
        title: t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"),
        values: [
          {
            title: t("WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"),
            value: application?.connectionHolders == null ? t("CS_YES") : t("CS_NO"),
          },
        ],
      },
      {
        title: t("WS_COMMON_DOCS"),
        values: getDocumentsForPDF(data?.documents, t),
      },
      {
        title: t("WS_COMMON_ADDN_DETAILS"),
        values: [
          {
            title: t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL"),
            value: application?.connectionType || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_NO_OF_TAPS"),
            value: application?.noOfTaps || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_WATER_SOURCE"),
            value: application?.waterSource || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_WATER_SUB_SOURCE"),
            value: application?.waterSource || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_PIPE_SIZE"),
            value: application?.pipeSize || "NA",
          },
        ],
      },
      {
        title: t("WS_COMMON_PLUMBER_DETAILS"),
        values: [
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"),
            value: application?.plumberInfo?.providedBy || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"),
            value: application?.plumberInfo?.licenseNo || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"),
            value: application?.plumberInfo?.name || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"),
            value: application?.plumberInfo?.mobileNumber || "NA",
          },
        ],
      },
      {
        title: t("WS_ROAD_CUTTING_CHARGE"),
        values: [
          {
            title: t("WS_ADDN_DETAIL_ROAD_TYPE"),
            value: application?.roadType || "NA",
          },
          {
            title: t("WS_ADDN_DETAILS_AREA_LABEL"),
            value: application?.roadCuttingArea || "NA",
          },
        ],
      },
      {
        title: t("WS_ACTIVATION_DETAILS"),
        values: [
          {
            title: t("WS_SERV_DETAIL_CONN_EXECUTION_DATE"),
            value: application?.connectionExecutionDate || "NA",
          },
          {
            title: t("WS_SERV_DETAIL_METER_ID"),
            value: application?.meterId || "NA",
          },
          {
            title: t("WS_ADDN_DETAIL_METER_INSTALL_DATE"),
            value: application?.meterInstallationDate || "NA",
          },
        ],
      },
    ],
  };
};
export const checkForEmployee = (roles) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  let rolesArray = [];

  const rolearray = userInfo?.info?.roles.filter((item) => {
    for (let i = 0; i < roles.length; i++) {
      if (item.code == roles[i] && item.tenantId === tenantId) rolesArray.push(true);
    }
  });

  return rolesArray?.length;
};

export const getBusinessService = (data) => {
  if (data?.service == "WATER") return "WS.ONE_TIME_FEE";
  else return "SW.ONE_TIME_FEE";
};

export const convertApplicationData = (data, serviceType, modify = false, editByConfig = false, t) => {
  data?.propertyDetails?.owners?.forEach((owner) => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress;
  });

  let ConnectionDetails = [
    {
      water: serviceType === "WATER" ? true : false,
      sewerage: serviceType === "WATER" ? false : true,
      applicationNo: data?.applicationData?.applicationNo,
      serviceName: serviceType,
      proposedTaps: Number(data?.applicationData?.proposedTaps) || "",
      proposedPipeSize: data?.applicationData?.proposedPipeSize
        ? {
            i18nKey: data?.applicationData?.proposedPipeSize,
            code: data?.applicationData?.proposedPipeSize,
            size: data?.applicationData?.proposedPipeSize,
          }
        : "",
      proposedToilets: data?.applicationData?.proposedToilets || "",
      proposedWaterClosets: data?.applicationData?.proposedWaterClosets || "",
    },
  ];

  const ConnectionHolderDetails =
    data?.applicationData?.connectionHolders?.length > 0
      ? [
          {
            sameAsOwnerDetails: false,
            uuid: data?.applicationData?.connectionHolders?.[0]?.uuid,
            name: data?.applicationData?.connectionHolders?.[0]?.name || "",
            mobileNumber: data?.applicationData?.connectionHolders?.[0]?.mobileNumber || "",
            guardian: data?.applicationData?.connectionHolders?.[0]?.fatherOrHusbandName || "",
            address: data?.applicationData?.connectionHolders?.[0]?.correspondenceAddress || "",
            gender: data?.applicationData?.connectionHolders?.[0]?.gender
              ? {
                  code: data?.applicationData?.connectionHolders?.[0]?.gender,
                  i18nKey: data?.applicationData?.connectionHolders?.[0]?.gender,
                }
              : "",
            relationship: data?.applicationData?.connectionHolders?.[0]?.relationship
              ? {
                  code: data?.applicationData?.connectionHolders?.[0]?.relationship,
                  i18nKey: data?.applicationData?.connectionHolders?.[0]?.relationship,
                }
              : "",
            ownerType: data?.applicationData?.connectionHolders?.[0]?.ownerType
              ? {
                  code: data?.applicationData?.connectionHolders?.[0]?.ownerType,
                  i18nKey: data?.applicationData?.connectionHolders?.[0]?.ownerType,
                }
              : "",

            documentId: "",
            documentType: "",
            file: "",
          },
        ]
      : [
          {
            sameAsOwnerDetails: true,
            name: "",
            gender: "",
            mobileNumber: "",
            guardian: "",
            relationship: "",
            address: "",
            ownerType: "",
            documentId: "",
            documentType: "",
            file: "",
          },
        ];

  let documents = [];
  if (data?.applicationData?.documents) {
    data.applicationData.documents.forEach((data) => {
      documents.push({
        active: true,
        code: data?.documentType,
        i18nKey: data?.documentType?.replaceAll(".", "_"),
        documentType: data?.documentType,
        id: data.id,
        documentUid: data?.documentUid,
        fileStoreId: data?.fileStoreId,
      });
    });
  }
  let DocumentsRequired =
    {
      documents: documents,
    } || [];

  let cpt = {};
  cpt["details"] = data?.propertyDetails || {};

  let payload = {};

  const sourceSubDataValue = data?.applicationData?.waterSource ? stringReplaceAll(data?.applicationData?.waterSource?.toUpperCase(), " ", "_") : "";
  const sourceSubDataFilter = sourceSubDataValue ? stringReplaceAll(sourceSubDataValue?.toUpperCase(), ".", "_") : "";

  const connectionDetails =
    serviceType === "WATER"
      ? {
          connectionType: data?.applicationData?.connectionType
            ? {
                code: data?.applicationData?.connectionType,
                i18nKey: t(`WS_CONNECTIONTYPE_${stringReplaceAll(data?.applicationData?.connectionType?.toUpperCase(), " ", "_")}`),
              }
            : "",
          waterSource: data?.applicationData?.waterSource
            ? {
                code: data?.applicationData?.waterSource,
                i18nKey: t(
                  `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.applicationData?.waterSource?.split(".")[0]?.toUpperCase(), " ", "_")}`
                ),
              }
            : "",
          sourceSubData: data?.applicationData?.waterSource
            ? {
                code: data?.applicationData?.waterSource,
                i18nKey: t(`WS_SERVICES_MASTERS_WATERSOURCE_${sourceSubDataFilter}`),
              }
            : "",
          pipeSize: data?.applicationData?.pipeSize
            ? {
                code: data?.applicationData?.pipeSize,
                i18nKey: data?.applicationData?.pipeSize,
                size: data?.applicationData?.pipeSize,
              }
            : "",
          noOfTaps: data?.applicationData?.noOfTaps || "",
        }
      : {
          noOfWaterClosets: data?.applicationData?.noOfWaterClosets || "",
          noOfToilets: data?.applicationData?.noOfToilets || "",
        };

  if (modify) {
    const activationDetails = [
      {
        meterId: data?.applicationData?.meterId ? Number(data?.applicationData?.meterId) : "",
        meterInstallationDate: data?.applicationData?.meterInstallationDate
          ? convertEpochToDateDMY(data?.applicationData?.meterInstallationDate, true)
          : null,
        meterInitialReading: data?.applicationData?.additionalDetails?.initialMeterReading
          ? Number(data?.applicationData?.additionalDetails?.initialMeterReading)
          : "",
        connectionExecutionDate: data?.applicationData?.connectionExecutionDate
          ? convertEpochToDateDMY(data?.applicationData?.connectionExecutionDate, true)
          : null,
      },
    ];

    if (window.location.href.includes("modify-application-edit"))
      activationDetails[0].dateEffectiveFrom = data?.applicationData?.dateEffectiveFrom
        ? convertEpochToDateDMY(data?.applicationData?.dateEffectiveFrom, true)
        : null;

    const sourceSubDataValue = data?.applicationData?.waterSource
      ? stringReplaceAll(data?.applicationData?.waterSource?.toUpperCase(), " ", "_")
      : "";
    const sourceSubDataFilter = sourceSubDataValue ? stringReplaceAll(sourceSubDataValue?.toUpperCase(), ".", "_") : "";

    const connectionDetails =
      serviceType === "WATER"
        ? {
            connectionType: data?.applicationData?.connectionType
              ? {
                  code: data?.applicationData?.connectionType,
                  i18nKey: t(`WS_CONNECTIONTYPE_${stringReplaceAll(data?.applicationData?.connectionType?.toUpperCase(), " ", "_")}`),
                }
              : "",
            waterSource: data?.applicationData?.waterSource
              ? {
                  code: data?.applicationData?.waterSource,
                  i18nKey: t(
                    `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.applicationData?.waterSource?.split(".")[0]?.toUpperCase(), " ", "_")}`
                  ),
                }
              : "",
            sourceSubData: data?.applicationData?.waterSource
              ? {
                  code: data?.applicationData?.waterSource,
                  i18nKey: t(`WS_SERVICES_MASTERS_WATERSOURCE_${sourceSubDataFilter}`),
                }
              : "",
            pipeSize: data?.applicationData?.pipeSize
              ? {
                  code: data?.applicationData?.pipeSize,
                  i18nKey: data?.applicationData?.pipeSize,
                }
              : "",
            noOfTaps: data?.applicationData?.noOfTaps || "",
          }
        : {
            noOfWaterClosets: data?.applicationData?.noOfWaterClosets || "",
            noOfToilets: data?.applicationData?.noOfToilets || "",
          };
    if (window.location.href.includes("modify-application-edit")) {
      DocumentsRequired = { documents: documents };
    } else {
      DocumentsRequired = { documents: [] };
    }

    payload = {
      ConnectionDetails: ConnectionDetails,
      connectionDetails: [connectionDetails],
      ConnectionHolderDetails: ConnectionHolderDetails,
      activationDetails: activationDetails,
      DocumentsRequired: DocumentsRequired,
      cpt: cpt,
      InfoLabel: "InfoLabel",
    };
  } else {
    payload = {
      ConnectionDetails: ConnectionDetails,
      ConnectionHolderDetails: ConnectionHolderDetails,
      DocumentsRequired: DocumentsRequired,
      cpt: cpt,
      InfoLabel: "InfoLabel",
    };

    let plumberDetails = [
      {
        detailsProvidedBy: data?.applicationData?.additionalDetails?.detailsProvidedBy
          ? {
              i18nKey: data?.applicationData?.additionalDetails?.detailsProvidedBy,
              code: data?.applicationData?.additionalDetails?.detailsProvidedBy,
              size: data?.applicationData?.additionalDetails?.detailsProvidedBy,
            }
          : "",
        plumberName: data?.applicationData?.plumberInfo?.[0].name,
        plumberMobileNo: data?.applicationData?.plumberInfo?.[0].mobileNumber,
        plumberLicenseNo: data?.applicationData?.plumberInfo?.[0].licenseNo,
      },
    ];

    let roadCuttingDetails = data?.applicationData?.roadCuttingInfo
      ? data?.applicationData?.roadCuttingInfo?.map((rc, index) => {
          return rc.id
            ? {
                key: index + "_" + Date.now(),
                id: rc?.id,
                roadType: {
                  i18nKey: `WS_ROADTYPE_` + rc?.roadType,
                  code: rc?.roadType,
                },
                area: rc?.roadCuttingArea,
                status: rc?.status,
              }
            : {
                key: index + "_" + Date.now(),
                roadType: {
                  i18nKey: `WS_ROADTYPE_` + rc?.roadType,
                  code: rc?.roadType,
                },
                area: rc?.roadCuttingArea,
                status: rc?.status,
              };
        })
      : [
          {
            key: 99999 + "_" + Date.now(),
            id: null,
            roadType: {
              i18nKey: "",
              code: "",
            },
            area: "",
            status: "",
          },
        ];

    if (editByConfig) {
      payload.connectionDetails = [connectionDetails];
      payload.plumberDetails = plumberDetails;
      payload.roadCuttingDetails = roadCuttingDetails;
    }
  }

  sessionStorage.setItem("Digit.PT_CREATE_EMP_WS_NEW_FORM", JSON.stringify(payload));
  sessionStorage.setItem("WS_EDIT_APPLICATION_DETAILS", JSON.stringify(data));

  return payload;
};

export const convertEditApplicationDetails = async (data, appData, actionData) => {
  data?.cpt?.details?.owners?.forEach((owner) => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress;
  });

  let payload = {
    ...appData.applicationData,
    propertyId: data?.cpt?.details?.propertyId,
    proposedTaps: data?.ConnectionDetails?.[0]?.proposedTaps && Number(data?.ConnectionDetails?.[0]?.proposedTaps),
    proposedPipeSize: data?.ConnectionDetails?.[0]?.proposedPipeSize?.size && Number(data?.ConnectionDetails?.[0]?.proposedPipeSize?.size),
    proposedWaterClosets: data?.ConnectionDetails?.[0]?.proposedWaterClosets && Number(data?.ConnectionDetails?.[0]?.proposedWaterClosets),
    proposedToilets: data?.ConnectionDetails?.[0]?.proposedToilets && Number(data?.ConnectionDetails?.[0]?.proposedToilets),
    connectionHolders: !data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails
      ? [
          {
            ...appData?.applicationData?.connectionHolders?.[0],
            correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
            fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
            gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
            mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
            name: data?.ConnectionHolderDetails?.[0]?.name || "",
            ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
            relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
            sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails,
          },
        ]
      : null,
    property: data?.cpt?.details,
    processInstance: {
      action: actionData ? actionData : "RESUBMIT_APPLICATION",
    },
    action: actionData ? actionData : "RESUBMIT_APPLICATION",
    documents: data?.DocumentsRequired?.documents,
  };

  return payload;
};

export const convertDisonnectApplicationData = (data, serviceType, editByConfig = false, t) => {
  const temp = "TEMPORARY",
    perm = "PERMANENT";

  let disConnectionDetails = [
    {
      consumerNumber: data?.applicationData?.applicationNo,
      disConnectionType: data?.applicationData?.isDisconnectionTemporary ? temp : perm,
      disConnectionReason: data?.applicationData?.disconnectionReason || "",
      disConnectionProposeDate: data?.applicationData?.dateEffectiveFrom
        ? convertEpochToDateDMY(data?.applicationData?.dateEffectiveFrom, true)
        : null,
    },
  ];

  let documents = [];
  if (data?.applicationData?.documents) {
    data.applicationData.documents.forEach((data) => {
      documents.push({
        active: true,
        code: data?.documentType,
        i18nKey: data?.documentType?.replaceAll(".", "_"),
        documentType: data?.documentType,
        id: data.id,
        documentUid: data?.documentUid,
        fileStoreId: data?.fileStoreId,
      });
    });
  }
  let DocumentsRequired = { documents: documents };

  let payload = {};
  payload.disConnectionDetails = disConnectionDetails;
  payload.DocumentsRequired = DocumentsRequired;

  if (editByConfig) {
    let plumberDetails = [
      {
        detailsProvidedBy: data?.applicationData?.additionalDetails?.detailsProvidedBy
          ? {
              i18nKey: data?.applicationData?.additionalDetails?.detailsProvidedBy,
              code: data?.applicationData?.additionalDetails?.detailsProvidedBy,
              size: data?.applicationData?.additionalDetails?.detailsProvidedBy,
            }
          : "",
        plumberName: data?.applicationData?.plumberInfo?.[0].name,
        plumberMobileNo: data?.applicationData?.plumberInfo?.[0].mobileNumber,
        plumberLicenseNo: data?.applicationData?.plumberInfo?.[0].licenseNo,
        applicationNo: data?.applicationData?.applicationNo,
      },
    ];
    payload.plumberDetails = plumberDetails;
  }

  sessionStorage.setItem("Digit.PT_CREATE_EMP_WS_NEW_FORM", JSON.stringify(payload));
  sessionStorage.setItem("WS_EDIT_APPLICATION_DETAILS", JSON.stringify(data));

  return payload;
};

export const convertDisonnectEditApplicationDetails = async (data, appData, actionData) => {
  const docs = sessionStorage.getItem("DISCONNECTION_EDIT_DOCS");
  const docsData = docs ? JSON.parse(docs) : "";
  const documentsData = [];

  docsData?.map(data => {
    const doc = appData?.applicationData?.documents?.filter(appDoc => `${appDoc?.documentType?.split(".")?.[0]}.${appDoc?.documentType?.split(".")?.[1]}` ==  `${data?.documentType?.split(".")?.[0]}.${data?.documentType?.split(".")?.[1]}`);
    let document = doc?.length > 0 ? {
      auditDetails: null,
      documentType: data?.documentType,
      documentUid: doc?.[0]?.documentUid,
      fileStoreId: data?.fileStoreId,
      id: doc?.[0]?.id,
      status: "ACTIVE"
    } : data;
    documentsData.push(document);
  })

  const plumberInfo = [
    {
      licenseNo: data?.plumberDetails?.[0]?.plumberLicenseNo,
      mobileNumber: data?.plumberDetails?.[0]?.plumberMobileNo,
      name: data?.plumberDetails?.[0]?.plumberName,
      id: appData?.applicationData?.plumberInfo?.[0]?.id
    },
  ];

  let payload = {
    ...appData.applicationData,
    documents: documentsData?.length > 0 ? documentsData : data?.DocumentsRequired?.documents,
    isDisconnectionTemporary: data?.disConnectionDetails?.[0]?.disConnectionType == "TEMPORARY" ? true : false,
    disconnectionReason: data?.disConnectionDetails?.[0]?.disConnectionReason || "",
    dateEffectiveFrom: await getConvertedDate(data?.disConnectionDetails?.[0]?.disConnectionProposeDate),
    processInstance: {
      action: actionData ? actionData : "RESUBMIT_APPLICATION",
    },
    action: actionData ? actionData : "RESUBMIT_APPLICATION",
  };
  if (data?.plumberDetails?.[0]?.detailsProvidedBy?.code) {
    payload.additionalDetails.detailsProvidedBy = data?.plumberDetails?.[0]?.detailsProvidedBy?.code;
    if (data?.plumberDetails?.[0]?.detailsProvidedBy?.code == "ULB") {
      payload.plumberInfo = plumberInfo;
    }
  }

  return payload;
};

export const getConvertedDate = async (dateOfTime) => {
  const splitStr = dateOfTime?.split("-");
  const dateOfTimeReversedArr = splitStr?.reverse();
  const dateOfTimeReversed = dateOfTimeReversedArr?.join("-");
  let dateOfReplace = stringReplaceAll(dateOfTimeReversed, "/", "-");
  let formattedDate = "";
  if (dateOfReplace.split("-")[2] > 1900) {
    formattedDate = `${dateOfReplace.split("-")[2]}-${dateOfReplace.split("-")[1]}-${dateOfReplace.split("-")[0]}`;
  } else {
    formattedDate = `${dateOfReplace.split("-")[0]}-${dateOfReplace.split("-")[2]}-${dateOfReplace.split("-")[1]}`;
  }
  const convertedDate = await convertDateToEpoch(formattedDate);
  return convertedDate;
};

export const convertModifyApplicationDetails = async (data, appData, actionData = "INITIATE") => {
  data?.cpt?.details?.owners?.forEach((owner) => {
    if (owner?.permanentAddress) owner.correspondenceAddress = owner?.permanentAddress;
  });

  let formData = { ...appData.applicationData };
  if (data?.cpt?.details?.propertyId) formData.propertyId = data?.cpt?.details?.propertyId;
  if (data?.connectionDetails?.[0]?.connectionType?.code) formData.connectionType = data?.connectionDetails?.[0]?.connectionType?.code;
  if (data?.connectionDetails?.[0]?.waterSource?.code) formData.waterSource = data?.connectionDetails?.[0]?.waterSource?.code;
  if (data?.connectionDetails?.[0]?.pipeSize?.size) formData.pipeSize = data?.connectionDetails?.[0]?.pipeSize?.size;
  if (data?.connectionDetails?.[0]?.noOfTaps) formData.noOfTaps = data?.connectionDetails?.[0]?.noOfTaps;

  if (data?.connectionDetails?.[0]?.noOfWaterClosets) formData.noOfWaterClosets = data?.connectionDetails?.[0]?.noOfWaterClosets;
  if (data?.connectionDetails?.[0]?.noOfToilets) formData.noOfToilets = data?.connectionDetails?.[0]?.noOfToilets;

  if (data?.activationDetails?.[0]?.meterId) formData.meterId = data?.activationDetails?.[0]?.meterId;
  if (data?.activationDetails?.[0]?.meterInstallationDate)
    formData.meterInstallationDate = await getConvertedDate(data?.activationDetails?.[0]?.meterInstallationDate);
  if (data?.activationDetails?.[0]?.meterInitialReading)
    formData.additionalDetails.initialMeterReading = data?.activationDetails?.[0]?.meterInitialReading;
  if (data?.activationDetails?.[0]?.connectionExecutionDate)
    formData.connectionExecutionDate = await getConvertedDate(data?.activationDetails?.[0]?.connectionExecutionDate);

  if (data?.activationDetails?.[0]?.dateEffectiveFrom)
    formData.dateEffectiveFrom = await getConvertedDate(data?.activationDetails?.[0]?.dateEffectiveFrom);

  if (data?.DocumentsRequired?.documents?.length) formData.documents = data?.DocumentsRequired?.documents;
  else formData.documents = null;

  if (!data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails) {
    formData.connectionHolders = [
      {
        ...appData?.applicationData?.connectionHolders?.[0],
        correspondenceAddress: data?.ConnectionHolderDetails?.[0]?.address || "",
        fatherOrHusbandName: data?.ConnectionHolderDetails?.[0]?.guardian || "",
        gender: data?.ConnectionHolderDetails?.[0]?.gender?.code || "",
        mobileNumber: data?.ConnectionHolderDetails?.[0]?.mobileNumber || "",
        name: data?.ConnectionHolderDetails?.[0]?.name || "",
        ownerType: data?.ConnectionHolderDetails?.[0]?.ownerType?.code || "",
        relationship: data?.ConnectionHolderDetails?.[0]?.relationship?.code || "",
        sameAsPropertyAddress: data?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails,
      },
    ];
  }
  formData.processInstance = { action: actionData };
  formData.action = actionData;
  formData.channel = "CFC_COUNTER";

  sessionStorage.setItem("WS_DOCUMENTS_INOF", JSON.stringify(data?.DocumentsRequired?.documents || []));
  sessionStorage.setItem("WS_PROPERTY_INOF", JSON.stringify(data?.cpt?.details));

  return formData;
};

export const downloadPdf = (blob, fileName) => {
  if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      window.mSewaApp.downloadBase64File(base64data, fileName);
    };
  } else {
    const link = document.createElement("a");
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  }
};
export const downloadAndOpenPdf = async (connectionNo, filters) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const response = await Digit.WSService.generateBillPdf({ tenantId, filters });
  const responseStatus = parseInt(response.status, 10);
  if (responseStatus === 201 || responseStatus === 200) {
    downloadPdf(new Blob([response.data], { type: "application/pdf" }), `BILL-${connectionNo}.pdf`);
  }
};

export const ifUserRoleExists = (role) => {
  const userInfo = Digit.UserService.getUser();
  const roleCodes = userInfo?.info?.roles ? userInfo?.info?.roles.map((role) => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};
