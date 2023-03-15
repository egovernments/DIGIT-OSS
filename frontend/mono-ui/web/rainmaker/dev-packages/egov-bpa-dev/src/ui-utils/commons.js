import commonConfig from "config/common.js";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrl, getFileUrlFromAPI, getMultiUnits, getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { downloadPdf, printPdf } from "egov-ui-kit/utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import {
  edcrDetailsToBpaDetails, getCheckBoxJsonpath, getHygeneLevelJson,
  getLocalityHarmedJson, getSafetyNormsJson, getTranslatedLabel, setOrganizationVisibility, updateDropDowns
} from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";

export const downloadReceiptFromFilestoreID = (fileStoreId, mode, tenantId) => {
  getFileUrlFromAPI(fileStoreId, tenantId).then(async (fileRes) => {
    if (mode === 'download') {
      downloadPdf(fileRes[fileStoreId]);
    }
    else {
      printPdf(fileRes[fileStoreId]);
    }
  });
}

export const download = (receiptQueryString, mode = "download", configKey = "consolidatedreceipt", state, businessService) => {
  if (state && process.env.REACT_APP_NAME === "Citizen" && configKey === "consolidatedreceipt") {
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");
    configKey = get(uiCommonPayConfig, "receiptKey", "consolidatedreceipt")
  }
  const FETCHRECEIPT = {
    GET: {
      URL: businessService ? `/collection-services/payments/${businessService}_search`  :"/collection-services/payments/_search",
      ACTION: "_get",
    },
  };
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", FETCHRECEIPT.GET.URL, FETCHRECEIPT.GET.ACTION, receiptQueryString).then((payloadReceiptDetails) => {
      const queryStr = [
        { key: "key", value: configKey },
        { key: "tenantId", value: commonConfig.tenantId }
      ]
      if (payloadReceiptDetails && payloadReceiptDetails.Payments && payloadReceiptDetails.Payments.length == 0) {
        console.log("Could not find any receipts");
        return;
      }
      const oldFileStoreId = get(payloadReceiptDetails.Payments[0], "fileStoreId")
      if (oldFileStoreId) {
        downloadReceiptFromFilestoreID(oldFileStoreId, mode)
      }
      else {
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Payments: payloadReceiptDetails.Payments }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Receipt Download");
            }
          });
      }
    })
  } catch (exception) {
    alert('Some Error Occured while downloading Receipt!');
  }
}

const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};

export const convertEchToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${year}-${month}-${day}`;
};

export const getSearchResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/tl-services/v1/BPAREG/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getBpaSearchResults = async queryObject => {
  try {
    if (queryObject && queryObject.length) {
      let isTenantId = true;
      queryObject.forEach(obj => {
        if (obj.key === "tenantId") {
          isTenantId = false
        }
      })
      if (isTenantId) {
        queryObject.push({ key: "tenantId", value: getTenantId() })
      }
    } else {
      queryObject = [{ key: "tenantId", value: getTenantId() }];
    }
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/bpa/_search?offset=0&limit=-1",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const updateTradeDetails = async requestBody => {
  try {
    const payload = await httpRequest(
      "post",
      "/tl-services/v1/BPAREG/_update",
      "",
      [],
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getAppSearchResults = async (queryObject, dispatch) => {
  try {
    if (queryObject && queryObject.length) {
      let isTenantId = true;
      queryObject.forEach(obj => {
        if (obj.key === "tenantId") {
          isTenantId = false
        }
      })
      if (isTenantId) {
        queryObject.push({ key: "tenantId", value: getTenantId() })
      }
    } else {
      queryObject = [{ key: "tenantId", value: getTenantId() }];
    }
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/bpa/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

// export const getNocSearchResults = async (queryObject, dispatch) => {
//   try {
//     if(queryObject && queryObject.length) {
//       let isTenantId = true;
//       queryObject.forEach(obj => {
//         if(obj.key === "tenantId"){
//           isTenantId = false
//         }
//       })
//       if(isTenantId) {
//         queryObject.push({key : "tenantId", value: getTenantId()})
//       }
//     } else {
//       queryObject = [{key : "tenantId", value: getTenantId()}];
//     }
//     const payload = await httpRequest(
//       "post",
//       "/noc-services/v1/noc/_search",
//       "",
//       queryObject
//     );
//     return payload;
//   } catch (error) {
//     store.dispatch(
//       toggleSnackbar(
//         true,
//         { labelName: error.message, labelKey: error.message },
//         "error"
//       )
//     );
//     throw error;
//   }
// };

export const createUpdateBpaApplication = async (state, dispatch, status) => {
  let applicationId = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.id"
  );
  let method = applicationId ? "UPDATE" : "CREATE";

  let documentsUpdalod = get(
    state,
    "screenConfiguration.preparedFinalObject.documentDetailsUploadRedux",
    []
  );

  let BPADocs = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.documents",
    []
  );

  let documnts = [];
  if (documentsUpdalod) {
    Object.keys(documentsUpdalod).forEach(function (key) {
      documnts.push(documentsUpdalod[key])
    });
  }

  let nocDocumentsUpload = get(
    state,
    "screenConfiguration.preparedFinalObject.nocDocumentsUploadRedux"
  );

  if (nocDocumentsUpload) {
    Object.keys(nocDocumentsUpload).forEach(function (key) {
      documnts.push(nocDocumentsUpload[key])
    });
  }

  let requiredDocuments = [];
  if (documnts && documnts.length > 0) {
    documnts.forEach(documents => {
      if (documents && documents.documents) {
        documents.documents.forEach(docItem => {
          if (documents.dropDownValues && documents.dropDownValues.value) {
            let doc = { };
            doc.documentType = documents.dropDownValues.value;
            doc.fileStoreId = docItem.fileStoreId;
            doc.fileStore = docItem.fileStoreId;
            doc.fileName = docItem.fileName;
            doc.fileUrl = docItem.fileUrl;
            doc.additionalDetails = docItem.additionalDetails;
            BPADocs && BPADocs.forEach(bpaDc => {
              if (bpaDc.fileStoreId === docItem.fileStoreId) {
                doc.id = bpaDc.id;
              }
            });
            requiredDocuments.push(doc);
          }
        })
      }
    });

    documnts.forEach(documents => {
      if (documents && documents.previewdocuments) {
        documents.previewdocuments.forEach(pDoc => {
          let doc = { };
          // if(documents.dropDownValues) {
          // doc.documentType = documents.dropDownValues.value;
          // }
          doc.documentType = pDoc.dropDownValues;
          doc.fileStoreId = pDoc.fileStoreId;
          doc.fileStore = pDoc.fileStoreId;
          doc.fileName = pDoc.fileName;
          doc.fileUrl = pDoc.fileUrl;
          BPADocs && BPADocs.forEach(bpaDc => {
            if (bpaDc.fileStoreId === pDoc.fileStoreId) {
              doc.id = bpaDc.id;
            }
          });
          requiredDocuments.push(doc);
        })
      }
    });

  }


  let subOccupancyData = get(
    state, "screenConfiguration.preparedFinalObject.edcr.blockDetail"
  );
  let BPADetails = get(
    state, "screenConfiguration.preparedFinalObject.BPA"
  );
  let blocks = [];
  subOccupancyData.forEach((block, index) => {
    let arry = [];
    block && block.occupancyType && block.occupancyType.length &&
      block.occupancyType.forEach(occType => {
        arry.push(occType.value);
      })
    blocks[index] = { };
    blocks[index].blockIndex = index;
    blocks[index].usageCategory = { };
    blocks[index].usageCategory = arry.join();
    blocks[index].floorNo = block.floorNo;
    blocks[index].unitType = "Block";
    if (BPADetails.landInfo.unit && BPADetails.landInfo.unit[index] && BPADetails.landInfo.unit[index].id) {
      blocks[index].id = BPADetails.landInfo.unit[index].id;
    }
  })

  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "BPA", []);
    let tenantId =
      get(state, "screenConfiguration.preparedFinalObject.BPA.landInfo.address.city") ||
      getQueryArg(window.location.href, "tenantId") ||
      getTenantId();
    let userInfo = JSON.parse(getUserInfo());
    let accountId = get(userInfo, "uuid");
    set(payload, "tenantId", tenantId);
    set(payload, "landInfo.tenantId", tenantId);
    set(payload, "workflow.action", status);
    set(payload, "accountId", accountId);

    // set(payload, "additionalDetails", null);
    // set(payload, "units", null);
    set(payload, "landInfo.unit", blocks);

    let documents;
    if (requiredDocuments && requiredDocuments.length > 0) {
      documents = requiredDocuments;
    } else {
      documents = null;
    }

    let wfDocuments;
    if (method === "UPDATE") {
      if (status === "APPLY") {
        documents = payload.documents
      } else {
        documents = payload.documents;
        documents = requiredDocuments;
      }
      set(payload, "documents", documents);
      set(payload, "workflow.varificationDocuments", null);
    } else if (method === 'CREATE') {
      documents = null;
    }

    payload.documents = documents;

    // // Set Channel and Financial Year
    // process.env.REACT_APP_NAME === "Citizen"
    //   ? set(payload[0], "BPA.channel", "CITIZEN")
    //   : set(payload[0], "BPA.channel", "COUNTER");
    // set(payload[0], "BPA.financialYear", "2019-20");

    // Set Dates to Epoch

    let owners = get(payload, "landInfo.owners", []);
    owners.forEach((owner, index) => {
      set(
        payload,
        `landInfo.owners[${index}].dob`,
        convertDateToEpoch(get(owner, "dob"))
      );
    });

    let authOwners = [];
    let multiOwners = get(payload, "landInfo.owners", []);
    if (multiOwners && multiOwners.length > 0) {
      multiOwners.forEach(owner => {
        if (owner && owner.isDeleted != false) {
          authOwners.push(owner);
        }
      })
    }

    set(payload, "landInfo.owners", authOwners);
    let response;
    if (method === "CREATE") {
      response = await httpRequest(
        "post",
        "bpa-services/v1/bpa/_create",
        "",
        [],
        { BPA: payload }
      );
      // response = prepareOwnershipType(response);
      dispatch(prepareFinalObject("BPA", response.BPA[0]));
      setApplicationNumberBox(state, dispatch);
      await edcrDetailsToBpaDetails(state, dispatch);
    } else if (method === "UPDATE") {
      response = await httpRequest(
        "post",
        "bpa-services/v1/bpa/_update",
        "",
        [],
        { BPA: payload }
      );
      // response = prepareOwnershipType(response);
      dispatch(prepareFinalObject("BPA", response.BPA[0]));
    }
    return { status: "success", message: response };
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "failure", message: error };
  }
};

export const prepareDocumentsUploadData = (state, dispatch, isOC) => {
  let applicationDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.DocTypeMapping", //[0].docTypes
    []
  );
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );

  let bpaDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA", { }
  );

  let documents = []
  /**
   * @TODO optimize logic further
   */
  applicationDocuments.forEach(doc => {
    if ((doc.WFState == "INITIATED" && doc.RiskType === bpaDetails.riskType && doc.ServiceType === bpaDetails.serviceType && doc.applicationType === bpaDetails.applicationType)) {
      documents.push(doc.docTypes);
    }
  });

  if (documents[0] && documents[0].length > 0) {
    let documentsList = [];
    documents[0].forEach(doc => {
      let code = doc.code;
      doc.dropDownValues = [];
      documentsDropDownValues.forEach(value => {
        let values = value.code.slice(0, code.length);
        if (code === values) {
          doc.hasDropdown = true;
          doc.dropDownValues.push(value);
        }
      });
      documentsList.push(doc);
    });
    const bpaDocuments = documentsList;
    let documentsContract = [];
    let tempDoc = { };

    bpaDocuments.forEach(doc => {
      let card = { };
      card["code"] = doc.code.split(".")[0];
      card["title"] = doc.code.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.code.split(".")[0]] = card;
    });
    bpaDocuments.forEach(doc => {
      let card = { };
      card["name"] = doc.code;
      card["code"] = doc.code;
      if (bpaDetails && bpaDetails.documents && bpaDetails.documents.length > 0) {
        card["required"] = false;
      }
      else {
        card["required"] = doc.required ? true : false;
      };
      if (doc.hasDropdown && doc.dropDownValues) {
        let dropDownValues = { };
        dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
        dropDownValues.required = doc.required ? true : false;
        dropDownValues.menu = doc.dropDownValues.filter(item => {
          return item.active;
        });
        dropDownValues.menu = dropDownValues.menu.map(item => {
          return { code: item.code, label: item.code };
        });
        card["dropDownValues"] = dropDownValues;
      }
      tempDoc[doc.code.split(".")[0]].cards.push(card);
    });

    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });

    dispatch(prepareFinalObject("documentsContract", documentsContract));
  }
};

export const prepareNOCUploadData = async (state, dispatch) => {


  let documents = await getNocDocuments(state);
  let documentsList = await mapDropdownValues(documents, state);

  // nocData.forEach(nocDoc => {
  //   applicationDocuments && applicationDocuments.length > 0 && 
  //   applicationDocuments.forEach(doc =>{
  //     if(doc.applicationType === nocDoc.applicationType && doc.nocType === nocDoc.nocType) {
  //       doc.docTypes[0].nocType = doc.nocType;
  //       documents.push(doc.docTypes[0]);    
  //     }
  //   });
  // });
  const nocDocuments = documentsList;
  let documentsContract = [];
  let tempDoc = { };
  if (nocDocuments && nocDocuments.length > 0) {
    nocDocuments.forEach(doc => {
      let card = { };
      // card["code"] = doc.documentType;
      // card["title"] = doc.documentType;
      card["code"] = doc.documentType.split(".")[0];
      card["title"] = doc.documentType.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.documentType.split(".")[0]] = card;
    });
    nocDocuments.forEach(doc => {
      let card = { };
      card["name"] = doc.documentType;
      card["code"] = doc.documentType;
      card["nocType"] = doc.nocType;
      card["additionalDetails"] = doc.additionalDetails;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropDownValues) {
        let dropDownValues = { };
        dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
        dropDownValues.required = doc.required;
        dropDownValues.menu = doc.dropDownValues.filter(item => {
          return item.active;
        });
        dropDownValues.menu = dropDownValues.menu.map(item => {
          return { code: item.code, label: item.code };
        });
        card["dropDownValues"] = dropDownValues;
      }
      tempDoc[doc.documentType.split(".")[0]].cards.push(card);
    });
  }

  if (tempDoc) {
    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });
  }
  dispatch(prepareFinalObject("nocBPADocumentsContract", documentsContract));
  let Noc = fetchFileDetails(get(
    state.screenConfiguration.preparedFinalObject,
    "Noc",
    []
  ))

  let finalCards = [];
  documentsContract.length > 0 && documentsContract[0].cards && documentsContract[0].cards.map(docs => {
    Noc && Noc.map(upDocs => {
      if (docs.nocType === upDocs.nocType) {
        docs.documents = upDocs.documents;
        let card = {
          code: docs.code,
          name: docs.code,
          nocType: docs.nocType,
          dropDownValues: docs.dropDownValues,
          documentCode: docs.code,
          documents: upDocs.documents,
          additionalDetails: docs.additionalDetails,
          readOnly: false
        };
        finalCards.push(card);
      }
    })
  })
  dispatch(prepareFinalObject("nocFinalCardsforPreview", finalCards));
  dispatch(prepareFinalObject("nocBPADocumentsContract", documentsContract));

};

/**
 * This method will be called to get teh noc documents matched with noctyps and applicationType
 */
const getNocDocuments = (state) => {
  let applicationDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NOC.DocumentTypeMapping",
    []
  );

  let Noc = get(
    state,
    "screenConfiguration.preparedFinalObject.Noc",
    []
  );
  let documents = [];
  Noc.forEach(nocDoc => {

    applicationDocuments && applicationDocuments.length > 0 &&
      applicationDocuments.forEach(doc => {
        if (doc.applicationType === nocDoc.applicationType && doc.nocType === nocDoc.nocType) {
          let linkDetails = { };
          let checkingApp = getTenantId().split('.')[1] ? "employee" : "citizen";
          let url = `${window.location.origin}/noc/search-preview?applicationNumber=${nocDoc.applicationNo}&tenantId=${nocDoc.tenantId}&isFromBPA=true`;
          if (process.env.NODE_ENV === "production") {
            if (checkingApp) {
              url = `${window.location.origin}/${checkingApp}/noc/search-preview?applicationNumber=${nocDoc.applicationNo}&tenantId=${nocDoc.tenantId}&isFromBPA=true`;
            }
          }
          if (nocDoc.applicationStatus === "CREATED" || nocDoc.applicationStatus === null) {
            url = "";
          }
          linkDetails.labelName = "BPA_SEARCH_APPLICATION_NO_LABEL"
          linkDetails.value = url;
          linkDetails.valueName = nocDoc.applicationNo;
          doc.docTypes[0].nocType = doc.nocType;
          doc.docTypes[0].additionalDetails = {
            submissionDetails: nocDoc.additionalDetails,
            applicationStatus: nocDoc.applicationStatus,
            linkDetails: linkDetails,
            appNumberLink: nocDoc.applicationNo,
            nocNo: nocDoc.nocNo,
            approvedRejectedOn: get(nocDoc, "auditDetails.lastModifiedTime", "")
          }
          documents.push(doc.docTypes[0]);
        }
      });
  });
  return documents;
}

/**
 * This method will be called to map mdms dropdown values
 * @param {*} documents 
 */
const mapDropdownValues = (documents, state) => {
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );
  let documentsList = [];
  if (documents && documents.length > 0) {
    documents.map(doc => {
      let code = doc.documentType;
      let nocType = doc.nocType;
      doc.dropDownValues = [];
      documentsDropDownValues.forEach(value => {
        let values = value.code.slice(0, code.length);
        if (code === values) {
          doc.hasDropdown = true;
          doc.dropDownValues.push(value);
        }
      });
      documentsList.push(doc);
    })
  }
  return documentsList;

}

/**
 * This method will be called to update filestore
 * @param {*} fileData 
 */
const fetchFileDetails = fileData => {
  fileData && fileData.length > 0 && fileData.forEach(async (items) => {
    if (items.documents && items.documents.length > 0) {
      let fileStoreIds = jp.query(items.documents, "$.*.fileStoreId");
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : { };
      items.documents.map((docs, index) => {
        docs["fileName"] =
          (fileUrls[docs.fileStoreId] &&
            decodeURIComponent(
              getFileUrl(fileUrls[docs.fileStoreId])
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
      })
    }
  });
  return fileData;
}

export const prepareOwnershipType = response => {
  console.log(response);
  // Handle applicant ownership dependent dropdowns
  let ownershipCategory = get(response, "BPA.landInfo.ownerShipType");
  set(
    response,
    "BPA.landInfo.ownershipCategory",
    ownershipCategory == undefined ? "SINGLE" : ownershipType.split(".")[0]
  );
  return response;
};

const setDocsForEditFlow = async (state, dispatch) => {
  const applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.applicationDocuments",
    []
  );
  let uploadedDocuments = { };
  let fileStoreIds =
    applicationDocuments && applicationDocuments.length > 0 &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  let fileUrlPayload =
    fileStoreIds && fileStoreIds.length > 0 && (await getFileUrlFromAPI(fileStoreIds));
  if (fileUrlPayload && fileUrlPayload.fileStoreIds) delete fileUrlPayload.fileStoreIds;
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
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
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
          id: item.id
        }
      ];
    });
  dispatch(
    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", uploadedDocuments)
  );
  dispatch(
    prepareFinalObject("LicensesTemp[0].isDocsEdit", true)
  );
};

export const updatePFOforSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  queryValuePurpose,
  tenantId
) => {
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId ? tenantId : getTenantId()
    },
    { key: "applicationNumber", value: queryValue }
  ];
  const isPreviouslyEdited = getQueryArg(window.location.href, "edited");
  const payload = !isPreviouslyEdited
    ? await getSearchResults(queryObject)
    : {
      Licenses: get(state.screenConfiguration.preparedFinalObject, "Licenses")
    };
  getQueryArg(window.location.href, "action") === "edit" &&
    (await setDocsForEditFlow(state, dispatch));
  if (payload) {
    let stakeHolderDetails = payload.Licenses[0];
    if (stakeHolderDetails && stakeHolderDetails.tradeLicenseDetail) {
      let owners = stakeHolderDetails.tradeLicenseDetail.owners;
      let dob = convertEchToDate(owners[0].dob);
      stakeHolderDetails.tradeLicenseDetail.owners[0].dob = dob;
    }
    dispatch(prepareFinalObject("Licenses[0]", stakeHolderDetails));
  }
  const licenseType = payload && get(payload, "Licenses[0].licenseType");
  updateDropDowns(payload, action, state, dispatch, queryValue);
  const subOwnerShipCategory = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
  );

  setOrganizationVisibility(action, state, dispatch, subOwnerShipCategory);

  if (queryValuePurpose !== "cancel") {
    set(payload, getSafetyNormsJson(queryValuePurpose), "yes");
    set(payload, getHygeneLevelJson(queryValuePurpose), "yes");
    set(payload, getLocalityHarmedJson(queryValuePurpose), "No");
  }
  set(payload, getCheckBoxJsonpath(queryValuePurpose), true);

  setApplicationNumberBoxBPAREG(state, dispatch);

  createOwnersBackup(dispatch, payload);
};

const updateownersAddress = (dispatch, payload) => {
  const owners = get(payload, "Licenses[0].tradeLicenseDetail.owners");
  let permanantAddrLine1 = get(owners[0], "address.addressLine1");
  let permanantAddr = get(owners[0], "permanentAddress");
  if (!permanantAddrLine1) {
    set(owners[0], "address.addressLine1", permanantAddr);
  }
  dispatch(
    prepareFinalObject(
      "LicensesTemp[0].tradeLicenseDetail.owners",
      JSON.parse(JSON.stringify(owners))
    )
  );
};
const createOwnersBackup = (dispatch, payload) => {
  const owners = get(payload, "Licenses[0].tradeLicenseDetail.owners");
  owners &&
    owners.length > 0 &&
    dispatch(
      prepareFinalObject(
        "LicensesTemp[0].tradeLicenseDetail.owners",
        JSON.parse(JSON.stringify(owners))
      )
    );
};

const userAddressConstruct = address => {
  let doorNo = address.doorNo ? address.doorNo : "";
  let buildingName = address.buildingName ? address.buildingName : "";
  let street = address.street ? address.street : "";
  let landmark = address.landmark ? address.landmark : "";
  let city = address.city ? address.city : "";
  return `${doorNo},${buildingName},${street},${landmark},${city}`;
};

export const setApplicationNumberBoxBPAREG = (
  state,
  dispatch,
  applicationNo
) => {
  if (!applicationNo) {
    applicationNo = get(
      state,
      "screenConfiguration.preparedFinalObject.Licenses[0].applicationNumber",
      null
    );
  }

  if (applicationNo) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNo
      )
    );
  }
};

export const applyTradeLicense = async (state, dispatch, activeIndex) => {
  try {
    dispatch(toggleSpinner());
    let queryObject = JSON.parse(
      JSON.stringify(
        get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
      )
    );
    let documents = get(
      queryObject[0],
      "tradeLicenseDetail.applicationDocuments"
    );
    set(
      queryObject[0],
      "validFrom",
      convertDateToEpoch(queryObject[0].validFrom, "dayend")
    );
    // set(queryObject[0], "wfDocuments", documents);
    set(
      queryObject[0],
      "validTo",
      convertDateToEpoch(queryObject[0].validTo, "dayend")
    );
    if (queryObject[0] && queryObject[0].commencementDate) {
      queryObject[0].commencementDate = convertDateToEpoch(
        queryObject[0].commencementDate,
        "dayend"
      );
    }
    let ownershipType = get(
      queryObject[0],
      "tradeLicenseDetail.subOwnerShipCategory"
    );
    if (ownershipType == "INDIVIDUAL")
      set(queryObject[0], "tradeLicenseDetail.institution", null);
    let owners = get(queryObject[0], "tradeLicenseDetail.owners");
    owners = (owners && convertOwnerDobToEpoch(owners)) || [];
    set(queryObject[0], "tradeLicenseDetail.owners", owners);
    set(queryObject[0], "licenseType", "PERMANENT");
    set(queryObject[0], "businessService", "BPAREG");

    let tenantId = getTenantId();
    if ((tenantId == "null") || (tenantId == null)) {
      tenantId = process.env.REACT_APP_DEFAULT_TENANT_ID;
    }

    set(queryObject[0], "tenantId", tenantId);
    let userAddress = get(
      state.screenConfiguration.preparedFinalObject,
      "LicensesTemp[0].userData.address"
    );

    let permanantAddr = userAddressConstruct(userAddress);

    set(
      queryObject[0],
      "tradeLicenseDetail.owners[0].permanentAddress",
      permanantAddr
    );
    set(
      queryObject[0],
      "tradeLicenseDetail.owners[0].permanentPinCode",
      userAddress.pincode
    );
    if (queryObject[0].applicationNumber) {
      //call update

      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      set(
        queryObject[0],
        "tradeLicenseDetail.tradeUnits",
        getMultiUnits(tradeUnits)
      );
      // set(
      //   queryObject[0],
      //   "tradeLicenseDetail.owners",
      //   getMultipleOwners(owners)
      // );
      let action = "NOWORKFLOW";
      // if (
      //   queryObject[0].tradeLicenseDetail &&
      //   queryObject[0].tradeLicenseDetail.applicationDocuments
      // ) {
      if (activeIndex === 2) {
        action = "APPLY";
      }
      //   let docs = []; 
      //   let bparegDocuments = queryObject[0].tradeLicenseDetail.applicationDocuments;
      //  if(bparegDocuments && bparegDocuments.length > 0) {
      //   bparegDocuments.forEach(doc => {
      //     if(doc != null) docs.push(doc)
      //   })
      //   }
      //   queryObject[0].tradeLicenseDetail.applicationDocuments = docs;
      // }

      let documentsUpdalod = get(
        state,
        "screenConfiguration.preparedFinalObject.bparegDocumentDetailsUploadRedux",
        []
      );

      let documnts = [];
      if (documentsUpdalod) {
        Object.keys(documentsUpdalod).forEach(function (key) {
          documnts.push(documentsUpdalod[key])
        });
      }

      if (documents && documents.length && documnts && documnts.length) {
        documents.forEach(upDocs => {
          documnts.forEach(reduxDocs => {
            if (reduxDocs && upDocs &&
              reduxDocs.documentCode === upDocs.documentType) {
              reduxDocs.documents[0].id = upDocs.id;
            }
          })
        })
      }

      let requiredDocuments = [];
      if (documnts && documnts.length > 0) {
        documnts.forEach(documents => {
          if (documents && documents.documents) {
            let doc = { };
            doc.fileStoreId = documents.documents[0].fileStoreId;
            doc.fileStore = documents.documents[0].fileStoreId;
            doc.fileName = documents.documents[0].fileName;
            doc.fileUrl = documents.documents[0].fileUrl;
            doc.documentType = documents.documentCode;
            doc.tenantId = tenantId;
            if (documents.documents[0].id) {
              doc.id = documents.documents[0].id;
            }
            requiredDocuments.push(doc);
          }
        })
      }
      if (requiredDocuments && requiredDocuments.length) {
        queryObject[0].tradeLicenseDetail.applicationDocuments = requiredDocuments;
      }
      // else if (
      //   queryObject[0].tradeLicenseDetail &&
      //   queryObject[0].tradeLicenseDetail.applicationDocuments &&
      //   activeIndex === 1
      // ) {
      // } else if (
      //   queryObject[0].tradeLicenseDetail &&
      //   queryObject[0].tradeLicenseDetail.applicationDocuments
      // ) {
      //   action = "APPLY";
      // }
      let searchResponse = { };
      set(queryObject[0], "action", action);
      const isEditFlow = getQueryArg(window.location.href, "action") === "edit";
      if (!isEditFlow) {
        searchResponse = await httpRequest(
          "post",
          "/tl-services/v1/BPAREG/_update",
          "",
          [],
          {
            Licenses: queryObject
          }
        );
      }
      dispatch(toggleSpinner());

      // let searchQueryObject = [
      //   { key: "tenantId", value: queryObject[0].tenantId },
      //   { key: "applicationNumber", value: queryObject[0].applicationNumber }
      // ];
      // let searchResponse = await getSearchResults(searchQueryObject);
      if (isEditFlow) {
        searchResponse = { Licenses: queryObject };
      } else {
        let stakeHolderDetails = searchResponse.Licenses;
        if (stakeHolderDetails && stakeHolderDetails[0] && stakeHolderDetails[0].tradeLicenseDetail) {
          let owners = stakeHolderDetails[0].tradeLicenseDetail.owners;
          let dob = convertEchToDate(owners[0].dob);
          stakeHolderDetails[0].tradeLicenseDetail.owners[0].dob = dob;
        }
        dispatch(prepareFinalObject("Licenses", stakeHolderDetails));
        await setDocsForEditFlow(state, dispatch);
      }
      const updatedtradeUnits = get(
        searchResponse,
        "Licenses[0].tradeLicenseDetail.tradeUnits"
      );
    } else {
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      // let owners = get(queryObject[0], "tradeLicenseDetail.owners");
      let mergedTradeUnits =
        tradeUnits &&
        tradeUnits.filter(item => !item.hasOwnProperty("isDeleted"));

      set(queryObject[0], "tradeLicenseDetail.tradeUnits", mergedTradeUnits);
      set(queryObject[0], "action", "NOWORKFLOW");
      //Emptying application docs to "INITIATE" form in case of search and fill from old TL Id.
      if (!queryObject[0].applicationNumber)
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
      const response = await httpRequest(
        "post",
        "/tl-services/v1/BPAREG/_create",
        "",
        [],
        { Licenses: queryObject }
      );
      dispatch(toggleSpinner());
      if (!response) {
      }
      let stakeHolderDetails = response.Licenses;
      if (stakeHolderDetails && stakeHolderDetails[0] && stakeHolderDetails[0].tradeLicenseDetail) {
        let owners = stakeHolderDetails[0].tradeLicenseDetail.owners;
        let dob = convertEchToDate(owners[0].dob);
        stakeHolderDetails[0].tradeLicenseDetail.owners[0].dob = dob;
      }
      dispatch(prepareFinalObject("Licenses", stakeHolderDetails));
      createOwnersBackup(dispatch, response);
    }
    /** Application no. box setting */
    setApplicationNumberBoxBPAREG(state, dispatch);
    return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    dispatch(toggleSpinner());

    console.log(error);
    return false;
  }
};

const convertOwnerDobToEpoch = owners => {
  let updatedOwners =
    owners &&
    owners
      .map(owner => {
        return {
          ...owner,
          dob:
            owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
        };
      })
      .filter(item => item && item !== null);
  return updatedOwners;
};

export const getImageUrlByFile = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const fileNameArray = file["name"].split(".");
  const fileFormat = fileNameArray[fileNameArray.length - 1];
  return (
    (fileFormat &&
      acceptedFiles &&
      acceptedFiles.indexOf(fileFormat.toUpperCase()) > -1) ||
    false
  );
};

export const setApplicationNumberBox = (state, dispatch, applicationNo) => {
  if (!applicationNo) {
    applicationNo = get(
      state,
      "screenConfiguration.preparedFinalObject.BPA.applicationNo",
      null
    );
  }

  if (applicationNo) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNo
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const acceptedFiles = acceptedExt => {
  const splitExtByName = acceptedExt.split(",");
  const acceptedFileTypes = splitExtByName.map(item => {
    return item.toUpperCase();
  });
  return acceptedFileTypes;
};

export const handleFileUpload = (event, handleDocument, props) => {
  let uploadDocument = true;
  const { inputProps, maxFileSize, moduleName } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const fileValid = isFileValid(file, acceptedFiles(inputProps.accept));
      // const fileValid = true //temporary disabling check as dxf issues in other os
      const isSizeValid = getFileSize(file) <= maxFileSize;
      if (!fileValid) {
        alert(`Only dxf files can be uploaded`);
        uploadDocument = false;
      }
      if (!isSizeValid) {
        alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
        uploadDocument = false;
      }
      if (uploadDocument) {
        handleDocument(file);
      }
    });
  }
};

const updateNocApplication = async (state, dispatch, bpaAction) => {
  const Noc = get(state, "screenConfiguration.preparedFinalObject.Noc", []);
  let nocDocuments = get(state, "screenConfiguration.preparedFinalObject.nocForPreview", []);
  if (Noc.length > 0) {
    let count = 0;
    for (let data = 0; data < Noc.length; data++) {
      let documents = nocDocuments[data].documents;
      set(Noc[data], "documents", documents);
      // set(NOCData[data], "workflow.action", bpaAction)
      let response = await httpRequest(
        "post",
        "/noc-services/v1/noc/_update",
        "",
        [],
        { Noc: Noc[data] }
      );
      if (get(response, "ResponseInfo.status") == "successful") {
        count++;
        if (Noc.length == count) {
          return "successful"
        }
      }
    }
  }
};

export const submitBpaApplication = async (state, dispatch) => {
  const bpaAction = "APPLY";
  let isDeclared = get(state, "screenConfiguration.preparedFinalObject.BPA.isDeclared");

  if (isDeclared) {
    let nocRespose = await nocapplicationUpdate(state);
    let response = await createUpdateBpaApplication(state, dispatch, bpaAction);
    const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.BPA.applicationNo");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    if (get(response, "status", "") === "success") {
      let status = get(state, "screenConfiguration.preparedFinalObject.BPA.status");
      if (status === "DOC_VERIFICATION_INPROGRESS") {
        const acknowledgementUrl =
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/egov-bpa/acknowledgement?purpose=apply_skip&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
            : `/egov-bpa/acknowledgement?purpose=apply_skip&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
        dispatch(setRoute(acknowledgementUrl));
      } else {
        const acknowledgementUrl =
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/egov-bpa/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
            : `/egov-bpa/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
        dispatch(setRoute(acknowledgementUrl));
      }

    }
  }
  else {
    let errorMessage = {
      labelName: "Please confirm the declaration!",
      labelKey: "BPA_DECLARATION_COMMON_LABEL"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};

export const updateBpaApplication = async (state, dispatch) => {
  const bpaAction = "SEND_TO_CITIZEN";
  let nocRespose = await updateNocApplication(state, dispatch, "INITIATE");
  let response = await createUpdateBpaApplication(state, dispatch, bpaAction);
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.BPA.applicationNo");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  if (get(response, "status", "") === "success" && nocRespose == "successful") {
    const acknowledgementUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/egov-bpa/acknowledgement?purpose=${bpaAction}&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/egov-bpa/acknowledgement?purpose=${bpaAction}&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(acknowledgementUrl));
  }
};
export const updateOcBpaApplication = async (state, dispatch) => {
  const bpaAction = "SEND_TO_CITIZEN";
  let nocRespose = await updateNocApplication(state, dispatch, "INITIATE");
  let response = await createUpdateOCBpaApplication(state, dispatch, bpaAction);
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.BPA.applicationNo");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  if (response && nocRespose == "successful") {
    const acknowledgementUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/oc-bpa/acknowledgement?purpose=${bpaAction}&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/oc-bpa/acknowledgement?purpose=${bpaAction}&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(acknowledgementUrl));
  }
};

export const createUpdateOCBpaApplication = async (state, dispatch, status) => {
  let applicationId = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.id"
  );

  let documentsUpdalod = get(
    state,
    "screenConfiguration.preparedFinalObject.documentDetailsUploadRedux",
    []
  );

  let BPADocs = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.documents",
    []
  );

  let method = applicationId ? "UPDATE" : "CREATE";

  let documnts = [];
  if (documentsUpdalod) {
    Object.keys(documentsUpdalod).forEach(function (key) {
      documnts.push(documentsUpdalod[key])
    });
  }

  let requiredDocuments = [];
  if (documnts && documnts.length > 0) {
    documnts.forEach(documents => {
      if (documents && documents.documents) {
        documents.documents.forEach(docItem => {
          if (documents.dropDownValues && documents.dropDownValues.value) {
            let doc = { };
            doc.documentType = documents.dropDownValues.value;
            doc.fileStoreId = docItem.fileStoreId;
            doc.fileStore = docItem.fileStoreId;
            doc.fileName = docItem.fileName;
            doc.fileUrl = docItem.fileUrl;
            doc.additionalDetails = docItem.additionalDetails;
            BPADocs && BPADocs.forEach(bpaDc => {
              if (bpaDc.fileStoreId === docItem.fileStoreId) {
                doc.id = bpaDc.id;
              }
            });
            requiredDocuments.push(doc);
          }
        })
      }
    });

    documnts.forEach(documents => {
      if (documents && documents.previewdocuments) {
        documents.previewdocuments.forEach(pDoc => {
          let doc = { };
          doc.documentType = pDoc.dropDownValues;
          doc.fileStoreId = pDoc.fileStoreId;
          doc.fileStore = pDoc.fileStoreId;
          doc.fileName = pDoc.fileName;
          doc.fileUrl = pDoc.fileUrl;
          BPADocs && BPADocs.forEach(bpaDc => {
            if (bpaDc.fileStoreId === pDoc.fileStoreId) {
              doc.id = bpaDc.id;
            }
          });
          requiredDocuments.push(doc);
        })
      }
    });
  }

  // will use this later
  // let subOccupancyData = get(
  //   state, "screenConfiguration.preparedFinalObject.edcr.blockDetail"
  // );
  // let BPADetails = get(
  //   state, "screenConfiguration.preparedFinalObject.BPA"
  // );
  // let blocks = [];
  // subOccupancyData.forEach((block, index) => {
  //   let arry = [];
  //   block && block.occupancyType && block.occupancyType.length &&
  //     block.occupancyType.forEach(occType => {
  //       arry.push(occType.value);
  //     })
  //   blocks[index] = {};
  //   blocks[index].blockIndex = index;
  //   blocks[index].usageCategory = {};
  //   blocks[index].usageCategory = arry.join();
  //   blocks[index].floorNo = block.floorNo;
  //   blocks[index].unitType = "Block";
  //   if (BPADetails.landInfo && BPADetails.landInfo.unit && BPADetails.landInfo.unit[index] && BPADetails.landInfo.unit[index].id) {
  //     blocks[index].id = BPADetails.landInfo.unit[index].id;
  //   }
  // })

  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "BPA", []);
    let tenantId = getQueryArg(window.location.href, "tenantId") || getTenantId();
    let userInfo = JSON.parse(getUserInfo());
    let accountId = get(userInfo, "uuid");
    set(payload, "tenantId", tenantId);
    set(payload, "workflow.action", status);
    set(payload, "accountId", accountId);
    // set(payload, "landInfo.tenantId", tenantId);
    // set(payload, "landInfo.unit", blocks);

    let documents;
    if (requiredDocuments && requiredDocuments.length > 0) {
      documents = requiredDocuments;
    } else {
      documents = null;
    }

    if (method === "UPDATE") {
      if (status === "APPLY") {
        documents = payload.documents
      } else {
        documents = payload.documents;
        documents = requiredDocuments;
      }
      set(payload, "documents", documents);
      set(payload, "workflow.varificationDocuments", null);
    } else if (method === 'CREATE') {
      documents = null;
    }

    payload.documents = documents;

    // Set Dates to Epoch
    let owners = get(payload, "landInfo.owners", []);
    owners.forEach((owner, index) => {
      set(
        payload,
        `landInfo.owners[${index}].dob`,
        convertDateToEpoch(get(owner, "dob"))
      );
    });

    let authOwners = [];
    let multiOwners = get(payload, "landInfo.owners", []);
    if (multiOwners && multiOwners.length > 0) {
      multiOwners.forEach(owner => {
        if (owner && owner.isDeleted != false) {
          authOwners.push(owner);
        }
      })
    }

    set(payload, "landInfo.owners", authOwners);
    let response;
    if (method === "CREATE") {
      response = await httpRequest(
        "post",
        "bpa-services/v1/bpa/_create",
        "",
        [],
        { BPA: payload }
      );
      dispatch(prepareFinalObject("BPA", response.BPA[0]));
      setApplicationNumberBox(state, dispatch);
      await edcrDetailsToBpaDetails(state, dispatch);
    } else if (method === "UPDATE") {
      response = await httpRequest(
        "post",
        "bpa-services/v1/bpa/_update",
        "",
        [],
        { BPA: payload }
      );
      dispatch(prepareFinalObject("BPA", response.BPA[0]));
      await edcrDetailsToBpaDetails(state, dispatch);
    }
    return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return false;
  }
};

export const submitOCBpaApplication = async (state, dispatch) => {
  const bpaAction = "APPLY";
  let nocRespose = await nocapplicationUpdate(state);
  let response = await createUpdateOCBpaApplication(state, dispatch, bpaAction);
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.BPA.applicationNo");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  if (response) {
    if (get(response, "BPA[0].status" === "DOC_VERIFICATION_INPROGRESS")) {
      const acknowledgementUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/oc-bpa/acknowledgement?purpose=apply_skip&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
          : `/oc-bpa/acknowledgement?purpose=apply_skip&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
      dispatch(setRoute(acknowledgementUrl));
    } else {
      const acknowledgementUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/oc-bpa/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
          : `/oc-bpa/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
      dispatch(setRoute(acknowledgementUrl));
    }
  }
};
export const getNocSearchResults = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/noc-services/v1/noc/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const nocapplicationUpdate = (state) => {
  const Noc = get(state, "screenConfiguration.preparedFinalObject.Noc", []);
  let nocDocuments = get(state, "screenConfiguration.preparedFinalObject.nocFinalCardsforPreview", []);
  if (Noc.length > 0) {
    let count = 0;
    for (let data = 0; data < Noc.length; data++) {
      let documents = nocDocuments[data].documents;
      set(Noc[data], "documents", documents);
      let response = httpRequest(
        "post",
        "/noc-services/v1/noc/_update",
        "",
        [],
        { Noc: Noc[data] }
      );
      if (get(response, "ResponseInfo.status") == "successful") {
        count++;
        if (Noc.length == count) {
          return "successful"
        }
      }
    }
  }
}

export const getStakeHolderRoles = () => {
  let roles = [
    "BPA_ARCHITECT",
    "BPA_ENGINEER",
    "BPA_BUILDER",
    "BPA_STRUCTURALENGINEER",
    "BPA_SUPERVISOR",
    "BPA_TOWNPLANNER"
  ];
  return roles;
}