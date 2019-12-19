import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import "../utils/index.css";
import PayWnsBillIcon from "../../../../ui-atoms-local/Icons/PayWnsBillIcon/index";
import MyConnectionsIcon from "../../../../ui-atoms-local/Icons/MyConnectionsIcon/index";

const header = getCommonHeader({
    labelKey: "WS_COMMON_HEADER"
}, {
    classes: {
        root: "common-header-cont"
    }
});

const cardItems = [{
        label: {
            labelKey: "WS_COMMON_PAY_WS_BILL_HEADER",
        },
        icon: < PayWnsBillIcon / > ,
        route: "search"
    },
    {
        label: {
            labelKey: "WS_MYCONNECTIONS_HEADER",
        },
        icon: < MyConnectionsIcon / > ,
        route: "my-connections"
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
            props: {
                className: "common-div-css"
            },
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
                    moduleName: "egov-wns",
                    componentPath: "PastPayments",
                    props: {
                        route: "my-connections"
                    }

                },
                listCard2: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "HowItWorks",
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
        // cityPickerDialog: {
        //   componentPath: "Dialog",
        //   props: {
        //     open: false,
        //     maxWidth: "md"
        //   },
        //   children: {
        //     dialogContent: {
        //       componentPath: "DialogContent",
        //       props: {
        //         classes: {
        //           root: "city-picker-dialog-style"
        //         }
        //         // style: { minHeight: "180px", minWidth: "365px" }
        //       },
        //       children: {
        //         popup: cityPicker
        //       }
        //     }
        //   }
        // }
    }
};

export default tradeLicenseSearchAndResult;