import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getUploadFilesMultiple } from "../../utils";

export const otherDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Other Details",
      labelKey: "HR_OTHER_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),

  educationQualification: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        header: getCommonSubHeader(
          {
            labelName: "Education Qualification",
            labelKey: "HR_ED_QUAL_HEADER"
          },
          {
            style: {
              marginBottom: 18
            }
          }
        ),
        eduDetailsCardContainer: getCommonContainer(
          {
            degree: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-hrms",
              componentPath: "AutosuggestContainer",
              jsonPath: "Employee[0].education[0].qualification",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                jsonPath: "Employee[0].education[0].qualification",
                sourceJsonPath: "createScreenMdmsData.egov-hrms.Degree",
                className: "autocomplete-dropdown",
                optionLabel: "status",
                optionValue: "code",
                label: {
                  labelName: "Degree",
                  labelKey: "HR_DEGREE_LABEL"
                },
                placeholder: {
                  labelName: "Select Degree",
                  labelKey: "HR_DEGREE_PLACEHOLDER"
                },
                localePrefix: {
                  moduleName: "egov-hrms",
                  masterName: "Degree"
                },
                labelsFromLocalisation: true,
                isClearable:true,
              },
                
            },
            year: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-hrms",
              componentPath: "AutosuggestContainer",
              jsonPath: "Employee[0].education[0].yearOfPassing",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                className: "hr-generic-selectfield autocomplete-dropdown",
                optionValue: "value",
                optionLabel: "label",
                sourceJsonPath: "yearsList",
                label: {
                  labelName: "Year",
                  labelKey: "HR_YEAR_LABEL"
                },
                placeholder: {
                  labelName: "Select Year",
                  labelKey: "HR_YEAR_PLACEHOLDER"
                },
                labelsFromLocalisation: true,
                isClearable:true,
                jsonPath: "Employee[0].education[0].yearOfPassing"
              }
            },
            university: {
              ...getTextField({
                label: {
                  labelName: "University",
                  labelKey: "HR_UNIVERSITY_LABEL"
                },
                placeholder: {
                  labelName: "Select University",
                  labelKey: "HR_UNIVERSITY_PLACEHOLDER"
                },
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                jsonPath: "Employee[0].education[0].university"
              })
            },
            stream: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-hrms",
              componentPath: "AutosuggestContainer",
              jsonPath: "Employee[0].education[0].stream",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                className: "hr-generic-selectfield autocomplete-dropdown",
                localePrefix: {
                  moduleName: "egov-hrms",
                  masterName: "Specalization"
                },
                sourceJsonPath: "createScreenMdmsData.egov-hrms.Specalization",
                label: {
                  labelName: "Stream",
                  labelKey: "HR_STREAM_LABEL"
                },
                placeholder: {
                  labelName: "Select Stream",
                  labelKey: "HR_STREAM_PLACEHOLDER"
                },
                labelsFromLocalisation: true,
                isClearable:true,
                jsonPath: "Employee[0].education[0].stream"
              },
            },
            remarks: {
              ...getTextField({
                label: {
                  labelName: "Remarks",
                  labelKey: "HR_REMARKS_LABEL"
                },
                placeholder: {
                  labelName: "Enter Remarks",
                  labelKey: "HR_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("TradeName") || null,
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                jsonPath: "Employee[0].education[0].remarks"
              })
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
        LabelName: "ADD QUALIFICATIONS",
        labelKey: "HR_ADD_QUALIFICATIONS"
      },
      headerName: "Education Qualification",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "Employee[0].education",
      prefixSourceJsonPath:
        "children.cardContent.children.eduDetailsCardContainer.children"
    },
    type: "array"
  },
  departmentDetails: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        header: getCommonSubHeader(
          {
            labelName: "Department Test Details",
            labelKey: "HR_DEPT_TEST_HEADER"
          },
          {
            style: {
              marginBottom: 18
            }
          }
        ),
        testsDetailsCardContainer: getCommonContainer(
          {
            testName: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-hrms",
              componentPath: "AutosuggestContainer",
              jsonPath: "Employee[0].tests[0].test",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                className: "hr-generic-selectfield autocomplete-dropdown",
                label: {
                  labelName: "Test Name",
                  labelKey: "HR_TEST_NAME_LABEL"
                },
                placeholder: {
                  labelName: "Select Test Name",
                  labelKey: "HR_TEST_NAME_PLACEHOLDER"
                },
                localePrefix: {
                  moduleName: "egov-hrms",
                  masterName: "EmploymentTest"
                },
                jsonPath: "Employee[0].tests[0].test",
                sourceJsonPath: "createScreenMdmsData.egov-hrms.EmploymentTest",
                labelsFromLocalisation: true,
                isClearable:true,
              },
                
            },
            year: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-hrms",
              componentPath: "AutosuggestContainer",
              jsonPath: "Employee[0].tests[0].yearOfPassing",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                className: "hr-generic-selectfield autocomplete-dropdown",
                optionValue: "value",
                optionLabel: "label",
                label: {
                  labelName: "Year",
                  labelKey: "HR_YEAR_LABEL"
                },
                placeholder: {
                  labelName: "Select Year",
                  labelKey: "HR_YEAR_PLACEHOLDER"
                },
                jsonPath: "Employee[0].tests[0].yearOfPassing",
                sourceJsonPath: "yearsList",
                labelsFromLocalisation: true,
                isClearable:true,
              }
            },
            remarks: {
              ...getTextField({
                label: {
                  labelName: "Remarks",
                  labelKey: "HR_REMARKS_LABEL"
                },
                placeholder: {
                  labelName: "Enter Remarks",
                  labelKey: "HR_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("TradeName") || null,
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                jsonPath: "Employee[0].tests[0].remarks"
              })
            }
            // uploadFile: getUploadFilesMultiple(
            //   "Employee[0].deptTestDetails[0].documents"
            // )
          },
          {
            style: {
              overflow: "visible"
            }
          }
        )
      }),
      items: [],
      addItemLabel: { labelName: "ADD TEST", labelKey: "HR_ADD_TEST" },
      headerName: "Department Test Details",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "Employee[0].tests",
      prefixSourceJsonPath:
        "children.cardContent.children.testsDetailsCardContainer.children"
    },
    type: "array"
  }
},{
  style:{
    overflow: "visible"
  }
});

// export const otherDetails = getCommonCard({
//   header: getCommonTitle(
//     {
//       labelName: "Other Details",
//       labelKey: "HR_OTHER_DET_HEADER"
//     },
//     {
//       style: {
//         marginBottom: 18
//       }
//     }
//   ),
//   otherDetailsCard
// });
