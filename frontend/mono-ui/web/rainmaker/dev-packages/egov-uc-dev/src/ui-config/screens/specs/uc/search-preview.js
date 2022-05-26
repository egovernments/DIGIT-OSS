import { download } from "egov-common/ui-utils/commons";
import {
  getCommonCard,



  getCommonContainer, getCommonGrayCard, getCommonHeader,


  getCommonSubHeader,


  getLabel, getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField, prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonPayUrl, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getDateFromEpoch, getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import { getLocale, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import set from "lodash/set";
import "../../../../index.css";
import { httpRequest } from "../../../../ui-utils";
import { getChallanSearchResult, getSearchResults } from "../../../../ui-utils/commons";
import {
  convertEpochToDate, downloadEchallan, getFeesEstimateCard, printEchallan
} from "../utils";
import { confirmationDialog } from "./confirmationDialog";
import './index.css';



let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let tenantId = getQueryArg(window.location.href, "tenantId");
let businessService = getQueryArg(window.location.href, "businessService");
export const checkValueForNA = value => {
  return value == null || value == undefined || value == '' ? "NA" : value;
};

const searchResults = async (action, state, dispatch) => {

  let tenantId = getQueryArg(window.location.href, "tenantId");
  let businessService = getQueryArg(window.location.href, "businessService");
  let challanNo = getQueryArg(window.location.href, "applicationNumber");
  let queryObject = [];
  queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "challanNo",
      value: challanNo
    },
    {
      key: "businessService",
      value: businessService
    }

  ];


  const challanresponse = await getChallanSearchResult(queryObject);
  dispatch(prepareFinalObject("Challan", challanresponse.challans[0]));
  dispatch(prepareFinalObject("challanStatus", challanresponse.challans[0].applicationStatus));
  if (challanresponse.challans[0].applicationStatus === "ACTIVE") {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.preview.children.cardContent.children.footer.children.cancelButton",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.preview.children.cardContent.children.footer.children.editButton",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.preview.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.cancellComment",
        "visible",
        false
      )
    );
  }

  else if (challanresponse.challans[0].applicationStatus === "CANCELLED") {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.preview.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.cancellComment",
        "visible",
        true
      )
    );
  }
  else {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.preview.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.cancellComment",
        "visible",
        false
      )
    );
  }

  fetchBill(
    action,
    state,
    dispatch,
    challanNo,
    tenantId,
    businessService
  );
}
const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let businessService = getQueryArg(window.location.href, "businessService");
  let challanNo = getQueryArg(window.location.href, "applicationNumber");
  let status = getQueryArg(window.location.href, "status");
  searchResults(action, state, dispatch, applicationNumber)
  const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelName: "Challan Details:",
      labelKey: "CHALLAN_DETAILS",
    }),
    //challanNumberContainer: getCommonContainer({
    challanNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-uc",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber,
        label: {
          labelKey: "PAYMENT_UC_CONSUMER_CODE",
        },
      },
    },

    helpSection: {
      uiFramework: "custom-atoms",
      componentPath: "Div",

      props: {
        color: "primary",
        style: { justifyContent: "flex-end" }
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        align: "right"
      },
      children: downloadprintMenu(state, dispatch, challanNo, tenantId, status)

    }

  });
  set(
    action.screenConfig,
    "components.div.children.headerDiv.children.header1.children.headertop",
    headerrow
  );



};

const downloadReceipt = async (mode = 'download', state) => {
  const receiptNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.Payments[0].paymentDetails[0].receiptNumber",
    null
  );
  const businessService = get(
    state,
    "screenConfiguration.preparedFinalObject.Payments[0].paymentDetails[0].businessService",
    null
  );

  if (receiptNumber) {
    const receiptQueryString = [
      { key: "receiptNumbers", value: receiptNumber },
      { key: "tenantId", value: tenantId },
      { key: "businessService", value: businessService }

    ];
    download(receiptQueryString, mode, "consolidatedreceipt",'PAYMENT', state);
  }
};

const downloadprintMenu = (state, dispatch, applicationNumber, tenantId, status) => {
  let applicationDownloadObject = {
    label: { labelName: "Challan", labelKey: "UC_CHALLAN" },
    link: () => {
      const Challan = [
        { key: "challanNo", value: applicationNumber },
        { key: "tenantId", value: tenantId }
      ]
      downloadEchallan(Challan, `CHALLAN-${applicationNumber}.pdf`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Challan", labelKey: "UC_CHALLAN" },
    link: () => {
      const Challan = [
        { key: "challanNo", value: applicationNumber },
        { key: "tenantId", value: tenantId }
      ]
      printEchallan(Challan);
    },
    leftIcon: "assignment"
  };
  const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");
  const receiptKey = get(uiCommonPayConfig, "receiptKey")
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "UC_RECEIPT" },
    link: () => {
      downloadReceipt("download", state);
    },
    leftIcon: "receipt"
  };

  let receiptPrintObject = {
    label: { labelName: "PRINT RECEIPT", labelKey: "UC_RECEIPT" },
    link: () => {
      downloadReceipt("print", state);
    },
    leftIcon: "receipt"
  };

  let downloadMenu = [];
  let printMenu = [];

  if (status === "PAID") {
    console.info("download challan, for PAID case");
    downloadMenu = [applicationDownloadObject, receiptDownloadObject];
    printMenu = [applicationPrintObject, receiptPrintObject];
  }
  else {
    //Download challan option
    console.info("download challan, for cancel and active case");
    downloadMenu = [applicationDownloadObject];
    printMenu = [applicationPrintObject];
  }


  return {
    test1: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      visible: !JSON.parse(window.localStorage.getItem('isPOSmachine')),
      props: {
        className: "downloadprint-commonmenu",
        style: { textAlign: "right", display: "flex", paddingTop: "10px" },
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-molecules",
          componentPath: "DownloadPrintButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: {
                variant: "outlined",
                style: {
                  height: "60px", color: "#FE7A51",
                  marginRight: "5px"
                },
                className: "uc-download-button",
              },
              menu: downloadMenu,
            },
          },
        },
        printMenu: {
          uiFramework: "custom-molecules",
          componentPath: "DownloadPrintButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "TL_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: {
                variant: "outlined",
                style: { height: "60px", color: "#FE7A51" },
                className: "uc-print-button",
              },
              menu: printMenu,
            },
          },
        },
      },

    },
    posbuttons: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      visible: JSON.parse(window.localStorage.getItem('isPOSmachine')),

      children: {
        printMiniReceiptButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            className: "preview-challan-btn",
            //className:"gen-challan-btn"

            // disabled: true
          },
          children: {
            printFormButtonLabel: getLabel({
              labelName: "PRINT MINI RECEIPT",
              labelKey: "COMMON_PRINT_MINI_RECEIPT"
            })
          },
          visible: status === "PAID" ? true : false,
          onClickDefination: {
            action: "condition",
            callBack: () => {

              const receiptData = generateMiniReceipt(state);
              try {
                window.Android && window.Android.sendPrintData("printData", JSON.stringify(receiptData));
              } catch (e) {
              }

            }
          },


        },
        printMiniChallanButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            className: "preview-challan-btn",

            // disabled: true
          },
          children: {
            printFormButtonLabel: getLabel({
              labelName: "PRINT MINI CHALLAN",
              labelKey: "COMMON_PRINT_MINI_CHALLAN"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: () => {
              const challanData = generateMiniChallan(state);
              try {
                window.Android && window.Android.sendPrintData("printData", JSON.stringify(challanData));
              } catch (e) {
              }
            }
          },
        }

      },

    },

  }

}
const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "Demands[0].estimateCardData",
  }),
});
export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

const userDetails = getCommonGrayCard({
  headerDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" },
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10,
        },
        ...getCommonSubHeader({
          labelName: "Consumer Details",
          labelKey: "CONSUMERDETAILS",
        }),
      },
    },
  },
  viewTwo: getCommonContainer({
    consumerName: getLabelWithValue(
      {
        labelName: "Consumer Name",
        labelKey: "UC_CONS_NAME_LABEL",
      },

      {
        jsonPath: "Challan.citizen.name",
        callBack: checkValueForNA
      }
    ),
    consumerMobileNo: getLabelWithValue(
      {
        labelName: "Mobile No",
        labelKey: "UC_MOBILE_NO_LABEL",
      },

      {
        jsonPath: "Challan.citizen.mobileNumber",
        callBack: checkValueForNA
      }
    ),
    ConsumerHouseNo: getLabelWithValue(
      {
        labelName: "Door/House No.",
        labelKey: "UC_DOOR_NO_LABEL"
      },
      {
        jsonPath: "Challan.address.doorNo",
        callBack: checkValueForNA
      }
    ),
    ConsumerBuilidingName: getLabelWithValue(
      {
        labelName: "Building/Colony Name",
        labelKey: "UC_BLDG_NAME_LABEL"
      },
      {
        jsonPath: "Challan.address.buildingName",
        callBack: checkValueForNA
      }
    ),
    ConsumerStreetName: getLabelWithValue(
      {
        labelName: "Street Name",
        labelKey: "UC_SRT_NAME_LABEL"
      },
      {
        jsonPath: "Challan.address.street",
        callBack: checkValueForNA
      }
    ),
    ConsumerLocMohalla: getLabelWithValue(
      {

        labelName: "Mohalla",
        labelKey: "UC_MOHALLA_LABEL"
      },
      {
        jsonPath: "Challan.address.locality.code",
        localePrefix: {
          moduleName: getQueryArg(window.location.href, "tenantId") ? getQueryArg(window.location.href, "tenantId").replace('.', '_').toUpperCase() : getTenantId().replace('.', '_').toUpperCase(),
          masterName: "REVENUE"
        }, callBack: checkValueForNA
      }
    )


  }),
});

export const checkChallanStatus = value => {
  return value === "CANCELLED" ? value : "NA";
};


const headerrow = getCommonContainer({});




const serviceDetails = getCommonGrayCard({

  headerDiv1: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" },
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10,
        },
        ...getCommonSubHeader({
          labelName: "Service Details",
          labelKey: "SERVICEDETAILS",
        }),
      },
    },
  },
  viewOne: getCommonContainer({
    serviceName: getLabelWithValue(
      {
        labelName: "Service Name",
        labelKey: "UC_SERVICE_CATEGORY_LABEL",
      },

      {
        jsonPath: "Challan.businessService",
        localePrefix: {
          moduleName: "BillingService",
          masterName: "BusinessService",
        },
        callBack: checkValueForNA
      }
    ),

    fromDate: getLabelWithValue(
      {
        labelName: "From Date",
        labelKey: "UC_FROM_DATE_LABEL",
      },

      { jsonPath: "Challan.taxPeriodFrom", callBack: convertEpochToDate }
    ),
    toDate: getLabelWithValue(
      {
        labelName: "Tp Date",
        labelKey: "UC_TO_DATE_LABEL",
      },

      { jsonPath: "Challan.taxPeriodTo", callBack: convertEpochToDate }
    ),

    description: getLabelWithValue(
      {
        labelName: "Description",
        labelKey: "UC_COMMENT_LABEL",
      },
      {
        jsonPath: "Challan.description",
        callBack: checkValueForNA
      }
    ),

    applicationStatus: getLabelWithValue(
      {
        labelName: "Application Status",
        labelKey: "CS_INBOX_STATUS_FILTER",
      },

      {
        jsonPath: "Challan.applicationStatus"
        ,
        callBack: checkValueForNA
      }
    ),
    cancellComment: getLabelWithValue(

      {
        labelName: "Reason for Cancellation",
        labelKey: "UC_CANCELL_COMMENT",
      },

      {
        jsonPath: "Challan.additionalDetail.cancellComment",
        callBack: checkValueForNA
      }

    ),

  }),
});



export const callBackForPay = (state, dispatch) => {
  getCommonPayUrl(dispatch, applicationNumber, tenantId, businessService);
};

export const showHideConfirmationPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["search-preview"],
    "components.div.children.preview.children.cardContent.children.footer.children.cancelConfirmationDialog.props.open",
    false
  );
  dispatch(
    handleField("search-preview", "components.div.children.preview.children.cardContent.children.footer.children.cancelConfirmationDialog", "props.open", !toggle)
  );
};

export const cancelChallan = async (state, dispatch, status) => {
  var operation = "cancel";
  let estimateData = get(state.screenConfiguration.preparedFinalObject, "Demands[0].estimateCardData");
  estimateData && estimateData.forEach((item, index) => {
    dispatch(
      prepareFinalObject(`Challan.amount[${index}].taxHeadCode`, item.info.labelName)
    );
    dispatch(
      prepareFinalObject(`Challan.amount[${index}].amount`, item.value)
    );
  });
  const challan = get(state.screenConfiguration.preparedFinalObject, "Challan");
  challan.applicationStatus = status;

  try {
    if (challan != null) {
      const payload = await httpRequest("post", "/echallan-services/eChallan/v1/_update", "", [], {
        Challan: challan
      });
      if (payload.challans.length > 0) {
        const consumerCode = get(payload, "challans[0].challanNo");
        const businessService = get(payload, "challans[0].businessService");
        dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=success&tenantId=${getTenantId()}&serviceCategory=${businessService}&challanNumber=${consumerCode}`));
      } else {
        console.info("some error  happened while cancelling challan");
        dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
      }
    }
  } catch (e) {
    console.error("error:::" + e);
    dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
  }
}

const openUpdateForm = (state, dispatch) => {
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let businessService = getQueryArg(window.location.href, "businessService");
  let consumerCode = getQueryArg(window.location.href, "applicationNumber");
  dispatch(setRoute(`/uc/newCollection?consumerCode=${consumerCode}&tenantId=${tenantId}&businessService=${businessService}`));
};

const formatTaxHeaders = (billDetail = {}) => {
  let formattedFees = [];
  const { billAccountDetails = [] } = billDetail;
  const billAccountDetailsSorted = orderBy(
    billAccountDetails,
    ["amount"],
    ["asce"]
  );

  formattedFees = billAccountDetailsSorted.map((taxHead) => {
    return {
      info: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode,
      },
      name: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode,
      },
      value: taxHead.amount,
    };
  });
  formattedFees.reverse();
  return formattedFees;
};

const fetchBill = async (
  action,
  state,
  dispatch,
  consumerCode,
  tenantId,
  billBusinessService
) => {
  const getBillQueryObj = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCode",
      value: consumerCode,
    },
    {
      key: "service",
      value: billBusinessService,
    },
  ];
  const queryObj = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCodes",
      value: consumerCode
    },
    {
      key: "businessServices",
      value: billBusinessService
    }
  ];
  const fetchBillResponse = await getBill(getBillQueryObj);
  const paymentObject = await getSearchResults(queryObj);
  let bill = get(paymentObject, "Payments[0].paymentDetails[0].bill", null);
  if (bill == null) {
    bill = get(fetchBillResponse, "Bill[0]", {});
  }
  let estimateData = formatTaxHeaders(bill.billDetails[0]);
  const challanStatus = get(
    state.screenConfiguration.preparedFinalObject,
    "Challan.applicationStatus",
    null
  );
  set(estimateData, "payStatus", challanStatus === "PAID" ? true : false);
  dispatch(prepareFinalObject("Bill[0]", bill));
  dispatch(prepareFinalObject("Demands[0].estimateCardData", estimateData));
  dispatch(
    prepareFinalObject("Payments", get(paymentObject, "Payments", null))
  );
};
export const getBill = async (queryObject) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getReceipt = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      getPaymentSearchAPI(businessService),
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const generateMiniReceipt = (state) => {

  const ReceiptDataTemp = get(
    state.screenConfiguration.preparedFinalObject, "Payments[0]"
  );
  let receiptDateFormatted = getDateFromEpoch(ReceiptDataTemp.transactionDate);
  let receiptAmount = ReceiptDataTemp.totalAmountPaid;
  let fromPeriod = getDateFromEpoch(ReceiptDataTemp.paymentDetails[0].bill.billDetails[0].fromPeriod);
  let toPeriod = getDateFromEpoch(ReceiptDataTemp.paymentDetails[0].bill.billDetails[0].toPeriod);
  let consumerName = ReceiptDataTemp.payerName;
  let id = getQueryArg(window.location.href, "tenantId");
  let localizedULBName = "";
  if (id != null) {
    id = id.split(".")[1];
    localizedULBName = id[0].toUpperCase() + id.slice(1);

  };
  let collectorName = "";

  let empInfo = JSON.parse(localStorage.getItem("Employee.user-info"));
  collectorName = empInfo.name;
  const paymentMode = ReceiptDataTemp.paymentMode;

  let UCminiReceiptData = {
    ulbType: localizedULBName,
    receiptNumber: getQueryArg(window.location.href, "applicationNumber"),
    tenantid: getQueryArg(window.location.href, "tenantId"),
    consumerName: consumerName,
    receiptDate: receiptDateFormatted,
    businessService: getQueryArg(window.location.href, "businessService"),
    fromPeriod: fromPeriod,
    toPeriod: toPeriod,
    receiptAmount: receiptAmount,
    paymentMode: paymentMode,
    collectorName: collectorName,
    status: "Paid"
  };

  return UCminiReceiptData;

}

const generateMiniChallan = (state) => {
  const ReceiptDataTemp = get(
    state.screenConfiguration.preparedFinalObject, "Challan"
  );
  const status = get(
    state.screenConfiguration.preparedFinalObject, "challanStatus"
  );

  // const todayDate = new Date();
  const challanDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).split(' ').join('-');
  //const challanDateFormatted = todayDate.toString();           
  const fromPeriod = getDateFromEpoch(ReceiptDataTemp.taxPeriodFrom);
  const toPeriod = getDateFromEpoch(ReceiptDataTemp.taxPeriodTo);
  const consumerName = ReceiptDataTemp.citizen.name;
  let id = getQueryArg(window.location.href, "tenantId");
  let localizedULBName = "";
  if (id != null) {
    id = id.split(".")[1];
    localizedULBName = id[0].toUpperCase() + id.slice(1);

  }
  let collectorName = "";

  let empInfo = JSON.parse(localStorage.getItem("Employee.user-info"));
  collectorName = empInfo.name;

  const businessService = getQueryArg(window.location.href, "businessService");

  let estimateData = get(state.screenConfiguration.preparedFinalObject, "Demands[0].estimateCardData");
  let amount = [];
  estimateData && estimateData.forEach((item, index) => {
    amount.push(item.value);
  });
  let totalAmt = 0;

  if (amount.length != 0) {
    totalAmt = amount.reduce(function (total, arr) {
      // return the sum with previous value
      return total + arr;

      // set initial value as 0
    }, 0);
  }


  let UCminiChallanData = {
    ulbType: localizedULBName,
    receiptNumber: getQueryArg(window.location.href, "applicationNumber"),
    tenantid: getQueryArg(window.location.href, "tenantId"),
    consumerName: consumerName,
    businessService: businessService,
    fromPeriod: fromPeriod,
    toPeriod: toPeriod,
    receiptAmount: totalAmt,
    receiptDate: challanDateFormatted,
    collectorName: collectorName,
    status: status
  };
  return UCminiChallanData;
};
const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    beforeInitFn(action, state, dispatch, applicationNumber);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview",
      },

      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 12,
              },

              ...headerrow,
            },
          },
        },

        preview: getCommonCard({
          estimate,
          serviceDetails,
          userDetails,
          footer: getCommonApplyFooter({
            cancelButton: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                className: "preview-challan-btn",
              },
              children: {
                cancelButtonLabel: getLabel({
                  labelName: "Cancel Challan",
                  labelKey: "UC_CANCEL_CHALLAN",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  showHideConfirmationPopup(state, dispatch);
                }

              },
              visible: false,
            },
            editButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                className: "preview-challan-btn",

              },
              children: {
                editButtonLabel: getLabel({
                  labelName: "Edit Challan",
                  labelKey: "UC_UPDATE_CHALLAN",
                }),
              },
              onClickDefination: {
                action: "condition",
                //callBack: callBackForPay,
              },
              visible: false,
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  openUpdateForm(state, dispatch);
                }

              },
            },
            cancelConfirmationDialog: {
              componentPath: "Dialog",
              props: {
                open: false,
                maxWidth: "sm"
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
                    popup: confirmationDialog
                  }
                }
              }
            },
          }),


        }),
      },
    },
  },
};




export default screenConfig;
