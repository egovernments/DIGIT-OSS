import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, checkValueForNA } from "../../utils";

import { changeStep } from "./footer";

export const reviewOwnerGender = getLabelWithValue(
  {
    labelName: "Gender",
    labelKey: "BPA_COMMON_GENDER_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    localePrefix: {
      moduleName: "COMMON",
      masterName: "GENDER"
    },
    callBack: checkValueForNA
  }
);

export const reviewOwnerDOB = getLabelWithValue(
  {
    labelName: "Date of Birth",
    labelKey: "BPA_APPLICANT_DOB_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    callBack: convertEpochToDate
  }
);

export const reviewOwnerPhoneNo = getLabelWithValue(
  {
    labelName: "Mobile No.",
    labelKey: "BPA_APPLICANT_MOBILE_NO_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber",
    callBack: checkValueForNA
  }
);
export const reviewOwnerEmail = getLabelWithValue(
  {
    labelName: "Email",
    labelKey: "BPA_APPLICANT_EMAIL_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId",
    callBack: checkValueForNA
  }
);
export const reviewOwnerPAN = getLabelWithValue(
  {
    labelName: "PAN No.",
    labelKey: "BPA_APPLICANT_PAN_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan",
    callBack: checkValueForNA
  }
);

export const getReviewOwner = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Applicant Details",
            labelKey: "BPA_COMMON_AP_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "BPA_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    multiOwner: getCommonContainer({
      viewFive: getCommonContainer({
        reviewApplicantName: getLabelWithValue(
          {
            labelName: "Applicant Name",
            labelKey: "BPA_APPLICANT_NAME_LABEL"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name" }
        ),
        reviewOwnerGender,
        reviewOwnerDOB,
        reviewOwnerPhoneNo,
        reviewOwnerEmail,
        reviewOwnerPAN
      })
    })
  });
};
