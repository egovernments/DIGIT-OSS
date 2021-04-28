import commonConfig from "config/common.js";
import {
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { httpRequest } from "../../../../ui-utils";
import { footer } from "./applyResource/footer";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { propertyAssemblySummary } from "./summaryResource/propertyAssemblySummary";
import { propertyLocationSummary } from "./summaryResource/propertyLocationSummary";
import { institutionSummary, applicantSummary } from './summaryResource/propertyOwnershipSummary'

export const header = getCommonContainer({
  header: getCommonHeader({
    labelKey: "PT_COMMON_REGISTER_NEW_PROPERTY"
  }),
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyAssemblySummary,
    propertyLocationSummary,
    applicantSummary,
    institutionSummary
  }
};


const setSearchResponse = async (state, dispatch, propertyId, tenantId, action) => {
  const response = await httpRequest(
    "post",
    "/property-services/property/_search",
    "",
    [{
      key: "tenantId",
      value: tenantId
    },
    {
      key: "propertyIds",
      value: propertyId
    }]
  );
  dispatch(prepareFinalObject("Property", get(response, "Properties[0]")));
  let ownershipCategory = get(response, "Properties[0].ownershipCategory", "");
  if (ownershipCategory.includes("INDIVIDUAL")) {
    dispatch(
      handleField(
        "summary",
        "components.div.children.formwizardFirstStep.children.institutionSummary",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "summary",
        "components.div.children.formwizardFirstStep.children.applicantSummary",
        "visible",
        true
      )
    );
  } else {
    dispatch(
      handleField(
        "summary",
        "components.div.children.formwizardFirstStep.children.institutionSummary",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "summary",
        "components.div.children.formwizardFirstStep.children.applicantSummary",
        "visible",
        false
      )
    );
  }
}

const getMDMSPropertyData = async (dispatch) => {
  const mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "PropertyTax",
          masterDetails: [
            { name: "PTWorkflow" }
          ]
        }
      ],

    }
  }
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    let ptWorkflowDetails = get(payload, "MdmsRes.PropertyTax.PTWorkflow", []);
    ptWorkflowDetails.forEach(data => {
      if(data.enable) {
        let workFlow = {
          tenantId : getQueryArg(window.location.href, "tenantId"),
          businessService : data.businessService,
          businessId : getQueryArg(window.location.href, "propertyId"),
          action : "SUBMIT",
          moduleName : "PT",
          state : null,
          comment : null,
          documents : null,
          assignes : null
        };
        dispatch(prepareFinalObject("isWorkflowDetails", workFlow, null));
      }
    })
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "summary",
  beforeInitScreen: (action, state, dispatch) => {
    const propertyId = getQueryArg(window.location.href, "propertyId");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    getMDMSPropertyData(dispatch);
    dispatch(prepareFinalObject("Property", {}));
    dispatch(prepareFinalObject("isFromWNS", false));
    setSearchResponse(state, dispatch, propertyId, tenantId, action);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep,
        footer
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "SuccessPTPopupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "summary"
      }
    }
  }
};

export default screenConfig;
