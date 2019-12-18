import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getDateField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {
  getDetailsForOwner,
  getTodaysDateInYMD,
  getRadioGroupWithLabel,
  setLicenseeSubTypeDropdownData
} from "../../utils";

import { prepareFinalObject as pFO } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRadioButton } from "egov-ui-framework/ui-config/screens/specs/utils";

export const getOwnerMobNoField = getTextField({
  label: {
    labelName: "Mobile No.",
    labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Mobile No.",
    labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_PLACEHOLDER"
  },
  iconObj: {
    label: "+91 |",
    position: "start"
  },
  required: true,
  pattern: getPattern("MobileNo"),
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber"
});

export const getGenderRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
    md: 6
  },
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
  props: {
    label: {
      name: "Gender",
      key: "BPA_COMMON_GENDER_LABEL"
    },
    //     {
    //       label: "Husband",
    //       labelKey: "COMMON_RELATION_HUSBAND",
    //       value: "HUSBAND"
    //     }
    //   ],
    //   "Licenses[0].tradeLicenseDetail.owners[0].relationship",
    //   ""
    // );

    buttons: [
      {
        labelName: "Male",
        labelKey: "COMMON_GENDER_MALE",
        value: "MALE"
      },
      {
        label: "Female",
        labelKey: "COMMON_GENDER_FEMALE",
        value: "FEMALE"
      },
      {
        label: "Transgender",
        labelKey: "COMMON_GENDER_TRANSGENDER",
        value: "OTHERS"
      }
    ],
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    required: true
  },
  required: true,
  type: "array"
};

export const getOwnerDOBField = getDateField({
  label: { labelName: "Date of Birth", labelKey: "TL_EMP_APPLICATION_DOB" },
  placeholder: {
    labelName: "Enter Date of Birth",
    labelKey: "TL_NEW_OWNER_DETAILS_DOB_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("Date"),
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
});

export const getOwnerEmailField = getTextField({
  label: {
    labelName: "Email",
    labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_LABEL"
  },
  placeholder: {
    labelName: "Enter Email",
    labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_PLACEHOLDER"
  },
  pattern: getPattern("Email"),
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId",
  required: true
});

export const OwnerInfoCard = getCommonCard({
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
    ownerName: getTextField({
      label: {
        labelName: "Applicant Name",
        labelKey: "BPA_APPLICANT_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "BPA_APPLICANT_NAME_LABEL_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Name"),
      jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name"
    }),
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
        jsonPath: "LicensesTemp[0].tradeLicenseDetail.tradeUnits[0].tradeType",
        localePrefix: {
          moduleName: "TRADELICENSE",
          masterName: "TRADETYPE"
        },
        sourceJsonPath: "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
        gridDefination: {
          xs: 12,
          sm: 6
        }
      }),
      beforeFieldChange: async (action, state, dispatch) => {
        await setLicenseeSubTypeDropdownData(action.value, state, dispatch);
        if (action.value == "ARCHITECT") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.counsilForArchNo",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.counsilForArchNo",
              "required",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
              "visible",
              true
            )
          );
        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.counsilForArchNo",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.counsilForArchNo",
              "required",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwner.children.viewFive.children.reviewcounsilForArchNo",
              "visible",
              false
            )
          );
        }
      }
    },
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
    },
    getGenderRadioButton,
    ownerDOB: {
      ...getDateField({
        label: {
          labelName: "Date of Birth",
          labelKey: "BPA_EMP_APPLICATION_DOB"
        },
        placeholder: {
          labelName: "Enter Date of Birth",
          labelKey: "BPA_NEW_OWNER_DETAILS_DOB_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        isDOB: true,
        errorMessage: "TL_DOB_ERROR_MESSAGE",
        jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
        props: {
          inputProps: {
            max: getTodaysDateInYMD()
          }
        }
      })
    },
    getOwnerMobNoField,
    getOwnerEmailField,
    ownerPAN: getTextField({
      label: {
        labelName: "PAN No.",
        labelKey: "TL_NEW_OWNER_DETAILS_PAN_LABEL"
      },
      placeholder: {
        labelName: "Enter Owner's PAN No.",
        labelKey: "TL_NEW_OWNER_DETAILS_PAN_PLACEHOLDER"
      },
      pattern: getPattern("PAN"),
      jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan"
    }),
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
});

export const tradeOwnerDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Trade Owner Details",
      labelKey: "TL_NEW_OWNER_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  OwnerInfoCard
});
