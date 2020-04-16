import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {
  getSearchResults,
  getPayload,
  getTenantName
} from "./publicSearchUtils";
import { getTextToLocalMapping, validateFields } from "../../utils/index";
import { ComponentJsonPath } from "./publicSearchUtils";

export const propertySearch = async (state, dispatch) => {
  searchApiCall(state, dispatch);
};

const removeValidation = (state, dispatch) => {
  Object.keys(ComponentJsonPath).map(key => {
    dispatch(
      handleField("public-search", ComponentJsonPath[key], "props.error", false)
    );

    dispatch(
      handleField("public-search", ComponentJsonPath[key], "isFieldValid", true)
    );
    return true;
  });
};

const getAddress = item => {
  if (item && item.address) {
    let doorNo = item.address.doorNo != null ? item.address.doorNo + "," : "";
    let buildingName =
      item.address.buildingName != null ? item.address.buildingName + "," : "";
    let street = item.address.street != null ? item.address.street + "," : "";
    let mohalla = item.address.locality.name
      ? item.address.locality.name + ","
      : "";
    let city = item.address.city != null ? item.address.city : "";
    return doorNo + buildingName + street + mohalla + city;
  }
};

const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);

  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  
  // if (
  //   searchScreenObject.tenantId === "" ||
  //   searchScreenObject.locality === ""
  // ) {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       {
  //         labelName: "Please fill valid fields to search",
  //         labelKey: "ERR_FIRENOC_FILL_VALID_FIELDS"
  //       },
  //       "error"
  //     )
  //   );
  //   return;
  // }

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children",
    state,
    dispatch,
    "public-search"
  );

  if (!isSearchBoxFirstRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_FIRENOC_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
    return;
  }
  
  if (searchScreenObject.tenantId && searchScreenObject.locality && !(searchScreenObject.ids || searchScreenObject.mobileNumber || searchScreenObject.ownerName)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field along with city and locality",
          labelKey:
            "PT_SEARCH_SELECT_AT_LEAST_ONE_FIELD_WITH_CITY_AND_LOCALITY"
        },
        "error"
      )
    );
    return;
  } else {
    removeValidation(state, dispatch);

    //  showHideProgress(true, dispatch);
    const requestPayload = getPayload(searchScreenObject);
    try {
      const response = await getSearchResults(requestPayload);
      // const response = searchResponse;

      let propertyData = response.Properties.map(item => ({
        [getTextToLocalMapping("Property ID")]: item.propertyId || "-",
        [getTextToLocalMapping("Owner Name")]: item.ownersName || "-",
        [getTextToLocalMapping("Address")]: getAddress(item) || "-",
        [getTextToLocalMapping("Property Status")]: item.status || "-",
        [getTextToLocalMapping("Amount Dues")]: item.pendingDues || "-",
        [getTextToLocalMapping("Action")]: item.pendingDues || "-"
      }));

      dispatch(
        handleField(
          "public-search",
          "components.div.children.searchPropertyTable",
          "props.data",
          propertyData
        )
      );
      dispatch(
        handleField(
          "public-search",
          "components.div.children.searchPropertyTable",
          "props.title",
          `${getTextToLocalMapping("Search Results for Properties")} (${
            response.Properties.length
          })`
        )
      );

      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch);
    } catch (error) {
      //showHideProgress(false, dispatch);
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
      "public-search",
      "components.div.children.searchPropertyTable",
      "visible",
      booleanHideOrShow
    )
  );
};

export const resetFields = (state, dispatch) => {
  Object.keys(ComponentJsonPath).map(key => {
    dispatch(
      handleField("public-search", ComponentJsonPath[key], "props.value", "")
    );
    return true;
  });
  dispatch(
    handleField("public-search", ComponentJsonPath["locality"], "props.data", [])
  );
  dispatch(
    prepareFinalObject("applyScreenMdmsData.tenant.localities", [])
  );
  dispatch(prepareFinalObject("searchScreen.tenantId", ""));
  dispatch(prepareFinalObject("searchScreen.locality.code", ""));
  dispatch(prepareFinalObject("searchScreen.ids", ""));
  dispatch(prepareFinalObject("searchScreen.mobileNumber", ""));
  dispatch(prepareFinalObject("searchScreen.ownerName", ""));
  removeValidation(state, dispatch);
};
