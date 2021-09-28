export const getPattern = type => {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
    case "MobileNo":
      return /^[6-9]{1}[0-9]{9}$/i;
  }
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

export const sortDropdownNames = (options, optionkey, locilizationkey) => {
  return options.sort((a, b) => locilizationkey(a[optionkey]).localeCompare(locilizationkey(b[optionkey])));
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
                  "id":noc?.id,
                  "additionalDetails": {
                  }})
                  
  }) || [];
  formData.Noc.documents = doc;
  return formData;
}

export const getDocumentforBPA = (docs) => {
let document = [];
  docs && docs.map((ob) =>{
    if(ob.id){
      document.push({
        "documentType": ob.documentType,
        "fileStoreId": ob.fileStoreId,
        "fileStore": ob.fileStoreId,
        "fileName": "",
        "fileUrl": "",
        "additionalDetails": {
        },
        "id":ob.id,
      })
    }
    else{
    document.push({
      "documentType": ob.documentType,
      "fileStoreId": ob.fileStoreId,
      "fileStore": ob.fileStoreId,
      "fileName": "",
      "fileUrl": "",
      "additionalDetails": {
      },
    })
  }
  });
  return document;
}

function getusageCategoryAPI(arr){
  let usageCat = ""
  arr.map((ob,i) => {
      usageCat = usageCat + (i !==0?",":"") + ob.code;
  });
  return usageCat;
}

export const getBPAUnit = (data) =>{
  let units=[];
  let ob = data?.subOccupancy;
  if(ob) {
    let result = Object.entries(ob);
  data?.landInfo?.unit.map((oldUnit,ind) => {
    result.map((newunit,index)=>{
      if(oldUnit.id && oldUnit.floorNo === newunit[0].split("_")[1])
      {
        units.push({...oldUnit,  usageCategory:getusageCategoryAPI(newunit[1])})
      }
      else{
        units.push({
            blockIndex:index,
            floorNo:newunit[0].split("_")[1],
            unitType:"Block",
            usageCategory:getusageCategoryAPI(newunit[1]),
        });
      }
    })
  })   
  }

  return units;

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

export const getBPAOwners = (data) => {
  let bpaownerarray = [];
  data.landInfo.owners.map((oldowner) => {
    data?.owners?.owners.map((newowner) => {
      oldowner.gender = oldowner.gender.code?oldowner.gender.code:oldowner.gender;
      newowner.gender = newowner.gender.code ?newowner.gender.code:newowner.gender;
      if(oldowner.id === newowner.id)
      {
        if((oldowner.name !== newowner.name) || (oldowner.gender !== newowner.gender.code) || (oldowner.mobileNumber !== newowner.mobilenumber))
        {
        if (oldowner.name !== newowner.name)
        {
          oldowner.name = newowner.name;
        }
        if(oldowner.gender !== newowner.gender)
        {
          oldowner.gender = newowner.gender;
        }
        if(oldowner.mobileNumber !== newowner.mobilenumber)
        {
          oldowner.mobileNumber = newowner.mobileNumber;
        }
        let found = bpaownerarray.length > 0 ?bpaownerarray.some(el => el.id === oldowner.id):false;
          if(!found)bpaownerarray.push(oldowner);
      }
        else
        {
          let found = bpaownerarray.length > 0 ? bpaownerarray.some(el => el.id === oldowner.id):false;
          if(!found)bpaownerarray.push(oldowner);
        }
      }
    })
  })
  data.landInfo.owners.map((oldowner) => {
    let found = bpaownerarray.length > 0 ? bpaownerarray.some(el => el.id === oldowner.id):false;
    if(!found)bpaownerarray.push({...oldowner,active:false});   
  })
  data?.owners?.owners.map((ob) => {
    if(!ob.id)
    {
      bpaownerarray.push({
              mobileNumber: ob.mobileNumber,
              name: ob.name,
              fatherOrHusbandName: "",
              relationship: "",
              dob: null,
              gender: ob.gender.code,
            });
    }
  })
  return bpaownerarray;
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
        "tenantId": data?.tenantId || data?.address?.tenantId,
        "approvalDate": data?.approvalDate,
        "applicationDate": data?.applicationDate,
        "status": "INITIATED",
        "documents": getDocumentforBPA(data?.documents?.documents),
        "landInfo": {...data?.landInfo, owners:getBPAOwners(data), unit:getBPAUnit(data)},
        "workflow": {
          "action": "SEND_TO_CITIZEN",
          "assignes": null,
          "comments": null,
          "varificationDocuments": null
      },
      "auditDetails": data?.auditDetails,
    "additionalDetails": data?.additionalDetails,
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

export const getUniqueItemsFromArray = (data, identifier) => {
  const uniqueArray = [];
  const map = new Map();
  for (const item of data) {
    if (!map.has(item[identifier])) {
      map.set(item[identifier], true); // set any value to Map
      uniqueArray.push(item);
    }
  }
  return uniqueArray;
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

export const getBPAEditDetails = (data, APIScrutinyDetails, mdmsData, nocdata, t) => {

  const getBlockIds = (unit) => {
    let blocks = {};
    unit && unit.map((ob, index) => {
      blocks[`Block_${index + 1}`] = ob.id;
    });
    return blocks;
  }

  const getBlocksforFlow = (unit) => {
    let arr = [];
    let subBlocks = [];
    let subOcc = {};
    unit && unit.map((un, index) => {
      arr = un?.usageCategory.split(",");
      subBlocks = [];
      arr && arr.map((ob, ind) => {
        subBlocks.push({
          code: ob,
          i18nKey: `BPA_SUBOCCUPANCYTYPE_${ob.replaceAll(".", "_")}`,
          name: t(`BPA_SUBOCCUPANCYTYPE_${ob.replaceAll(".", "_")}`),
        })
      })
      subOcc[`Block_${index + 1}`] = subBlocks;
    });

    return subOcc;

  }

  data.BlockIds = getBlockIds(data?.landInfo?.unit);
  data.address = data?.landInfo?.address;
  data.data = {
    applicantName: APIScrutinyDetails?.planDetail?.planInformation?.applicantName,
    applicationDate: APIScrutinyDetails?.applicationDate,
    applicationType: APIScrutinyDetails?.appliactionType,
    holdingNumber: data?.additionalDetails?.holdingNo,
    occupancyType: APIScrutinyDetails?.planDetail?.planInformation?.occupancy,
    registrationDetails: data?.additionalDetails?.registrationDetails,
    riskType: Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, APIScrutinyDetails?.planDetail?.plot?.area, APIScrutinyDetails?.planDetail?.blocks),
    serviceType: data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType,
  }
  data.documents = {
    documents: data?.documents
  }

  data.nocDocuments = {
    NocDetails: nocdata,
    nocDocuments: nocdata.map(a => a?.documents?.[0] || {}),
  }

  data?.landInfo.owners.map((owner, ind) => {
    owner.gender = {
      active: true,
      code: owner.gender,
      i18nKey: `COMMON_GENDER_${owner.gender}`,
    }
  })

  data.owners = {
    owners: data?.landInfo?.owners,
    ownershipCategory: {
      active: true,
      code: data?.landInfo?.ownershipCategory,
      i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_${data?.landInfo?.ownershipCategory.replaceAll(".", "_")}`,
    }
  }

  data.riskType = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, APIScrutinyDetails?.planDetail?.plot?.area, APIScrutinyDetails?.planDetail?.blocks)
  data.subOccupancy = getBlocksforFlow(data?.landInfo?.unit);
  data.uiFlow = {
    flow: data?.businessService.split(".")[0],
    applicationType: data?.additionalDetails?.applicationType || APIScrutinyDetails?.appliactionType,
    serviceType: data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType
  }
  return data;
}

export const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};