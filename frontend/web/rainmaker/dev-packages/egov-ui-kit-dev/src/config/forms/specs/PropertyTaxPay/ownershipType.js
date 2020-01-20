import { getOwnerDetails } from "./utils/formConfigModifier";
import set from "lodash/set";
import get from "lodash/get";
import { updateInstituteType } from "./utils/formConfigModifier";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";

const formConfig = {
  name: "ownershipType",
  fields: {
    typeOfOwnership: {
      id: "typeOfOwnership",
      jsonPath: "Properties[0].propertyDetails[0].subOwnershipCategory",
      type: "singleValueList",
      floatingLabelText: "PT_FORM3_OWNERSHIP_TYPE",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      hintText: "PT_FORM3_OWNERSHIP_TYPE_PLACEHOLDER",
      numcols: 6,
      required: true,
      updateDependentFields: ({ formKey, field: sourceField, dispatch, state }) => {
        const { value } = sourceField;
        const institutedropDown = updateInstituteType(state, value);
        dispatch(
          prepareFormData(
            "Properties[0].propertyDetails[0].ownershipCategory",
            get(state, `common.generalMDMSDataById.SubOwnerShipCategory[${sourceField.value}].ownerShipCategory`, value)
          )
        );
        if (value.toUpperCase().indexOf("INSTITUTIONAL") !== -1 || value.toUpperCase().indexOf("COMPANY") !== -1) {
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
    const selectedOwnerShip=get(state, "common.prepareFormData.Properties[0].propertyDetails[0].ownershipCategory");
    const ownerShipValue=selectedOwnerShip?selectedOwnerShip:ownerDetails[0].value;
    const currentOwnershipType = get(state, "form.ownershipType.fields.typeOfOwnership.value", ownerShipValue);
    set(action, "form.fields.typeOfOwnership.dropDownData", ownerDetails);
    set(action, "form.fields.typeOfOwnership.value", currentOwnershipType);
    dispatch(
      prepareFormData(
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(state, `common.generalMDMSDataById.SubOwnerShipCategory[${currentOwnershipType}].ownerShipCategory`)
      )
    );
    dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", currentOwnershipType));

    if (currentOwnershipType.toUpperCase().indexOf("INSTITUTIONAL") !== -1 || currentOwnershipType.toUpperCase().indexOf("COMPANY") !== -1) {
      dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", null));
    }

    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
