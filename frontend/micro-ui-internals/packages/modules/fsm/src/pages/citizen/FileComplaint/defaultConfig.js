import SelectPropertySubtype from "./SelectPropertySubtype";
import SelectPropertyType from "./SelectPropertyType";
import SelectAddress from "./SelectAddress";
import SelectLandmark from "./SelectLandmark";
import SelectPincode from "./SelectPincode";
import SelectTankSize from "./SelectTankSize";

export const config = {
  routes: {
    "property-type": {
      component: SelectPropertyType,
      texts: {
        headerCaption: "",
        header: "CS_FILE_PROPERTY_PLACEHOLDER",
        cardText: "CS_FILE_PROPERTY_TEXT",
        submitBarLabel: "PT_COMMONS_NEXT",
      },
      nextStep: "property-subtype",
    },
    "property-subtype": {
      component: SelectPropertySubtype,
      texts: {
        headerCaption: "",
        header: "CS_FILE_PROPERTY_SUBTYPE_PLACEHOLDER",
        cardText: "CS_FILE_PROPERTY_SUBTYPE_TEXT",
        submitBarLabel: "PT_COMMONS_NEXT",
      },
      nextStep: "pincode",
    },
    pincode: {
      component: SelectPincode,
      texts: {
        headerCaption: "",
        header: "CS_ADDCOMPLAINT_PINCODE",
        cardText: "CS_FILE_PROPERTY_PINCODE_TEXT",
        nextText: "PT_COMMONS_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      inputs: [
        {
          label: "CORE_COMMON_PINCODE",
          type: "text",
          name: "pincode",
          validation: {
            minLength: 6,
            maxLength: 7,
          },
          error: "CORE_COMMON_PINCODE_INVALID",
        },
      ],
      nextStep: "address",
    },
    address: {
      component: SelectAddress,
      texts: {
        headerCaption: "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
        header: "CS_ADDCOMPLAINT_PROVIDE_COMPLAINT_ADDRESS",
        cardText: "CS_ADDCOMPLAINT_CITY_MOHALLA_TEXT",
        nextText: "PT_COMMONS_NEXT",
      },
      nextStep: "landmark",
    },
    landmark: {
      component: SelectLandmark,
      texts: {
        headerCaption: "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
        header: "CS_ADDCOMPLAINT_PROVIDE_LANDMARK",
        cardText: "CS_ADDCOMPLAINT_PROVIDE_LANDMARK_TEXT",
        nextText: "PT_COMMONS_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      inputs: [
        {
          label: "CS_ADDCOMPLAINT_LANDMARK",
          type: "textarea",
          name: "landmark",
        },
      ],
      nextStep: "tank-size",
    },
    "tank-size": {
      component: SelectTankSize,
      texts: {
        headerCaption: "",
        header: "CS_FILE_PROPERTY_SUBTYPE_PLACEHOLDER",
        cardText: "CS_FILE_PROPERTY_SUBTYPE_TEXT",
        nextText: "PT_COMMONS_NEXT",
      },
    },
  },
  indexRoute: "property-type",
};
