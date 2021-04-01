import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";

export const fetchData = async (action, state, dispatch) => {
  let tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : get(state,"auth.userInfo.permanentCity","pb");
  let queryObject = [
    { key: "tenantId", value: tenantId }
  ];
  const response = await getSearchResults(queryObject);
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
    if (response && response.FireNOCs && response.FireNOCs.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.FireNOCs));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.FireNOCs.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
