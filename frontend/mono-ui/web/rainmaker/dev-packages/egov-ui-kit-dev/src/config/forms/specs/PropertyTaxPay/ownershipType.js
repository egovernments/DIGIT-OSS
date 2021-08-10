import { getOwnerDetails } from "./utils/formConfigModifier";
import set from "lodash/set";
import get from "lodash/get";
import { updateInstituteType } from "./utils/formConfigModifier";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";

const formConfig = {
  name: "ownershipType",
  fields: {
    typeOfOwnership: {
      id: "typeOfOwnership",
      jsonPath: "Properties[0].propertyDetails[0].subOwnershipCategory",
      type: "AutocompleteDropdown",
      floatingLabelText: "PT_FORM3_OWNERSHIP_TYPE",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      labelsFromLocalisation: false,
      hintText: "PT_FORM3_OWNERSHIP_TYPE_PLACEHOLDER",
      numcols: 6,
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6
      },
      formName: "ownershipType",
      updateDependentFields: ({ formKey, field: sourceField, dispatch, state }) => {
        const { value } = sourceField;
        const institutedropDown = updateInstituteType(state, value);
        dispatch(
          prepareFormData(
            "Properties[0].propertyDetails[0].ownershipCategory",
            get(state, `common.generalMDMSDataById.SubOwnerShipCategory[${sourceField.value}].ownerShipCategory`, value)
          )
        );
        if (value.toUpperCase().indexOf("INSTITUTIONAL") !== -1) {
          dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", null));
        }
        dispatch(setFieldProperty("institutionDetails", "type", "dropDownData", institutedropDown));
      },
    },
  },
  beforeInitForm: (action, store) => {
    let state = store.getState();
    const { dispatch } = store;
    const ownerDetails = getOwnerDetails(state);
    if(ownerDetails && ownerDetails.length){
      ownerDetails && ownerDetails.length > 0 && ownerDetails.forEach(data => { data.label = getLocaleLabels(`PT_OWNERSHIP_${data.value}`, `PT_OWNERSHIP_${data.value}`) });
      const currentOwnershipType = get(state, "form.ownershipType.fields.typeOfOwnership.value", ownerDetails[0].value);
      set(action, "form.fields.typeOfOwnership.dropDownData", ownerDetails);
      set(action, "form.fields.typeOfOwnership.value", currentOwnershipType);
      dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", currentOwnershipType ? currentOwnershipType : ownerDetails[0].value));
      dispatch(prepareFormData("Properties[0].propertyDetails[0].ownershipCategory",
          get(state, `common.generalMDMSDataById.OwnerShipCategory[${currentOwnershipType ? currentOwnershipType : ownerDetails[0].value}]`).ownerShipCategory)
      );
    }
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
