import SelectAddress from "./Steps/SelectAddress";
import SelectComplaintType from "./Steps/SelectComplaintType";
import SelectDetails from "./Steps/SelectDetails";
import SelectImages from "./Steps/SelectImages";
import SelectLandmark from "./Steps/SelectLandmark";
import SelectPincode from "./Steps/SelectPincode";
import SelectSubType from "./Steps/SelectSubType";

export const config = {
  routes: {
    "complaint-type": {
      component: SelectComplaintType,
      texts: {
        headerCaption: "",
        header: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
        cardText: "CS_COMPLAINT_TYPE_TEXT",
        submitBarLabel: "PT_COMMONS_NEXT",
      },
      nextStep: "sub-type",
    },
    "sub-type": {
      component: SelectSubType,
      texts: {
        header: "CS_ADDCOMPLAINT_COMPLAINT_SUBTYPE_PLACEHOLDER",
        cardText: "CS_COMPLAINT_SUBTYPE_TEXT",
        submitBarLabel: "PT_COMMONS_NEXT",
      },
      nextStep: "pincode",
    },
    pincode: {
      component: SelectPincode,
      texts: {
        headerCaption: "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
        header: "CS_ADDCOMPLAINT_PINCODE",
        cardText: "CS_ADDCOMPLAINT_CHANGE_PINCODE_TEXT",
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
      nextStep: "upload-photos",
    },
    "upload-photos": {
      component: SelectImages,
      texts: {
        header: "CS_ADDCOMPLAINT_UPLOAD_PHOTO",
        cardText: "CS_ADDCOMPLAINT_UPLOAD_PHOTO_TEXT",
        nextText: "PT_COMMONS_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE",
      },
      nextStep: "additional-details",
    },
    "additional-details": {
      component: SelectDetails,
      texts: {
        header: "CS_ADDCOMPLAINT_PROVIDE_ADDITIONAL_DETAILS",
        cardText: "CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_TEXT",
        nextText: "PT_COMMONS_NEXT",
      },
      inputs: [
        {
          label: "CS_ADDCOMPLAINT_ADDITIONAL_DETAILS",
          type: "textarea",
          name: "details",
        },
      ],
      nextStep: null,
    },
  },
  indexRoute: "complaint-type",
};
