import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { cityPicker } from "./citypicker";
import { ifUserRoleMatches } from "../utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import BPAStakeholderRegIcon from "../../../../ui-atoms-local/Icons/BPAStakeholderRegIcon";
import BPANewPermitIcon from "../../../../ui-atoms-local/Icons/BPANewPermitIcon";
import { getStakeHolderRoles } from "../../../../ui-utils/commons";
import "../utils/index.css";
const header = getCommonHeader(
  {
    labelName: "Building Plan Approval",
    labelKey: "BPA_CITIZEN_COMMON_TITLE"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const stakeHolderRoles = getStakeHolderRoles();

const hideBPACard = () => {
  return ifUserRoleMatches(stakeHolderRoles);
};

const displayView = () => {
  return hideBPACard() ? "my-applications" : "my-applications-stakeholder";
}

const cardItems = [
  {
    label: {
      labelKey: "BPA_COMMON_APPL_NEW_LICENSE",
      labelName: "Register Technical Person/Builder"
    },
    icon: <BPAStakeholderRegIcon />,
    route: "apply"
  },
  {
    label: {
      labelKey: "BPA_COMMON_APPL_NEW_CONSTRUCTION",
      labelName: "Building Permit New Construction"
    },
    hide: hideBPACard(),
    icon: <BPANewPermitIcon />,
    route: {
      screenKey: "home",
      jsonPath: "components.cityPickerDialog",
      value: "apply"
    }
  },
  {
    label: {
      labelKey: "BPA_OC_COMMON_APPL_NEW_CONSTRUCTION",
      labelName: "Occupancy Certificate New Building Construction"
    },
    hide: hideBPACard(),
    icon: <BPANewPermitIcon />,
    route: {
      screenKey: "home",
      jsonPath: "components.cityPickerDialogForOC"
    }
  },
  {
    label: {
      labelKey: "BPA_MY_APPLICATIONS",
      labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: displayView()
  }
];

const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch);
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
        }
        // listCard: {
        //   uiFramework: "custom-molecules-local",
        //   moduleName: "egov-tradelicence",
        //   componentPath: "HowItWorks"
        // }
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
    cityPickerDialogForOC: {
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
            popup: cityPicker
          }
        }
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
