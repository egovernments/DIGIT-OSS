import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale, transformById } from "egov-ui-framework/ui-utils/commons";
import { getLocalization, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getSearchResults,getChallanSearchResult } from "../../../../../ui-utils/commons";
import { convertDateToEpoch, convertEpochToDate, getTextToLocalMapping, validateFields } from "../../utils";

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));
const transfomedKeys = transformById(localizationLabels, "code");
const tenantId = getTenantId();
import {
 
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const searchApiCall = async (state, dispatch) => {
  
  showHideReceiptTable(false, dispatch);
  let queryObject = [];
  
   queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "offset", value: "0" }
  ];



  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "ucSearchScreen",
    {}
  );

  
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.UCSearchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!isSearchBoxFirstRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "UC_SEARCH_SELECT_AT_LEAST_VALID_FIELD"
        },
        "warning"
      )
    );
  }
  else if (
    Object.keys(searchScreenObject).length == 0 ||
    checkEmptyFields(searchScreenObject)
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "UC_SEARCH_SELECT_AT_LEAST_VALID_FIELD"
        },
        "warning"
      )
    );
  }
  else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && key === "businessServices" && searchScreenObject['businessServices'] != null) {
        queryObject.push({ key: key, value: searchScreenObject[key] });
      } else if (
        searchScreenObject.hasOwnProperty(key) && searchScreenObject[key] &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "daystart")
          });
        } else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "dayend")
          });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }


    const responseFromAPI = await getSearchResults(queryObject);
    dispatch(prepareFinalObject("receiptSearchResponse", responseFromAPI));
    const Payments = (responseFromAPI && responseFromAPI.Payments) || [];
    const response = [];
    for (let i = 0; i < Payments.length; i++) {
      const serviceTypeLabel = getTransformedLocale(
        get(Payments[i], `paymentDetails[0].bill.businessService`)
      );
      response[i] = {
        receiptNumber: get(Payments[i], `paymentDetails[0].receiptNumber`),
        consumerCode:get(Payments[i],`paymentDetails[0].bill.consumerCode`),
        payeeName: get(Payments[i], `paidBy`), // Changed by DC
        serviceType: serviceTypeLabel,
        receiptdate: get(Payments[i], `paymentDetails[0].receiptDate`),
        amount: get(Payments[i], `paymentDetails[0].totalAmountPaid`),
        status: get(Payments[i], `paymentDetails[0].bill.status`),
        businessService: get(Payments[i], `paymentDetails[0].bill.businessService`),
        tenantId: get(Payments[i], `tenantId`),
      };
    }
    const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.uiCommonConfig");
    try {      
      let data = response.map(item => ({
        ['UC_COMMON_TABLE_COL_RECEIPT_NO']: item.receiptNumber || "-",
        ['UC_COMMON_TABLE_COL_CONSUMERCODE']:item.consumerCode || "-",
        ['UC_COMMON_TABLE_COL_PAYEE_NAME']: item.payeeName || "-",
        ['UC_SERVICE_TYPE_LABEL']: getTextToLocalMapping(`BILLINGSERVICE_BUSINESSSERVICE_${item.serviceType}`) || "-",
        ['UC_COMMON_TABLE_COL_DATE']: convertEpochToDate(item.receiptdate) || "-",
        ['UC_COMMON_TABLE_COL_AMOUNT']: item.amount || "-",
        ['UC_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ["RECEIPT_KEY"]: get(uiConfigs.filter(item => item.code === item.businessService), "0.receiptKey", "consolidatedreceipt"),
        ["TENANT_ID"]: item.tenantId || "-",
        ["SERVICE"]:item.businessService
      }));
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.rows",
          data.length
        )
      );

      dispatch(
        handleField("search", "components.div.children.searchResults")
      );
      showHideReceiptTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
    // } else {
    //   dispatch(
    //     toggleSnackbar(
    //       true,
    //       {
    //         labelName:
    //           "Please fill atleast one more field apart from service category !",
    //         labelKey: "ERR_FILL_ONE_MORE_SEARCH_FIELD"
    //       },
    //       "warning"
    //     )
    //   );
    // }
  }
};
export const searchChallanApiCall = async(state,dispatch)=>{
  
  showHideTable(false, dispatch);
  let queryObject = [];
   queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "offset", value: "0" }
  ];
  let challanSearchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "challanSearchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.SearchChallanCard.children.cardContent.children.searchContainer.children",
     state,
    dispatch,
    "searchChallan" //screen name
  );
 
  if (!isSearchBoxFirstRowValid) {
   
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "UC_SEARCH_SELECT_AT_LEAST_VALID_FIELD"
        },
        "warning"
      )
    );
  }
  else if (
    Object.keys(challanSearchScreenObject).length == 0 ||
    checkSearchChallanEmptyFields(challanSearchScreenObject)
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "UC_SEARCH_SELECT_AT_LEAST_VALID_FIELD"
        },
        "warning"
      )
    );
  }
  else {
    for (var key in challanSearchScreenObject) {
      if (challanSearchScreenObject.hasOwnProperty(key) && key === "businessService" && challanSearchScreenObject['businessService'] != "") {
        queryObject.push({ key: key, value: challanSearchScreenObject[key] });
      } else if (
        challanSearchScreenObject.hasOwnProperty(key) && challanSearchScreenObject[key] &&
        challanSearchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(challanSearchScreenObject[key], "daystart")
          });
        } else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(challanSearchScreenObject[key], "dayend")
          });
        } else {
          queryObject.push({ key: key, value: challanSearchScreenObject[key].trim() });
        }
      }
    }

    dispatch(toggleSpinner());
    const responseFromAPI = await getChallanSearchResult(queryObject);
    
    dispatch(prepareFinalObject("challanSearchResponse", responseFromAPI));
    dispatch(toggleSpinner()); 
    const challans = (responseFromAPI && responseFromAPI.challans) || [];
    
     const response = [];
     for (let i = 0; i < challans.length; i++) {
       
       const serviceTypeLabel = getTransformedLocale(challans[i].businessService);
      
      response[i] = {
        challanNo: challans[i].challanNo,
        serviceType: serviceTypeLabel,
        consumerName : challans[i].citizen.name,
        status: challans[i].applicationStatus,
        tenantId: challans[i].tenantId,
        businessService: challans[i].businessService
      };
    }
    
    // const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.uiCommonConfig");
    try {
      let data = response.map(item => ({
        ['UC_CHALLAN_NO_LABEL']: item.challanNo || "-",
        ['UC_COMMON_TABLE_COL_PAYEE_NAME']: item.consumerName || "-",
        ['UC_SERVICE_TYPE_LABEL']: getTextToLocalMapping(`BILLINGSERVICE_BUSINESSSERVICE_${item.serviceType}`) || "-",
        ['UC_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ["TENANT_ID"]: item.tenantId || "-",
        ["BUSINESS_SERVICE"]: item.businessService || "-",
      }));
     
      dispatch(
        handleField(
          "searchChallan",
          "components.div.children.SearchChallanResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "searchChallan",
          "components.div.children.SearchChallanResults",
          "props.rows",
          data.length
        )
      );

      dispatch(
        handleField("searchChallan", "components.div.children.SearchChallanResults")
      );
      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
    
  }
};

const checkSearchChallanEmptyFields = (searchScreenObject) => {
  const businessServices = get(searchScreenObject, 'businessService', null)
  const mobileNumber = get(searchScreenObject, 'mobileNumber', null)
  const consumerCodes = get(searchScreenObject,'challanNo',null)
  if (checkEmpty(businessServices) && checkEmpty(mobileNumber) && checkEmpty(consumerCodes)) {
    return true; 
    }
  return false;
}

const checkEmptyFields = (searchScreenObject) => {
  
  const businessServices = get(searchScreenObject, 'businessService', null)
  const mobileNumber = get(searchScreenObject, 'mobileNumber', null)
  const receiptNumbers = get(searchScreenObject, 'receiptNumbers', null)
  const consumerCodes = get(searchScreenObject,'consumerCodes',null)
  const fromDate = get(searchScreenObject,'fromDate',null)
  const toDate = get(searchScreenObject,'toDate',null)
  if (checkEmpty(businessServices) && checkEmpty(mobileNumber) && checkEmpty(receiptNumbers)&& checkEmpty(consumerCodes)&& checkEmpty(fromDate)&& checkEmpty(toDate)) {
    
    return true; 
    
    }
  return false;
}
const checkEmpty = (value) => {
  value = typeof (value) == "string" ? value.trim() : value;
  if (value && value != null && value.length > 0) {
    return false;
  }
  return true;
}

const showHideTable = (booleanHideOrShow, dispatch) => {
 
  dispatch(
    handleField(
      "searchChallan",
      "components.div.children.SearchChallanResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideReceiptTable = (booleanHideOrShow, dispatch) => {
 
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};