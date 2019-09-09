import { MDMS } from "egov-ui-kit/utils/endPoints";
import get from "lodash/get";
import { updateInstituteType } from "../../utils/formConfigModifier";
import set from "lodash/set";

const formConfig = {
  name: "institutionDetails",
  fields: {
    name: {
      id: "institution-name",
      jsonPath: "propertyDetails[0].institution.name",
      type: "textfield",
      floatingLabelText: "PT_INSTITUTION_NAME",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      errorMessage: "PT_NAME_ERROR_MESSAGE",
      numcols: 6,
      required: true,
    },
    type: {
      id: "institution-type",
      jsonPath: "propertyDetails[0].institution.type",
      type: "singleValueList",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      floatingLabelText: "PT_INSTITUTION_TYPE",
      numcols: 6,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      required: true,
    },
  },
  beforeInitForm: (action, store) => {
    let state = store.getState();
    const value = get(state, "form.ownershipType.fields.typeOfOwnership.value", "");
    const institutedropDown = updateInstituteType(state, value);
    set(action, "form.fields.type.dropDownData", institutedropDown);
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
