import { city, colony, dummy, houseNumber, pincode, street } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/reusableFields";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";

const formConfig = {
  name: "propertyInformation",
  fields: {
    ...city,
    ...dummy,
    ...houseNumber,
    ...colony,
    ...street,

    mohalla: {
      id: "mohalla",
      jsonPath: "Properties[0].address.locality.code",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_DETAILS_MOHALLA",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      fullWidth: true,
      boundary: true,
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_MOHALLA_ERRORMSG",
      disabled: true
    },

    ...pincode,
    oldPID: {
      id: "oldpid",
      type: "textFieldIcon",
      className: "pt-old-pid-text-field",
      iconRedirectionURL: "https://pmidc.punjab.gov.in/propertymis/search.php",
      jsonPath: "Properties[0].oldPropertyId",
      floatingLabelText: "PT_PROPERTY_ADDRESS_EXISTING_PID",
      hintText: "PT_PROPERTY_ADDRESS_EXISTING_PID_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: /^[^\$\"'<>?\\\\~`!@$%^+={}*,.:;“”‘’]{1,64}$/i,
      maxLength: 64
    }
  },
  beforeInitForm: (action, store) => {
    let state = store.getState();
    set(action, "form.fields.city.required", false);
    set(action, "form.fields.pincode.disabled", true);
    return action;
  },
  afterInitForm: (action, store, dispatch) => {
    let tenantId = getTenantId();
    dispatch(handleFieldChange("propertyInformation", "city", tenantId));
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false
};

export default formConfig;
