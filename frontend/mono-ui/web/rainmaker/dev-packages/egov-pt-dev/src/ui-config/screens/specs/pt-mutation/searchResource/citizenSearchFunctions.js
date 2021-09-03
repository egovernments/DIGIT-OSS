import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";


export const fetchData = async (action, state, dispatch) => {




  const response = await getSearchResults([
    {
      key: "tenantId",
      value: commonConfig.tenantId
    }]);

  try {
    if (response && response.Properties && response.Properties.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.Properties));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.Properties.length)
      );
      dispatch(
        handleField(
          "my-applications",
          "components.div.children.header.children.key",
          "props.dynamicArray",
          response.Properties.length ? [response.Properties.length] : [0]
        )
      )
    }
  } catch (error) {
    console.log(error);
  }
};
