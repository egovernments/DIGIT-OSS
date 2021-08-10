import {
  getBreak,
  getCommonContainer, getCommonHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import { applyForm, getTenantMdmsData, showApplyCityPicker } from "../utils";
import { BPAApplication, resetFields } from "./searchResource/bpaApplication";
import { pendingApprovals } from "./searchResource/pendingApprovals";
import { searchResults } from "./searchResource/searchResults";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "BPA",
  labelKey: "BPA_TITLE_LABEL"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(
    prepareFinalObject("BPA's", [{ "bpaDetails.bpaType": "NEW" }])
  );
  // dispatch(setRoute("/tradelicence/apply"));
};

const startApplyFlow = (state, dispatch) => {
  dispatch(prepareFinalObject("BPAs", []));
  dispatch(prepareFinalObject("scrutinyDetails", {}));
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? `/egov-ui-framework/egov-bpa/citySelection` : `/egov-bpa/citySelection`;
  dispatch(setRoute(applyUrl));
};

const BpaSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    resetFields(state, dispatch);
    const tenantId = getTenantId();
    const BSqueryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "BPA" }
    ];
    setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "BPA" });
    const { states } = data || [];
    if (states && states.length > 0) {
      const status = states.map((item, index) => {
        return {
          code: item.state
        };
      });
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.searchScreen.status",
          status.filter(item => item.code != null)
        )
      );
    }
    // getRequiredDocData(action, state, dispatch).then(() => {
    //   let documents = get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.searchScreenMdmsData.BPA.Documents",
    //     []
    //   );
    //   set(
    //     action,
    //     "screenConfig.components.adhocDialog.children.popup",
    //     // getRequiredDocuments(documents)
    //   );
    // });
    //for service and app type
    getTenantMdmsData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
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
            },
            // newApplicationButton: {
            //   componentPath: "Button",
            //   gridDefination: {
            //     xs: 12,
            //     sm: 6,
            //     align: "right"
            //   },
            //   visible: enableButton,
            //   props: {
            //     variant: "contained",
            //     color: "primary",
            //     style: {
            //       color: "white",
            //       borderRadius: "2px",
            //       width: "250px",
            //       height: "48px"
            //     }
            //   },
            //   children: {
            //     plusIconInsideButton: {
            //       uiFramework: "custom-atoms",
            //       componentPath: "Icon",
            //       props: {
            //         iconName: "add",
            //         style: {
            //           fontSize: "24px"
            //         }
            //       }
            //     },
            //     buttonLabel: getLabel({
            //       labelName: "NEW APPLICATION",
            //       labelKey: "BPA_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
            //     })
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       showApplyCityPicker(state, dispatch)
            //     }
            //   }
            // }
          }
        },
        pendingApprovals,
        BPAApplication,
        breakAfterSearch: getBreak(),
        searchResults
      }
    },
    cityPickerDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
          },
          children: {
            popup: getCommonContainer({
              header: getCommonHeader({
                labelName: "Select City",
                labelKey: "BPA_SELECT_CITY"
              }),
              cityPicker: getCommonContainer({
                cityDropdown: {
                  uiFramework: "custom-containers-local",
                  moduleName: "egov-bpa",
                  componentPath: "AutosuggestContainer",
                  jsonPath: "citiesByModule.citizenTenantId",
                  required: true,
                  gridDefination: {
                    xs: 12,
                    sm: 12
                  },
                  props: {
                    style: {
                      width: "100%",
                      cursor: "pointer"
                    },
                    localePrefix: {
                      moduleName: "TENANT",
                      masterName: "TENANTS"
                    },
                    className: "citizen-city-picker",
                    label: {
                      labelName: "City",
                      labelKey: "BPA_CITY_LABEL"
                    },
                    placeholder: { labelName: "Select City", labelKey: "BPA_SELECT_CITY" },
                    jsonPath: "BPA.address.city",
                    sourceJsonPath: "citiesByModule.TL.tenants",
                    labelsFromLocalisation: true,
                    fullwidth: true,
                    required: true,
                    isClearable: true,
                    inputLabelProps: {
                      shrink: true
                    }
                  }
                },
                div: {
                  uiFramework: "custom-atoms",
                  componentPath: "Div",
                  children: {
                    selectButton: {
                      componentPath: "Button",
                      props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                          width: "40px",
                          height: "20px",
                          marginRight: "4px",
                          marginTop: "16px"
                        }
                      },
                      children: {
                        previousButtonLabel: getLabel({
                          labelName: "SELECT",
                          labelKey: "BPA_CITIZEN_SELECT_BUTTON"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: applyForm
                      }
                    },
                    cancelButton: {
                      componentPath: "Button",
                      props: {
                        variant: "outlined",
                        color: "primary",
                        style: {
                          width: "40px",
                          height: "20px",
                          marginRight: "4px",
                          marginTop: "16px"
                        }
                      },
                      children: {
                        previousButtonLabel: getLabel({
                          labelName: "CANCEL",
                          labelKey: "BPA_CITIZEN_CANCEL_BUTTON"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: showApplyCityPicker
                      }
                    }
                  }
                }
              })
            })
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-bpa",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default BpaSearchAndResult;
