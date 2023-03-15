import commonConfig from "config/common.js";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  getFileUrlFromAPI,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import {
  downloadPdf,
  getPaymentSearchAPI,
  openPdf,
  printPdf
} from "egov-ui-kit/utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  searchAndDownloadPdf,
  searchAndPrintPdf
} from "egov-ui-kit/utils/pdfUtils/generatePDF";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { getTranslatedLabel } from "../ui-config/screens/specs/utils";

const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter((element) => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map((element) => {
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
      "/firenoc-services/v1/_search",
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

export const createUpdateNocApplication = async (state, dispatch, status) => {
  let nocId = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].id"
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
      ).filter((buildingType) => {
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
            "HEIGHT_OF_BUILDING",
          ],
        ]),
      ];
      let finalUoms = [];
      allUoms.forEach((uom) => {
        let value = get(building.uomsMap, uom);
        value &&
          finalUoms.push({
            code: uom,
            value: parseInt(value),
            isActiveUom: requiredUoms.includes(uom) ? true : false,
            active: true,
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
        ...oldUoms,
      ]);

      // Set building documents
      let uploadedDocs = [];
      jp.query(reduxDocuments, "$.*").forEach((doc) => {
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
                  fileStoreId: doc.documents[0].fileStoreId,
                },
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
    jp.query(reduxDocuments, "$.*").forEach((doc) => {
      if (doc.documents && doc.documents.length > 0) {
        if (doc.documentType === "OWNER") {
          ownerDocuments = [
            ...ownerDocuments,
            {
              tenantId: tenantId,
              documentType: doc.documentSubCode
                ? doc.documentSubCode
                : doc.documentCode,
              fileStoreId: doc.documents[0].fileStoreId,
            },
          ];
        } else if (!doc.documentSubCode) {
          // SKIP BUILDING PLAN DOCS
          otherDocuments = [
            ...otherDocuments,
            {
              tenantId: tenantId,
              documentType: doc.documentCode,
              fileStoreId: doc.documents[0].fileStoreId,
            },
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
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.FireNoc.Documents",
    []
  );
  documents = documents.filter((item) => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach((doc) => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach((doc) => {
    // Handle the case for multiple muildings
    if (
      doc.code === "BUILDING.BUILDING_PLAN" &&
      doc.hasMultipleRows &&
      doc.options
    ) {
      let buildingsData = get(
        state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach((building) => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach((subDoc) => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    } else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter((item) => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map((item) => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach((key) => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const prepareDocumentsUploadRedux = (state, dispatch) => {
  const {
    documentsList,
    documentsUploadRedux = {},
    prepareFinalObject,
  } = this.props;
  let index = 0;
  documentsList.forEach((docType) => {
    docType.cards &&
      docType.cards.forEach((card) => {
        if (card.subCards) {
          card.subCards.forEach((subCard) => {
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
                documentSubCode: subCard.name,
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
                : false,
            };
          }
        }
        index++;
      });
  });
  prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
};

export const furnishNocResponse = (response) => {
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
    uoms.forEach((uom) => {
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

export const downloadReceiptFromFilestoreID = (
  fileStoreId,
  mode,
  tenantId,
  showConfirmation = false
) => {
  getFileUrlFromAPI(fileStoreId, tenantId).then(async (fileRes) => {
    if (fileRes && !fileRes[fileStoreId]) {
      console.error("ERROR IN DOWNLOADING RECEIPT");
      return;
    }
    if (mode === "download") {
      if (
        localStorage.getItem("pay-channel") &&
        localStorage.getItem("pay-redirectNumber")
      ) {
        setTimeout(() => {
          const weblink =
            "https://api.whatsapp.com/send?phone=" +
            localStorage.getItem("pay-redirectNumber") +
            "&text=" +
            ``;
          window.location.href = weblink;
        }, 1500);
      }
      downloadPdf(fileRes[fileStoreId]);
      if (showConfirmation) {
        if (
          localStorage.getItem("receipt-channel") == "whatsapp" &&
          localStorage.getItem("receipt-redirectNumber") != ""
        ) {
          setTimeout(() => {
            const weblink =
              "https://api.whatsapp.com/send?phone=" +
              localStorage.getItem("receipt-redirectNumber") +
              "&text=" +
              ``;
            window.location.href = weblink;
          }, 1500);
        }
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Success in Receipt Generation",
              labelKey: "SUCCESS_IN_GENERATION_RECEIPT",
            },
            "success"
          )
        );
      }
    } else if (mode === "open") {
      if (
        localStorage.getItem("pay-channel") &&
        localStorage.getItem("pay-redirectNumber")
      ) {
        setTimeout(() => {
          const weblink =
            "https://api.whatsapp.com/send?phone=" +
            localStorage.getItem("pay-redirectNumber") +
            "&text=" +
            ``;
          window.location.href = weblink;
        }, 1500);
      }
      openPdf(fileRes[fileStoreId], "_self");
      if (showConfirmation) {
        if (
          localStorage.getItem("receipt-channel") == "whatsapp" &&
          localStorage.getItem("receipt-redirectNumber") != ""
        ) {
          setTimeout(() => {
            const weblink =
              "https://api.whatsapp.com/send?phone=" +
              localStorage.getItem("receipt-redirectNumber") +
              "&text=" +
              ``;
            window.location.href = weblink;
          }, 1500);
        }
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Success in Receipt Generation",
              labelKey: "SUCCESS_IN_GENERATION_RECEIPT",
            },
            "success"
          )
        );
      }
    } else {
      printPdf(fileRes[fileStoreId]);
    }
  });
};

/*  Download version with pdf service  */
/* export const download = (receiptQueryString, mode = "download", configKey = "consolidatedreceipt", state,showConfirmation=false) => {
  if (state && process.env.REACT_APP_NAME === "Citizen" && configKey === "consolidatedreceipt") {
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");
    configKey = get(uiCommonPayConfig, "receiptKey", "consolidatedreceipt")
  }

  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  let businessService = '';
  receiptQueryString && Array.isArray(receiptQueryString) && receiptQueryString.map(query => {
    if (query.key == "businessService") {
      businessService = query.value;
    }
  })
  receiptQueryString = receiptQueryString && Array.isArray(receiptQueryString) && receiptQueryString.filter(query => query.key != "businessService")
  try {
    httpRequest("post", getPaymentSearchAPI(businessService), "_search", receiptQueryString).then((payloadReceiptDetails) => {
      const queryStr = [
        { key: "key", value: configKey },
        { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
      ]
      if (payloadReceiptDetails && payloadReceiptDetails.Payments && payloadReceiptDetails.Payments.length == 0) {
        console.log("Could not find any receipts");
        store.dispatch(toggleSnackbar(true, { labelName: "Receipt not Found", labelKey: "ERR_RECEIPT_NOT_FOUND" }
          , "error"));
        return;
      }
      // Setting the Payer and mobile from Bill to reflect it in PDF
      state = state ? state : {};
      let billDetails = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]", null);
      if ((billDetails && !billDetails.payerName) || !billDetails) {
        billDetails = {
          payerName: get(state, "screenConfiguration.preparedFinalObject.applicationDataForReceipt.owners[0].name", null) || get(state, "screenConfiguration.preparedFinalObject.applicationDataForPdf.owners[0].name", null),
          mobileNumber: get(state, "screenConfiguration.preparedFinalObject.applicationDataForReceipt.owners[0].mobile", null) || get(state, "screenConfiguration.preparedFinalObject.applicationDataForPdf.owners[0].mobile", null),
        };
      }
      if (!payloadReceiptDetails.Payments[0].payerName && process.env.REACT_APP_NAME === "Citizen" && billDetails) {
        payloadReceiptDetails.Payments[0].payerName = billDetails.payerName;
        // payloadReceiptDetails.Payments[0].paidBy = billDetails.payer;
        payloadReceiptDetails.Payments[0].mobileNumber = billDetails.mobileNumber;
      }

      const oldFileStoreId = get(payloadReceiptDetails.Payments[0], "fileStoreId")
      if (oldFileStoreId) {
        downloadReceiptFromFilestoreID(oldFileStoreId, mode,undefined,showConfirmation)
      }
      else {
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Payments: payloadReceiptDetails.Payments }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode,undefined,showConfirmation)
              })
            } else {
              console.log('Some Error Occured while downloading Receipt!');
              store.dispatch(toggleSnackbar(true, { labelName: "Error in Receipt Generation", labelKey: "ERR_IN_GENERATION_RECEIPT" }
                , "error"));
            }
          });
      }
    })
  } catch (exception) {
    console.log('Some Error Occured while downloading Receipt!');
    store.dispatch(toggleSnackbar(true, { labelName: "Error in Receipt Generation", labelKey: "ERR_IN_GENERATION_RECEIPT" }
      , "error"));
  }
} */

/*  Download version with egov-pdf service  */
export const download = (
  receiptQueryString,
  mode = "download",
  configKey = "consolidatedreceipt",
  pdfModule = "PAYMENT",
  state,
  showConfirmation = false
) => {
  if (
    state &&
    process.env.REACT_APP_NAME === "Citizen" &&
    configKey === "consolidatedreceipt"
  ) {
    const uiCommonPayConfig = get(
      state.screenConfiguration.preparedFinalObject,
      "commonPayInfo"
    );
    configKey = get(uiCommonPayConfig, "receiptKey", "consolidatedreceipt");
  }
  let onSuccess = () => {
    console.info("Success in Receipt Generation");
  };

  try {
    let businessService = "";
    receiptQueryString &&
      Array.isArray(receiptQueryString) &&
      receiptQueryString.map((query) => {
        if (query.key == "businessService") {
          businessService = query.value;
        }
      });
    receiptQueryString =
      receiptQueryString &&
      Array.isArray(receiptQueryString) &&
      receiptQueryString.filter((query) => query.key != "businessService");
    httpRequest(
      "post",
      getPaymentSearchAPI(businessService),
      "_search",
      receiptQueryString
    ).then((payloadReceiptDetails) => {
      if (showConfirmation) {
        onSuccess = () => {
          console.info("Success in Receipt Generation");
          if (
            localStorage.getItem("receipt-channel") == "whatsapp" &&
            localStorage.getItem("receipt-redirectNumber") != ""
          ) {
            setTimeout(() => {
              const weblink =
                "https://api.whatsapp.com/send?phone=" +
                localStorage.getItem("receipt-redirectNumber") +
                "&text=" +
                ``;
              window.location.href = weblink;
            }, 1500);
          }
          store.dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Success in Receipt Generation",
                labelKey: "SUCCESS_IN_GENERATION_RECEIPT",
              },
              "success"
            )
          );
        };
      }

      if (
        payloadReceiptDetails &&
        payloadReceiptDetails.Payments &&
        payloadReceiptDetails.Payments.length == 0
      ) {
        console.log("Could not find any receipts");
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Receipt not Found",
              labelKey: "ERR_RECEIPT_NOT_FOUND",
            },
            "error"
          )
        );
        return;
      }
      const queryStr = [
        {
          key: "consumerCode",
          value: get(
            payloadReceiptDetails,
            "Payments[0].paymentDetails[0].bill.consumerCode"
          ),
        },
        {
          key: "bussinessService",
          value: get(
            payloadReceiptDetails,
            "Payments[0].paymentDetails[0].businessService"
          ),
        },
        {
          key: "tenantId",
          value: get(
            payloadReceiptDetails,
            "Payments[0].paymentDetails[0].tenantId"
          ),
        },
      ];
      mode == "download"
        ? downloadConReceipt(
            queryStr,
            configKey,
            pdfModule,
            `RECEIPT-${get(
              payloadReceiptDetails,
              "Payments[0].paymentDetails[0].receiptNumber"
            )}.pdf`,
            onSuccess
          )
        : mode == "open"?downloadConReceipt(
          queryStr,
          configKey,
          pdfModule,
          `RECEIPT-${get(
            payloadReceiptDetails,
            "Payments[0].paymentDetails[0].receiptNumber"
          )}.pdf`,
          onSuccess
        ):printConReceipt(queryStr, configKey, pdfModule);
    });
  } catch (exception) {
    console.log("Some Error Occured while downloading Receipt!");
    store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Error in Receipt Generation",
          labelKey: "ERR_IN_GENERATION_RECEIPT",
        },
        "error"
      )
    );
  }
};

export const downloadBill = async (
  consumerCode,
  tenantId,
  configKey = "consolidatedbill",
  url = "egov-searcher/bill-genie/billswithaddranduser/_get"
) => {
  const searchCriteria = {
    consumerCode,
    tenantId,
  };
  const FETCHBILL = {
    GET: {
      URL: url,
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
    const billResponse = await httpRequest(
      "post",
      FETCHBILL.GET.URL,
      FETCHBILL.GET.ACTION,
      [],
      { searchCriteria }
    );
    const oldFileStoreId = get(billResponse.Bills[0], "fileStoreId");
    if (oldFileStoreId) {
      downloadReceiptFromFilestoreID(oldFileStoreId, "download");
    } else {
      const queryStr = [
        { key: "key", value: configKey },
        { key: "tenantId", value: commonConfig.tenantId },
      ];
      const pfResponse = await httpRequest(
        "post",
        DOWNLOADRECEIPT.GET.URL,
        DOWNLOADRECEIPT.GET.ACTION,
        queryStr,
        { Bill: billResponse.Bills },
        { Accept: "application/pdf" },
        { responseType: "arraybuffer" }
      );
      downloadReceiptFromFilestoreID(pfResponse.filestoreIds[0], "download");
    }
  } catch (error) {
    console.log(error);
  }
};

export const downloadMultipleBill = async (bills = [], configKey) => {
  try {
    const DOWNLOADRECEIPT = {
      GET: {
        URL: "/pdf-service/v1/_create",
        ACTION: "_get",
      },
    };
    const queryStr = [
      { key: "key", value: configKey },
      { key: "tenantId", value: commonConfig.tenantId },
    ];
    const pfResponse = await httpRequest(
      "post",
      DOWNLOADRECEIPT.GET.URL,
      DOWNLOADRECEIPT.GET.ACTION,
      queryStr,
      { Bill: bills },
      { Accept: "application/pdf" },
      { responseType: "arraybuffer" }
    );
    downloadMultipleFileFromFilestoreIds(pfResponse.filestoreIds,"download",commonConfig.tenantId)
  } catch (error) {
    console.log(error);
  }
};

export const downloadMultipleFileFromFilestoreIds = (
  fileStoreIds = [],
  mode,
  tenantId
) => {
  getFileUrlFromAPI(fileStoreIds.join(","), tenantId).then(async (fileRes) => {
    fileStoreIds.map((fileStoreId) => {
      if (mode === "download") {
        downloadPdf(fileRes[fileStoreId]);
      } else if (mode === "open") {
        openPdf(fileRes[fileStoreId], "_self");
      } else {
        printPdf(fileRes[fileStoreId]);
      }
    });
  });
};

export const downloadChallan = async (queryStr, mode = "download") => {
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/egov-pdf/download/UC/mcollect-challan",
      ACTION: "_get",
    },
  };
  try {
    httpRequest(
      "post",
      DOWNLOADRECEIPT.GET.URL,
      DOWNLOADRECEIPT.GET.ACTION,
      queryStr,
      {
        Accept: commonConfig.singleInstance ? "application/pdf,application/json" : "application/json",
      },
      { responseType: "arraybuffer" }
    ).then((res) => {
      res.filestoreIds[0];
      if (res && res.filestoreIds && res.filestoreIds.length > 0) {
        res.filestoreIds.map((fileStoreId) => {
          downloadReceiptFromFilestoreID(fileStoreId, mode);
        });
      } else {
        console.log("Error In Acknowledgement form Download");
      }
    });
  } catch (exception) {
    alert("Some Error Occured while downloading Acknowledgement form!");
  }
};

export const downloadConReceipt = (
  queryObj,
  receiptKey = "consolidatedreceipt",
  pdfModule = "PAYMENT",
  fileName,
  onSuccess
) => {
  queryObj && queryObj.push({ key: "pdfKey", value: receiptKey });
  pdfModule = "PAYMENT"; // Temporary fix to download receipts from common pays
  receiptKey = pdfModule == "PAYMENT" ? "consolidatedreceipt" : receiptKey;
  searchAndDownloadPdf(
    `/egov-pdf/download/${pdfModule}/${receiptKey}`,
    queryObj,
    fileName,
    onSuccess
  );
};

export const printConReceipt = (
  queryObj,
  receiptKey = "consolidatedreceipt",
  pdfModule = "PAYMENT"
) => {
  queryObj && queryObj.push({ key: "pdfKey", value: receiptKey });
  pdfModule = "PAYMENT";
  receiptKey = pdfModule == "PAYMENT" ? "consolidatedreceipt" : receiptKey;
  searchAndPrintPdf(`/egov-pdf/download/${pdfModule}/${receiptKey}`, queryObj);
};
