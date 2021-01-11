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

const serviceDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      serviceDetailsCardContainer: getCommonContainer(
        {
          status: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-hrms",
            componentPath: "AutosuggestContainer",
            jsonPath: "Employee[0].serviceHistory[0].serviceStatus",
            gridDefination: {
              xs: 12,
              sm: 4
            },
            required:false,
            props: {
              className: "hr-generic-selectfield autocomplete-dropdown",
              jsonPath: "Employee[0].serviceHistory[0].serviceStatus",
              sourceJsonPath: "createScreenMdmsData.egov-hrms.EmployeeStatus",
              optionValue: "code",
              optionLabel: "status",
              localePrefix: {
                moduleName: "egov-hrms",
                masterName: "EmployeeStatus"
              },
              label: {
                labelName: "Status",
                labelKey: "HR_STATUS_LABEL"
              },
              placeholder: {
                labelName: "Select Status",
                labelKey: "HR_STATUS_PLACEHOLDER"
              },
              labelsFromLocalisation: true,
              isClearable:true,
              required:false,
            },
          },
          serviceFromDate: {
            ...getDateField({
              label: {
                labelName: "Service From Date",
                labelKey: "HR_SER_FROM_DATE_LABEL"
              },
              placeholder: {
                labelName: "Service From Date",
                labelKey: "HR_SER_FROM_DATE_LABEL"
              },
              pattern: getPattern("Date"),
              jsonPath: "Employee[0].serviceHistory[0].serviceFrom",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                jsonPath: "Employee[0].serviceHistory[0].serviceFrom"
                // inputProps: {
                //   min: getTodaysDateInYMD(),
                //   max: getFinancialYearDates("yyyy-mm-dd").endDate
                // }
              }
            })
          },
          serviceToDate: {
            ...getDateField({
              label: {
                labelName: "Service To Date",
                labelKey: "HR_SER_TO_DATE_LABEL"
              },
              placeholder: {
                labelName: "Service To Date",
                labelKey: "HR_SER_TO_DATE_LABEL"
              },
              pattern: getPattern("Date"),
              jsonPath: "Employee[0].serviceHistory[0].serviceTo",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                jsonPath: "Employee[0].serviceHistory[0].serviceTo",
                checkFieldDisable: true,
                dependantField:'isCurrentPosition',
                jsonPathRemoveKey:"serviceTo"
                // inputProps: {
                //   min: getTodaysDateInYMD(),
                //   max: getFinancialYearDates("yyyy-mm-dd").endDate
                // }
              }
            })
          },
          location: {
            ...getTextField({
              label: {
                labelName: "Location",
                labelKey: "HR_LOCATION_LABEL"
              },
              placeholder: {
                labelName: "Select Location",
                labelKey: "HR_LOCATION_PLACEHOLDER"
              },
              jsonPath: "Employee[0].serviceHistory[0].location",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                //   className: "hr-generic-selectfield",
                jsonPath: "Employee[0].serviceHistory[0].location"
                //   data: [
                //     {
                //       value: "pb.amritsar",
                //       label: "Amritsar"
                //     }
                //   ],
                //   optionValue: "value",
                //   optionLabel: "label"
              }
            })
          },
          orderNo: {
            ...getTextField({
              label: {
                labelName: "Order No",
                labelKey: "HR_ORDER_NO_LABEL"
              },
              placeholder: {
                labelName: "Enter Order No",
                labelKey: "HR_ORDER_NO_PLACEHOLDER"
              },
              pattern: getPattern("TradeName") || null,
              jsonPath: "Employee[0].serviceHistory[0].orderNo",
              props: {
                jsonPath: "Employee[0].serviceHistory[0].orderNo"
              }
            }),
            gridDefination: {
              xs: 12,
              sm: 4
            }
          },
          currentlyWorkingHere: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-hrms",
            componentPath: "SwitchWithLabel",
            jsonPath: "Employee[0].serviceHistory[0].isCurrentPosition",
            props: {
              items: [
                {
                  label: {
                    labelName: "Currently Working Here",
                    labelKey: "HR_CURRENTLY_WORKING_HERE_SWITCH_LABEL"
                  }
                }
              ],
              SwitchProps: {
                color: "primary"
              },
              jsonPath: "Employee[0].serviceHistory[0].isCurrentPosition"
            },
            beforeFieldChange: (action, state, dispatch) => {
              let assignToComponentPath = action.componentJsonpath.replace(
                ".currentlyWorkingHere",
                ".serviceToDate"
              );
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
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],
    addItemLabel: {
      labelName: "ADD SERVICE ENTRY",
      labelKey: "HR_ADD_SERVICE_ENTRY"
    },
    headerName: "Service",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Employee[0].serviceHistory",
    prefixSourceJsonPath:
      "children.cardContent.children.serviceDetailsCardContainer.children",
    disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const serviceDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Service Details",
      labelKey: "HR_SER_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subheader: getCommonSubHeader({
    labelName:
      "Verify entered details before submission. Service details cannot be edited once submitted.",
    labelKey: "HR_SER_DET_SUB_HEADER"
  }),

  serviceDetailsCard
},{
  style: {
    overflow: "visible"
  }
});
