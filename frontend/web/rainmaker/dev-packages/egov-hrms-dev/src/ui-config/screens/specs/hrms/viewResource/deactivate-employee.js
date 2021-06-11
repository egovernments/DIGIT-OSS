import {
  getCommonContainer,
  getCommonHeader,
  getCommonParagraph,
  getCommonSubHeader,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { get } from "lodash";
import { showHideAdhocPopup } from "../../utils";
import { createUpdateEmployee } from "./functions";

const deactivateEmployeeCallback = (state, dispatch) => {
  let employeeStatus = get(
    state.screenConfiguration.preparedFinalObject,
    'employeeStatus',
    'DEACTIVATE',
  );
  createUpdateEmployee(state, dispatch, employeeStatus);
};
const activateEmployeeCallback = (state, dispatch) => {
  createUpdateEmployee(state, dispatch, "ACTIVATE");
};


export const deactivateEmployee = getCommonContainer({
  // header: getCommonHeader({
  //   labelName: "Add Adhoc Penalty/Rebate",
  //   labelKey: "TL_ADD_HOC_CHARGES_POPUP_HEAD"
  // }),
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right",
        marginBottom: "20px"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Deactivate Employee",
              labelKey: "HR_DEACTIVATE_EMPLOYEE_HEAD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)",
                marginTop: "-8px",
                marginRight: "-25px"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: showHideAdhocPopup
            }
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      deactivationReason: getSelectField({
        label: {
          labelName: "Reason for Deactivation",
          labelKey: "HR_DEACTIVATION_REASON"
        },
        placeholder: {
          labelName: "Select Reason for Deactivation",
          labelKey: "HR_DEACTIVATION_REASON_SELECT"
        },
        required: true,
        props: {
          style: {
            width: "100%"
          },
          value:''
        },
        // data: [
        //   {
        //     code: "Others"
        //   },
        //   {
        //     code: "Order by commissioner"
        //   }
        // ],
        jsonPath: "Employee[0].deactivationDetails[0].reasonForDeactivation",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        sourceJsonPath: "viewScreenMdmsData.egov-hrms.DeactivationReason",
        localePrefix: {
          moduleName: "egov-hrms",
          masterName: "DeactivationReason"
        }
      }),
      effectiveDate: getDateField({
        label: {
          labelName: "Effective Date",
          labelKey: "HR_EFFECTIVE_DATE"
        },
        required: true,
        pattern: getPattern("Date"),
        props: {
          style: {
            width: "100%"
          },
          value:'',
        },
        jsonPath: "Employee[0].deactivationDetails[0].effectiveFrom",
        gridDefination: {
          xs: 12,
          sm: 12
        }
      })
    }
  },
  nonMandatoryBody: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      orderNo: getTextField({
        label: {
          labelName: "Order No.",
          labelKey: "HR_ORDER_NO"
        },
        placeholder: {
          labelName: "Enter Order No.",
          labelKey: "HR_ENTER_ORDER_NO"
        },
        props: {
          style: {
            width: "100%"
          },value:'',
        },
        jsonPath: "Employee[0].deactivationDetails[0].orderNo",
        gridDefination: {
          xs: 12,
          sm: 12
        }
      }),
      upload: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: {
            marginLeft: 8
          },
          value:'',
        },
        required: false,
        children: {
          uploadFileHeader: getCommonSubHeader(
            {
              labelName: "Supporting Documents",
              labelKey: "HR_APPROVAL_UPLOAD_HEAD"
            },
            {
              style: { marginTop: 15, width: "100%" }
            }
          ),
          uploadFileInfo: getCommonParagraph(
            {
              labelName: "Only .jpg and .pdf files. 5MB max file size.",
              labelKey: "TL_APPROVAL_UPLOAD_SUBHEAD"
            },
            {
              style: {
                fontSize: 12,
                marginBottom: 0,
                marginTop: 5,
                width: "100%",
                color: "rgba(0, 0, 0, 0.6000000238418579)"
              }
            }
          ),
          uploadButton: {
            uiFramework: "custom-molecules",
            componentPath: "UploadMultipleFiles",
            props: {
              maxFiles: 4,
              jsonPath: "deactivationDocuments",
              inputProps: {
                accept: "image/*, .pdf, .png, .jpeg"
              },
              buttonLabel: {
                labelName: "UPLOAD FILES",
                labelKey: "HR_UPLOAD_FILES_BUTTON_LABEL"
              },
              maxFileSize: 5000,
              moduleName: "HR",
              hasLocalization: false
            }
          }
        }
      },
      remarks: getTextField({
        label: {
          labelName: "Remarks",
          labelKey: "HR_REMARKS"
        },
        placeholder: {
          labelName: "Enter Remarks",
          labelKey: "HR_ENTER_REMARKS"
        },
        props: {
          style: {
            width: "100%"
          },
          value:'',
        },
        jsonPath: "Employee[0].deactivationDetails[0].remarks",
        gridDefination: {
          xs: 12,
          sm: 12
        }
      })
    }
  },
  buttonDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      deactivateButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "200px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "DEACTIVATE EMPLOYEE",
            labelKey: "HR_DEACTIVATE_EMPLOYEE_LABEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: deactivateEmployeeCallback
        }
      }
    }
  }
});
export const ActivateEmployee = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right",
        marginBottom: "20px"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Deactivate Employee",
              labelKey: "HR_ACTIVATE_EMPLOYEE_HEAD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)",
                marginTop: "-8px",
                marginRight: "-25px"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: showHideAdhocPopup
            }
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      deactivationReason: getSelectField({
        label: {
          labelName: "Reason for Deactivation",
          labelKey: "HR_ACTIVATION_REASON"
        },
        placeholder: {
          labelName: "Select Reason for Deactivation",
          labelKey: "HR_ACTIVATION_REASON_SELECT"
        },
        required: true,
        props: {
          style: {
            width: "100%"
          },value:''
        },
        jsonPath: "Employee[0].reactivationDetails[0].reasonForReactivation",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        sourceJsonPath: "viewScreenMdmsData.egov-hrms.DeactivationReason",
        localePrefix: {
          moduleName: "egov-hrms",
          masterName: "DeactivationReason"
        }
      }),
      effectiveDate: getDateField({
        label: {
          labelName: "Effective Date",
          labelKey: "HR_EFFECTIVE_DATE"
        },
        required: true,
        pattern: getPattern("Date"),
        props: {
          style: {
            width: "100%"
          },value:''
        },
        jsonPath: "Employee[0].reactivationDetails[0].effectiveFrom",
        gridDefination: {
          xs: 12,
          sm: 12
        }
      })
    }
  },
  nonMandatoryBody: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      orderNo: getTextField({
        label: {
          labelName: "Order No.",
          labelKey: "HR_ORDER_NO"
        },
        placeholder: {
          labelName: "Enter Order No.",
          labelKey: "HR_ENTER_ORDER_NO"
        },
        props: {
          style: {
            width: "100%"
          },value:''
        },
        jsonPath: "Employee[0].reactivationDetails[0].orderNo",
        gridDefination: {
          xs: 12,
          sm: 12
        }
      }),
      upload: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: {
            marginLeft: 8
          }
        },
        required: false,
        children: {
          uploadFileHeader: getCommonSubHeader(
            {
              labelName: "Supporting Documents",
              labelKey: "HR_APPROVAL_UPLOAD_HEAD"
            },
            {
              style: { marginTop: 15, width: "100%" }
            }
          ),
          uploadFileInfo: getCommonParagraph(
            {
              labelName: "Only .jpg and .pdf files. 5MB max file size.",
              labelKey: "TL_APPROVAL_UPLOAD_SUBHEAD"
            },
            {
              style: {
                fontSize: 12,
                marginBottom: 0,
                marginTop: 5,
                width: "100%",
                color: "rgba(0, 0, 0, 0.6000000238418579)"
              }
            }
          ),
          uploadButton: {
            uiFramework: "custom-molecules",
            componentPath: "UploadMultipleFiles",
            props: {
              maxFiles: 4,
              jsonPath: "ActivationDocuments",
              inputProps: {
                accept: "image/*, .pdf, .png, .jpeg"
              },
              buttonLabel: {
                labelName: "UPLOAD FILES",
                labelKey: "HR_UPLOAD_FILES_BUTTON_LABEL"
              },
              maxFileSize: 5000,
              moduleName: "HR",
              hasLocalization: false
            }
          }
        }
      },
      remarks: getTextField({
        label: {
          labelName: "Remarks",
          labelKey: "HR_REMARKS"
        },
        placeholder: {
          labelName: "Enter Remarks",
          labelKey: "HR_ENTER_REMARKS"
        },
        props: {
          style: {
            width: "100%"
          },value:''
        },
        jsonPath: "Employee[0].reactivationDetails[0].remarks",
        gridDefination: {
          xs: 12,
          sm: 12
        }
      })
    }
  },
  buttonDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      deactivateButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "200px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "DEACTIVATE EMPLOYEE",
            labelKey: "HR_ACTIVATE_EMPLOYEE_LABEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: activateEmployeeCallback
        }
      }
    }
  }
});
