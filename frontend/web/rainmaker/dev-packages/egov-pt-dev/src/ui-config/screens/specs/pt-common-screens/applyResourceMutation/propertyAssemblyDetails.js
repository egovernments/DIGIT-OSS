import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from 'lodash/get';
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


const rendersubUsageType = (usageType, propType, dispatch, state) => {
  let subTypeValues = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.PropertyTax.subUsageType"
  );
  let propertyType = get(
    state.screenConfiguration.preparedFinalObject,
    "Property.propertyType"
  );  
  let subUsage;
  if (propertyType === "BUILTUP.SHAREDPROPERTY") {
    dispatch(
      handleField(
        "register-property",
        "components.div.children.formwizardFirstStep.children.propertyAssemblyDetails.children.cardContent.children.propertyAssemblyDetailsContainer.children.subUsageType",
        "required",
        true
      )
     )
    if (usageType === "MIXED") {
      subUsage = subTypeValues;
    } else {
      subUsage = subTypeValues.filter(cur => {
        return (cur.code.startsWith(usageType))
      })
    }
  } else {
    subUsage = [];
     set(state.screenConfiguration.preparedFinalObject,"Property.subUsageCategory", "");
     dispatch(
      handleField(
        "register-property",
        "components.div.children.formwizardFirstStep.children.propertyAssemblyDetails.children.cardContent.children.propertyAssemblyDetailsContainer.children.subUsageType",
        "required",
        false
      )
     )
  }
  dispatch(
    prepareFinalObject(
      "propsubusagetypeForSelectedusageCategory",
      subUsage
    )
  )

}

export const propertyAssemblyDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Property Assembly Details",
      labelKey: "PT_COMMON_PROPERTY_ASSEMBLY_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  propertyAssemblyDetailsContainer: getCommonContainer({
    propertyType: getSelectField({
      label: {
        labelName: "Property Type",
        labelKey: "PT_COMMON_PROPERTY_TYPE"
      },
      placeholder: {
        labelName: "Select Property Type",
        labelKey: "PT_COMMON_PROPERTY_TYPE_PLACEHOLDER"
      },
      required: true,
      jsonPath: "Property.propertyType",
      sourceJsonPath: "searchScreenMdmsData.PropertyTax.PropertyType",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      localePrefix: {
        moduleName: "COMMON",
        masterName: "PROPTYPE"
      },
      afterFieldChange: async (action, state, dispatch) => {
        let usageType = get(
          state.screenConfiguration.preparedFinalObject,
          "Property.usageCategory"
        );
        // if (usageType) {
          rendersubUsageType(usageType, action.value, dispatch, state)
        // }
      }
    }),
    totalLandArea: getTextField({
      label: {
        labelName: "Total Land Area",
        labelKey: "PT_COMMON_TOTAL_LAND_AREA"
      },
      props: {
      },
      placeholder: {
        labelName: "Select Total Land Area",
        labelKey: "PT_COMMON_TOTAL_LAND_AREA_PLACEHOLDER"
      },
      required: true,
      pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Property.landArea"
    }),
    totalConstructedArea: getTextField({
      label: {
        labelName: "Total Constructed Area",
        labelKey: "PT_COMMON_TOTAL_CONSTRUCTED_AREA"
      },
      props: {
      },
      placeholder: {
        labelName: "Enter Total Constructed Area",
        labelKey: "PT_COMMON_TOTAL_CONSTRUCTED_AREA_PLACEHOLDER"
      },
      required: true,
      pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Property.totalConstructedArea"
    }),
    usageType: getSelectField({
      label: {
        labelName: "Usage Type",
        labelKey: "PT_COMMON_USAGE_TYPE"
      },
      placeholder: {
        labelName: "Select Usage Type",
        labelKey: "PT_COMMON_USAGE_TYPE_PLACEHOLDER"
      },
      required: true,
      jsonPath: "Property.usageCategory",
      sourceJsonPath: "searchScreenMdmsData.PropertyTax.UsageType",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      localePrefix: {
        moduleName: "COMMON",
        masterName: "PROPUSGTYPE"
      },
      beforeFieldChange: async (action, state, dispatch) => {
        let propType = get(
          state.screenConfiguration.preparedFinalObject,
          "Property.propertyType"
        );
        rendersubUsageType(action.value, propType, dispatch, state)
      }
    }),
    subUsageType: getSelectField({
      label: {
        labelName: "Sub Usage Type",
        labelKey: "PT_COMMON_SUB_USAGE_TYPE"
      },
      placeholder: {
        labelName: "Select Sub Usage Type",
        labelKey: "PT_COMMON_SUB_USAGE_TYPE_PLACEHOLDER"
      },
      required: false,
      jsonPath: "Property.subUsageCategory",
      sourceJsonPath: "propsubusagetypeForSelectedusageCategory",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props:{
       
      },
      localePrefix: {
        moduleName: "COMMON",
        masterName: "PROPSUBUSGTYPE"
      },
    })
  })
});