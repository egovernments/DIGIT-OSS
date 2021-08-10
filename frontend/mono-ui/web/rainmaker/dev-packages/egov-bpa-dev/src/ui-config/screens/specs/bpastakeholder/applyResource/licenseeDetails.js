import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";

import { setLicenseeSubTypeDropdownData } from "../../utils";

export const LicenseeCard = getCommonCard({
  header: getCommonSubHeader(
    {
      labelName: "Licensee Details",
      labelKey: "BPA_LICENSEE_DETAILS_HEADER_OWNER_INFO"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  tradeUnitCardContainer: getCommonContainer({
    container1: getCommonContainer({
      licenseeType: {
        ...getSelectField({
          label: {
            labelName: "Technical Person Licensee Type",
            labelKey: "BPA_LICENSEE_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Technical Person Licensee Type",
            labelKey: "BPA_LICENSEE_TYPE_PLACEHOLDER"
          },
          required: true,
          jsonPath:
            "LicensesTemp[0].tradeLicenseDetail.tradeUnits[0].tradeType",
          localePrefix: {
            moduleName: "TRADELICENSE",
            masterName: "TRADETYPE"
          },
          sourceJsonPath:
            "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
          gridDefination: {
            xs: 12,
            sm: 6
          }
        }),
        beforeFieldChange: async (action, state, dispatch) => {
          let previousValue = get(
            state.screenConfiguration.preparedFinalObject,
            "LicensesTemp[0].tradeLicenseDetail.tradeUnits[0].tradeType"
          );
          let counsilForArchNo = get(
            state.screenConfiguration.preparedFinalObject,
            "Licenses[0].tradeLicenseDetail.additionalDetail.counsilForArchNo"
          );
          if (action.value !== previousValue) {
            await setLicenseeSubTypeDropdownData(action.value, state, dispatch);
            if(counsilForArchNo) {
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
                  "props.value",
                  ""
                )
              );
              };
              dispatch(prepareFinalObject("LicensesTemp.isDeclared",false));
          }

          if (action.value == "ARCHITECT") {
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
                "required",
                true
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardForthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
                "visible",
                true
              )
            )
          } else {
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
                "visible",
                false
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
                "required",
                false
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardForthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
                "visible",
                false
              )
            );   
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewLicenseDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
                "visible",
                false
              )
            )      
            if(counsilForArchNo) {
              dispatch(prepareFinalObject("Licenses[0].tradeLicenseDetail.additionalDetail.counsilForArchNo", ""));
            }
          }
          let getClassOfLicenseType = get(
            state.screenConfiguration.preparedFinalObject,
            "applyScreenMdmsData.TradeLicense.tradeSubType[0].code"
          );
          if(getClassOfLicenseType) {
            dispatch(prepareFinalObject("Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType", getClassOfLicenseType));
          }
        }
      }
    }),
    container2: getCommonContainer({
      licenseeSubType: {
        ...getSelectField({
          label: {
            labelName: "Technical Person Licensee Sub Type",
            labelKey: "BPA_LICENSEE_SUB_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Technical Person Licensee Sub Type",
            labelKey: "BPA_LICENSEE_SUB_TYPE_PLACEHOLDER"
          },
          required: true,
          visible: false,
          jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
          localePrefix: {
            moduleName: "TRADELICENSE",
            masterName: "TRADETYPE"
          },
          // props: {
          //   jsonPathUpdatePrefix: "LicensesTemp.tradeUnits",
          //   setDataInField: true
          // },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.tradeSubType",
          gridDefination: {
            xs: 12,
            sm: 6
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {}
      }
    }),
    container3: getCommonContainer({
      counsilForArchNo: getTextField({
        label: {
          labelName: "Council for Architecture No.",
          labelKey: "BPA_COUNCIL_FOR_ARCH_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Council for Architecture No.",
          labelKey: "BPA_COUNCIL_FOR_ARCH_NO_PLACEHOLDER"
        },
        visible: false,
        required: true,
        jsonPath:
          "Licenses[0].tradeLicenseDetail.additionalDetail.counsilForArchNo"
      })
    })
  })
});

export const tradeOwnerDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Trade Owner Details",
      labelKey: "BPA_NEW_OWNER_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  LicenseeCard
});
