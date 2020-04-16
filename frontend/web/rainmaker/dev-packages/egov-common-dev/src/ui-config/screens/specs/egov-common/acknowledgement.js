import { paymentFooter } from "./acknowledgementResource/paymentFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { ifUserRoleExists } from "../utils";
import {download} from  "../../../../ui-utils/commons";
import {getHeader} from "./pay";
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
            download(receiptQueryString , "download" , receiptKey, state);
          
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
            download(receiptQueryString  ,"print" , receiptKey ,state);
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
    const businessService = getQueryArg(window.location.href, "businessService");
    const transBusinessService = businessService ? businessService.toUpperCase().replace(/[._:-\s\/]/g, "_") : "DEFAULT";
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject , "commonPayInfo");
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
                                labelKey: roleExists ? `CITIZEN_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE` : `EMPLOYEE_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE`
                            },
                            body: {
                                labelKey: roleExists ? `CITIZEN_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE_DETAIL` : `EMPLOYEE_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE_DETAIL`
                            },
                            tailText: {
                                labelKey : roleExists ? `CITIZEN_SUCCESS_${transBusinessService}_PAYMENT_RECEIPT_NO` : `EMPLOYEE_SUCCESS_${transBusinessService}_PAYMENT_RECEIPT_NO`
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
                            labelKey: roleExists ? `CITIZEN_FAILURE_${transBusinessService}_PAYMENT_MESSAGE` : `EMPLOYEE_FAILURE_${transBusinessService}_PAYMENT_MESSAGE`
                        },
                        body: {
                            labelKey: roleExists ? `CITIZEN_FAILURE_${transBusinessService}_PAYMENT_MESSAGE_DETAIL` : `EMPLOYEE_FAILURE_${transBusinessService}_PAYMENT_MESSAGE_DETAIL`
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
        const businessService = getQueryArg(window.location.href, "businessService");
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
