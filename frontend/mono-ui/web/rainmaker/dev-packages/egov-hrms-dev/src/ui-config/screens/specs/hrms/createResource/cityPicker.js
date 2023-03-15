import {
  getCommonHeader,
  getCommonContainer,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showCityPicker, createEmployee } from "../../utils";
import "./index.css";

export const cityPicker = getCommonContainer({
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
          labelName: "Pick your city.",
          labelKey: "HR_PICK_YOUR_CITY_LABEL"
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
            marginRight: "-15px"
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
          callBack: showCityPicker
        }
      }
    }
  },
  cityPicker: getCommonContainer({
    cityDropdown: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hrms",
      componentPath: "AutosuggestContainer",
      jsonPath: "citiesByModule.tenantId",
      required: false,
      gridDefination: {
        xs: 12,
        sm: 12
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        className: "hrmsCityPicker",
        label: {
          labelName: "City",
          labelKey: "HE_NEW_EMPLOYEE_CITY_LABEL"
        },
        placeholder: {
          labelName: "Select City",
          labelKey: "HR_SELECT_CITY_PLACEHOLDER"
        },
        jsonPath: "citiesByModule.citizenTenantId",
        sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
        labelsFromLocalisation: true,
        fullwidth: true,
        required: false,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        }
      }
    },
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        selectButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            className: "hrmsCityPickerButton"
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "SELECT",
              labelKey: "HR_CITY_SELECT_LABEL"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: createEmployee
          }
        }
      }
    }
  })
});
