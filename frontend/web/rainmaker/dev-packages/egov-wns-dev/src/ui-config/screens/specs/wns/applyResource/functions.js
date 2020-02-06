import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPropertyResults } from "../../../../../ui-utils/commons";
import set from 'lodash/set';
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";

export const propertySearchApiCall = async (state, dispatch) => {
  let queryObject = [
    { key: "tenantId", value: "pb.amritsar" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );

  // if (
  //   Object.keys(searchScreenObject).length == 0 ||
  //   Object.values(searchScreenObject).every(x => x === "")
  // ) {
  //   dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_MANDATORY_FIELDS" }, "warning"));
  // } else {
  for (var key in searchScreenObject) {
    if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
      queryObject.push({ key: key, value: searchScreenObject[key].trim() });
    }
  }
  try {
    let response = await getPropertyResults(queryObject, dispatch);
    dispatch(prepareFinalObject("Properties[0]", response.Properties[0]))
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.Details.visible",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.ownerDetails.visible",
        "visible",
        true
      )
    );
  } catch (err) { console.log(err) }
}
// }