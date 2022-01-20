import {
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { applyTradeLicense } from "../../../../../ui-utils/commons";
import { download } from "egov-common/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  getDocList,
  validateFields,
  ifUserRoleExists,
  createEstimateData,
  prepareBPAREGDocumentDetailsUploadRedux
} from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg, getLocaleLabels, getTransformedLocalStorgaeLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { setTenantId, getTenantId } from "egov-ui-kit/utils/localStorageUtils";

import {
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import generateReceipt from "../../utils/receiptPdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import some from "lodash/some";
import jp from "jsonpath";
import commonConfig from "config/common.js";

const moveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = getTenantId();//process.env.REACT_APP_DEFAULT_TENANT_ID;
  const financialYear = get(LicenseData, "financialYear");
  const purpose = "apply";
  const status = "success";
  if (window.location.pathname.includes("openlink")) {
    dispatch(
      setRoute(
        `/openlink/bpastakeholder/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
      )
    );
  } else {
    dispatch(
      setRoute(
        `/bpastakeholder/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
      )
    );
  }
};
export const generatePdfFromDiv = (action, applicationNumber) => {
  let target = document.querySelector("#custom-atoms-div");
  html2canvas(target, {
    onclone: function(clonedDoc) {
      // clonedDoc.getElementById("custom-atoms-footer")[
      //   "data-html2canvas-ignore"
      // ] = "true";
      clonedDoc.getElementById("custom-atoms-footer").style.display = "none";
    }
  }).then(canvas => {
    var data = canvas.toDataURL("image/jpeg", 1);
    var imgWidth = 200;
    var pageHeight = 295;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var doc = new jsPDF("p", "mm");
    var position = 0;

    doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    if (action === "download") {
      doc.save(`preview-${applicationNumber}.pdf`);
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  });
};

const prepareDocumentsDetailsView = async (state, dispatch) => {
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.bparegDocumentDetailsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0) {
      documentsPreview.push({
        title: getTransformedLocale(doc.documentCode),
        name: doc.documents[0].fileName,
        fileStoreId: doc.documents[0].fileStoreId,
        linkText: "View",
        link: doc.documents[0].fileUrl && doc.documents[0].fileUrl.length > 0 && doc.documents[0].fileUrl.split(",")[0]
      });
    }
  });
  dispatch( prepareFinalObject("LicensesTemp[0].reviewDocData", documentsPreview) );
};

const getSummaryRequiredDetails = async (state, dispatch) => {
  const LicenseData = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0]",
    {}
  );
  createEstimateData(
    LicenseData,
    "LicensesTemp[0].estimateCardData",
    dispatch,
    {},
    true
  ); //get bill and populate estimate card
  let getLicenceValidData = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.tradeSubType[0].validityPeriod", 0
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.footnoteOFLicenceValid.children.footNote",
      "props.labelKey[1]",
      getLicenceValidData
    )
  );
  const tradeType = get(LicenseData, "tradeLicenseDetail.tradeUnits[0].tradeType");
  if (tradeType.split('.')[0] == "ARCHITECT") {
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
        "visible",
        true
      )
    );
  } else {
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
        "visible",
        false
      )
    );
  }
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewValidityPeriod",
      "visible",
      false
    )
  );
 
  prepareDocumentsDetailsView(state, dispatch);
}

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = true;
  if (activeStep === 0) {
    const isLicenseeTypeValid = validateFields(
      "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container1.children",
      state,
      dispatch
    );
    const isLicenseeSubTypeValid = validateFields(
      "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children",
      state,
      dispatch
    );
    const isLicenseeCOAValid = validateFields(
      "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children",
      state,
      dispatch
    );
    const licenseType = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
      ""
    );
    if(licenseType && licenseType != "BUILDER.CLASSA") {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.declarationSummary.children.header.children.body.children.checkbox",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.declarationSummary.children.header.children.body.children.checkbox2",
          "visible",
          true
        )
      );
    } else {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.declarationSummary.children.header.children.body.children.checkbox2",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.declarationSummary.children.header.children.body.children.checkbox",
          "visible",
          true
        )
      );
    }

    if (
      !isLicenseeCOAValid ||
      !isLicenseeSubTypeValid ||
      !isLicenseeTypeValid
    ) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {
    const data = get(state.screenConfiguration, "preparedFinalObject");

    const isTradeDetailsValid = validateFields(
      "components.div.children.formwizardSecondStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children",
      state,
      dispatch
    );
    // let isTradeOrganizationValid = true;

    // let ownershipType = get(
    //   data,
    //   "Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
    // );

    // if (ownershipType != "INDIVIDUAL") {
    //   isTradeOrganizationValid = validateFields(
    //     "components.div.children.formwizardFirstStep.children.organizationDetails.children.cardContent.children.organizationDetailsConatiner.children",
    //     state,
    //     dispatch
    //   );
    // }

    const isPermanentAddrValid = validateFields(
      "components.div.children.formwizardSecondtep.children.permanentAddr.children.cardContent.children.tradeDetailsConatiner.children",
      state,
      dispatch
    );
    const isCommunicationAddrValid = validateFields(
      "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children",
      state,
      dispatch
    );

    if (
      !isTradeDetailsValid ||
      !isPermanentAddrValid ||
      !isCommunicationAddrValid
    ) {
      isFormValid = false;
    } else {
      let isDocsEdit = get(
        state.screenConfiguration.preparedFinalObject, 
        "LicensesTemp[0].isDocsEdit", ""
      );
      await getDocList(state, dispatch);
      if(isDocsEdit != true){
        await prepareBPAREGDocumentDetailsUploadRedux(state, dispatch);
      }

      isFormValid = await applyTradeLicense(state, dispatch);
      if (!isFormValid) {
        hasFieldToaster = false;
      }
      let tenantIdInLocastorage = getTenantId();
      if (!tenantIdInLocastorage || tenantIdInLocastorage == "null"){
        let tenantId = window.globalConfigs.getConfig("STATE_LEVEL_TENANT_ID")  || process.env.REACT_APP_DEFAULT_TENANT_ID;
        setTenantId(tenantId)
        localStorage.setItem("Citizen.tenant-id", tenantId);
      }
    }
  }

  if (activeStep === 2) {
    const documentsFormat = Object.values(
      get(state.screenConfiguration.preparedFinalObject, "bparegDocumentDetailsUploadRedux")
    );

    let validateDocumentField = false;
    if (documentsFormat && documentsFormat.length) {
      for (let i = 0; i < documentsFormat.length; i++) {
        let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
        let isDocumentTypeRequired = get( documentsFormat[i], "isDocumentTypeRequired" );
        let documents = get(documentsFormat[i], "documents");
        if (isDocumentRequired) {
          if (documents && documents.length > 0) {
            if (isDocumentTypeRequired) {
              if (get(documentsFormat[i], "dropDownValues.value")) {
                validateDocumentField = true;
              } else {
                dispatch(
                  toggleSnackbar(
                    true,
                    { labelName: "Please select type of Document!", labelKey: "BPA_FOOTER_SELECT_DOC_TYPE" },
                    "warning"
                  )
                );
                validateDocumentField = false;
                break;
              }
            } else {
              validateDocumentField = true;
            }
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please uplaod mandatory documents!", labelKey: "BPA_FOOTER_UPLOAD_MANDATORY_DOC" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      }
      if (!validateDocumentField) {
      isFormValid = false;
      hasFieldToaster = true;
      } else {
        getSummaryRequiredDetails(state, dispatch);
      }
    } else {
      getSummaryRequiredDetails(state, dispatch);
    }
  }

  if (activeStep === 3) {
    const LicenseData = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0]"
    );
    const isDeclared = get(
      state.screenConfiguration.preparedFinalObject,
      "LicensesTemp.isDeclared"
    );
    
    if (isDeclared) {
      isFormValid = await applyTradeLicense(state, dispatch, 2);
      moveToSuccess(LicenseData, dispatch);
    }
    else {
      let errorMessage = {
        labelName: "Please confirm the declaration!",
        labelKey: "ERR_FILL_DECLARATION_MESSAGE"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));      
    }
  }
  if (activeStep !== 3) {
    if (isFormValid) {
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields and upload the documents !",
        labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case 0:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Stakeholder Registration, then do next!",
            labelKey: "ERR_FILL_BPA_FIELDS"
          };
          break;
        case 1:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Stakeholder Registration, then do next!",
            labelKey: "ERR_FILL_BPA_FIELDS"
          };
          break;
        case 2:
          errorMessage = {
            labelName: "Please upload all the required documents!",
            labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 3 ? true : false;
  const isSubmitButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.submitButton",
      property: "visible",
      value: isSubmitButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "BPA_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "BPA_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "BPA_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const footerReview = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  const redirectionURL = roleExists ? "/tradelicense-citizen" : "/tradelicence";

  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      generateReceipt(state, dispatch, "certificate_download");
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      generateReceipt(state, dispatch, "certificate_print");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      generatePdfFromDiv("download", applicationNumber);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      generatePdfFromDiv("print", applicationNumber);
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        tlCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "pending_approval":
      downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      printMenu = [receiptPrintObject, applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return getCommonApplyFooter({
    container: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        leftdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            style: { textAlign: "left", display: "flex" }
          },
          children: {
            // downloadMenu: {
            //   uiFramework: "custom-atoms-local",
            //   moduleName: "egov-tradelicence",
            //   componentPath: "MenuButton",
            //   props: {
            //     data: {
            //       label: "Download",
            //       leftIcon: "cloud_download",
            //       rightIcon: "arrow_drop_down",
            //       props: { variant: "outlined", style: { marginLeft: 10 } },
            //       menu: downloadMenu
            //     }
            //   }
            // },
            // printMenu: {
            //   uiFramework: "custom-atoms-local",
            //   moduleName: "egov-tradelicence",
            //   componentPath: "MenuButton",
            //   props: {
            //     data: {
            //       label: "Print",
            //       leftIcon: "print",
            //       rightIcon: "arrow_drop_down",
            //       props: { variant: "outlined", style: { marginLeft: 10 } },
            //       menu: printMenu
            //     }
            //   }
            // }
          },
          gridDefination: {
            xs: 12,
            sm: 6
          }
        },
        rightdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            rejectButton: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  minWidth: "200px",
                  height: "48px",
                  marginRight: "16px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "Reject",
                  labelKey: "TL_APPROVER_TRADE_APP_BUTTON_REJECT"
                })
              },
              onClickDefination: {
                action: "page_change",
                path: `/tradelicence/approve?purpose=reject&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
              },
              visible: getButtonVisibility(status, "REJECT"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_APPROVER"]
              }
            },
            approveButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "200px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "APPROVE",
                  labelKey: "TL_APPROVER_TRADE_APP_BUTTON_APPROVE"
                })
              },
              onClickDefination: {
                action: "page_change",
                path: `/tradelicence/approve?applicationNumber=${applicationNumber}&tenantId=${tenantId}`
              },
              visible: getButtonVisibility(status, "APPROVE"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_APPROVER"]
              }
            },
            proceedPayButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "200px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "PROCEED TO PAYMENT",
                  labelKey: "TL_COMMON_BUTTON_PROC_PMT"
                })
              },
              onClickDefination: {
                action: "page_change",
                path: `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=BPAREG`
                //path: `${redirectionURL}/pay?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=TL`
              },
              roleDefination: {
                rolePath: "user-info.roles",
                action: "PAY"
              }
            },
            cancelButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "200px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "CANCEL TRADE LICENSE",
                  labelKey: "TL_COMMON_BUTTON_CANCEL_LICENSE"
                })
              },
              onClickDefination: {
                action: "page_change",
                path: `/tradelicence/approve?purpose=cancel&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
              },
              visible: getButtonVisibility(status, "CANCEL TRADE LICENSE"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_APPROVER"]
              }
            }
          },
          gridDefination: {
            xs: 12,
            sm: 6
          }
        }
      }
    }
  });
};

export const updateDownloadandPrintMenu = (action, state, dispatch, status) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  const receiptQueryString = [
    {
      key: "consumerCodes",
      value: get(
        state.screenConfiguration.preparedFinalObject.Licenses[0],
        "applicationNumber"
      )
    },
    {
      key: "tenantId",
      value: get(
        state.screenConfiguration.preparedFinalObject.Licenses[0],
        "tenantId"
      )
    },
    {
      key: "businessService",
      value: "BPAREG"
      
    }
  ];
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      download(receiptQueryString,"download",'consolidatedreceipt','PAYMENT');
    },
    leftIcon: "receipt"
  };

  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      download(receiptQueryString,"print",'consolidatedreceipt','PAYMENT');
    },
    leftIcon: "receipt"
  };

  switch (status) {
    case "PENDINGDOCVERIFICATION":
    case "PENDINGAPPROVAL":
    case "REJECTED":
    case "APPROVED":
      downloadMenu = [receiptDownloadObject];
      printMenu = [receiptPrintObject];
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu.props",
          "data.menu",
          downloadMenu
        )
      );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu.props",
          "data.menu",
          printMenu
        )
      );
      break;
    default:
      break;
  }
};
