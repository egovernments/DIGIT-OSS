import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getSelectField,
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
              ...getSelectField({
                label: {
                  labelName: "Degree",
                  labelKey: "HR_DEGREE_LABEL"
                },
                placeholder: {
                  labelName: "Select Degree",
                  labelKey: "HR_DEGREE_PLACEHOLDER"
                },
                jsonPath: "Employee[0].education[0].qualification",
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                sourceJsonPath: "createScreenMdmsData.egov-hrms.Degree",
                props: {
                  jsonPath: "Employee[0].education[0].qualification",
                  optionLabel: "status",
                  optionValue: "code"
                  // hasLocalization: false
                },
                localePrefix: {
                  moduleName: "egov-hrms",
                  masterName: "Degree"
                }
              })
            },
            year: {
              ...getSelectField({
                label: {
                  labelName: "Year",
                  labelKey: "HR_YEAR_LABEL"
                },
                placeholder: {
                  labelName: "Select Year",
                  labelKey: "HR_YEAR_PLACEHOLDER"
                },
                jsonPath: "Employee[0].education[0].yearOfPassing",
                sourceJsonPath: "yearsList",
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                props: {
                  className: "hr-generic-selectfield",
                  // data: [
                  //   {
                  //     value: "Male",
                  //     label: "Male"
                  //   },
                  //   {
                  //     value: "Female",
                  //     label: "Female"
                  //   }
                  // ],
                  optionValue: "value",
                  optionLabel: "label"
                }
              })
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
              ...getSelectField({
                label: {
                  labelName: "Stream",
                  labelKey: "HR_STREAM_LABEL"
                },
                placeholder: {
                  labelName: "Select Stream",
                  labelKey: "HR_STREAM_PLACEHOLDER"
                },
                jsonPath: "Employee[0].education[0].stream",
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                sourceJsonPath: "createScreenMdmsData.egov-hrms.Specalization",
                props: {
                  className: "hr-generic-selectfield"
                  // data: [
                  //   {
                  //     value: "Arts",
                  //     label: "Arts"
                  //   },
                  //   {
                  //     value: "Science",
                  //     label: "Science"
                  //   }
                  // ],
                  // optionValue: "code",
                  // optionLabel: "label"
                },
                localePrefix: {
                  moduleName: "egov-hrms",
                  masterName: "Specalization"
                }
              })
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
              ...getSelectField({
                label: {
                  labelName: "Test Name",
                  labelKey: "HR_TEST_NAME_LABEL"
                },
                placeholder: {
                  labelName: "Select Test Name",
                  labelKey: "HR_TEST_NAME_PLACEHOLDER"
                },
                jsonPath: "Employee[0].tests[0].test",
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                sourceJsonPath: "createScreenMdmsData.egov-hrms.EmploymentTest",
                props: {
                  className: "hr-generic-selectfield"
                  // data: [
                  //   {
                  //     value: "Arts",
                  //     label: "Arts"
                  //   },
                  //   {
                  //     value: "Science",
                  //     label: "Science"
                  //   }
                  // ],
                  // optionValue: "code",
                  // optionLabel: "label"
                },
                localePrefix: {
                  moduleName: "egov-hrms",
                  masterName: "EmploymentTest"
                }
              })
            },
            year: {
              ...getSelectField({
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
                gridDefination: {
                  xs: 12,
                  sm: 4
                },
                props: {
                  className: "hr-generic-selectfield",
                  // data: [
                  //   {
                  //     value: "Male",
                  //     label: "Male"
                  //   },
                  //   {
                  //     value: "Female",
                  //     label: "Female"
                  //   }
                  // ],
                  optionValue: "value",
                  optionLabel: "label"
                }
              })
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
