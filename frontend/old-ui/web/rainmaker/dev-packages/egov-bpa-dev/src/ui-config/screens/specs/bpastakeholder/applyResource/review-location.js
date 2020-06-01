import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { checkValueForNA } from "../../utils";

export const getPermanentDetails = (isEditable = true) => {
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
            labelName: "Permanent Details",
            labelKey: "BPA_PERMENENT_ADDRESS_HEADER_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
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
              labelKey: "BPA_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewDoorHouseNo: getLabelWithValue(
        {
          labelName: "Door/House No.",
          labelKey: "BPA_DETAILS_DOOR_NO_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.doorNo",
          callBack: checkValueForNA
        }
      ),
      reviewBuilidingName: getLabelWithValue(
        {
          labelName: "Building/Colony Name",
          labelKey: "BPA_DETAILS_BLDG_NAME_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.buildingName",
          callBack: checkValueForNA
        }
      ),
      reviewStreetName: getLabelWithValue(
        {
          labelName: "Enter Street Name",
          labelKey: "BPA_DETAILS_SRT_NAME_PLACEHOLDER"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.street",
          callBack: checkValueForNA
        }
      ),
      reviewMohalla: getLabelWithValue(
        {
          labelName: "Locality",
          labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.landmark",
          callBack: checkValueForNA
        }
      ),
      reviewCity: getLabelWithValue(
        {
          labelName: "City",
          labelKey: "BPA_CITY_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.city",
          callBack: checkValueForNA
        }
      ),
      reviewPincode: getLabelWithValue(
        {
          labelName: "Pincode",
          labelKey: "BPA_DETAILS_PIN_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.pincode",
          callBack: checkValueForNA
        }
      )
    })
  });
};

export const getCommunicactionDetails = (isEditable = true) => {
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
            labelName: "Communication Details",
            labelKey: "BPA_COMMUNICATION_ADDRESS_HEADER_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
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
              labelKey: "BPA_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewDoorHouseNo: getLabelWithValue(
        {
          labelName: "Door/House No.",
          labelKey: "BPA_DETAILS_DOOR_NO_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo",
          callBack: checkValueForNA
        }
      ),
      reviewBuilidingName: getLabelWithValue(
        {
          labelName: "Building/Colony Name",
          labelKey: "BPA_DETAILS_BLDG_NAME_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName",
          callBack: checkValueForNA
        }
      ),
      reviewStreetName: getLabelWithValue(
        {
          labelName: "Enter Street Name",
          labelKey: "BPA_DETAILS_SRT_NAME_PLACEHOLDER"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.street",
          callBack: checkValueForNA
        }
      ),
      reviewMohalla: getLabelWithValue(
        {
          labelName: "Locality",
          labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.landmark",
          callBack: checkValueForNA
        }
      ),
      reviewCity: getLabelWithValue(
        {
          labelName: "City",
          labelKey: "BPA_CITY_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.city",
          callBack: checkValueForNA
        }
      ),
      reviewPincode: getLabelWithValue(
        {
          labelName: "Pincode",
          labelKey: "BPA_DETAILS_PIN_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode",
          callBack: checkValueForNA
        }
      )
    })
  });
};
