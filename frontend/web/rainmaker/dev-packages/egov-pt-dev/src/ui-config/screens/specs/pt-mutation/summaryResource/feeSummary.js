import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getCommonContainerNew,
    ptFeeLabelWithValue,
    getCommonHeader, getTextField, getPattern,
    getSelectField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get"
  import { showHideAdhocPopup } from "../../utils"
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  // import { adhocPopups } from "../applyResource/adhocpopup";
  import { adhocPopup, adhocPopupFee} from "../adhocPopup"
  
  
  
  export const feeDetails = getCommonContainerNew({
    applicationFee: ptFeeLabelWithValue(
      {
        labelName: "Application Fee",
        labelKey: "PT_APPLICATION_FEE",
      },
      {
        jsonPath: "Property.additionalDetails.applicationFee",
        callBack: value => {
          return value ? value : "0";
        }
      }
    ),
    processingFee: ptFeeLabelWithValue(
      {
        labelName: "Processing Fee",
        labelKey: "PT_PROCESSING_FEE"
      },
      {
        jsonPath: "Property.additionalDetails.processingFee", callBack: value => {
          return value ? value : "0";
        }
      }
    ),
    mutationFee: ptFeeLabelWithValue(
      {
        labelName: "Mutation Fee",
        labelKey: "PT_MUTATION_FEE"
      },
      {
        jsonPath:
          "Property.additionalDetails.mutationFee",
        callBack: value => {
          return value ? value : "0";
        }
      }
    ),
    publicationFee: ptFeeLabelWithValue(
      {
        labelName: "Publication Fee",
        labelKey: "PT_PUBLICATION_FEE"
      },
      {
        jsonPath: "Property.additionalDetails.publicationFee",
        callBack: value => {
          return value ? value : "0";
        }
      }
    ),
    lateFee: ptFeeLabelWithValue(
      {
        labelName: "Late Fee",
        labelKey: "PT_LATE_FEE"
      },
      {
        jsonPath:
          "Property.additionalDetails.lateFee",
        callBack: value => {
          return value ? value : "0";
        }
      }
    ),
  });
  
  const mutationFeeDetails = getCommonGrayCard({
    feedetailsContainer: feeDetails,
    buttonContainer: getCommonContainer({
      openFeeDetails: {
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
          downloadReceiptButtonLabel: getLabel({
            labelName: "Open Fee details",
            labelKey: "Open Fee details"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            let toggle = get(
               state.screenConfiguration.screenConfig["search-preview"],
               "components.adhocDialog.props.open",
               false
             );
             dispatch(
               handleField("search-preview", "components.adhocDialog", "props.open", !toggle)
             );
  
            let mutationAdditionalDetails = state.screenConfiguration.preparedFinalObject
              && state.screenConfiguration.preparedFinalObject.MutationAdditionalFees
              && state.screenConfiguration.preparedFinalObject.MutationAdditionalFees[0]
            let mutDetails = get(
              state.screenConfiguration.screenConfig["search-preview"], 
              "components.div.children.body.children.cardContent.children.FeeSummary.children.cardContent.children.adhocDialog.children.popup.children.feeDetails.children", 
              false);
            if (mutationAdditionalDetails) {
              for (var mutKey in mutDetails) {
                var visible =mutationAdditionalDetails[mutKey] ? 
              (mutationAdditionalDetails[mutKey].enabledCities && 
                mutationAdditionalDetails[mutKey].enabledCities.includes(getTenantId()))
                  :false
                dispatch(handleField(
                  "search-preview",
                  `components.div.children.body.children.cardContent.children.FeeSummary.children.cardContent.children.adhocDialog.children.popup.children.feeDetails.children.${mutKey}`,
                  "visible",
                  visible
                ))
              }
            }
          }
        }
      },
    }),
  })
  
  
  export const FeeSummary = getCommonGrayCard({
    header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 8
          },
          ...getCommonSubHeader({
            labelName: "Property fee",
            labelKey: "Property fee"
          })
        }
      }
    },
    cardOne: mutationFeeDetails,
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: adhocPopupFee
      }
    }
    
  });