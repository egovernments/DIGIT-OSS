import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

export const applicantSummary = getCommonGrayCard({
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
          labelName: "Applicant Details",
          labelKey: "NOC_APPLICANT_DETAILS_HEADER"
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
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 2);
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
        applicantContainer: getCommonContainer({
          mobileNo: getLabelWithValue(
            {
              labelName: "Mobile No.",
              labelKey: "NOC_MOBILE_NO_LABEL"
            },
            {
              jsonPath: "noc.applicantDetails.applicant[0].mobileNo"
              // callBack: value => {
              //   return value.split(".")[0];
              // }
            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "NOC_APPLICANT_NAME_LABEL"
            },
            {
              jsonPath: "noc.applicantDetails.applicant[0].applicantName"
              // callBack: value => {
              //   return value.split(".")[1];
              // }
            }
          ),
          applicantGender: getLabelWithValue(
            {
              labelName: "Gender",
              labelKey: "NOC_APPLICANT_GENDER_LABEL"
            },
            { jsonPath: "noc.applicantDetails.applicant[0].applicantGender" }
          ),
          applicantFatherHusbandName: getLabelWithValue(
            {
              labelName: "Father/Husband's Name",
              labelKey: "NOC_FATHER_HUSBAND_NAME_LABEL"
            },
            {
              jsonPath:
                "noc.applicantDetails.applicant[0].applicantFatherHusbandName"
            }
          ),
          applicantDob: getLabelWithValue(
            {
              labelName: "Date of Birth",
              labelKey: "NOC_APPLICANT_DOB_LABEL"
            },
            { jsonPath: "noc.applicantDetails.applicant[0].applicantDob" }
          ),
          applicantEmail: getLabelWithValue(
            {
              labelName: "Email",
              labelKey: "NOC_APPLICANT_EMAIL_LABEL"
            },
            { jsonPath: "noc.applicantDetails.applicant[0].applicantEmail" }
          ),
          applicantPan: getLabelWithValue(
            {
              labelName: "PAN",
              labelKey: "NOC_APPLICANT_PAN_LABEL"
            },
            { jsonPath: "noc.applicantDetails.applicant[0].applicantPan" }
          ),
          applicantAddress: getLabelWithValue(
            {
              labelName: "Correspondence Address",
              labelKey: "NOC_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
            },
            { jsonPath: "noc.applicantDetails.applicant[0].applicantAddress" }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "noc.applicantDetails.applicant",
      prefixSourceJsonPath:
        "children.cardContent.children.applicantContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});
