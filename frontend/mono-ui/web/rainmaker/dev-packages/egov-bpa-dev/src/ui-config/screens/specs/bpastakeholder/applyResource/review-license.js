import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "../../utils";

import { changeStep } from "./footer";

export const reviewLicenseeType = getLabelWithValue(
  {
    labelName: "Technical Person Licensee Type",
    labelKey: "BPA_LICENSEE_TYPE_LABEL"
  },
  {
    jsonPath: "LicensesTemp[0].tradeLicenseDetail.tradeUnits[0].tradeType",
    localePrefix: {
      moduleName: "TRADELICENSE",
      masterName: "TRADETYPE"
    },
    callBack: checkValueForNA
  }
);

export const reviewLicenseeSubType = getLabelWithValue(
  {
    labelName: "Technical Person Licensee Sub Type",
    labelKey: "BPA_LICENSEE_SUB_TYPE_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
    localePrefix: {
      moduleName: "TRADELICENSE",
      masterName: "TRADETYPE"
    },
    callBack: checkValueForNA
  }
);

export const reviewcounsilForArchNo = getLabelWithValue(
  {
    labelName: "Council for Architecture No.",
    labelKey: "BPA_COUNCIL_FOR_ARCH_NO_LABEL"
  },
  {
    jsonPath:
      "Licenses[0].tradeLicenseDetail.additionalDetail.counsilForArchNo",
    callBack: checkValueForNA
  }
);

export const reviewValidityPeriod = getLabelWithValue(
  {
    labelName: "License valid up to.",
    labelKey: "BPA_LICENSE_VALID_UP_TO_LABEL"
  },
  {
    jsonPath: "Licenses[0].validTo",
    callBack: value => {
      return convertEpochToDate(value) || checkValueForNA;
    }
  }
);

export const getReviewLicenseDetails = (isEditable = true) => {
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
              labelKey: "BPA_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    multiOwner: getCommonContainer({
      viewFive: getCommonContainer({
        reviewLicenseeType,
        // reviewLicenseeSubType,
        reviewcounsilForArchNo,
        reviewValidityPeriod
      })
    })
  });
};
