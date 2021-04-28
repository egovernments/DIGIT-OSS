import { getCommonContainer, getCommonHeader, getStepperObject } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { set } from "lodash";
import get from "lodash/get";
import map from "lodash/map";
import "../../../../index.css";
import { httpRequest } from "../../../../ui-utils";
import { assignmentDetails } from "./createResource/assignment-details";

import {
  employeeDetails,
  professionalDetails
} from "./createResource/employee-details";
import { footer } from "./createResource/footer";
import { jurisdictionDetails } from "./createResource/jurisdiction-details";
import { otherDetails } from "./createResource/other-details";
import { serviceDetails } from "./createResource/service-details";
import { employeeReviewDetails } from "./viewResource/employee-review";
import { getEmployeeData } from "./viewResource/functions";



export const stepsData = [
  { labelName: "Employee Details", labelKey: "HR_NEW_EMPLOYEE_FORM_HEADER" },
  {
    labelName: "Jurisdiction & Assignment Details",
    labelKey: "HR_DETAILS_HEADER"
  },
  // { labelName: "Assignment Details", labelKey: "HR_ASSIGN_DET_HEADER" },
  { labelName: "Summary", labelKey: "HR_SUMMARY_DETAILS" },
  // { labelName: "Other Details", labelKey: "HR_OTHER_DET_HEADER" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0} },
  stepsData
);
// export const queryValue = getQueryArg(
//   window.location.href,
//   "applicationNumber"
// );

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Create New Employee`,
    labelKey: "HR_COMMON_CREATE_EMPLOYEE_HEADER"
  })
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    employeeDetails,
    professionalDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    jurisdictionDetails,
    assignmentDetails
  },
  visible: false
};

// export const formwizardThirdStep = {
//   uiFramework: "custom-atoms",
//   componentPath: "Form",
//   props: {
//     id: "apply_form3"
//   },
//   children: {
//     assignmentDetails
//   },
//   visible: false
// };
const reviewDetails = employeeReviewDetails(true)
export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
 
  props: {
    id: "apply_form3"
  },
  children: {
    reviewDetails
  },
  visible: false
};

// export const formwizardFifthStep = {
//   uiFramework: "custom-atoms",
//   componentPath: "Form",
//   props: {
//     id: "apply_form5"
//   },
//   children: {
//     otherDetails
//   },
//   visible: false
// };

const getMdmsData = async (state, dispatch, tenantId) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "Department",
              filter: "[?(@.active == true)]"
            },
            {
              name: "Designation",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "ACCESSCONTROL-ROLES",
          masterDetails: [
            {
              name: "roles",
              filter: "$.[?(@.code!='CITIZEN')]"
            }
          ]
        },
        {
          moduleName: "egov-location",
          masterDetails: [
            {
              name: "TenantBoundary"
              // filter: "$.*.hierarchyType"
            }
          ]
        },
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "Degree",
              filter: "[?(@.active == true)]"
            },
            {
              name: "EmployeeStatus",
              filter: "[?(@.active == true)]"
            },
            {
              name: "EmployeeType",
              filter: "[?(@.active == true)]"
            },
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            },
            {
              name: "EmploymentTest",
              filter: "[?(@.active == true)]"
            },
            {
              name: "Specalization",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [{ name: "tenants" }]
        }
      ]
    }
  };
  try {
    const response = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(
      prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes"))
    );
    setRolesList(state, dispatch);
    setHierarchyList(state, dispatch);
    return true;
  } catch (e) {
    console.log(e);
  }
};

const getYearsList = (startYear, state, dispatch) => {
  var currentYear = new Date().getFullYear(),
    years = [];
  startYear = startYear || 1980;

  while (startYear <= currentYear) {
    let yearNumbers = startYear++
    years.push({ code: (yearNumbers).toString(), name: (yearNumbers).toString() });
  }

  dispatch(prepareFinalObject("yearsList", years));
};

const setRolesList = (state, dispatch) => {
  let rolesList = get(
    state.screenConfiguration.preparedFinalObject,
    `createScreenMdmsData.ACCESSCONTROL-ROLES.roles`,
    []
  );
  let furnishedRolesList = rolesList.filter(item => {
    return item.code;
  });
  dispatch(
    prepareFinalObject(
      "createScreenMdmsData.furnishedRolesList",
      furnishedRolesList
    )
  );
};

const setHierarchyList = (state, dispatch) => {
  let tenantBoundary = get(
    state.screenConfiguration.preparedFinalObject,
    `createScreenMdmsData.egov-location.TenantBoundary`,
    []
  );
  let hierarchyList = map(tenantBoundary, "hierarchyType", []);
  dispatch(
    prepareFinalObject("createScreenMdmsData.hierarchyList", hierarchyList)
  );
};

const freezeEmployedStatus = (state, dispatch) => {
  let employeeStatus = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee[0].employeeStatus"
  );
  if (!employeeStatus) {
    dispatch(prepareFinalObject("Employee[0].employeeStatus", "EMPLOYED"));
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "create",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("empPhoneNumber", ""));
    const pickedTenant = getQueryArg(window.location.href, "tenantId");
    pickedTenant &&
      dispatch(prepareFinalObject("Employee[0].tenantId", pickedTenant));
    const empTenantId = get(
      state.screenConfiguration.preparedFinalObject,
      "Employee[0].tenantId"
    );
    set(
            action.screenConfig,
            "components.div.children.formwizardFirstStep.children.professionalDetails.children.cardContent.children.employeeDetailsContainer.children.employeeId.props.disabled",
            false
          );
 
    const tenantId = pickedTenant || empTenantId || getTenantId();
    const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
    let employeeCode = getQueryArg(window.location.href, "employeeCode");
    employeeCode && getEmployeeData(state, dispatch, employeeCode, tenantId);
    getYearsList(1950, state, dispatch);
    freezeEmployedStatus(state, dispatch);
    // if (mdmsDataStatus) {
    //   setHierarchyList(state, dispatch);
    // }
    //   dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
    //   dispatch(prepareFinalObject("LicensesTemp", []));
    //   // getData(action, state, dispatch);
    //   getData(action, state, dispatch).then(responseAction => {
    //     const queryObj = [{ key: "tenantId", value: tenantId }];
    //     getBoundaryData(action, state, dispatch, queryObj);
    //     let props = get(
    //       action.screenConfig,
    //       "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
    //       {}
    //     );
    //     props.value = tenantId;
    //     props.disabled = true;
    //     set(
    //       action.screenConfig,
    //       "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
    //       props
    //     );
    //     dispatch(
    //       prepareFinalObject(
    //         "Licenses[0].tradeLicenseDetail.address.city",
    //         tenantId
    //       )
    //     );
    //     //hardcoding license type to permanent
    //     set(
    //       action.screenConfig,
    //       "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicenseType.props.value",
    //       "PERMANENT"
    //     );
    //   });

    const step=getQueryArg(
      window.location.href,
      "step"
    );
if(step&&Number(step)>0){
  set(action.screenConfig,"components.div.children.stepper.props.activeStep",Number(step));
  set(action.screenConfig,"components.div.children.formwizardFifthStep.visible",step=='4'?true:false);
  set(action.screenConfig,"components.div.children.formwizardFourthStep.visible",step=='3'?true:false);
  set(action.screenConfig,"components.div.children.formwizardThirdStep.visible",step=='2'?true:false);
  set(action.screenConfig,"components.div.children.formwizardSecondStep.visible",step=='1'?true:false);
  set(action.screenConfig,"components.div.children.formwizardFirstStep.visible",step=='0'?true:false);
}
dispatch(prepareFinalObject("existingPhoneNumbers", []));
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        // formwizardFourthStep,
        // formwizardFifthStep,
        footer
      }
    }
    // breakUpDialog: {
    //   uiFramework: "custom-containers-local",
    //   componentPath: "ViewBreakupContainer",
    //   props: {
    //     open: false,
    //     maxWidth: "md",
    //     screenKey: "apply"
    //   }
    // }
  }
};

export default screenConfig;
