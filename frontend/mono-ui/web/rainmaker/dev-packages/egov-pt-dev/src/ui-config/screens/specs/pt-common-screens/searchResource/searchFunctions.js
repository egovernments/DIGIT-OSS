
import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { convertDateToEpoch,  validateFields } from "../../utils/index";

export const propertySearch = async (state, dispatch) => {
  searchApiCall(state, dispatch)
}

const getAddress = (item) => {
  let doorNo = item.address.doorNo != null ? (item.address.doorNo + ",") : '';
  let buildingName = item.address.buildingName != null ? (item.address.buildingName + ",") : '';
  let street = item.address.street != null ? (item.address.street + ",") : '';
  let mohalla = item.address.locality.name ? (item.address.locality.name + ",") : '';
  let city = item.address.city != null ? (item.address.city) : '';
  return (doorNo + buildingName + street + mohalla + city);
}

const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);

  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  let queryObject=[];

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children",
    state,
    dispatch,
    "propertySearch"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children",
    state,
    dispatch,
    "propertySearch"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, {labelName:"Please provide the city and any one other field information to search for property.", labelKey: "ERR_PT_COMMON_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, {labelName:"Please provide the city and any one other field information to search for property.", labelKey: "ERR_PT_COMMON_FILL_MANDATORY_FIELDS" }, "warning"));
  }  else if (
    (searchScreenObject["propertyIds"] === undefined || searchScreenObject["propertyIds"] === "") &&
    (searchScreenObject["mobileNumber"] === undefined || searchScreenObject["mobileNumber"] === "") &&
    (searchScreenObject["oldpropertyids"] === undefined || searchScreenObject["oldpropertyids"] === "")
  ) {
    dispatch(toggleSnackbar(true, { labelName:"In addition to City, please provide any one of the other parameters to search for property.",labelKey: "ERR_PT_COMMON_FILL_VALID_FIELDS" }, "warning"));
  }else{
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    try {
      const response = await getSearchResults(queryObject);
      let propertyData = response.Properties.map(item => ({
        ["PT_COMMON_TABLE_COL_PT_ID"]:
          item.propertyId || "-",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]: item.owners.filter(owner => owner.status == "ACTIVE").map(owner=>owner.name).join(",") || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["PT_COMMON_TABLE_COL_ACTION_LABEL"]: (item.status === 'ACTIVE')?"SELECT":item.status,
        ["PT_COMMON_TABLE_COL_TENANTID_LABEL"]: item.tenantId
      }));

      dispatch(
        handleField(
          "propertySearch",
          "components.div.children.searchPropertyTable",
          "props.data",
          propertyData
        )
      );
      dispatch(
        handleField(
          "propertySearch",
          "components.div.children.searchPropertyTable",
          "props.rows",
          response.Properties.length
        )
      );

      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
   
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.searchPropertyTable",
        "visible",
        booleanHideOrShow
      )
    );
};
