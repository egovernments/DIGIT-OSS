// import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getFileUrlFromAPI, getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertToOldPTObject } from "egov-ui-kit/utils/PTCommon/FormWizardUtils";

export const createPropertyPayload = (properties, documentsUploadRedux, newProperties = []) => {
  properties[0] = {
    ...properties[0],
    ...properties[0].propertyDetails[0],
    source: "MUNICIPAL_RECORDS",
    channel: "CFC_COUNTER",
    status: "ACTIVE",
  };
  if (properties[0].owners && properties[0].owners.length) {
    properties[0].owners.map((obj) => {
      if (obj.documents && Array.isArray(obj.documents) && obj.documents.length) {
        if (!obj.documents[0].documentType || !obj.documents[0].documentUid) {
          delete obj.documents;
        }
      }
      obj.ownerType = obj.ownerType || "NONE";
    });
  }
  if (newProperties && newProperties.length > 0) {
    properties[0].owners = newProperties[0].owners;
  }
  properties[0].units.map((unit) => {
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

  if (documentsUploadRedux && Object.keys(documentsUploadRedux) && Object.keys(documentsUploadRedux).length) {
    properties[0].documents = [];
    Object.keys(documentsUploadRedux).map((key) => {
      properties[0].documents.push({
        documentType: documentsUploadRedux[key].dropdown.value,
        fileStoreId: documentsUploadRedux[key].documents[0].fileStoreId,
        documentUid: documentsUploadRedux[key].documents[0].fileStoreId,
      });
    });
  }

  if (properties[0].institution) {
    properties[0].institution.nameOfAuthorizedPerson = properties[0].owners[0].name;
    properties[0].institution.tenantId = properties[0].tenantId;
  }
  properties[0].creationReason = "NEWPROPERTY";
  properties[0].superBuiltUpArea = properties[0].buildUpArea;

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
    assessmentDate: properties.auditDetails.createdTime - 60000,
    tenantId: properties.tenantId,
    propertyID: properties.propertyId,
    source: "MUNICIPAL_RECORDS",
    channel: "CFC_COUNTER",
    status: "ACTIVE",
  };

  return Assessment;
};

export const getCreatePropertyResponse = (createPropertyResponse) => {
  // createPropertyResponse.Properties[0].propertyDetails = createPropertyResponse.Properties;
  // Documents array coming in reverse order from API
  createPropertyResponse.Properties[0] && createPropertyResponse.Properties[0].documents && createPropertyResponse.Properties[0].documents.length && createPropertyResponse.Properties[0].documents.reverse();
  return { Properties: convertToOldPTObject(createPropertyResponse), newProperties: createPropertyResponse.Properties };
};

export const convertToArray = (documentsUploadRedux) => {
  if (documentsUploadRedux && typeof documentsUploadRedux === "object") {
    if (Object.keys(documentsUploadRedux) && Object.keys(documentsUploadRedux).length) {
      let documentsData = [];
      Object.keys(documentsUploadRedux).map((key) => {
        let docTitleArray = documentsUploadRedux[key].dropdown.value.split(".");
        return documentsData.push({
          title: docTitleArray[docTitleArray.length - 1],
          link: getFileUrl(documentsUploadRedux[key].documents[0].fileUrl),
          linkText: "View",
          name: documentsUploadRedux[key].documents[0].fileName,
        });
      });
      return documentsData;
    }
  }
};

export const setPTDocuments = async (payload, sourceJsonPath, destJsonPath, dispatch, businessService) => {
  const uploadedDocData = get(payload, sourceJsonPath);
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
  for (let i = 0; i < documentsUploadRedux.length; i++) {
    docs[i] = documentsUploadRedux[i][i];
  }
  console.log("documentsUploadRedux-----:   ", docs);
  dispatch(prepareFinalObject(destJsonPath, docs));
};
