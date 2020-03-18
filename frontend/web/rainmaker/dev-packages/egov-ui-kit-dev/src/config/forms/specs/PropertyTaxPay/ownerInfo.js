import { getOwnerCategoryByYear ,getOwnerCategory} from "egov-ui-kit/utils/PTCommon";
import { setDependentFields } from "./utils/enableDependentFields";
import get from "lodash/get";
import set from "lodash/set";
import { setFieldProperty, handleFieldChange } from "egov-ui-kit/redux/form/actions";

const formConfig = {
  name: "ownerInfo",
  fields: {
    ownerName: {
      id: "ownerName",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].name",
      type: "textfield",
      floatingLabelText: "PT_OWNER_NAME",
      hintText: "PT_FORM3_OWNER_NAME_PLACEHOLDER",
      required: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: /^[^{0-9}^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,64}$/i,
      errorMessage: "PT_NAME_ERROR_MESSAGE",
    },
    ownerMobile: {
      id: "ownerMobile",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].mobileNumber",
      type: "textfield",
      floatingLabelText: "PT_FORM3_MOBILE_NO",
      hintText: "PT_FORM3_MOBILE_NO_PLACEHOLDER",
      required: true,
      pattern: /^([0]|((\+\d{1,2}[-]{0,1})))?\(?[5-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
      errorMessage: "PT_MOBILE_NUMBER_ERROR_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    },
    ownerGuardian: {
      id: "ownerGuardian",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].fatherOrHusbandName",
      type: "textfield",
      floatingLabelText: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME",
      hintText: "PT_FORM3_GUARDIAN_PLACEHOLDER",
      pattern: /^[^{0-9}^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,64}$/i,
      required: true,
      errorMessage: "PT_NAME_ERROR_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    },
    ownerEmail: {
      id: "ownerEmail",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].emailId",
      type: "textfield",
      floatingLabelText: "PT_FORM3_EMAIL_ID",
      hintText: "PT_FORM3_EMAIL_ID_PLACEHOLDER",
      errorMessage: "PT_EMAIL_ID_ERROR_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/,
    },
    ownerAddress: {
      id: "ownerAddress",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].permanentAddress",
      type: "textfield",
      floatingLabelText: "PT_FORM3_CORRESPONDENCE_ADDRESS",
      hintText: "PT_FORM3_CORRESPONDENCE_ADDRESS_PLACEHOLDER",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,256}$/,
      errorMessage: "PT_ADDRESS_ERROR_MESSAGE",
    },
    ownerRelationship: {
      id: "ownerRelationship",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].relationship",
      type: "singleValueList",
      localePrefix: "PT_RELATION",
      floatingLabelText: "PT_FORM3_RELATIONSHIP",
      hintText: "",
      dropDownData: [{ label: "Father", value: "FATHER" }, { label: "Husband", value: "HUSBAND" }],
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    },
    ownerCategory: {
      id: "ownerCategory",
      required: true,
      localePrefix: { moduleName: "PropertyTax", masterName: "OwnerType" },
      jsonPath: "Properties[0].propertyDetails[0].owners[0].ownerType",
      type: "singleValueList",
      floatingLabelText: "PT_FORM3_SPECIAL_CATEGORY",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      dropDownData: [],
      fullWidth: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      updateDependentFields: ({ formKey, field: sourceField, dispatch, state }) => {
        const { value } = sourceField;
        const dependentFields = ["ownerCategoryId", "ownerCategoryIdType"];
        let documentTypes = get(
          state,
          `${process.env.REACT_APP_NAME === "Citizen" ? "citizen" : "employee"}.mdms.document.MdmsRes.PropertyTax.OwnerTypeDocument`,
          []
        )
          .filter((docu) => {
            return docu.ownerTypeCode === value;
          })
          .reduce((acc, curr) => {
            let currAcc = [...acc];
            let dropDownData = {
              label: curr.name,
              value: curr.code,
            };
            currAcc.push(dropDownData);
            return currAcc;
          }, []);

        dispatch(setFieldProperty(formKey, "ownerCategoryIdType", "dropDownData", documentTypes));
        dispatch(handleFieldChange(formKey, "ownerCategoryIdType", get(documentTypes, "[0].value", "")));
        dispatch(setFieldProperty(formKey, "ownerCategoryIdType", "value", get(documentTypes, "[0].value", "")));       
        switch (value) {
          case "NONE":
            dispatch(handleFieldChange(formKey, "ownerCategoryId", null));
            setDependentFields(dependentFields, dispatch, formKey, true);
            break;
          case "WIDOW":
            dispatch(setFieldProperty(formKey, "ownerGender", "value", "Female"));
            setDependentFields(dependentFields, dispatch, formKey, false);
            break;
          default:
            setDependentFields(dependentFields, dispatch, formKey, false);
            break;
        }
      },
      updateOnSetField: (store, action) => {
        const dispatch = store.dispatch;
        const state = store.getState();
        const { fieldKey, formKey, propertyValue } = action;
        const dependentFields = ["ownerCategoryId", "ownerCategoryIdType"];
        const currentCategory = get(state, `form.${formKey}.fields.${fieldKey}.value`, "NONE");
        let documentTypes = get(
          state,
          `${process.env.REACT_APP_NAME === "Citizen" ? "citizen" : "employee"}.mdms.document.MdmsRes.PropertyTax.OwnerTypeDocument`,
          []
        )
          .filter((docu) => {
            return docu.ownerTypeCode === currentCategory;
          })
          .reduce((acc, curr) => {
            let currAcc = [...acc];
            let dropDownData = {
              label: curr.name,
              value: curr.code,
            };
            currAcc.push(dropDownData);
            return currAcc;
          }, []);
        dispatch(setFieldProperty(formKey, "ownerCategoryIdType", "dropDownData", documentTypes));
        dispatch(setFieldProperty(formKey, "ownerCategoryIdType", "value", get(documentTypes, "[0].value", "")));
        if (propertyValue.length > 0) {
          if (currentCategory === "NONE") {
            setDependentFields(dependentFields, dispatch, formKey, true);
          } else {
            setDependentFields(dependentFields, dispatch, formKey, false);
          }
        }
        return action;
      },
    },
    ownerCategoryId: {
      id: "ownerCategoryId",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].document.documentUid",
      required: true,
      type: "textfield",
      floatingLabelText: "PT_FORM3_DOCUMENT_ID_NO",
      hintText: "PT_FORM3_DOCUMENT_ID_NO_PLACEHOLDER",
      toolTip: true,
      toolTipMessage: "PT_DOCUMENT_ID_TOOLTIP_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      hideField: true,
    },
    ownerCategoryIdType: {
      id: "ownerCategoryIdType",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].document.documentType",
      required: true,
      localePrefix: { moduleName: "PropertyTax", masterName: "OwnerTypeDocument" },
      type: "singleValueList",
      floatingLabelText: "PT_FORM3_DOCUMENT_ID_TYPE",
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      toolTip: true,
      toolTipMessage: "PT_DOCUMENT_ID_TYPE_TOOLTIP_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      dropDownData: [],
      hideField: true,
      updateDependentFields: ({ formKey, field: sourceField, dispatch, state }) => {
        const { value } = sourceField;
        if (value === "Aadhar") {
          dispatch(setFieldProperty(formKey, "ownerCategoryId", "pattern", /^[0-9]{12}$/i));
          dispatch(setFieldProperty(formKey, "ownerCategoryId", "errorMessage", "Enter valid 12 digits aadhar no"));
        } else {
          dispatch(setFieldProperty(formKey, "ownerCategoryId", "pattern", ""));
          dispatch(setFieldProperty(formKey, "ownerCategoryId", "errorMessage", ""));
        }
      },
    },
    ownerGender: {
      id: "ownerGender",
      jsonPath: "Properties[0].propertyDetails[0].owners[0].gender",
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
            .replace(":","");
          dispatch(setFieldProperty(formKey, "ownerAddress", "value", correspondingAddress));
          dispatch(handleFieldChange(formKey, "ownerAddress", correspondingAddress));
        } else {
          dispatch(setFieldProperty(formKey, "ownerAddress", "value", ""));
        }
      },
    },
  },
  beforeInitForm: (action, store, dispatch) => {
    try {
      let state = store.getState();
      const OwnerTypes = get(state, `common.generalMDMSDataById.OwnerType`);
      // let financialYearFromQuery = window.location.search.split("FY=")[1];
      // financialYearFromQuery = financialYearFromQuery.split("&")[0];
      // const dropdownData = getOwnerCategoryByYear(Object.values(OwnerTypes), financialYearFromQuery);
      const dropdownData = getOwnerCategory(Object.values(OwnerTypes));
      set(action, "form.fields.ownerCategory.dropDownData", dropdownData);
      const ownerShipType = get(state, "form.ownershipType.fields.typeOfOwnership.value", "");
      if (ownerShipType === "SINGLEOWNER") {
        set(action, "form.fields.ownerGender.value", get(state, "form.ownerInfo.fields.ownerGender.value", "Male"));
      }
      return action;
    } catch (e) {
      console.log(e);
      return action;
    }
  },
  afterInitForm: (action, store, dispatch) => {
    try {
      const formKey = get(action, "form.name", "");
      const state = store.getState();
      if (get(state, `form.${formKey}.fields.ownerRelationship.value`, "NONE") === "NONE") {
        dispatch(handleFieldChange(formKey, "ownerRelationship", "FATHER"));
      }

      if (get(state, `form.${formKey}.fields.ownerCategory.value`, "NONE") === "NONE") {
        dispatch(setFieldProperty(formKey, "ownerCategoryId", "hideField", true));
        dispatch(setFieldProperty(formKey, "ownerCategoryIdType", "hideField", true));
      } else {
        dispatch(setFieldProperty(formKey, "ownerCategoryId", "hideField", false));
        dispatch(setFieldProperty(formKey, "ownerCategoryIdType", "hideField", false));
      }
      const currentCategory = get(state, `form.${action.form.name}.fields.ownerCategory.value`, "NONE");
      let documentTypes = get(
        state,
        `${process.env.REACT_APP_NAME === "Citizen" ? "citizen" : "employee"}.mdms.document.MdmsRes.PropertyTax.OwnerTypeDocument`,
        []
      )
        .filter((docu) => {
          return docu.ownerTypeCode === currentCategory;
        })
        .reduce((acc, curr) => {
          let currAcc = [...acc];
          let dropDownData = {
            label: curr.name,
            value: curr.code,
          };
          currAcc.push(dropDownData);
          return currAcc;
        }, []);

      dispatch(setFieldProperty(action.form.name, "ownerCategoryIdType", "dropDownData", documentTypes));
      return action;
    } catch (e) {
      console.log(e);
      return action;
    }
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
