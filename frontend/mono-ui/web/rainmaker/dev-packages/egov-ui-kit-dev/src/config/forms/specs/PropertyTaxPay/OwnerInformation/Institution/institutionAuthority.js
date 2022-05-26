import {
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleFieldChange, setFieldProperty } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
const formConfig = {
  name: "institutionAuthority",
  fields: {
    name: {
      id: "authority-name",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].name",
      type: "textfield",
      floatingLabelText: "PT_OWNER_NAME",
      hintText: "PT_FORM3_OWNER_NAME_PLACEHOLDER",
      required: true,
    },
    mobile: {
      id: "authority-mobile",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].mobileNumber",
      type: "textfield",
      floatingLabelText: "PT_FORM3_MOBILE_NO",
      hintText: "PT_FORM3_MOBILE_NO_PLACEHOLDER",
      pattern: /^(\+\d{1,2}[-]{0,1})?\(?[6-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
      errorMessage: "PT_MOBILE_NUMBER_ERROR_MESSAGE",
      required: true,
    },
    alterMobile: {
      id: "authority-altermobile",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].alternatemobilenumber",
      type: "textfield",
      floatingLabelText: "PT_FORM3_ALT_MOBILE_NO",
      hintText: "PT_FORM3_ALT_MOBILE_NO_PLACEHOLDER",
      pattern: getPattern("MobileNo"),
      errorMessage: "PT_MOBILE_NUMBER_ERROR_MESSAGE",
      required: false,
    },
    designation: {
      id: "authority-designation",
      jsonPath: "Properties[0].propertyDetails[0].institution.designation",
      type: "textfield",
      floatingLabelText: "TL_NEW_OWNER_DESIG_LABEL",
      hintText: "TL_NEW_OWNER_DESIG_PLACEHOLDER",
      errorMessage: "",
      required: true,
    },
    telephone: {
      id: "authority-telephone",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].altContactNumber",
      type: "textfield",
      floatingLabelText: "PT_LANDLINE_NUMBER_FLOATING_LABEL",
      hintText: "PT_LANDLINE_NUMBER_HINT_TEXT",
      required: true,
      pattern: /^[0-9]{11}$/i,
      errorMessage: "PT_LAND_NUMBER_ERROR_MESSAGE",
    },
    email: {
      id: "authority-email",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].emailId",
      type: "textfield",
      floatingLabelText: "PT_FORM3_EMAIL_ID",
      hintText: "PT_FORM3_EMAIL_ID_PLACEHOLDER",
      errorMessage: "PT_EMAIL_ID_ERROR_MESSAGE",
      pattern: /^(([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    address: {
      id: "authority-address",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].correspondenceAddress",
      type: "textfield",
      floatingLabelText: "PT_FORM3_CORRESPONDENCE_ADDRESS",
      hintText: "PT_FORM3_CORRESPONDENCE_ADDRESS_PLACEHOLDER",
      required: true,
    },
    isSameAsPropertyAddress: {
      id: "rcpt",
      type: "checkbox",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].isCorrespondenceAddress",
      errorMessage: "",
      floatingLabelText: "PT_FORM3_ADDRESS_CHECKBOX",
      value: "",
      updateDependentFields: ({ formKey, field: sourceField, dispatch, state }) => {
        const { value: iscorrAddrSameProp } = sourceField;
        const { city = "", colony = "", houseNumber = "", mohalla = "", pincode = "", street = "" } = get(state, "form.propertyAddress.fields", {});
        const mohallaDetails =
          mohalla && mohalla.dropDownData && mohalla.dropDownData.find((mohallaData) => mohallaData.value === get(mohalla, "value", ""));
        if (iscorrAddrSameProp) {
          const correspondingAddress = [
            `${get(houseNumber, "value", "")}`,
            `${get(colony, "value", "")}`,
            `${get(street, "value", "")}`,
            `${get(mohallaDetails, "label", "")}`,
            `${get(city, "value", "")
              .split(".")
              .pop()}`,
            `${get(pincode, "value", "")}`,
          ]
            .join(", ")
            .replace(/^(,\s)+|(,\s)+$/g, "")
            .replace(/(,\s){2,}/g, ", ")
            .replace(":", "");
          dispatch(setFieldProperty(formKey, "address", "value", correspondingAddress));
          dispatch(handleFieldChange(formKey, "address", correspondingAddress));
        } else {
          dispatch(setFieldProperty(formKey, "address", "value", ""));
        }
      },
    },
  },
  beforeInitForm: (action, store, dispatch) => {
    // Since designation field was not prefilling while doing edit in assessment operation. Making designation prefill. Root cause was designation data getting lost in propertydetails object of property. Hence taking it from Properties.
    let state = store.getState();
    const designation = get(state, "common.prepareFormData.Properties[0].institution.designation", "");
    dispatch(setFieldProperty("institutionAuthority", "designation", "value", designation));
    dispatch(handleFieldChange("institutionAuthority", "designation", designation));
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
