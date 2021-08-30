import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getCommonContainer,
  getPattern,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";

const assignmentDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      asmtDetailsCardContainer: getCommonContainer(
        {
          assignFromDate: {
            ...getDateField({
              label: {
                labelName: "Assigned From Date",
                labelKey: "HR_ASMT_FROM_DATE_LABEL"
              },
              placeholder: {
                labelName: "Assigned From Date",
                labelKey: "HR_ASMT_FROM_DATE_PLACEHOLDER"
              },
              required: true,
              
              pattern: getPattern("Date"),
              jsonPath: "Employee[0].assignments[0].fromDate",
              props: {
                inputProps: {
                  max: getTodaysDateInYMD(),

                }
              }
            })
          },
          assignToDate: {
            ...getDateField({
              label: {
                labelName: "Assigned To Date",
                labelKey: "HR_ASMT_TO_DATE_LABEL"
              },
              placeholder: {
                labelName: "Assigned To Date",
                labelKey: "HR_ASMT_TO_DATE_PLACEHOLDER"
              },
              pattern: getPattern("Date"),
              jsonPath: "Employee[0].assignments[0].toDate",
             
              props: {
                checkFieldDisable: true,
                dependantField:'isCurrentAssignment',
                jsonPathRemoveKey:"toDate",
                
                inputProps: {
                  min: getTodaysDateInYMD(),
                }
              }
            })
          },
          dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 6
            },
            props: {
              disabled: true
            }
          },
          currentAssignment: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-hrms",
            componentPath: "SwitchWithLabel",
            props: {
              items: [
                {
                  label: {
                    labelName: "Currently Assigned Here",
                    labelKey: "HR_CURRENTLY_ASSIGNED_HERE_SWITCH_LABEL"
                  }
                }
              ],
              SwitchProps: {
                color: "primary"
              },
              jsonPath: "Employee[0].assignments[0].isCurrentAssignment",
              compJPath:
                "components.div.children.formwizardThirdStep.children.assignmentDetails.children.cardContent.children.assignmentDetailsCard.props.items",
              screenKey: "create"
            },
            beforeFieldChange: (action, state, dispatch) => {
              let assignToComponentPath = action.componentJsonpath.replace(
                ".currentAssignment",
                ".assignToDate"
              );
              let isDisabled = get(
                state.screenConfiguration.screenConfig.create,
                `${action.componentJsonpath}.props.disabled`
              );
              if (!isDisabled) {
                if (action.value) {
                  dispatch(
                    handleField(
                      "create",
                      assignToComponentPath,
                      "props.value",
                      null
                    )
                  );
                  dispatch(
                    handleField(
                      "create",
                      assignToComponentPath,
                      "props.disabled",
                      true
                    )
                  );
                } else {
                  dispatch(
                    handleField(
                      "create",
                      assignToComponentPath,
                      "props.disabled",
                      false
                    )
                  );
                 }
              }
            }
          },
          department: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-hrms",
            componentPath: "AutosuggestContainer",
            jsonPath: "Employee[0].assignments[0].department",
            props: {
              className: "hr-generic-selectfield autocomplete-dropdown",
              optionValue: "code",
              optionLabel: "name",
              localePrefix: {
                moduleName: "common-masters",
                masterName: "Department"
              },
              label: {
                labelName: "Department",
                labelKey: "HR_DEPT_LABEL"
              },
              placeholder: {
                labelName: "Select Department",
                labelKey: "HR_DEPT_PLACEHOLDER"
              },
              required: true,
              isClearable: true,
              labelsFromLocalisation: true,
              jsonPath: "Employee[0].assignments[0].department",
              sourceJsonPath: "createScreenMdmsData.common-masters.Department",
            },
            required: true,
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            },
          },
          designation: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-hrms",
            componentPath: "AutosuggestContainer",
            jsonPath: "Employee[0].assignments[0].designation",
            props: {
              className: "hr-generic-selectfield autocomplete-dropdown",
              optionValue: "code",
              optionLabel: "name",
              localePrefix: {
                moduleName: "common-masters",
                masterName: "Designation"
              },
              label: { labelName: "Designation", labelKey: "HR_DESG_LABEL" },
              placeholder: {
                labelName: "Select Designation",
                labelKey: "HR_DESIGNATION_PLACEHOLDER"
              },
              required: true,
              isClearable: true,
              labelsFromLocalisation: true,
              jsonPath: "Employee[0].assignments[0].designation",
              sourceJsonPath: "createScreenMdmsData.common-masters.Designation",
            },
            required: true,
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            },
          },
          reportingTo: {
            ...getTextField({
              label: {
                labelName: "Reporting To",
                labelKey: "HR_REP_TO_LABEL"
              },
              placeholder: {
                labelName: "Reporting To",
                labelKey: "HR_REP_TO_LABEL"
              },
              pattern: getPattern("Name") || null,
              jsonPath: "Employee[0].assignments[0].reportingTo"
            })
          },
          headOfDepartment: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-hrms",
            componentPath: "SwitchWithLabel",
            props: {
              items: [
                {
                  label: {
                    labelName: "Head Of Department",
                    labelKey: "HR_HOD_SWITCH_LABEL"
                  }
                }
              ],
              SwitchProps: {
                color: "primary"
              },
              jsonPath: "Employee[0].assignments[0].isHOD"
            }
          }
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    onMultiItemAdd: (state, muliItemContent) => {
      let preparedFinalObject = get(
        state,
        "screenConfiguration.preparedFinalObject",
        {}
      );
      let cardIndex = get(muliItemContent, "assignFromDate.index");
      let cardId = get(
        preparedFinalObject,
        `Employee[0].assignments[${cardIndex}].id`
      );
      if (cardId) {
        let isCurrentAssignment = get(
          preparedFinalObject,
          `Employee[0].assignments[${cardIndex}].isCurrentAssignment`
        );
        Object.keys(muliItemContent).forEach(key => {
          if (isCurrentAssignment && key === "currentAssignment") {
            set(muliItemContent[key], "props.disabled", false);
          } else {
            // set(muliItemContent[key], "props.disabled", true);
          }
        });
      } else {
        Object.keys(muliItemContent).forEach(key => {
          if (key === "dummyDiv") {
            set(muliItemContent[key], "props.disabled", true);
          } else {
            set(muliItemContent[key], "props.disabled", false);
          }
        });
      }
      return muliItemContent;
    },
    items: [],
    addItemLabel: {
      labelName: "ADD ASSIGNMENT",
      labelKey: "HR_ADD_ASSIGNMENT"
    },
    headerName: "Assignment",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Employee[0].assignments",
    prefixSourceJsonPath:
      "children.cardContent.children.asmtDetailsCardContainer.children",
    disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const assignmentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Assignment Details",
      labelKey: "HR_ASSIGN_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subheader: getCommonSubHeader({
    labelName:
      "Verify entered details before submission. Assignment details cannot be edited once submitted.",
    labelKey: "HR_ASSIGN_DET_SUB_HEADER"
  }),
  assignmentDetailsCard
},{
  style:{
    overflow: "visible"
  }
});
