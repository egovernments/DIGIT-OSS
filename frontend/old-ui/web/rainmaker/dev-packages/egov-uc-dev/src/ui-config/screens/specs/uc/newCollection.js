import commonConfig from "config/common.js";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { setServiceCategory } from "../utils";
import { newCollectionDetailsCard } from "./newCollectionResource/newCollectionDetails";
import { newCollectionFooter } from "./newCollectionResource/newCollectionFooter";

const header = getCommonHeader({
  labelName: "New Collection",
  labelKey: "UC_COMMON_HEADER"
});
const tenantId = getTenantId();
const loadServiceType = async (tenantId, dispatch) => {
  let requestBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "BillingService",
          masterDetails: [
            {
              name: "BusinessService",
              filter: "[?(@.type=='Adhoc')]"
            },
            {
              name: "TaxHeadMaster"
            },
            {
              name: "TaxPeriod"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.BillingService",
        payload.MdmsRes.BillingService
      )
    );
    setServiceCategory(
      get(payload, "MdmsRes.BillingService.BusinessService", []),
      dispatch
    );
  } catch (e) {
    console.log(e);
  }
}
const getData = async (action, state, dispatch, demandId) => {

  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },
            { name: "citymodule" }
          ]
        }
      ]
    }
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );

    if (payload) {
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload, "MdmsRes.tenant.citymodule");
      const liveTenants = citymodule && citymodule.filter(item => item.code === "UC");
      dispatch(
        prepareFinalObject("applyScreenMdmsData.tenant.citiesByModule", get(liveTenants[0], "tenants"))
      );
    }
    const serviceCategories = get(
      state.screenConfiguration,
      "preparedFinalObject.searchScreenMdmsData.serviceCategory",
      []
    );
    if (serviceCategories && serviceCategories.length !== 0) {
      setServiceCategory(
        serviceCategories,
        dispatch
      );
    } else if (tenantId) {
      loadServiceType(tenantId, dispatch)
    }
    dispatch(
      prepareFinalObject("Demands[0].tenantId", tenantId)
    );
  } catch (e) {
    console.log(e);
  }
  if (!demandId) {
    try {
      let payload = null;
      payload = await httpRequest("post", "/egov-idgen/id/_generate", "", [], {
        idRequests: [
          {
            idName: "",
            format: "UC/[CY:dd-MM-yyyy]/[seq_uc_demand_consumer_code]",
            tenantId: `${tenantId}`
          }
        ]
      });
      dispatch(
        prepareFinalObject(
          "Demands[0].consumerCode",
          get(payload, "idResponses[0].id", "")
        )
      );
      loadServiceType(tenantId, dispatch);
    } catch (e) {
      console.log(e);
    }
  }

  // return action;
};

const newCollection = {
  uiFramework: "material-ui",
  name: "newCollection",
  beforeInitScreen: (action, state, dispatch) => {
    const demandId = get(
      state.screenConfiguration.preparedFinalObject,
      "Demands[0].id",
      null
    );
    const screenConfigForUpdate = get(
      state.screenConfiguration,
      "screenConfig.newCollection"
    );

    dispatch(prepareFinalObject('DynamicMdms.BillingService.selectedValues',[]));
    dispatch(prepareFinalObject('DynamicMdms.BillingService.serviceCategories.selectedValues',[]));

    if (demandId) {

      set(
        screenConfigForUpdate,
        "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceCategory.props.disabled",
        true
      );
      set(
        screenConfigForUpdate,
        "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType.props.disabled",
        true
      );
      action.screenConfig = screenConfigForUpdate;
    }
    !demandId && getData(action, state, dispatch, demandId);

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "newCollection"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        newCollectionDetailsCard,
        newCollectionFooter
      }
    }
  }
};

export default newCollection;
