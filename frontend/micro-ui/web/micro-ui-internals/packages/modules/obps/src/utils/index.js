export const getPattern = type => {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
  }
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

export const uuidv4 = () => {
  return require("uuid/v4")();
};

export const pdfDownloadLink = (documents = {}, fileStoreId = "", format = "") => {

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

export const convertToNocObject = (data,datafromflow) => {

  let formData = {Noc: data};
  let doc = datafromflow?.nocDocuments?.nocDocuments.filter((n) => n.documentType.includes(data.nocType.split("_")[0])).map((noc) => {
    return ( {    "fileName": noc?.fileName || "",
                  "name": noc?.name || "",
                  "fileStoreId": noc?.fileStoreId,
                  "fileUrl": "",
                  "isClickable": true,
                  "link": "",
                  "title": noc?.documentType,
                  "documentType": noc?.documentType,
                  "additionalDetails": {
                  }})
  }) || [];
  formData.Noc.documents = doc;
  return formData;
}

export const getDocumentforBPA = (docs) => {
let document = [];
  docs && docs.map((ob) =>{
    document.push({
      "documentType": ob.documentType,
      "fileStoreId": ob.fileStoreId,
      "fileStore": ob.fileStoreId,
      "fileName": "",
      "fileUrl": "",
      "additionalDetails": {
      }
    })
  });
  return document;
}

export const getunitforBPA = (units) => {
  let unit = [];
  units && units.map((ob,index) => {
    unit.push({
      "blockIndex": index,
      "usageCategory": ob.usageCategory,
      "floorNo": ob.floorNo,
      "unitType": ob.unitType,
      "id": ob.id,
    })
  })
  return unit;
}

export const convertToBPAObject = (data, isOCBPA = false) => {

  if(isOCBPA) {
    data.landInfo = data.landInfo
  } else {
    data.landInfo.owners.map((owner,index) => {
      data.landInfo.owners[index].gender=owner?.gender?.code;
    });
  
    data.landInfo.address.city=data?.landInfo?.address?.city?.code;
  
    data.landInfo.unit=getunitforBPA(data?.landInfo?.unit);
  }

  let formData={
    "BPA":{
        "id": data?.id,
        "applicationNo": data?.applicationNo,
        "approvalNo": data?.approvalNo,
        "accountId": data?.accountId,
        "edcrNumber": data?.edcrNumber,
        "riskType": data?.riskType,
        "businessService":data?.businessService,
        "landId": data?.landId,
        "tenantId": data?.tenantId,
        "approvalDate": data?.approvalDate,
        "applicationDate": data?.applicationDate,
        "status": "INITIATED",
        "documents": getDocumentforBPA(data?.documents?.documents),
        "landInfo": data?.landInfo,
        "workflow": {
          "action": "SEND_TO_CITIZEN",
          "assignes": null,
          "comments": null,
          "varificationDocuments": null
      },
      "auditDetails": data?.auditDetails,
    "additionalDetails": null,
    "applicationType": "BUILDING_PLAN_SCRUTINY",
    "serviceType": "NEW_CONSTRUCTION",
    "occupancyType": "A"
    }
  }

  return formData;
}

export const getapplicationdocstakeholder = (initial) => {
let convertedDoc = [];
initial.documents?.documents.map((ob) => {
  convertedDoc.push({
    "fileStoreId":ob.fileStoreId,
    "fileStore":ob.fileStoreId,
    "fileName":"",
    "fileUrl":"",
    "documentType":ob.documentType,
    "tenantId": initial?.result?.Licenses[0]?.tenantId,
  })
});
return convertedDoc;
}

export const convertToStakeholderObject = (data) => {
  let formData = {
    "Licenses":[
      {...data?.result?.Licenses[0], action:"APPLY", tradeLicenseDetail:{...data?.result?.Licenses[0]?.tradeLicenseDetail,applicationDocuments:getapplicationdocstakeholder(data)}}
    ]
  }
  return formData;
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