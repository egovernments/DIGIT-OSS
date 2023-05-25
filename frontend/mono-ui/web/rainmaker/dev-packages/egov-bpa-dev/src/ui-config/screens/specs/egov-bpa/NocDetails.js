import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  // import { getTodaysDateInYMD } from "../utils";
  
const nocDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Details",
        labelKey: "title_header"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    employeeDetailsContainer: getCommonContainer({
      employeeName: {
        ...getTextField({
          label: {
            labelName: "Name",
            labelKey: "HR_NAME_LABEL"
          },
          placeholder: {
            labelName: "Enter Employee Name",
            labelKey: "HR_NAME_PLACEHOLDER"
          },
          required: true,
          // pattern: getPattern("Name") || null,
          jsonPath: "Employee[0].user.name"
        })
      },
      mobileNumber: {
        ...getTextField({
          label: {
            labelName: "Mobile No.",
            labelKey: "HR_MOB_NO_LABEL"
          },
          placeholder: {
            labelName: "Enter Mobile No.",
            labelKey: "HR_MOB_NO_PLACEHOLDER"
          },
          title: {
            value: "Password/OTP will be sent to this number",
            key: "HR_MOB_NO_TOOLTIP_MESSAGE"
          },
          infoIcon: "info_circle",
          required: true,
          // pattern: getPattern("MobileNo"),
          jsonPath: "Employee[0].user.mobileNumber"
        })
      },
      fatherHusbandName: {
        ...getTextField({
          label: {
            labelName: "Father/Husband's Name",
            labelKey: "HR_FATHER_HUSBAND_NAME_LABEL"
          },
          placeholder: {
            labelName: "Enter Father/Husband's Name",
            labelKey: "HR_FATHER_HUSBAND_NAME_PLACEHOLDER"
          },
          required: true,
          // pattern: getPattern("Name") || null,
          jsonPath: "Employee[0].user.fatherOrHusbandName"
        })
      },
      gender: {
        ...getSelectField({
          label: { labelName: "Gender", labelKey: "HR_GENDER_LABEL" },
          placeholder: {
            labelName: "Select Gender",
            labelKey: "HR_GENDER_PLACEHOLDER"
          },
          required: true,
          jsonPath: "Employee[0].user.gender",
          props: {
            className: "hr-generic-selectfield",
            data: [
              {
                value: "MALE",
                label: "COMMON_GENDER_MALE"
              },
              {
                value: "FEMALE",
                label: "COMMON_GENDER_FEMALE"
              },
              {
                value: "TRANSGENDER",
                label: "COMMON_GENDER_TRANSGENDER"
              }
            ],
            optionValue: "value",
            optionLabel: "label"
          }
        })
      },
      dateOfBirth: {
        ...getDateField({
          label: {
            labelName: "Date of Birth",
            labelKey: "HR_BIRTH_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter Date of Birth",
            labelKey: "HR_BIRTH_DATE_PLACEHOLDER"
          },
          required: true,
          // pattern: getPattern("Date"),
          jsonPath: "Employee[0].user.dob",
          props: {
            inputProps: {
              // max: getTodaysDateInYMD()
            }
          }
        })
      },
      email: {
        ...getTextField({
          label: {
            labelName: "Email",
            labelKey: "HR_EMAIL_LABEL"
          },
          placeholder: {
            labelName: "Enter Email",
            labelKey: "HR_EMAIL_PLACEHOLDER"
          },
          // pattern: getPattern("Email"),
          jsonPath: "Employee[0].user.emailId"
        })
      },
      correspondenceAddress: {
        ...getTextField({
          label: {
            labelName: "Correspondence Address",
            labelKey: "HR_CORRESPONDENCE_ADDRESS_LABEL"
          },
          placeholder: {
            labelName: "Enter Corrospondence Address",
            labelKey: "HR_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
          },
          required: true,
          // pattern: getPattern("Address"),
          jsonPath: "Employee[0].user.correspondenceAddress"
        })
      }
    })
  });
  
  export const professionalDetails = getCommonCard(
    {
      header: getCommonTitle(
        {
          labelName: "Professional Details",
          labelKey: "HR_PROFESSIONAL_DETAILS_FORM_HEADER"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      employeeDetailsContainer: getCommonContainer({
        employeeId: {
          ...getTextField({
            label: {
              labelName: "Employee ID",
              labelKey: "HR_EMPLOYEE_ID_LABEL"
            },
            placeholder: {
              labelName: "Enter Employee ID",
              labelKey: "HR_EMPLOYEE_ID_PLACEHOLDER"
            },
            pattern: /^[a-zA-Z0-9-_]*$/i,
            jsonPath: "Employee[0].code"
          })
        },
        dateOfAppointment: {
          ...getDateField({
            label: {
              labelName: "Date of Appointment",
              labelKey: "HR_APPOINTMENT_DATE_LABEL"
            },
            placeholder: {
              labelName: "Enter Date of Appointment",
              labelKey: "HR_APPOINTMENT_DATE_PLACEHOLDER"
            },
            // pattern: getPattern("Date"),
            jsonPath: "Employee[0].dateOfAppointment"
          })
        },
        employmentType: {
          ...getSelectField({
            label: {
              labelName: "Employement Type",
              labelKey: "HR_EMPLOYMENT_TYPE_LABEL"
            },
            placeholder: {
              labelName: "Select Employment Type",
              labelKey: "HR_EMPLOYMENT_TYPE_PLACEHOLDER"
            },
            required: true,
            jsonPath: "Employee[0].employeeType",
            sourceJsonPath: "createScreenMdmsData.egov-hrms.EmployeeType",
            props: {
              optionLabel: "status",
              optionValue: "code"
              // hasLocalization: false,
              // jsonPath: "Employee[0].employeeType"
            },
            localePrefix: {
              moduleName: "egov-hrms",
              masterName: "EmployeeType"
            }
          })
        },
        status: {
          ...getSelectField({
            label: { labelName: "Status", labelKey: "HR_STATUS_LABEL" },
            placeholder: {
              labelName: "Select Status",
              labelKey: "HR_STATUS_PLACEHOLDER"
            },
            required: true,
            jsonPath: "Employee[0].employeeStatus",
            sourceJsonPath: "createScreenMdmsData.egov-hrms.EmployeeStatus",
            props: {
              optionLabel: "status",
              optionValue: "code",
              disabled: true,
              value: "EMPLOYED"
              // hasLocalization: false,
              // jsonPath: "Employee[0].employeeStatus"
            },
            localePrefix: {
              moduleName: "egov-hrms",
              masterName: "EmployeeStatus"
            }
          })
        },
        // role: {
        //   ...getSelectField({
        //     label: { labelName: "Role", labelKey: "HR_ROLE_LABEL" },
        //     placeholder: {
        //       labelName: "Select Role",
        //       labelKey: "HR_ROLE_PLACEHOLDER"
        //     },
        //     required: true,
        //     jsonPath: "Employee[0].user.roles",
        //     sourceJsonPath: "createScreenMdmsData.ACCESSCONTROL-ROLES.roles"
        //   })
        // },
        role: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-hrms",
          componentPath: "AutosuggestContainer",
          jsonPath: "Employee[0].user.roles",
          required: true,
          props: {
            style: {
              width: "100%",
              cursor: "pointer"
            },
            label: { labelName: "Role", labelKey: "HR_ROLE_LABEL" },
            placeholder: {
              labelName: "Select Role",
              labelKey: "HR_ROLE_PLACEHOLDER"
            },
            jsonPath: "Employee[0].user.roles",
            sourceJsonPath: "createScreenMdmsData.furnishedRolesList",
            labelsFromLocalisation: false,
            suggestions: [],
            fullwidth: true,
            required: true,
            inputLabelProps: {
              shrink: true
            },
            isMulti: true,
            labelName: "name",
            valueName: "code"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          }
        }
      })
    },
    {
      style: { overflow: "visible" }
    }
  );
  