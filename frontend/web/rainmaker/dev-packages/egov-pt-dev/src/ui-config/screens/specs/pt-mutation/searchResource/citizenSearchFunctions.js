import { getSearchResults } from "../../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const fetchData = async (action, state, dispatch) => {


  
    
  const response = await getSearchResults();
  //const mdmsRes = await getMdmsData(dispatch);
  //   let tenants =
  //     mdmsRes &&
  //     mdmsRes.MdmsRes &&
  //     mdmsRes.MdmsRes.tenant.citymodule.find(item => {
  //       if (item.code === "TL") return true;
  //     });
  //   dispatch(
  //     prepareFinalObject(
  //       "applyScreenMdmsData.common-masters.citiesByModule.TL",
  //       tenants
  //     )
  //   );
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
