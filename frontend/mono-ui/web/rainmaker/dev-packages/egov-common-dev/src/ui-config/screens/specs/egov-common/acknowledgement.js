import { paymentFooter } from "./acknowledgementResource/paymentFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { ifUserRoleExists } from "../utils";
import {download} from  "../../../../ui-utils/commons";
import {getHeader} from "./pay"
import './index.css';


const downloadprintMenu=(state,applicationNumber,tenantId,uiCommonPayConfig)=>{
    const receiptKey = get(uiCommonPayConfig, "receiptKey")
      let receiptDownloadObject = {
        label: { labelName: "DOWNLOAD RECEIPT", labelKey: "COMMON_DOWNLOAD_RECEIPT" },
        link: () => {
            const receiptQueryString = [
                { key: "receiptNumbers", value: applicationNumber },
                { key: "tenantId", value: tenantId }
            ]
            download(receiptQueryString , "download" , receiptKey);
          
        },
        leftIcon: "receipt"
      };
      let receiptPrintObject = {
        label: { labelName: "PRINT RECEIPT", labelKey: "COMMON_PRINT_RECEIPT" },
        link: () => {
            const receiptQueryString = [
                { key: "receiptNumbers", value: applicationNumber },
                { key: "tenantId", value: tenantId }
            ]
            download(receiptQueryString  ,"print" , receiptKey);
        },
        leftIcon: "receipt"
      };
    let downloadMenu = [];
    let printMenu = [];
        downloadMenu = [receiptDownloadObject];
        printMenu = [receiptPrintObject];
    
  
      return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className:"downloadprint-commonmenu",
          style: { textAlign: "right", display: "flex" }
        },
        children: {
          downloadMenu: {
            uiFramework: "custom-molecules",
            componentPath: "DownloadPrintButton",
            props: {
              data: {
                label: {labelName : "DOWNLOAD" , labelKey :"TL_DOWNLOAD"},
                 leftIcon: "cloud_download",
                rightIcon: "arrow_drop_down",
                props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
                menu: downloadMenu
              }
            }
          },
          printMenu: {
            uiFramework: "custom-molecules",
            componentPath: "DownloadPrintButton",
            props: {
              data: {
                label: {labelName : "PRINT" , labelKey :"TL_PRINT"},
                leftIcon: "print",
                rightIcon: "arrow_drop_down",
                props: { variant: "outlined", style: { height: "60px", color : "#FE7A51"}, className: "tl-print-button" },
                menu: printMenu
              }
            }
          }
    
        },
      }
     
  }
const getAcknowledgementCard = (
    state,
    dispatch,
    status,
    receiptNumber,
    consumerCode,
    tenant
) => {
    const roleExists = ifUserRoleExists("CITIZEN");
    let header = getHeader(state);
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject , "commonPayInfo");
    const citizenSuccess=get(uiCommonPayConfig,"citizenSuccess");
    const citizenFailure=get(uiCommonPayConfig,"citizenFailure");
    const employeeSuccess=get(uiCommonPayConfig,"employeeSuccess");
    const employeeFailure=get(uiCommonPayConfig,"employeeFailure");
  //  const {citizenSuccess , employeeSuccess , citizenFailure , employeeFailure} = uiCommonPayConfig;
    if (status === "success") {
        return {
            header,
            headerdownloadprint:downloadprintMenu(state,receiptNumber,tenant,uiCommonPayConfig),
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelKey: roleExists ? get(citizenSuccess,"primaryMessage","PAYMENT_MESSAGE_CITIZEN")  : get(employeeSuccess,"primaryMessage","PAYMENT_MESSAGE_EMPLOYEE")
                        },
                        body: {
                            labelKey: roleExists ? get(citizenSuccess,"secondaryMessage","PAYMENT_MESSAGE_DETAIL_CITIZEN") : get(employeeSuccess,"secondaryMessage","PAYMENT_MESSAGE_DETAIL_EMPLOYEE")
                        },
                        tailText: {
                            labelKey : roleExists ? get(citizenSuccess,"receiptNo","PAYMENT_RECEIPT_NO") : get(employeeSuccess,"receiptNo","PAYMENT_RECEIPT_NO")
                        },
                        number: receiptNumber
                    })
                }
            },
            paymentFooter: paymentFooter(state,consumerCode, tenant, status)
        };
    } else if (status === "failure") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "close",
                        backgroundColor: "#E54D42",
                        header: {
                            labelKey: roleExists ? get(citizenFailure,"primaryMessage","PAYMENT_FAILURE_MESSAGE") : get(employeeFailure,"primaryMessage","PAYMENT_FAILURE_MESSAGE")
                        },
                        body: {
                            labelKey: roleExists ? get(citizenFailure,"secondaryMessage","PAYMENT_FAILURE_MESSAGE_DETAIL") : get(employeeFailure,"secondaryMessage","PAYMENT_FAILURE_MESSAGE_DETAIL")
                        }
                    })
                }
            },
            paymentFooter: paymentFooter(state,consumerCode, tenant,status)
        };
    }
};
const screenConfig = {
    uiFramework: "material-ui",
    name: "acknowledgement",
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css"
            },
            children: {}
        }
    },
    beforeInitScreen: (action, state, dispatch) => {
        const status = getQueryArg(window.location.href, "status");
        const consumerCode = getQueryArg(window.location.href, "consumerCode");
        const receiptNumber = getQueryArg(window.location.href, "receiptNumber");
        const tenant = getQueryArg(window.location.href, "tenantId");
        const data = getAcknowledgementCard(
            state,
            dispatch,
            status,
            receiptNumber,
            consumerCode,
            tenant
        );
        set(action, "screenConfig.components.div.children", data);
        return action;
    }
};

export default screenConfig;
