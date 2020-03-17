import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import {
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import {checkValueForNA} from "../../utils";

const tenantId = getQueryArg(window.location.href, "tenantId");

const propertyDetails =  getCommonGrayCard({
  propertyLocationContainer:getCommonContainer({
      city: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "PT_PROPERTY_ADDRESS_CITY"
      },
      {
        jsonPath: "Property.address.city",
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        callBack: checkValueForNA
      }
    ),
    doorHouseNo: getLabelWithValue(
      {
        labelName: "Door/House No.",
        labelKey: "PT_PROPERTY_ADDRESS_HOUSE_NO"
      },
      { jsonPath: "Property.address.doorNo", callBack: checkValueForNA }
    ),
    buildingCompanyName: getLabelWithValue(
      {
        labelName: "Building/Company Name",
        labelKey: "PT_PROPERTY_ADDRESS_COLONY_NAME"
      },
      {
        jsonPath:
          "Property.address.buildingName", callBack: checkValueForNA
      }
    ),
    streetName: getLabelWithValue(
      {
        labelName: "Street Name",
        labelKey: "PT_PROPERTY_ADDRESS_STREET_NAME"
      },
      { jsonPath: "Property.address.street", callBack: checkValueForNA }
    ),
    mohalla: getLabelWithValue(
      {
        labelName: "Mohalla",
        labelKey: "PT_PROPERTY_ADDRESS_MOHALLA"
      },
      {
        jsonPath:
          "Property.address.locality.code",
        callBack: value => {
          return value ? `${getTransformedLocale(tenantId)}_REVENUE_${value}` : "NA";
        }
      }
    ),
    pincode: getLabelWithValue(
      {
        labelName: "Pincode",
        labelKey: "PT_PROPERTY_ADDRESS_PINCODE"
      },
      { jsonPath: "Property.address.pincode", callBack: checkValueForNA }
    ),
    existingPropertyId: getLabelWithValue(
      {
        labelName: "Existing Property ID",
        labelKey: "PT_PROPERTY_ADDRESS_EXISTING_PID"
      },
      { jsonPath: "Property.oldPropertyId", callBack: checkValueForNA }
    ),
  })
})


export const propertySummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Property Address",
          labelKey: "PT_PROPERTY_ADDRESS_SUB_HEADER"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
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
            labelKey: "PT_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  cardOne: propertyDetails,
});
