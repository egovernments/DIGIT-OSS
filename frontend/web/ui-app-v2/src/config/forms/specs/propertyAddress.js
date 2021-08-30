// const formConfig = {
//   name: "propertyAddress",
//   fields: {
//     doorNumber: {
//       id: "door-number",
//       jsonPath: "",
//       required: true,
//       type: "textfield",
//       floatingLabelText: "PT_PROPERTY_DETAILS_DOOR_NUMBER",
//       hintText: "PT_PROPERTY_DETAILS_DOOR_NUMBER_PLACEHOLDER",
//       errorMessage: "PT_PROPERTY_DETAILS_DOOR_NUMBER_ERRORMSG",
//     },
//     colony: {
//       id: "property-colony",
//       jsonPath: "",
//       required: true,
//       type: "textfield",
//       floatingLabelText: "PT_PROPERTY_DETAILS_COLONY_NAME",
//       hintText: "PT_PROPERTY_DETAILS_COLONY_NAME_PLACEHOLDER",
//       errorMessage: "PT_PROPERTY_DETAILS_COLONY_NAME_ERRORMSG",
//     },
//     street: {
//       id: "property-street",
//       jsonPath: "",
//       type: "textfield",
//       floatingLabelText: "PT_PROPERTY_DETAILS_STREET",
//       hintText: "PT_PROPERTY_DETAILS_STREET_PLACEHOLDER",
//       errorMessage: "PT_PROPERTY_DETAILS_STREET_ERRORMSG",
//     },
//     mohalla: {
//       id: "mohalla",
//       jsonPath: "",
//       type: "singleValueList",
//       floatingLabelText: "PT_PROPERTY_DETAILS_MOHALLA",
//       hintText: "PT_PROPERTY_DETAILS_MOHALLA_PLACEHOLDER",
//       errorMessage: "PT_PROPERTY_DETAILS_MOHALLA_ERRORMSG",
//     },
//     city: {
//       id: "city",
//       jsonPath: "",
//       required: true,
//       type: "singleValueList",
//       floatingLabelText: "CS_ADDCOMPLAINT_CITY",
//       hintText: "PT_PROPERTY_DETAILS_CITY_PLACEHOLDER",
//     },
//     pincode: {
//       id: "pincode",
//       type: "textfield",
//       jsonPath: "",
//       floatingLabelText: "PT_PROPERTY_DETAILS_PINCODE",
//       hintText: "PT_PROPERTY_DETAILS_PINCODE_PLACEHOLDER",
//       errorMessage: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG",
//     },
//   },

//   action: "",
//   redirectionRoute: "",
//   saveUrl: "",
// };

// export default formConfig;

const formConfig = {
  name: "propertyAddress",
  fields: {
    doorNumber: {
      id: "door-number",
      jsonPath: "",
      required: true,
      type: "textfield",
      floatingLabelText: "Door/Plot No.",
      hintText: "Enter Door/Plot No.",
      errorMessage: "PT_PROPERTY_DETAILS_DOOR_NUMBER_ERRORMSG",
    },
    colony: {
      id: "property-colony",
      jsonPath: "",
      required: true,
      type: "textfield",
      floatingLabelText: "Colony",
      hintText: "Enter buiding/colony name",
      errorMessage: "PT_PROPERTY_DETAILS_COLONY_NAME_ERRORMSG",
    },
    street: {
      id: "property-street",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "Street Name",
      hintText: "Enter street name",
      errorMessage: "PT_PROPERTY_DETAILS_STREET_ERRORMSG",
    },
    mohalla: {
      id: "mohalla",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "Locality/Mohalla",
      hintText: "Select locality",
      errorMessage: "PT_PROPERTY_DETAILS_MOHALLA_ERRORMSG",
    },
    city: {
      id: "city",
      jsonPath: "",
      required: true,
      type: "singleValueList",
      floatingLabelText: "City",
      hintText: "Enter City",
    },
    pincode: {
      id: "pincode",
      type: "textfield",
      jsonPath: "",
      floatingLabelText: "Pincode",
      hintText: "Enter area pincode",
      errorMessage: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG",
    },
  },

  action: "",
  redirectionRoute: "",
  saveUrl: "",
};

export default formConfig;
