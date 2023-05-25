import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { cityPicker } from "./citypicker";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";
import { getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const header = getCommonHeader(
  {
    labelName: "Trade License",
    labelKey: "TL_COMMON_TL"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const cardItems = [
  {
    label: {
      labelKey: "TL_APPLY_TRADELICENSE",
      labelName: "Apply for Trade License"
    },
    icon: <TradeLicenseIcon />,
    route: {
      screenKey: "home",
      jsonPath: "components.cityPickerDialog"
    }
  },
  {
    label: {
      labelKey: "TL_MY_APPLICATIONS",
      labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "my-applications"
  }
];

const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject('citiesByModule.citizenTenantId', ''))
    fetchData(action, state, dispatch);
    const moduleDetails = [
      {
        moduleName: 'TradeLicense',
        masterDetails: [{ name: 'Documents' }]
      }
    ];
    getRequiredDocData(action, dispatch, moduleDetails,state);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      // props: {
      //   className: "common-div-css"
      // },
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        },
        listCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-tradelicence",
          componentPath: "HowItWorks"
        }
      }
    },
    // div: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Div",
    //   props: {
    //     className: "common-div-css"
    //   },
    //   children: {
    //     header: header,
    //     applyCard: {
    //       uiFramework: "custom-atoms",
    //       componentPath: "Div",
    //       children: {
    //         card: getCommonCard({
    //           applicationSuccessContainer: getCommonContainer({
    //             icon: {
    //               uiFramework: "custom-atoms",
    //               componentPath: "Icon",
    //               props: {
    //                 iconName: "book",
    //                 variant: "outlined",
    //                 style: {
    //                   fontSize: "110px",
    //                   width: 120,
    //                   height: 100,
    //                   color: "rgba(0, 0, 0, 0.6)",
    //                   marginLeft: -22
    //                 },
    //                 iconSize: "110px"
    //               }
    //             },
    //             body: {
    //               uiFramework: "custom-atoms",
    //               componentPath: "Div",
    //               children: {
    //                 header: getCommonHeader({
    //                   labelName: "Apply for New Trade License",
    //                   labelKey: "TL_COMMON_APPL_NEW_LIC"
    //                 }),
    //                 break: getBreak(),
    //                 applyButton: {
    //                   componentPath: "Button",
    //                   props: {
    //                     variant: "contained",
    //                     color: "primary",
    //                     style: {
    //                       width: "200px",
    //                       height: "48px",
    //                       marginRight: "40px"
    //                     }
    //                   },
    //                   children: {
    //                     collectPaymentButtonLabel: getLabel({
    //                       labelName: "APPLY",
    //                       labelKey: "TL_APPLY"
    //                     })
    //                   },
    //                   onClickDefination: {
    //                     action: "condition",
    //                     callBack: showCityPicker
    //                   },
    //                   roleDefination: {
    //                     rolePath: "user-info.roles",
    //                     roles: ["CITIZEN"]
    //                   }
    //                 }
    //               }
    //             }
    //           })
    //         }),
    //         break: getBreak(),
    //         searchResults: searchResults
    //       }
    //     }
    //   }
    // },
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
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: cityPicker
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
