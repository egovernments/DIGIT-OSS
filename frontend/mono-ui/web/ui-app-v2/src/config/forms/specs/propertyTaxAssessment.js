const formConfig = {
  name: "propertyTaxAssessment",
  fields: {
    //start of details 1
    propertyType: {
      id: "assessment-property-type",
      jsonPath: "",
      required: true,
      floatingLabelText: "PT_ASSESMENT1_PROPERTY_TYPE",
      hintText: "PT_COMMON_SELECT_PLACEHOLDER",
    },
    plotSize: {
      id: "assessment-plot-size",
      jsonPath: "",
      floatingLabelText: "PT_ASSESMENT1_PLOT_SIZE",
      hintText: "PT_COMMON_SQFT_PLACEHOLDER",
      errorMessage: "PT_ASSESMENT1_PLOT_SIZE_ERROR_MESSAGE",
    },
    floorCount: {
      id: "assessment-number-of-floors",
      jsonPath: "",
      floatingLabelText: "PT_ASSESMENT1_NUMBER_OF_FLOORS",
      hintText: "PT_COMMON_SQFT_PLACEHOLDER",
    },
    //end of details 1
    // start of details 2
    builtUpArea1: {
      id: "assessment-built-up-area-floor1",
      jsonPath: "",
      floatingLabelText: "PT_ASSESSMENT2_FLOOR1_BUILT_UP_AREA",
      hintText: "PT_COMMON_SQFT_PLACEHOLDER",
      errorMessage: "PT_ASSESSMENT2_COMMON_ERRORMSG",
    },
    builtUpArea2: {
      id: "assessment-built-up-area-floor-2",
      floatingLabelText: "PT_ASSESSMENT2_FLOOR2_BUILT_UP_AREA",
      hintText: "PT_COMMON_SQFT_PLACEHOLDER",
      errorMessage: "PT_ASSESSMENT2_COMMON_ERRORMSG",
    },
    // end of details 2
    //exemption wizard starts
    propertcategoryNumber: {
      id: "exemption-category",
      jsonPath: "",
      floatingLabelText: "PT_EXEMPTION_EXEMPTION_CATEGORY",
      hintText: "PT_COMMON_SELECT_PLACEHOLDER",
    },
    referenceId: {
      id: "exemption-reference-id",
      jsonPath: "",
      floatingLabelText: "PT_EXEMPTION_REFERENCE_ID",
      hintText: "PT_EXEMPTION_REFERENCE_ID_PLACEHOLDER",
      errorMessage: "PT_EXEMPTION_REFERENCE_ID_ERRORMSG",
    },
    proof: {
      id: "exemption-proof",
      jsonPath: "",
      file: true,
      floatingLabelText: "PT_EXEMPTION_PROOF",
      hintText: "PT_EXEMPTION_PROOF_PLACEHOLDER",
    },
    //end of exemption
    // owner details start
    name: {
      id: "owner-name",
      jsonPath: "",
      required: true,
      floatingLabelText: "CORE_COMMON_NAME",
      hintText: "CORE_COMMON_NAME_PLACEHOLDER",
      errorMessage: "CORE_COMMON_NAME_VALIDMSG",
    },
    fatherHusbandName: {
      id: "owner-husband-or-father-name",
      jsonPath: "",
      floatingLabelText: "PT_OWNER_DETAILS_FATHER_OR_HUSBAND_NAME",
      hintText: "PT_OWNER_DETAILS_FATHER_OR_HUSBAND_NAME_PLACEHOLDER",
      errorMessage: "CORE_COMMON_NAME_VALIDMSG",
    },
    aadharNumber: {
      id: "owner-aadhar-number",
      jsonPath: "",
      floatingLabelText: "PT_OWNER_DETAILS_AADHAR_NUMBER",
      hintText: "PT_OWNER_DETAILS_AADHAR_PLACEHOLDER",
      errorMessage: "PT_OWNER_DETAILS_AADHAR_ERRORMSG",
    },
    mobileNumber: {
      id: "owner-mobile-number",
      jsonPath: "",
      required: true,
      floatingLabelText: "CORE_COMMON_MOBILE_NUMBER",
      hintText: "CORE_COMMON_PHONE_NUMBER_PLACEHOLDER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
    },
    address: {
      id: "owner-corresspondance-address",
      jsonPath: "",
      floatingLabelText: "PT_OWNER_DETAILS_ADDRESS",
      hintText: "PT_OWNER_DETAILS_ADDRESS_PLACEHOLDER",
      errorMessage: "PT_OWNER_DETAILS_ADDRESS_ERRORMSG",
    },
    // end of owner fields
    //property address
    propertyNumber: {
      id: "property-number",
      jsonPath: "",
      required: true,
      floatingLabelText: "PT_PROPERTY_DETAILS_PROPERTY_NUMBER",
      hintText: "PT_PROPERTY_DETAILS_PROPERTY_NUMBER_PLACEHOLDER",
      errorMessage: "PT_PROPERTY_DETAILS_PROPERTY_NUMBER_ERRORMSG",
    },
    colony: {
      id: "property-colony",
      jsonPath: "",
      required: true,
      floatingLabelText: "PT_PROPERTY_DETAILS_COLONY_NAME",
      hintText: "PT_PROPERTY_DETAILS_COLONY_NAME_PLACEHOLDER",
      errorMessage: "PT_PROPERTY_DETAILS_COLONY_NAME_ERRORMSG",
    },
    street: {
      id: "property-street",
      jsonPath: "",
      required: true,
      floatingLabelText: "PT_PROPERTY_DETAILS_STREET",
      hintText: "PT_PROPERTY_DETAILS_STREET_PLACEHOLDER",
      errorMessage: "PT_PROPERTY_DETAILS_STREET_ERRORMSG",
    },
    location: {
      id: "property-location",
      jsonPath: "",
      floatingLabelText: "CS_ADDCOMPLAINT_LOCATION",
      hintText: "PT_PROPERTY_DETAILS_LOCATION_PLACEHOLDER",
    },
    // end of property address
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
};

export default formConfig;
