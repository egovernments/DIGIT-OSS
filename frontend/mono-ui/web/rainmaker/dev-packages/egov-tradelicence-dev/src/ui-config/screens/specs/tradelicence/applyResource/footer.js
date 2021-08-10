import { download } from "egov-common/ui-utils/commons";
import { dispatchMultipleFieldChangeAction, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { generateTLAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateTLAcknowledgement";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import set from "lodash/set";
import some from "lodash/some";
import { applyTradeLicense, checkValidOwners, getNextFinancialYearForRenewal } from "../../../../../ui-utils/commons";
import {createEstimateData,downloadCertificateForm, getButtonVisibility,getCommonApplyFooter,getDocList, setMultiOwnerForApply,setValidToFromVisibilityForApply,validateFields} from "../../utils";
import "./index.css";

const moveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = get(LicenseData, "tenantId");
  const financialYear = get(LicenseData, "financialYear");
  const purpose = "apply";
  const status = "success";
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
    )
  );
};
const editRenewalMoveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = get(LicenseData, "tenantId");
  const financialYear = get(LicenseData, "financialYear");
  const licenseNumber = get(LicenseData, "licenseNumber");
  const purpose = "EDITRENEWAL";
  const status = "success";
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&licenseNumber=${licenseNumber}&FY=${financialYear}&tenantId=${tenantId}`
    )
  );
};

export const generatePdfFromDiv = (action, applicationNumber) => {
  let target = document.querySelector("#custom-atoms-div");
  html2canvas(target, {
    onclone: function (clonedDoc) {
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

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = true;
  if (activeStep === 0) {
    const isTradeDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children",
      state,
      dispatch
    );
    const isTradeLocationValid = validateFields(
      "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children",
      state,
      dispatch
    );
    let accessoriesJsonPath =
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.accessoriesCard.props.items";
    let accessories = get(
      state.screenConfiguration.screenConfig.apply,
      accessoriesJsonPath,
      []
    );
    let isAccessoriesValid = true;
    for (var i = 0; i < accessories.length; i++) {
      if (
        (accessories[i].isDeleted === undefined ||
          accessories[i].isDeleted !== false) &&
        !validateFields(
          `${accessoriesJsonPath}[${i}].item${i}.children.cardContent.children.accessoriesCardContainer.children`,
          state,
          dispatch
        )
      )
        isAccessoriesValid = false;
    }

    let tradeUnitJsonPath =
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items";
    let tradeUnits = get(
      state.screenConfiguration.screenConfig.apply,
      tradeUnitJsonPath,
      []
    );
    let isTradeUnitValid = true;

    for (var j = 0; j < tradeUnits.length; j++) {
      if (
        (tradeUnits[j].isDeleted === undefined ||
          tradeUnits[j].isDeleted !== false) &&
        !validateFields(
          `${tradeUnitJsonPath}[${j}].item${j}.children.cardContent.children.tradeUnitCardContainer.children`,
          state,
          dispatch
        )
      )
        isTradeUnitValid = false;
    }
    if (
      !isTradeDetailsValid ||
      !isTradeLocationValid ||
      !isAccessoriesValid ||
      !isTradeUnitValid
    ) {
      isFormValid = false;
    }
    let ownership = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
      "INDIVIDUAL"
    );
    // ownership = ownership.split(".")[0];
    let subOwnerShipCategoryType = ownership.split(".")[1];
      if (subOwnerShipCategoryType === "MULTIPLEOWNERS") {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
            "props.hasAddItem",
            true
          )
        );
      }else {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
            "props.hasAddItem",
            false
          )
        );
      }
  }

  if (activeStep === 1) {
    await getDocList(state, dispatch);

    let isOwnerShipValid = validateFields(
      "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownershipType.children",
      state,
      dispatch
    );
    let ownership = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
      "INDIVIDUAL"
    );
    ownership = ownership.split(".")[0];
    if (ownership === "INDIVIDUAL") {
      let ownersJsonPath =
        "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard.props.items";
      let owners = get(
        state.screenConfiguration.screenConfig.apply,
        ownersJsonPath,
        []
      );
      for (var k = 0; k < owners.length; k++) {
        if (
          (owners[k].isDeleted === undefined ||
            owners[k].isDeleted !== false) &&
          !validateFields(
            `${ownersJsonPath}[${k}].item${k}.children.cardContent.children.tradeUnitCardContainer.children`,
            state,
            dispatch
          )
        )
          isFormValid = false;
      }
    } else {
      let ownersJsonPath =
        "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownerInfoInstitutional.children.cardContent.children.tradeUnitCardContainerInstitutional.children";
      if (!validateFields(ownersJsonPath, state, dispatch)) isFormValid = false;
    }

    // check for multiple owners
    if (
      get(
        state.screenConfiguration.preparedFinalObject,
        "Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
      ) === "INDIVIDUAL.MULTIPLEOWNERS" 
      &&
      get(
        state.screenConfiguration.preparedFinalObject,
        "Licenses[0].tradeLicenseDetail.owners"
      )
      &&
      get(
        state.screenConfiguration.preparedFinalObject,
        "Licenses[0].tradeLicenseDetail.owners"
      ).length <= 1
    ) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please add multiple owners !",
            labelKey: "ERR_ADD_MULTIPLE_OWNERS"
          },
          "error"
        )
      );
      return false; // to show the above message
    }
    if (isFormValid && isOwnerShipValid) {
      isFormValid = await applyTradeLicense(state, dispatch, activeStep);
      if (!isFormValid) {
        hasFieldToaster = false;
      }
    } else {
      isFormValid = false;
    }
  }
  if (activeStep === 2) {
    const LicenseData = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0]",
      {}
    );

    get(LicenseData, "tradeLicenseDetail.subOwnerShipCategory") &&
      get(LicenseData, "tradeLicenseDetail.subOwnerShipCategory").split(
        "."
      )[0] === "INDIVIDUAL"
      ? setMultiOwnerForApply(state, true)
      : setMultiOwnerForApply(state, false);

    if (get(LicenseData, "licenseType")) {
      setValidToFromVisibilityForApply(state, get(LicenseData, "licenseType"));
    }

    let uploadedDocData = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.applicationDocuments",
      []
    );

    const uploadedTempDocData = get(
      state.screenConfiguration.preparedFinalObject,
      "LicensesTemp[0].applicationDocuments",
      []
    );
    for (var y = 0; y < uploadedTempDocData.length; y++) {
      if (
        uploadedTempDocData[y].required &&
        !some(uploadedDocData, { documentType: uploadedTempDocData[y].code })
      ) {
        isFormValid = false;
      }
    }

    if (isFormValid) {
      if (getQueryArg(window.location.href, "action") === "edit") {
        //EDIT FLOW
        const businessId = getQueryArg(
          window.location.href,
          "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        let oldOwners = JSON.parse(
          JSON.stringify(
            get(state.screenConfiguration.preparedFinalObject, "LicensesTemp[0].tradeLicenseDetail.owners", [])
          )
        );
        dispatch(prepareFinalObject( "Licenses[0].tradeLicenseDetail.owners", checkValidOwners(get(state.screenConfiguration.preparedFinalObject, "Licenses[0].tradeLicenseDetail.owners",[]),oldOwners)));
        dispatch(
          setRoute(
            `/tradelicence/search-preview?applicationNumber=${businessId}&tenantId=${tenantId}&edited=true`
          )
        );
        const updateMessage = {
          labelName: "Rates will be updated on submission",
          labelKey: "TL_COMMON_EDIT_UPDATE_MESSAGE"
        };
        dispatch(toggleSnackbar(true, updateMessage, "info"));
      }
      uploadedDocData=uploadedDocData.filter(item=> item.fileUrl&&item.fileName)
      const reviewDocData =
        uploadedDocData &&
        uploadedDocData.map(item => {
          return {
            title: `TL_${item.documentType}`,
            link: item.fileUrl && item.fileUrl.split(",")[0],
            linkText: "View",
            name: item.fileName
          };
        });
      createEstimateData(
        LicenseData,
        "LicensesTemp[0].estimateCardData",
        dispatch
      ); //get bill and populate estimate card
      dispatch(
        prepareFinalObject("LicensesTemp[0].reviewDocData", reviewDocData)
      );
      const summaryLocalPrefix = {
        masterName: "REVENUE",
        moduleName: get( state.screenConfiguration.preparedFinalObject, "Licenses[0].tenantId", "" ).replace('.', '_').toUpperCase()
      };
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewFour.children.reviewMohalla.children.value.children.key",
          "props.localePrefix",
          summaryLocalPrefix
        )
      );      
    }
  }
  if (activeStep === 3) {
    const LicenseData = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0]"
    );
    isFormValid = await applyTradeLicense(state, dispatch, activeStep);
    if (isFormValid) {
      if (getQueryArg(window.location.href, "action") === "EDITRENEWAL")
        editRenewalMoveToSuccess(LicenseData, dispatch);
      else
        moveToSuccess(LicenseData, dispatch);
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
              "Please fill all mandatory fields for Trade Details, then do next !",
            labelKey: "ERR_FILL_TRADE_MANDATORY_FIELDS"
          };
          break;
        case 1:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Owner Details, then do next !",
            labelKey: "ERR_FILL_OWNERS_MANDATORY_FIELDS"
          };
          break;
        case 2:
          errorMessage = {
            labelName: "Please upload all the required documents !",
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
    if (activeStep === 2 && mode === "next") {
      const isDocsUploaded = get(
        state.screenConfiguration.preparedFinalObject,
        "LicensesTemp[0].reviewDocData",
        null
      );
      activeStep = isDocsUploaded ? 3 : 2;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 3 ? true : false;
  const isPayButtonVisible = activeStep === 3 ? true : false;
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
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
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
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit"
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
        labelKey: "TL_COMMON_BUTTON_PREV_STEP"
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
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "TL_COMMON_BUTTON_NXT_STEP"
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
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "TL_COMMON_BUTTON_SUBMIT"
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



export const renewTradelicence = async (financialYear, state, dispatch) => {
  const licences = get(
    state.screenConfiguration.preparedFinalObject,
    `Licenses`
  );

  const tenantId = get(licences[0], "tenantId");

  const nextFinancialYear = await getNextFinancialYearForRenewal(financialYear);

  const wfCode = "DIRECTRENEWAL";
  set(licences[0], "action", "INITIATE");
  set(licences[0], "workflowCode", wfCode);
  set(licences[0], "applicationType", "RENEWAL");
  set(licences[0], "financialYear", nextFinancialYear);

  const response = await httpRequest("post", "/tl-services/v1/_update", "", [], {
    Licenses: licences
  })
  const renewedapplicationNo = get(
    response,
    `Licenses[0].applicationNumber`
  );
  const licenseNumber = get(
    response,
    `Licenses[0].licenseNumber`
  );
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=EDITRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&FY=${nextFinancialYear}&tenantId=${tenantId}&action=${wfCode}`
    ));
};

export const footerReview = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {
  /** MenuButton data based on status */
  let licenseNumber = get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );

  return getCommonApplyFooter({
    container: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        rightdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {

            style: {
              float: "right",
              display: "flex"
            }
          },
          children: {

            resubmitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "RESUBMIT",
                  labelKey: "TL_RESUBMIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: openPopup
              },
              visible: getButtonVisibility(status, "RESUBMIT"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_CEMP", "CITIZEN"]
              }
            },
            editButton: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "16px",
                  borderRadius: "inherit"
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
                  labelName: "Edit for Renewal",
                  labelKey: "TL_RENEWAL_BUTTON_EDIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                      // `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
                      `/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
                    )
                  );
                },

              },
              visible: (getButtonVisibility(status, "APPROVED") || getButtonVisibility(status, "EXPIRED")) && (responseLength === 1),
            },
            submitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px",
                  borderRadius: "inherit"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "Submit for Renewal",
                  labelKey: "TL_RENEWAL_BUTTON_SUBMIT"
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
                callBack: () => {
                  renewTradelicence(financialYear, state, dispatch);
                },

              },
              visible: (getButtonVisibility(status, "APPROVED") || getButtonVisibility(status, "EXPIRED")) && (responseLength === 1),
            },
            makePayment: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px",
                  borderRadius: "inherit"
                }
              },
              children: {
                submitButtonLabel: getLabel({
                  labelName: "MAKE PAYMENT",
                  labelKey: "TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                      `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=TL`
                    )
                  );
                },

              },
              visible: process.env.REACT_APP_NAME === "Citizen" && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
            }
          },
          gridDefination: {
            xs: 12,
            sm: 12
          }
        },
      }
    }
  });
};
export const footerReviewTop = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let licenseNumber = get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
  const uiCommonConfig = get(state.screenConfiguration.preparedFinalObject, "uiCommonConfig");
  const receiptKey = get(uiCommonConfig, "receiptKey");
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );
  // let renewalMenu=[];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value:'TL' }    
      ]
      download(receiptQueryString, "download", receiptKey||"consolidatedreceipt",'PAYMENT' ,state);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value:'TL' }   
      ]
      download(receiptQueryString, "print", receiptKey||"consolidatedreceipt",'PAYMENT', state);
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, `tl-acknowledgement-${Licenses[0].applicationNumber}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, 'print');

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
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
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

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "TL_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }

};

export const openPopup = (state, dispatch) => {
  dispatch(
    prepareFinalObject("ResubmitAction", true)
  );
}

export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {
  /** MenuButton data based on status */
  const uiCommonConfig = get(state.screenConfiguration.preparedFinalObject, "uiCommonConfig");
  const receiptKey = get(uiCommonConfig, "receiptKey");
  let downloadMenu = [];
  let printMenu = [];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value:'TL' }   
      ]
      download(receiptQueryString, "download", receiptKey);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value:'TL' }   
      ]
      download(receiptQueryString, "print", receiptKey);
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      // downloadAcknowledgementForm(Licenses);
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, `tl-acknowledgement-${Licenses[0].applicationNumber}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      // downloadAcknowledgementForm(Licenses,'print');
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, 'print');
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
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
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

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "TL_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
