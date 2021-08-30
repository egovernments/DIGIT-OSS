import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPropertyResults } from "../../../../../ui-utils/commons";

export const propertySearchApiCall = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: "pb.amritsar" }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});

  if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_PROVIDE_VALID_PROP_ID" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    try {
      let response = await getPropertyResults(queryObject, dispatch);
      dispatch(prepareFinalObject("applyScreen.property", response.Properties[0]))
      if (response.Properties.length > 0 && response.Properties[0]) {
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
      "components.div.children.formwizardFirstStep.children.Details.visible",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.ownerDetails.visible",
      "visible",
      value
    )
  );
}