import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate } from "../../utils";

import { changeStep } from "./footer";

export const reviewLicenseeType = getLabelWithValue(
  {
    labelName: "Technical Person Licensee Type",
    labelKey: "BPA_LICENSEE_TYPE_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
    localePrefix: {
      moduleName: "TRADELICENSE",
      masterName: "TRADETYPE"
    }
  }
);
export const reviewOwnerGender = getLabelWithValue(
  {
    name: "Gender",
    key: "BAP_COMMON_GENDER_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    localePrefix: {
      moduleName: "COMMON",
      masterName: "GENDER"
    }
  }
);

export const reviewOwnerDOB = getLabelWithValue(
  {
    labelName: "Date of Birth",
    labelKey: "TL_EMP_APPLICATION_DOB"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    callBack: convertEpochToDate
  }
);

export const reviewOwnerPhoneNo = getLabelWithValue(
  {
    labelName: "Mobile No.",
    labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber"
  }
);
export const reviewOwnerEmail = getLabelWithValue(
  {
    labelName: "Email",
    labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId"
  }
);
export const reviewOwnerPAN = getLabelWithValue(
  {
    labelName: "PAN No.",
    labelKey: "TL_NEW_OWNER_DETAILS_PAN_LABEL"
  },
  { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan" }
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
            labelName: "Licensee Details",
            labelKey: "BPA_LICENSEE_DETAILS_HEADER_OWNER_INFO"
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
              labelKey: "TL_SUMMARY_EDIT"
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
    multiOwner: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        scheama: getCommonGrayCard({
          viewFive: getCommonContainer({
            reviewApplicantName: getLabelWithValue(
              {
                labelName: "Applicant Name",
                labelKey: "BPA_APPLICANT_NAME_LABEL"
              },
              { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name" }
            ),
            reviewLicenseeType,
            reviewOwnerGender,
            reviewOwnerDOB,
            reviewOwnerPhoneNo,
            reviewOwnerEmail,
            reviewOwnerPAN
          })
        }),

        items: [],
        hasAddItem: false,
        sourceJsonPath: "Licenses[0].tradeLicenseDetail.owners",
        prefixSourceJsonPath: "children.cardContent.children.viewFive.children",
        afterPrefixJsonPath: "children.value.children.key"
      },
      type: "array"
    }
  });
};
