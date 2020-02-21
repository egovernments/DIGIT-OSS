import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { getTranslatedLabel } from "../ui-config/screens/specs/utils";
import DATA from "./documents";

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

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const getSearchResults = async (queryObject, dispatch) => {
  try {
    
    
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/property-services/property/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
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

export const createUpdatePTApplication = async (state, dispatch, status) => {
  let nocId = get(
    state,
    "screenConfiguration.preparedFinalObject.Properties[0].id"
  );
  let method = nocId ? "UPDATE" : "CREATE";
  try {
    let payload = get(
      state.screenConfiguration.preparedFinalObject,
      "FireNOCs",
      []
    );
    let tenantId = get(
      state.screenConfiguration.preparedFinalObject,
      "FireNOCs[0].fireNOCDetails.propertyDetails.address.city",
      getTenantId()
    );
    set(payload[0], "tenantId", tenantId);
    set(payload[0], "fireNOCDetails.action", status);

    // Get uploaded documents from redux
    let reduxDocuments = get(
      state,
      "screenConfiguration.preparedFinalObject.documentsUploadRedux",
      {}
    );

    handleDeletedCards(payload[0], "fireNOCDetails.buildings", "id");
    handleDeletedCards(
      payload[0],
      "fireNOCDetails.applicantDetails.owners",
      "id"
    );

    let buildings = get(payload, "[0].fireNOCDetails.buildings", []);
    buildings.forEach((building, index) => {
      // GET UOMS FOR THE SELECTED BUILDING TYPE
      let requiredUoms = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.firenoc.BuildingType",
        []
      ).filter(buildingType => {
        return buildingType.code === building.usageType;
      });
      requiredUoms = get(requiredUoms, "[0].uom", []);
      // GET UNIQUE UOMS LIST INCLUDING THE DEFAULT
      let allUoms = [
        ...new Set([
          ...requiredUoms,
          ...[
            "NO_OF_FLOORS",
            "NO_OF_BASEMENTS",
            "PLOT_SIZE",
            "BUILTUP_AREA",
            "HEIGHT_OF_BUILDING"
          ]
        ])
      ];
      let finalUoms = [];
      allUoms.forEach(uom => {
        let value = get(building.uomsMap, uom);
        value &&
          finalUoms.push({
            code: uom,
            value: parseInt(value),
            isActiveUom: requiredUoms.includes(uom) ? true : false,
            active: true
          });
      });

      // Quick fix to repair old uoms
      let oldUoms = get(
        payload[0],
        `fireNOCDetails.buildings[${index}].uoms`,
        []
      );
      oldUoms.forEach((oldUom, oldUomIndex) => {
        set(
          payload[0],
          `fireNOCDetails.buildings[${index}].uoms[${oldUomIndex}].isActiveUom`,
          false
        );
        set(
          payload[0],
          `fireNOCDetails.buildings[${index}].uoms[${oldUomIndex}].active`,
          false
        );
      });
      // End Quick Fix

      set(payload[0], `fireNOCDetails.buildings[${index}].uoms`, [
        ...finalUoms,
        ...oldUoms
      ]);

      // Set building documents
      let uploadedDocs = [];
      jp.query(reduxDocuments, "$.*").forEach(doc => {
        if (doc.documents && doc.documents.length > 0) {
          if (
            doc.documentSubCode &&
            doc.documentSubCode.startsWith("BUILDING.BUILDING_PLAN")
          ) {
            if (doc.documentCode === building.name) {
              uploadedDocs = [
                ...uploadedDocs,
                {
                  tenantId: tenantId,
                  documentType: doc.documentSubCode,
                  fileStoreId: doc.documents[0].fileStoreId
                }
              ];
            }
          }
        }
      });
      set(
        payload[0],
        `fireNOCDetails.buildings[${index}].applicationDocuments`,
        uploadedDocs
      );
    });

    // Set owners & other documents
    let ownerDocuments = [];
    let otherDocuments = [];
    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        if (doc.documentType === "OWNER") {
          ownerDocuments = [
            ...ownerDocuments,
            {
              tenantId: tenantId,
              documentType: doc.documentSubCode
                ? doc.documentSubCode
                : doc.documentCode,
              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        } else if (!doc.documentSubCode) {
          // SKIP BUILDING PLAN DOCS
          otherDocuments = [
            ...otherDocuments,
            {
              tenantId: tenantId,
              documentType: doc.documentCode,
              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        }
      }
    });

    set(
      payload[0],
      "fireNOCDetails.applicantDetails.additionalDetail.documents",
      ownerDocuments
    );
    set(
      payload[0],
      "fireNOCDetails.additionalDetail.documents",
      otherDocuments
    );

    // Set Channel and Financial Year
    process.env.REACT_APP_NAME === "Citizen"
      ? set(payload[0], "fireNOCDetails.channel", "CITIZEN")
      : set(payload[0], "fireNOCDetails.channel", "COUNTER");
    set(payload[0], "fireNOCDetails.financialYear", "2019-20");

    // Set Dates to Epoch
    let owners = get(payload[0], "fireNOCDetails.applicantDetails.owners", []);
    owners.forEach((owner, index) => {
      set(
        payload[0],
        `fireNOCDetails.applicantDetails.owners[${index}].dob`,
        convertDateToEpoch(get(owner, "dob"))
      );
    });

    let response;
    if (method === "CREATE") {
      response = await httpRequest(
        "post",
        "/firenoc-services/v1/_create",
        "",
        [],
        { FireNOCs: payload }
      );
      response = furnishNocResponse(response);
      dispatch(prepareFinalObject("FireNOCs", response.FireNOCs));
      setApplicationNumberBox(state, dispatch);
    } else if (method === "UPDATE") {
      response = await httpRequest(
        "post",
        "/firenoc-services/v1/_update",
        "",
        [],
        { FireNOCs: payload }
      );
      response = furnishNocResponse(response);
      dispatch(prepareFinalObject("FireNOCs", response.FireNOCs));
    }

    return { status: "success", message: response };
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    // Revert the changed pfo in case of request failure
    let fireNocData = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs",
      []
    );
    fireNocData = furnishNocResponse({ FireNOCs: fireNocData });
    dispatch(prepareFinalObject("FireNOCs", fireNocData.FireNOCs));

    return { status: "failure", message: error };
  }
};

export const prepareDocumentsUploadData = (state, dispatch) => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PropertyTax.Documents",
    []
  );
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
   
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "PT_MUTATION_SELECT_DOC_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const prepareDocumentsUploadRedux = (state, dispatch) => {
  const {
    documentsList,
    documentsUploadRedux = {},
    prepareFinalObject
  } = this.props;
  let index = 0;
  documentsList.forEach(docType => {
    docType.cards &&
      docType.cards.forEach(card => {
        if (card.subCards) {
          card.subCards.forEach(subCard => {
            let oldDocType = get(
              documentsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              documentsUploadRedux,
              `[${index}].documentCode`
            );
            let oldDocSubCode = get(
              documentsUploadRedux,
              `[${index}].documentSubCode`
            );
            if (
              oldDocType != docType.code ||
              oldDocCode != card.name ||
              oldDocSubCode != subCard.name
            ) {
              documentsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                documentSubCode: subCard.name
              };
            }
            index++;
          });
        } else {
          let oldDocType = get(documentsUploadRedux, `[${index}].documentType`);
          let oldDocCode = get(documentsUploadRedux, `[${index}].documentCode`);
          if (oldDocType != docType.code || oldDocCode != card.name) {
            documentsUploadRedux[index] = {
              documentType: docType.code,
              documentCode: card.name,
              isDocumentRequired: card.required,
              isDocumentTypeRequired: card.dropdown
                ? card.dropdown.required
                : false
            };
          }
        }
        index++;
      });
  });
  prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
};

export const furnishNocResponse = response => {
  // Handle applicant ownership dependent dropdowns
  let ownershipType = get(
    response,
    "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType"
  );
  set(
    response,
    "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipMajorType",
    ownershipType == undefined ? "SINGLE" : ownershipType.split(".")[0]
  );

  // Prepare UOMS and Usage Type Dropdowns in required format
  let buildings = get(response, "FireNOCs[0].fireNOCDetails.buildings", []);
  buildings.forEach((building, index) => {
    let uoms = get(building, "uoms", []);
    let uomMap = {};
    uoms.forEach(uom => {
      uomMap[uom.code] = `${uom.value}`;
    });
    set(
      response,
      `FireNOCs[0].fireNOCDetails.buildings[${index}].uomsMap`,
      uomMap
    );

    let usageType = get(building, "usageType");
    set(
      response,
      `FireNOCs[0].fireNOCDetails.buildings[${index}].usageTypeMajor`,
      usageType == undefined ? "" : usageType.split(".")[0]
    );
  });

  return response;
};

export const setApplicationNumberBox = (state, dispatch, applicationNo) => {
  if (!applicationNo) {
    applicationNo = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicationNumber",
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
export const downloadCertificateForm = (Properties,tenantId,mode='download') => {
  const queryStr = [
    { key: "key", value:"ptmutationcertificate" },
    { key: "tenantId", value: tenantId }
  ]
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Properties }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
      .then(res => {
        res.filestoreIds[0]
        if (res && res.filestoreIds && res.filestoreIds.length > 0) {
          res.filestoreIds.map(fileStoreId => {
            downloadReceiptFromFilestoreID(fileStoreId,tenantId,mode)
          })
        } else {
          console.log("Error In Acknowledgement form Download");
        }
      });
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}
export const generatePdfFromDiv = (action, applicationNumber) => {
  let target = document.querySelector("#material-ui-cardContent");
  html2canvas(target).then(canvas => {
    var data = canvas.toDataURL();
    var imgWidth = 200;
    var pageHeight = 295;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var doc = new jsPDF("p", "mm");
    var position = 0;
    doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    if (action === "download") {
      doc.save(`preview-${applicationNumber}.pdf`);
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  });
};