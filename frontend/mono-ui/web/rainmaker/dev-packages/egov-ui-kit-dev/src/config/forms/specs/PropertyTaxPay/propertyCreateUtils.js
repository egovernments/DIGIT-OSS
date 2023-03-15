import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { convertToOldPTObject } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import get from "lodash/get";
import uniqBy from "lodash/uniqBy";
import { getQueryValue } from "egov-ui-kit/utils/PTCommon";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";

export const createPropertyPayload = (properties, documentsUploadRedux) => {
  let oldUnits=properties&&properties[0]&&properties[0].units||[];
  properties[0] = {
    ...properties[0],
    ...properties[0].propertyDetails[0],
    source: "MUNICIPAL_RECORDS",
    channel: "CFC_COUNTER",
  };
  if (properties[0].owners && properties[0].owners.length) {
    properties[0].owners.map((obj) => {
      if (obj.documents && Array.isArray(obj.documents) && obj.documents.length) {
        if (!obj.documents[0].documentType || !obj.documents[0].documentUid) {
          delete obj.documents;
        } else {
          obj.documents = obj.documents.map(document => {
            document.fileStoreId = document.documentUid
            return { ...document }
          })
        }
      }
      obj.ownerType = obj.ownerType || "NONE";
    });
  }
  let floorArray = {};
  properties[0].units.map((unit) => {
    floorArray[unit.floorNo] = unit.floorNo;
    unit.constructionDetail = {
      builtUpArea: unit.unitArea,
    };
    unit.tenantId = properties[0].tenantId;
    unit.usageCategory =
      unit.usageCategoryMajor +
      (unit.usageCategoryMinor ? "." + unit.usageCategoryMinor : "") +
      (unit.usageCategorySubMinor ? "." + unit.usageCategorySubMinor : "") +
      (unit.usageCategoryDetail ? "." + unit.usageCategoryDetail : "");

    // unit.usageCategory = unit.usageCategoryMajor+"."+unit.usageCategoryMinor+"."+unit.usageCategorySubMinor+"."+unit.usageCategoryDetail;

    unit.unitType = unit.usageCategoryDetail;
    delete unit.usageCategoryMinor;
    delete unit.usageCategoryMajor;
    delete unit.usageCategoryDetail;
    delete unit.usageCategorySubMinor;
    delete unit.unitArea;
  });
  
  if(getQueryArg(window.location.href,  "mode") == 'WORKFLOWEDIT'){
    let oldUnit={};
    oldUnits&&oldUnits.map(unit=>{
      oldUnit[unit.id]=unit;
    })
    let newUnit={};
    properties[0].units&&properties[0].units.map(unit=>{
      newUnit[unit.id]=unit;
    })
    let newUnitKeys=Object.keys(newUnit);
    Object.keys(oldUnit).map(unitId=>{
       if(!newUnitKeys.includes(unitId)){
        properties[0].units.push({...oldUnit[unitId],active:false});
       }
    })
  }
  if (documentsUploadRedux && Object.keys(documentsUploadRedux) && Object.keys(documentsUploadRedux).length) {
    properties[0].documents = [];
    Object.keys(documentsUploadRedux).map((key) => {
      if(documentsUploadRedux[key].dropdown && documentsUploadRedux[key].dropdown.value && documentsUploadRedux[key].documents && documentsUploadRedux[key].documents[0].fileStoreId) {
        properties[0].documents.push({
          documentType: documentsUploadRedux[key].dropdown.value,
          fileStoreId: documentsUploadRedux[key].documents[0].fileStoreId,
          documentUid: documentsUploadRedux[key].documents[0].fileStoreId,
        });
      }
    });
  }

 if (properties[0].institution) {
    properties[0].institution.nameOfAuthorizedPerson = properties[0].owners[0].name;
    properties[0].institution.tenantId = properties[0].tenantId;
  }
  properties[0].superBuiltUpArea = properties[0].buildUpArea && Number(properties[0].buildUpArea);
  properties[0].superBuiltUpArea = properties[0].superBuiltUpArea && Number(properties[0].superBuiltUpArea.toFixed(2));

  properties[0].propertyType =
    properties[0].propertySubType === "SHAREDPROPERTY" || properties[0].propertySubType === "INDEPENDENTPROPERTY"
      ? properties[0].propertyType + "." + properties[0].propertySubType
      : properties[0].propertyType;
  // Changing usageCategoryMajor to usageCategory
  properties[0].usageCategory = properties[0].usageCategoryMajor + (properties[0].usageCategoryMinor ? "." + properties[0].usageCategoryMinor : "");
  properties[0].ownershipCategory =
    properties[0].ownershipCategory + (properties[0].subOwnershipCategory ? "." + properties[0].subOwnershipCategory : "");
  // Deleting object keys from request payload which are not required now
  //   delete properties[0].usageCategoryMajor;
  //   delete properties[0].usageCategoryMinor;

  if (properties[0].propertyType.includes("SHAREDPROPERTY")) {
    properties[0].noOfFloors = Object.keys(floorArray).length;
    properties[0].landArea = properties[0].superBuiltUpArea;
  }
  delete properties[0].citizenInfo;
  delete properties[0].propertyDetails;
  delete properties[0].subOwnershipCategory;
  delete properties[0].propertySubType;
  delete properties[0].buildUpArea;
  return properties[0];
};

export const createAssessmentPayload = (properties, propertyPayload) => {
  const Assessment = {
    financialYear: propertyPayload.financialYear,
    tenantId: properties.tenantId,
    propertyId: properties.propertyId,
    source: "MUNICIPAL_RECORDS",
    channel: "CFC_COUNTER",
  };

  return Assessment;
};

export const getCreatePropertyResponse = (createPropertyResponse) => {
  // createPropertyResponse.Properties[0].propertyDetails = createPropertyResponse.Properties;
  // Documents array coming in reverse order from API
  // createPropertyResponse.Properties[0] && createPropertyResponse.Properties[0].documents && createPropertyResponse.Properties[0].documents.length && createPropertyResponse.Properties[0].documents.reverse();
  try {
    return { Properties: convertToOldPTObject(createPropertyResponse), newProperties: createPropertyResponse.Properties };
  } catch (e) {
    console.error(e);
    return { Properties: [], newProperties: [] };
  }
};

export const convertToArray = (documentsUploadRedux) => {
  if (documentsUploadRedux && typeof documentsUploadRedux === "object") {
    if (Object.keys(documentsUploadRedux) && Object.keys(documentsUploadRedux).length) {
      let documentsData = [];
      Object.keys(documentsUploadRedux).map((key) => {
        const dropdownValue = documentsUploadRedux[key] && documentsUploadRedux[key].dropdown && documentsUploadRedux[key].dropdown.value || '';
        let docTitleArray = dropdownValue && dropdownValue.split(".");
        // if (dropdownValue == '' && docTitleArray.length == 1) {
        //   return;
        // }
        if(documentsUploadRedux[key].documents && documentsUploadRedux[key].documents[0].fileUrl && documentsUploadRedux[key].documents[0].fileName) {
          documentsData.push({
            title: docTitleArray && docTitleArray.length > 0 && docTitleArray[docTitleArray.length - 1],
            link: getFileUrl(documentsUploadRedux[key].documents[0].fileUrl),
            linkText: "View",
            name: documentsUploadRedux[key].documents[0].fileName,
          });
        }
        return documentsData;
      });
      return documentsData;
    }
  }
};

export const setPTDocuments = async (payload, sourceJsonPath, destJsonPath, dispatch, businessService) => {
  let uploadedDocData = get(payload, sourceJsonPath);
  uploadedDocData = uniqBy(uploadedDocData, 'fileStoreId');
  const fileStoreIds =
    uploadedDocData &&
    uploadedDocData
      .map((item) => {
        return item.fileStoreId;
      })
      .join(",");
  const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  const reviewDocData =
    uploadedDocData &&
    uploadedDocData.map((item, index) => {
      return {
        title: `${businessService}_${item.documentType}`.replace(".", "_") || "",
        link: (fileUrlPayload && fileUrlPayload[item.fileStoreId] && getFileUrl(fileUrlPayload[item.fileStoreId])) || "",
        linkText: "View",
        name:
          (fileUrlPayload &&
            fileUrlPayload[item.fileStoreId] &&
            decodeURIComponent(
              getFileUrl(fileUrlPayload[item.fileStoreId])
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`,
      };
    });
  return reviewDocData;
};

export const prefillPTDocuments = async (payload, sourceJsonPath, destJsonPath, dispatch, businessService) => {
  let documentsUploadRedux = {};
  const uploadedDocData = get(payload, sourceJsonPath);
  const uploadedDocs = await setPTDocuments(payload, "Properties[0].documents", "documentsUploaded", dispatch, "PT");
  documentsUploadRedux =
    uploadedDocs &&
    uploadedDocs.length &&
    uploadedDocs.map((item, key) => {
      let docUploadRedux = {};
      docUploadRedux[key] = {
        documents: [
          {
            fileName: item.name,
            fileUrl: item.link,
            fileStoreId: payload.Properties[0].documents[key].fileStoreId,
          },
        ],
      };
      docUploadRedux[key].dropdown = { value: payload.Properties[0].documents[key].documentType };
      docUploadRedux[key].isDocumentRequired = true;
      docUploadRedux[key].isDocumentTypeRequired = true;
      return docUploadRedux;
    });
  // documentsUploadRedux && documentsUploadRedux.length && documentsUploadRedux.reverse();
  let docs = {};
  if (documentsUploadRedux) {
    for (let i = 0; i < documentsUploadRedux.length; i++) {
      docs[i] = documentsUploadRedux[i][i];
    }
  }
  dispatch(prepareFinalObject(destJsonPath, docs));
};

export const setOldPropertyData = async (search, prepareFinalObject) => {
  const propertyId = getQueryValue(search, "propertyId");
  const tenantId = getQueryValue(search, "tenantId");
  let searchPropertyResponse = await httpRequest(
    "property-services/property/_search",
    "_search",
    [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "propertyIds",
        value: propertyId //"PT-107-001278",
      }
    ]
  );
  // searchPropertyResponse.Properties[0].owners.reverse(); // Owners are coming in reverse order
  const Property = convertToOldPTObject(searchPropertyResponse);
  const oldProperty = Object.create(Property);
  prepareFinalObject("OldProperty", oldProperty[0], null);
} 
