import { httpRequest } from "./api";
import {
  convertDateToEpoch,
  getCurrentFinancialYear,
  getCheckBoxJsonpath,
  getSafetyNormsJson,
  getHygeneLevelJson,
  getLocalityHarmedJson,
  setFilteredTradeTypes,
  getTradeTypeDropdownData
} from "../ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTranslatedLabel,
  //updateDropDowns,
  ifUserRoleExists
} from "../ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "../ui-redux/store";
import get from "lodash/get";
import set from "lodash/set";
import {
  getQueryArg,
  getFileUrlFromAPI,
  enableFieldAndHideSpinner
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";


export const getChallanSearchResult = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "echallan-services/eChallan/v1/_search",
      "",
      queryObject
    );

    return response;
  }
  catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
}



export const getSearchResults = async queryObject => {
  try {
    let businessService = '';
    queryObject && Array.isArray(queryObject) && queryObject.map(query => {
      if (query.key == "businessServices") {
        businessService = query.value;
        if (typeof businessService == 'object') {
          query.value = businessService.join();
        }
      }
    })
    if (typeof businessService == 'string') {
      const response = await httpRequest(
        "post",
        getPaymentSearchAPI(businessService),
        "",
        queryObject
      );

      return response;
    } else if (process.env.REACT_APP_NAME === "Citizen") {
      const response = await httpRequest(
        "post",
        getPaymentSearchAPI('-1'),
        "",
        queryObject
      );

      return response;
    } else if (typeof businessService == 'object') {
      const response = { "Payments": [] };
      businessService.map(async (businessSer) => {
        try {
          let respo = await httpRequest(
            "post",
            getPaymentSearchAPI(businessSer),
            "",
            queryObject
          )
          response.Payments.push(...respo.Payments);

        } catch (e) {
          console.log(e);
        }
      })
      if (response.Payments.length == 0) {
        throw { message: 'PAYMENT_SEARCH_FAILED' };
      }
      return response;
    }

  } catch (error) {
    enableFieldAndHideSpinner('search', "components.div.children.UCSearchCard.children.cardContent.children.buttonContainer.children.searchButton", store.dispatch);
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




export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};
