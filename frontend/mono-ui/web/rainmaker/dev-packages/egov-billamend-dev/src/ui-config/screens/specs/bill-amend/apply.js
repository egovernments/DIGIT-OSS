import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg,
  getFileUrlFromAPI,
  setBusinessServiceDataToLocalStorage,
  getTransformedLocale,
  orderWfProcessInstances
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest, edcrHttpRequest } from "../../../../ui-utils/api";
import set from "lodash/set";
import get from "lodash/get";
import jp from "jsonpath";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { documentDetails } from "./applyResource/documentDetails";
import { footer } from "./applyResource/footer";
import  summary from "./applyResource/summary"
import { AddDemandRevisionBasis,AddAdjustmentAmount } from "./applyResource/amountDetails";
import commonConfig from "config/common.js";
import { docdata } from "./applyResource/docData";
import { getFetchBill, procedToNextStep, cancelPopUp, searchBill } from "../utils";
import "./index.scss";


export const stepsData = [
  { labelName: "Amount Details", labelKey: "BILL_STEPPER_AMOUNT_DETAILS_HEADER" },
  { labelName: "Documents", labelKey: "BILL_STEPPER_DOCUMENTS_HEADER" },
  { labelName: "Summary", labelKey: "BILL_STEPPER_SUMMARY_HEADER" },
];

export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Generate Note`,
    labelKey: "BILL_APPLY_FOR_BILL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
        moduleName: "egov-billamend",
        componentPath: "ConsumerNo",
        props: {
            number: "NA",
            label: { labelValue: "Consumer No.", labelKey: "BILL_CONSUMER_NO" }
        },
    // visible: false
  }
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    AddAdjustmentAmount,
    AddDemandRevisionBasis
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails
  },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    summary
  },
  visible: false
};

 const setSearchResponse = async (state, dispatch, action) => {
  const connectionNumber = getQueryArg( window.location.href, "connectionNumber");
  const businessService = getQueryArg( window.location.href, "businessService");
  const tenantId = getTenantId() || getQueryArg( window.location.href, "businessService");

  let fetBill = await searchBill(state, dispatch, action, [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCode",
      value: connectionNumber
    },
    {
      key: "service",
      value: businessService
    }
  ]);
  
  if(fetBill && fetBill.Bill && fetBill && fetBill.Bill.length > 0) {
    let billDetails = get(fetBill, "Bill[0].billDetails[0].billAccountDetails",[]);
    let totalAmount=get(fetBill, "Bill[0].billDetails[0].amount",0);
    
    let searchedBill={"TOTAL":totalAmount}
    billDetails&&billDetails.map&&billDetails.map(item=>{
      searchedBill[item.taxHeadCode]=item.amount;
    })
    dispatch(prepareFinalObject("searchBillDetails-bill", searchedBill));
  }else{
    dispatch(prepareFinalObject("searchBillDetails-bill", {}));
  }
}

export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
  await setSearchResponse(state, dispatch, action);
}

export const getMdmsData = async (action, state, dispatch) => {
  const connectionNumber = getQueryArg( window.location.href, "connectionNumber");
  const businessService = getQueryArg( window.location.href, "businessService");
  const tenantId = getTenantId() || getQueryArg( window.location.href, "tenantId");

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "BillAmendment",
          masterDetails: [
            { name: "documentObj" },
            { name: "DemandRevisionBasis" }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "DocumentType" }
          ]
        },
        {
          moduleName: "BillingService",
          masterDetails: [
            { name: "TaxHeadMaster" } ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    let taxHeadMasterMdmsDetails = get(payload, "MdmsRes.BillingService.TaxHeadMaster", []), taxHeadMasterDetails;
    if (taxHeadMasterMdmsDetails && taxHeadMasterMdmsDetails.length > 0) {
      taxHeadMasterDetails = taxHeadMasterMdmsDetails.filter(service => (service.service == businessService));
      let billTaxHeadMasterDetails = taxHeadMasterDetails.filter(data => (data.IsBillamend== true));
      if(billTaxHeadMasterDetails && billTaxHeadMasterDetails.length > 0) {
       billTaxHeadMasterDetails.map(bill => {
          bill.reducedAmountValue = 0;
          bill.additionalAmountValue = 0;
          bill.taxHeadCode = bill.code;
        });
      }
      dispatch(prepareFinalObject("fetchBillDetails", billTaxHeadMasterDetails, []));
    } else {
      dispatch(prepareFinalObject("fetchBillDetails", []));
    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    dispatch(prepareFinalObject("Amendment.consumerCode", connectionNumber));
    dispatch(prepareFinalObject("Amendment.tenantId", tenantId));
    dispatch(prepareFinalObject("Amendment.businessService", businessService));
    dispatch(prepareFinalObject("BILL.AMOUNTTYPE", "reducedAmount"));
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        connectionNumber
      )
    );
  } catch (e) {
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch, componentJsonpath) => {
    dispatch(prepareFinalObject("BILL", {}));
    dispatch(prepareFinalObject("Amendment", {}));
    dispatch(prepareFinalObject("AmendmentTemp", {}));
    dispatch(prepareFinalObject("documentsUploadRedux", {}));
    dispatch(prepareFinalObject("documentsContract", []));
    dispatch(prepareFinalObject("AmendmentTemp.isPreviousDemandRevBasisValue", true));
    getData(action, state, dispatch).then(responseAction => {

    });


    const step = getQueryArg(window.location.href, "step");
    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep",
        "formwizardThirdStep",
      ];
      for (let i = 0; i < 3; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
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
        taskStatus: {
          moduleName: "egov-workflow",
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          visible: false,
          componentJsonpath: 'components.div.children.taskStatus',
          props: {
            dataPath: "",
            moduleName: "",
            updateUrl: ""
          }
        },
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        footer
      }
    },
    billAmdAlertDialog :{
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "sm"
      },
      children: {
        dialogTitle:{
          componentPath: "DialogTitle",
          children: {
            popup: getCommonContainer({
              billamdHeader: getCommonHeader({
                labelName: "Confirm change",
                labelKey: "BILL_CONFIRM_CHANGE_HEADER"
              }),
            }) 
          }
        },
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
          },
          children: {
            popup: getCommonContainer({
              billamdSubheader: getCommonSubHeader ({
                labelName: "Changing the Demand Revision basis will erase the previosly selected values.",
                labelKey: "BILL_CONFIRM_CHANGE_SUB_HEADER"
              }),
              billamdSubheader1: getCommonSubHeader ({
                labelName: "Are you sure want to proceed?",
                labelKey: "BILL_CONFIRM_CHANGE_SUB_HEADER_1"
              }),
              billAmdDialogPicker: getCommonContainer({
                div: {
                  uiFramework: "custom-atoms",
                  componentPath: "Div",
                  children: {
                    selectButton: {
                      componentPath: "Button",
                      props: {
                        variant: "outlined",
                        color: "primary",
                        style: {
                          width: "110px",
                          height: "30px",
                          marginRight: "4px",
                          marginTop: "16px"
                        }
                      },
                      children: {
                        previousButtonLabel: getLabel({
                          labelName: "CANCEL",
                          labelKey: "BILL_CANCEL_BUTTON"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: cancelPopUp
                      }
                    },
                    cancelButton: {
                      componentPath: "Button",
                      props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                          width: "100px",
                          height: "30px",
                          marginRight: "4px",
                          marginTop: "16px"
                        }
                      },
                      children: {
                        previousButtonLabel: getLabel({
                          labelName: "OK",
                          labelKey: "BILL_OK_BUTTON"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: procedToNextStep
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
  }
};

export default screenConfig;
