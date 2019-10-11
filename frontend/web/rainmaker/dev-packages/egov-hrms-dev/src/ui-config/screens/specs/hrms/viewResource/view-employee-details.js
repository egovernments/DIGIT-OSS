import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { convertEpochToDate } from "../../utils";
const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create?step=0`
      : `/hrms/create?step=0`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

export const getEmployeeDetailsView = (isReview = true) => {
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
            labelName: "Employee Details",
            labelKey: "HR_NEW_EMPLOYEE_FORM_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
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
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    personalDetailsHeader: getHeader({
      labelName: "Personal Details",
      labelKey: "HR_SUMMARY_PERSONAL_DEATILS_SUBHEADER"
    }),
    break1: getBreak(),
    viewOne: getCommonContainer({
      reviewName: getLabelWithValue(
        {
          labelName: "Name",
          labelKey: "HR_COMMON_TABLE_COL_NAME"
        },
        { jsonPath: "Employee[0].user.name" }
      ),
      reviewMobile: getLabelWithValue(
        { labelName: "Mobile No", labelKey: "HR_MOB_NO_LABEL" },
        { jsonPath: "Employee[0].user.mobileNumber" }
      ),
      reviewFather: getLabelWithValue(
        {
          labelName: "Father/Husband's Name",
          labelKey: "HR_FATHER_HUSBANDS_NAME_LABEL"
        },
        { jsonPath: "Employee[0].user.fatherOrHusbandName" }
      ),
      reviewGender: getLabelWithValue(
        { labelName: "Gender", labelKey: "HR_GENDER_LABEL" },
        {
          jsonPath: "Employee[0].user.gender"
        }
      ),
      reviewDob: getLabelWithValue(
        { labelName: "Date Of Birth", labelKey: "HR_DOB_LABEL" },
        {
          jsonPath: "Employee[0].user.dob",
          callBack: convertEpochToDate
        }
      ),
      reviewEmail: getLabelWithValue(
        { labelName: "Email", labelKey: "HR_EMAIL_LABEL" },
        {
          jsonPath: "Employee[0].user.emailId"
        }
      ),
      reviewAddress: getLabelWithValue(
        {
          labelName: "Correspondence Addres",
          labelKey: "HR_CORRESPONDENCE_ADDRESS_LABEL"
        },
        {
          jsonPath: "Employee[0].user.correspondenceAddress"
        }
      )
    }),
    professionalDetailsHeader: getHeader({
      labelName: "Professional Details",
      labelKey: "HR_SUMMARY_PROFESSIONAL_DEATILS_SUBHEADER"
    }),
    break2: getBreak(),
    viewTwo: getCommonContainer({
      reviewEmpID: getLabelWithValue(
        {
          labelName: "Employee ID",
          labelKey: "HR_EMP_ID_LABEL"
        },
        { jsonPath: "Employee[0].code" }
      ),
      reviewDOA: getLabelWithValue(
        { labelName: "Date of Appointment", labelKey: "HR_APPT_DATE_LABEL" },
        {
          jsonPath: "Employee[0].dateOfAppointment",
          callBack: convertEpochToDate
        }
      ),
      reviewEmpType: getLabelWithValue(
        { labelName: "Employee Type", labelKey: "HR_EMP_TYPE_LABEL" },
        {
          jsonPath: "Employee[0].employeeType"
        }
      ),
      reviewStatus: getLabelWithValue(
        { labelName: "Status", labelKey: "HR_STATUS_LABEL" },
        {
          jsonPath: "Employee[0].employeeStatus"
        }
      ),
      reviewRole: getLabelWithValue(
        { labelName: "Role", labelKey: "HR_ROLE_LABEL" },
        {
          jsonPath: "hrms.reviewScreen.furnishedRolesList"
        }
      )
    })
  });
};
