import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPropertyResults } from "../../../../../ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const propertySearchApiCall = async (state, dispatch) => {
  showHideFields(dispatch, false);
  let queryObject = [{ key: "tenantId", value: "pb.amritsar" }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv",
      "props.items",
      []
    )
  );
  if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "WS_FILL_REQUIRED_FIELDS", labelName: "Please fill required details" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    try {
      if (process.env.REACT_APP_NAME === "Citizen") {
        queryObject.push({ key: "mobileNumber", value: JSON.parse(getUserInfo()).mobileNumber })
      }
      let response = await getPropertyResults(queryObject, dispatch);
      if (response && response.Properties.length > 0) {
        if (!_.isEmpty(get(state, "screenConfiguration.preparedFinalObject.applyScreen.property", {}))) {
          dispatch(prepareFinalObject("applyScreen.property", {}))
        }
        dispatch(prepareFinalObject("applyScreen.property", response.Properties[0]))
        showHideFields(dispatch, true);
      } else {
        showHideFields(dispatch, false);
        dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_PROP_NOT_FOUND", labelName: "No Property records found" }, "warning"));
      }
    } catch (err) {
      showHideFields(dispatch, false);
      console.log(err)
    }
  }
}

const showHideFields = (dispatch, value) => {
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.Details",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.ownerDetails",
      "visible",
      value
    )
  );
}