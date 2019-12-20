import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const basicSummary = getCommonGrayCard({
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
          labelName: "Basic Details",
          labelKey: "BPA_BASIC_DETAILS_TITLE"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
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
            gotoApplyWithStep(state, dispatch, 0);
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        basicDetailsContainer: getCommonContainer({
          scrutinynumber: getLabelWithValue(
            {
              labelName: "Building plan scrutiny number",
              labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_LABEL"
            },
            {
              jsonPath: "BPA.edcrNumber",
              callBack: value => {
                return value //`COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
              }
            }
          ),
          occupancy: getLabelWithValue(
            {
              labelName: "occupancy",
              labelKey: "BPA_BASIC_DETAILS_OCCUPANCY_LABEL"
            },
            {
              jsonPath:
                "srutinyDetails.planDetail.planInformation.occupancy",
              callBack: value => {
                return value //`COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
              }
            }
          ),
          applicationtype: getLabelWithValue(
            {
              labelName: "Application Type",
              labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
            },
            {
              jsonPath:
                "BPA.applicationType"
            }
          ),
          servicetype: getLabelWithValue(
            {
              labelName: "Service Type",
              labelKey: "Service Type"
            },
            {
              jsonPath: "BPA.serviceType"
            }
          ),
          risktype: getLabelWithValue(
            {
              labelName: "Risk Type",
              labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
            },
            {
              jsonPath: "BPA.riskType"
            }
          ),
          applicationdate: getLabelWithValue(
            {
              labelName: "Application Date",
              labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
            },
            {
              jsonPath:
                "srutinyDetails.planDetail.applicationDate"
            }
          ),
          applicationFee: getLabelWithValue(
            {
              labelName: "Application Fee",
              labelKey: "BPA_BASIC_DETAILS_APP_FEE_LABEL"
            },
            {
              jsonPath:
                "BPA.appfee"
            }
          ),
          remarks: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "BPA_BASIC_DETAILS_REMARKS_LABEL"
            },
            {
              jsonPath:
                "BPA.remarks"
            }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "BPA",
      prefixSourceJsonPath:
        "children.cardContent.children.basicDetailsContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});
