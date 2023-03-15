import {
  handleScreenConfigurationFieldChange as handleField, prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI, getQueryArg, setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import { getTenantId, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import {
  convertDateToEpoch,
  getCurrentFinancialYear, getTranslatedLabel,
  //updateDropDowns,
  ifUserRoleExists
} from "../ui-config/screens/specs/utils";
import store from "../ui-redux/store";
import { httpRequest } from "./api";

export const updateTradeDetails = async requestBody => {
  try {
    const payload = await httpRequest(
      "post",
      "/tl-services/v1/_update",
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

export const getSearchResults = async (dispatch, queryObject) => {
  try {
    dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "billing-service/bill/v2/_search",
      "",
      queryObject,
      {}
    );
    dispatch(toggleSpinner());
    return response;
  } catch (error) {
    dispatch(toggleSpinner());
    console.error(error);
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getPaymentSearchResults = async (queryObject, dispatch) => {
  try {
    let businessService = '';
    queryObject && Array.isArray(queryObject) && queryObject.map(query => {
      if (query.key == "businessService") {
        businessService = query.value;
      }
    })
    queryObject = queryObject && Array.isArray(queryObject) && queryObject.filter(query => query.key != "businessService")
    const response = await httpRequest(
      "post",
      getPaymentSearchAPI(businessService),
      "",
      queryObject
    );

    return response;
  } catch (error) {
    // enableFieldAndHideSpinner('search',"components.div.children.UCSearchCard.children.cardContent.children.buttonContainer.children.searchButton",dispatch);
    console.error(error);
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};
export const getGroupBillSearch = async (dispatch, searchScreenObject) => {
  try {
    dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      searchScreenObject.url,
      "",
      [],
      { searchCriteria: searchScreenObject }
    );
    dispatch(toggleSpinner());
    return response;
  } catch (error) {
    dispatch(toggleSpinner());
    console.error(error);
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getBulkPdfRecords = async (dispatch, queryObject=[]) => {
  try {
    dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "pdf-service/v1/_getBulkPdfRecordsDetails",
      "",
      queryObject,
      {  }
    );
    dispatch(toggleSpinner());
    return response;
  } catch (error) {
    dispatch(toggleSpinner());
    console.error(error);
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

const setDocsForEditFlow = async (state, dispatch) => {
  const applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.applicationDocuments",
    []
  );
  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                fileUrlPayload[item.fileStoreId]
                  .split(",")[0]
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
};

export const getBoundaryData = async (
  action,
  state,
  dispatch,
  queryObject,
  tenantId
  // componentPath
) => {
  try {
    let payload = await httpRequest(
      "post",
      "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
      "_search",
      queryObject,
      {}
    );
    // process.env.REACT_APP_NAME === "Employee"
    //   ? get(
    //       state.screenConfiguration.preparedFinalObject,
    //       "Licenses[0].tradeLicenseDetail.address.city"
    //     )
    //   : getQueryArg(window.location.href, "tenantId");
    const mohallaData =
      payload &&
      payload.TenantBoundary[0] &&
      payload.TenantBoundary[0].boundary &&
      payload.TenantBoundary[0].boundary.reduce((result, item) => {
        result.push({
          ...item,
          name: `${tenantId
            .toUpperCase()
            .replace(/[.]/g, "_")}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`
        });
        return result;
      }, []);

    dispatch(
      prepareFinalObject("searchScreenMdmsData.localities", mohallaData)
    );
  } catch (e) {
  }
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

const getMultiUnits = multiUnits => {
  let hasTradeType = false;
  let hasAccessoryType = false;

  let mergedUnits =
    multiUnits &&
    multiUnits.reduce((result, item) => {
      hasTradeType = item.hasOwnProperty("tradeType");
      hasAccessoryType = item.hasOwnProperty("accessoryCategory");
      if (item && item !== null && (hasTradeType || hasAccessoryType)) {
        if (item.hasOwnProperty("id")) {
          if (item.hasOwnProperty("active") && item.active) {
            if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
              set(item, "active", false);
              result.push(item);
            } else {
              result.push(item);
            }
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedUnits;
};

// const getMultipleAccessories = licenses => {
//   let accessories = get(licenses, "tradeLicenseDetail.accessories");
//   let mergedAccessories =
//     accessories &&
//     accessories.reduce((result, item) => {
//       if (item && item !== null && item.hasOwnProperty("accessoryCategory")) {
//         if (item.hasOwnProperty("id")) {
//           if (item.hasOwnProperty("active") && item.active) {
//             if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
//               set(item, "active", false);
//               result.push(item);
//             } else {
//               result.push(item);
//             }
//           }
//         } else {
//           if (!item.hasOwnProperty("isDeleted")) {
//             result.push(item);
//           }
//         }
//       }
//       return result;
//     }, []);

//   return mergedAccessories;
// };

const getMultipleOwners = owners => {
  let mergedOwners =
    owners &&
    owners.reduce((result, item) => {
      if (item && item !== null && item.hasOwnProperty("mobileNumber")) {
        if (item.hasOwnProperty("active") && item.active) {
          if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
            set(item, "active", false);
            result.push(item);
          } else {
            result.push(item);
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedOwners;
};

export const applyTradeLicense = async (state, dispatch, activeIndex) => {
  try {
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
    set(queryObject[0], "wfDocuments", documents);
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
    let owners = get(queryObject[0], "tradeLicenseDetail.owners");
    owners = (owners && convertOwnerDobToEpoch(owners)) || [];

    //set(queryObject[0], "tradeLicenseDetail.owners", getMultipleOwners(owners));
    const cityId = get(
      queryObject[0],
      "tradeLicenseDetail.address.tenantId",
      ""
    );
    const tenantId = ifUserRoleExists("CITIZEN") ? cityId : getTenantId();
    const BSqueryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessService", value: "newTL" }
    ];
    if (process.env.REACT_APP_NAME === "Citizen") {
      let currentFinancialYr = getCurrentFinancialYear();
      //Changing the format of FY
      let fY1 = currentFinancialYr.split("-")[1];
      fY1 = fY1.substring(2, 4);
      currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
      set(queryObject[0], "financialYear", currentFinancialYr);
      setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
    }

    set(queryObject[0], "tenantId", tenantId);

    if (queryObject[0].applicationNumber) {
      //call update

      let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      set(
        queryObject[0],
        "tradeLicenseDetail.tradeUnits",
        getMultiUnits(tradeUnits)
      );
      set(
        queryObject[0],
        "tradeLicenseDetail.accessories",
        getMultiUnits(accessories)
      );
      set(
        queryObject[0],
        "tradeLicenseDetail.owners",
        getMultipleOwners(owners)
      );

      let action = "INITIATE";
      if (
        queryObject[0].tradeLicenseDetail &&
        queryObject[0].tradeLicenseDetail.applicationDocuments
      ) {
        if (getQueryArg(window.location.href, "action") === "edit") {
          // const removedDocs = get(
          //   state.screenConfiguration.preparedFinalObject,
          //   "LicensesTemp[0].removedDocs",
          //   []
          // );
          // set(queryObject[0], "tradeLicenseDetail.applicationDocuments", [
          //   ...get(
          //     state.screenConfiguration.prepareFinalObject,
          //     "Licenses[0].tradeLicenseDetail.applicationDocuments",
          //     []
          //   ),
          //   ...removedDocs
          // ]);
        } else if (activeIndex === 1) {
          alert("active index 1");

          set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
        } else action = "APPLY";
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
      set(queryObject[0], "action", action);
      const isEditFlow = getQueryArg(window.location.href, "action") === "edit";
      !isEditFlow &&
        (await httpRequest("post", "/tl-services/v1/_update", "", [], {
          Licenses: queryObject
        }));
      let searchQueryObject = [
        { key: "tenantId", value: queryObject[0].tenantId },
        { key: "applicationNumber", value: queryObject[0].applicationNumber }
      ];
      let searchResponse = await getSearchResults(searchQueryObject);
      if (isEditFlow) {
        searchResponse = { Licenses: queryObject };
      } else {
        dispatch(prepareFinalObject("Licenses", searchResponse.Licenses));
      }
      const updatedtradeUnits = get(
        searchResponse,
        "Licenses[0].tradeLicenseDetail.tradeUnits"
      );
      const tradeTemp = updatedtradeUnits.map((item, index) => {
        return {
          tradeSubType: item.tradeType.split(".")[1],
          tradeType: item.tradeType.split(".")[0]
        };
      });
      dispatch(prepareFinalObject("LicensesTemp.tradeUnits", tradeTemp));
      createOwnersBackup(dispatch, searchResponse);
    } else {
      let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      // let owners = get(queryObject[0], "tradeLicenseDetail.owners");
      let mergedTradeUnits =
        tradeUnits &&
        tradeUnits.filter(item => !item.hasOwnProperty("isDeleted"));
      let mergedAccessories =
        accessories &&
        accessories.filter(item => !item.hasOwnProperty("isDeleted"));
      let mergedOwners =
        owners && owners.filter(item => !item.hasOwnProperty("isDeleted"));

      set(queryObject[0], "tradeLicenseDetail.tradeUnits", mergedTradeUnits);
      set(queryObject[0], "tradeLicenseDetail.accessories", mergedAccessories);
      set(queryObject[0], "tradeLicenseDetail.owners", mergedOwners);
      set(queryObject[0], "action", "INITIATE");
      //Emptying application docs to "INITIATE" form in case of search and fill from old TL Id.
      if (!queryObject[0].applicationNumber)
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
      const response = await httpRequest(
        "post",
        "/tl-services/v1/_create",
        "",
        [],
        { Licenses: queryObject }
      );
      dispatch(prepareFinalObject("Licenses", response.Licenses));
      createOwnersBackup(dispatch, response);
    }
    /** Application no. box setting */
    setApplicationNumberBox(state, dispatch);
    return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
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
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

const setApplicationNumberBox = (state, dispatch) => {
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].applicationNumber",
    null
  );
  if (applicationNumber) {
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
        applicationNumber
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

export const getSearchResultsForCurrentBill = async (queryObject, filter = false) => {
  try {
      const response = await httpRequest(
          "post",
          "/ws-services/wc/_search",
          "_search",
          queryObject
      );
      if (response.WaterConnection && response.WaterConnection.length == 0) {
          return response;
      }
      let currentTime = new Date().getTime();
      if (filter) {
          response.WaterConnection = response.WaterConnection.filter(app => currentTime > app.dateEffectiveFrom && (app.applicationStatus == 'APPROVED' || app.applicationStatus == 'CONNECTION_ACTIVATED'));
          response.WaterConnection = response.WaterConnection.sort((row1, row2) => row2.auditDetails.createdTime - row1.auditDetails.createdTime);
      }

      let result = findAndReplace(response, null, "NA");
      result.WaterConnection[0].waterSourceSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource;
      let waterSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[0];
      let waterSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[1];
      result.WaterConnection[0].waterSource = waterSource;
      result.WaterConnection[0].waterSubSource = waterSubSource;
      result.WaterConnection = await getPropertyObj(result.WaterConnection);
      return result;
  } catch (error) {  }
};

export const getSearchResultsForSewerage = async (queryObject, dispatch, filter = false) => {
  dispatch(toggleSpinner());
  try {
      const response = await httpRequest(
          "post",
          "/sw-services/swc/_search",
          "_search",
          queryObject
      );
      if (response.SewerageConnections && response.SewerageConnections.length == 0) {
          dispatch(toggleSpinner());
          return response;
      }
      let currentTime = new Date().getTime();
      if (filter) {
          response.SewerageConnections = response.SewerageConnections.filter(app => currentTime > app.dateEffectiveFrom && (app.applicationStatus == 'APPROVED' || app.applicationStatus == 'CONNECTION_ACTIVATED'));
          response.SewerageConnections = response.SewerageConnections.sort((row1, row2) => row2.auditDetails.createdTime - row1.auditDetails.createdTime);
      }
      let result = findAndReplace(response, null, "NA");
      result.SewerageConnections = await getPropertyObj(result.SewerageConnections);
      dispatch(toggleSpinner());
      return result;
  } catch (error) {
      dispatch(toggleSpinner());
  }
};

export const fetchBill = async (queryObject, dispatch,replaceWithNA=true) => {
  dispatch(toggleSpinner());
  try {
      const response = await httpRequest(
          "post",
          "/billing-service/bill/v2/_fetchbill",
          "_fetchBill",
          queryObject
      );
      dispatch(toggleSpinner());
      if(!replaceWithNA){
        return response;
      }
      return findAndReplace(response, null, "NA");
  } catch (error) {
      dispatch(toggleSpinner());
      store.dispatch(
        toggleSnackbar(
          true, { labelName: error.message, labelCode: error.message },
          "error"
        )
      );
  }
};

export const getDescriptionFromMDMS = async (requestBody, dispatch) => {
  dispatch(toggleSpinner());
  try {
      const response = await httpRequest(
          "post",
          "/egov-mdms-service/v1/_search",
          "_search", [],
          requestBody
      );
      dispatch(toggleSpinner());
      return findAndReplace(response, null, "NA");
  } catch (error) {
      dispatch(toggleSpinner());
      store.dispatch(
          toggleSnackbar(
              true, { labelName: error.message, labelCode: error.message },
              "error"
          )
      );
  }
};

export const getConsumptionDetails = async (queryObject, dispatch) => {
  dispatch(toggleSpinner());
  try {
      const response = await httpRequest(
          "post",
          "/ws-calculator/meterConnection/_search",
          "_search",
          queryObject
      );
      dispatch(toggleSpinner());
      return findAndReplace(response, null, "NA");
  } catch (error) {
      dispatch(toggleSpinner());
      store.dispatch(
          toggleSnackbar(
              true, { labelName: error.message, labelCode: error.message },
              "error"
          )
      );
  }
};

export const serviceConst = {
  "WATER": "WATER",
  "SEWERAGE": "SEWERAGE"
}

export const findAndReplace = (obj, oldValue, newValue) => {
  Object.keys(obj).forEach(key => {
      if ((obj[key] instanceof Object) || (obj[key] instanceof Array)) findAndReplace(obj[key], oldValue, newValue)
      obj[key] = obj[key] === oldValue ? newValue : obj[key]
  })
  return obj
}

export const getPropertyObj = async (waterConnection, locality, tenantId, isFromSearch) => {
  let uuidsArray = [];
  let uuids = "";
  let propertyArr = [];
  for (var i = 0; i < waterConnection.length; i++) {
      if (waterConnection[i].propertyId && waterConnection[i].propertyId !== null && waterConnection[i].propertyId !== "NA") {
          if (!uuidsArray.includes(waterConnection[i]['propertyId'])) {
              uuidsArray.push(waterConnection[i]['propertyId']);
              uuids += waterConnection[i]['propertyId'] + ",";
          }
          if (uuidsArray.length % 50 === 0 || (uuidsArray.length > 0 && i === (waterConnection.length - 1))) {
              let queryObject1 = [];
              uuids = uuids.substring(0, uuids.length - 1);
              if (process.env.REACT_APP_NAME === "Citizen") {
                  queryObject1 = [{ key: "propertyIds", value: uuids }];
              } else {
                  queryObject1 = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "propertyIds", value: uuids }];
              }

              if(locality) {
                  queryObject1.push({key: "locality", value: locality})
              }
              if(tenantId) {
                  queryObject1.push({key: "tenantId", value: tenantId})
              }
              if (!window.location.href.includes("propertyId") || isFromSearch) {
                  let payload = await getPropertyResultsWODispatch(queryObject1);
                  if (payload.Properties.length > 0) {
                      for (var j = 0; j < payload.Properties.length; j++) {
                          propertyArr[payload.Properties[j].propertyId] = payload.Properties[j]
                      }
                  }
              }
              uuids = "";
              uuidsArray = [];
          }
      } else {
          waterConnection[i].property = null;
      }
  }
  let tempPropertyObj = null
  if (Object.keys(propertyArr).length > 0) {
      for (var i = 0; i < waterConnection.length; i++) {
          if (waterConnection[i].propertyId && waterConnection[i].propertyId !== null && waterConnection[i].propertyId !== "NA") {
              if (propertyArr[waterConnection[i].propertyId]) {
                  tempPropertyObj = (propertyArr[waterConnection[i].propertyId]) ? propertyArr[waterConnection[i].propertyId] : null
                  waterConnection[i].property = tempPropertyObj;
                  waterConnection[i].tenantId = (tempPropertyObj && tempPropertyObj.tenantId) ? tempPropertyObj.tenantId : null;
                  tempPropertyObj = null;
              }
          }
      }
  }
  if(get(waterConnection[0], "property.owners")) {
      waterConnection[0].property.owners = waterConnection[0].property.owners.filter(owner => owner.status == "ACTIVE");
  }
  if(get(waterConnection[0], "property.units") == "NA" && get(waterConnection[0], "property.additionalDetails") && get(waterConnection[0], "property.additionalDetails.subUsageCategory")) {
      waterConnection[0].property.units = [];
      waterConnection[0].property.units.push({usageCategory: get(waterConnection[0], "property.additionalDetails.subUsageCategory")})
    } 
  return waterConnection;
}

export const getPropertyResultsWODispatch = async (queryObject) => {
  try {
      const response = await httpRequest(
          "post",
          "/property-services/property/_search",
          "_search",
          queryObject
      );
      return findAndReplace(response, null, "NA");
  } catch (error) {
  }

};