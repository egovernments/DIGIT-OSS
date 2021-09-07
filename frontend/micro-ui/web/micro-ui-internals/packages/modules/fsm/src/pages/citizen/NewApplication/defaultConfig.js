import SelectPropertySubtype from "./SelectPropertySubtype";
import SelectPropertyType from "./SelectPropertyType";
import SelectAddress from "./SelectAddress";
import SelectStreet from "./SelectStreet";
import SelectLandmark from "./SelectLandmark";
import SelectPincode from "./SelectPincode";
import SelectTankSize from "./SelectTankSize";
import SelectPitType from "./SelectPitType";
import SelectGeolocation from "./SelectGeolocation";

export const config = {
  routes: [
    {
      route: "property-type",
      component: SelectPropertyType,
      groupKey: "ES_TITLE_APPLICATION_DETAILS",
      texts: {
        headerCaption: "",
        header: "CS_FILE_APPLICATION_PROPERTY_LABEL",
        cardText: "CS_FILE_APPLICATION_PROPERTY_TEXT",
        submitBarLabel: "CS_COMMON_NEXT",
      },
      nextStep: "property-subtype",
    },
    {
      route: "property-subtype",
      component: SelectPropertySubtype,
      groupKey: "ES_TITLE_APPLICATION_DETAILS",
      texts: {
        headerCaption: "",
        header: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL",
        cardText: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_TEXT",
        submitBarLabel: "CS_COMMON_NEXT",
      },
      nextStep: "map",
    },
    {
      route: "map",
      component: SelectGeolocation,
      nextStep: "pincode",
      hideInEmployee: true,
    },
    {
      route: "pincode",
      component: SelectPincode,
      groupKey: "ES_NEW_APPLICATION_LOCATION_DETAILS",
      texts: {
        headerCaption: "",
        header: "CS_FILE_APPLICATION_PINCODE_LABEL",
        cardText: "CS_FILE_APPLICATION_PINCODE_TEXT",
        nextText: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      inputs: [
        {
          label: "CORE_COMMON_PINCODE",
          type: "text",
          name: "pincode",
          validation: {
            pattern: /^([1-9])(\d{5})$/,
            minLength: 6,
            maxLength: 7,
          },
          error: "CORE_COMMON_PINCODE_INVALID",
        },
      ],
      nextStep: "address",
    },
    {
      route: "address",
      component: SelectAddress,
      groupKey: "ES_NEW_APPLICATION_LOCATION_DETAILS",
      texts: {
        headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
        header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
        cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_CITY_MOHALLA_TEXT",
        nextText: "CS_COMMON_NEXT",
      },
      nextStep: "street",
    },
    {
      route: "street",
      component: SelectStreet,
      groupKey: "ES_NEW_APPLICATION_LOCATION_DETAILS",
      texts: {
        headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
        header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
        cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_STREET_DOOR_NO_LABEL",
        nextText: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      inputs: [
        {
          label: "CS_FILE_APPLICATION_PROPERTY_LOCATION_STREET_NAME_LABEL",
          type: "text",
          name: "street",
          validation: {
            pattern: /^[\w\s]{1,256}$/,
          },
          error: "CORE_COMMON_STREET_INVALID",
        },
        {
          label: "CS_FILE_APPLICATION_PROPERTY_LOCATION_DOOR_NO_LABEL",
          type: "text",
          name: "doorNo",
          validation: {
            pattern: /^[\w]([\w\/,\s])*$/,
          },
          error: "CORE_COMMON_DOOR_INVALID",
        },
      ],
      nextStep: "landmark",
    },
    {
      route: "landmark",
      component: SelectLandmark,
      groupKey: "ES_NEW_APPLICATION_LOCATION_DETAILS",
      texts: {
        headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
        header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE",
        cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TEXT",
        nextText: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      inputs: [
        {
          label: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LANDMARK_LABEL",
          type: "textarea",
          name: "landmark",
          validation: {
            maxLength: 1024,
          },
        },
      ],
      nextStep: "pit-type",
    },
    {
      route: "pit-type",
      component: SelectPitType,
      groupKey: "CS_CHECK_PIT_SEPTIC_TANK_DETAILS",
      texts: {
        header: "CS_FILE_PROPERTY_PIT_TYPE",
        cardText: "CS_FILE_PROPERTY_PIT_TYPE_TEXT",
        nextText: "CS_COMMON_NEXT",
      },
      nextStep: "tank-size",
    },
    {
      route: "tank-size",
      component: SelectTankSize,
      groupKey: "CS_CHECK_PIT_SEPTIC_TANK_DETAILS",
      texts: {
        headerCaption: "",
        header: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TITLE",
        cardText: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TEXT",
        nextText: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      nextStep: null,
    },
  ],
  indexRoute: "property-type",
};
