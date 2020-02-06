// import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

// export const getSource = () => {
//     return localStorageGet("isNative") ? "MOBILEAPP" : "SYSTEM";
// }

export const createPropertyPayload = (properties, documentsUploadRedux) => {
  properties[0] = {
    ...properties[0],
    ...properties[0].propertyDetails[0],
    source: "MUNICIPAL_RECORDS",
    channel: "CFC_COUNTER",
    status: "ACTIVE"
  };
  if (properties[0].owners && properties[0].owners.length) {
    properties[0].owners.map(obj => {
      if (
        obj.documents &&
        Array.isArray(obj.documents) &&
        obj.documents.length
      ) {
        if (!obj.documents[0].documentType || !obj.documents[0].documentUid) {
          delete obj.documents;
        }
      }
      obj.ownerType = obj.ownerType || "NONE";
    });
  }

  properties[0].units.map(unit => {
    unit.constructionDetail = {
      builtUpArea: unit.unitArea
    };
    unit.tenantId = properties[0].tenantId;
    unit.usageCategory = unit.usageCategoryMajor + 
        (unit.usageCategoryMinor ? "."+unit.usageCategoryMinor : "") + 
        (unit.usageCategorySubMinor ? "."+unit.usageCategorySubMinor : "")+ 
        (unit.usageCategoryDetail ? "."+unit.usageCategoryDetail : "");

        // unit.usageCategory = unit.usageCategoryMajor+"."+unit.usageCategoryMinor+"."+unit.usageCategorySubMinor+"."+unit.usageCategoryDetail;

    unit.unitType = unit.usageCategoryDetail;
    delete unit.usageCategoryMinor;
    delete unit.usageCategoryMajor;
    delete unit.usageCategoryDetail;
    delete unit.usageCategorySubMinor;
    delete unit.unitArea;
  });

  if(documentsUploadRedux && Object.keys(documentsUploadRedux) && Object.keys(documentsUploadRedux).length){
    properties[0].documents = []
    Object.keys(documentsUploadRedux).map(key=>{
      properties[0].documents.push({
        "documentType": documentsUploadRedux[key].documentType,
        "fileStore": documentsUploadRedux[key].documents[0].fileStoreId,
      })
    })
  }

  if (properties[0].institution) {
    properties[0].institution.nameOfAuthorizedPerson =
      properties[0].owners[0].name;
    properties[0].institution.tenantId = properties[0].tenantId;
  }
  properties[0].creationReason = "NEWPROPERTY";
  properties[0].superBuiltUpArea = properties[0].buildUpArea;

  properties[0].propertyType =
    (properties[0].propertySubType === "SHAREDPROPERTY" || properties[0].propertySubType ===  "INDEPENDENTPROPERTY") ? properties[0].propertyType + "." + properties[0].propertySubType : properties[0].propertyType;
  // Changing usageCategoryMajor to usageCategory
  properties[0].usageCategory = properties[0].usageCategoryMajor;
  properties[0].ownershipCategory = properties[0].ownershipCategory + 
  (properties[0].subOwnershipCategory ? "."+properties[0].subOwnershipCategory : "");
  // Deleting object keys from request payload which are not required now
//   delete properties[0].usageCategoryMajor;
//   delete properties[0].usageCategoryMinor;
  delete properties[0].citizenInfo;
  delete properties[0].propertyDetails;
  delete properties[0].subOwnershipCategory;
  delete properties[0].propertySubType;
  delete properties[0].buildUpArea;
  // console.log("PT Info------", properties[0]);
  return properties[0];
};

export const createAssessmentPayload = (properties, propertyPayload) => {
  const Assessment = {
    financialYear: propertyPayload.financialYear,
    assessmentDate: properties.auditDetails.createdTime,
    tenantId: properties.tenantId,
    propertyID: properties.propertyId,
    // unitUsageList: [],
    source: "MUNICIPAL_RECORDS",
    channel: "CFC_COUNTER",
    status: "ACTIVE"
  };

//   properties.units.map( unit => {
//     const unitObj = {
//         unitId: unit.id,
//         usageCategory: unit.usageCategory,
//         occupancyType: unit.occupancyType,
//         tenantId: unit.tenantId,
//         occupancyDate: unit.occupancyDate ? unit.occupancyDate:0,
//         additionalDetails: unit.additionalDetails
//     }
//     Assessment.unitUsageList.push(unitObj);
//   })

  return Assessment;
};

export const getCreatePropertyResponse = (createPropertyResponse) => {
  createPropertyResponse.Properties[0].propertyDetails = createPropertyResponse.Properties;
  return createPropertyResponse;
}
