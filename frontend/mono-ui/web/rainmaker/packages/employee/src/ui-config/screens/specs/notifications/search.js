import { getBreak, getCommonHeader, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { ulbFilter } from "../utils";
import { searchApiCall, searchResults } from "./searchResults";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const pageResetAndChange = (state, dispatch) => {
  dispatch(prepareFinalObject("events", []));
  window.location.href="./create";
};

const header = getCommonHeader({
  labelName: "Public Message Notice",
  labelKey: "EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER",
});

const eventsSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    searchApiCall(state, dispatch);
    const tenantId = getTenantId();
    let props = get(action.screenConfig, "components.div.children.cityFilter.children.cardContent.children.container.children.ulb.props", {});
    props.value = tenantId;
    props.disabled = true;
    set(action.screenConfig, "components.div.children.cityFilter.children.cardContent.children.container.children.ulb.props", props);
    set(
      action.screenConfig,
      "components.div.children.searchResults.visible",
      false
    );
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right",
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "NEW PUBLIC MESSAGE",
                  labelKey: "NEW_PUBLIC_MESSAGE_BUTTON_LABEL",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  pageResetAndChange(state, dispatch);
                },
              },
            },
          },
        },
        cityFilter: ulbFilter,
        breakAfterSearch: getBreak(),
        searchResults: searchResults(),
      },
    },
  },
};

export default eventsSearchAndResult;
