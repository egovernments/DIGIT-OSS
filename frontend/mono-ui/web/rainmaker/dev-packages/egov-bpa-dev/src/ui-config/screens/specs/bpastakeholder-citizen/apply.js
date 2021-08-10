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
import { getLocale, getTenantId, setModule } from "egov-ui-kit/utils/localStorageUtils";
import { addressDestruct, setMobileNoField, setNameOfUser } from "../utils";
import { getModuleName } from "egov-ui-kit/utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";

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
  let aa = await updatePFOforSearchResults(
    action,
    state,
    dispatch,
    queryValue,
    "",
    tenantId
  );
  addressDestruct(action, state, dispatch);
  const subOwnerShipCategory = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
  );

  // setOrganizationVisibility(action, state, dispatch, subOwnerShipCategory);
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
    if (window.location.pathname.includes("openlink")) {
      set(state, "screenConfiguration.moduleName", "BPAREG");
      set(action.screenConfig, "components.div.children.footer.props.style", {
        width: "100vw"
      });
      setModule(getModuleName());
      const tenantId = getTenantId();
      const locale = getLocale() || "en_IN";
      dispatch(fetchLocalizationLabel(locale, tenantId, tenantId));

    }
    const queryValue = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const applicationNo = queryValue;
    dispatch(prepareFinalObject("Licenses[0]", {}));
    dispatch(prepareFinalObject("LicensesTemp[0]", {}));

    if (applicationNo) {
      updateSearchResults(action, state, dispatch, applicationNo, tenantId);
    } else {
      getData(action, state, dispatch, tenantId);
      // setOrganizationVisibility(action, state, dispatch, "INDIVIDUAL");
      dispatch(
        prepareFinalObject(
          "Licenses[0].tradeLicenseDetail.owners[0].gender",
          "MALE"
        )
      );
      dispatch(
        prepareFinalObject(
          "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
          "INDIVIDUAL"
        )
      );

      if (!window.location.pathname.includes("openlink")) {
        setMobileNoField(action, state, dispatch);
        setNameOfUser(action, state, dispatch);
      }
    }
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
