import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";

import { footer } from "../bpastakeholder/applyResource/footer";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  header,
  formwizardFirstStep,
  formwizardSecondStep,
  formwizardThirdStep,
  formwizardFourthStep,
  stepper,
  getMdmsData
} from "../bpastakeholder/apply";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

const getData = async (action, state, dispatch, tenantId) => {
  await getMdmsData(action, state, dispatch);
};

const updateSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  tenantId
) => {
  await getData(action, state, dispatch, tenantId);
  await updatePFOforSearchResults(
    action,
    state,
    dispatch,
    queryValue,
    "",
    tenantId
  );
  const queryValueFromUrl = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (!queryValueFromUrl) {
    dispatch(
      prepareFinalObject(
        "Licenses[0].oldLicenseNumber",
        get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].applicationNumber",
          ""
        )
      )
    );
    dispatch(prepareFinalObject("Licenses[0].applicationNumber", ""));
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        false
      )
    );
  }
};
const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    if (window.location.pathname.includes("whitelisted")) {
      set(action.screenConfig, "components.div.children.footer.props.style", {
        width: "100vw"
      });
    }
    const queryValue = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const applicationNo = queryValue;
    dispatch(prepareFinalObject("Licenses[0]", {}));

    if (applicationNo) {
      updateSearchResults(action, state, dispatch, applicationNo, tenantId);
    } else {
      getData(action, state, dispatch, tenantId);
    }
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
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
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        footer
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "apply"
      }
    }
  }
};

export default screenConfig;
