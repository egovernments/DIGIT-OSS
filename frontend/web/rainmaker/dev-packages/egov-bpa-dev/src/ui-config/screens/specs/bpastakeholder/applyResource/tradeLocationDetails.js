import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const tradeLocationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Address Details",
        labelKey: "BPA_NEW_ADDRESS_HEADER_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    tradeDetailsConatiner: getCommonContainer({
      permanantAddress: getTextField({
        label: {
          labelName: "Permanant Address",
          labelKey: "BPA_PERMANANT_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Permanant Address",
          labelKey: "BPA_PERMANANT_ADDRESS_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 12
        },
        jsonPath:
          "Licenses[0].tradeLicenseDetail.owners[0].address.addressLine1",
        required: true
      }),
      communicationAddress: getTextField({
        label: {
          labelName: "Communication Address",
          labelKey: "BPA_COMMUNICATION_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Communication Address",
          labelKey: "BPA_COMMUNICATION_ADDRESS_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 12
        },
        jsonPath: "Licenses[0].tradeLicenseDetail.address.addressLine1",
        required: true
      })
    })
  },
  {
    style: { overflow: "visible" }
  }
);

export const corrospondanceAddr = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Communication Address",
      labelKey: "BPA_COMMUNICATION_ADDRESS_HEADER_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),

  tradeDetailsConatiner: getCommonContainer({
    tradeLocDoorHouseNo: getTextField({
      label: {
        labelName: "Door/House No.",
        labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Door/House No.",
        labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      },
      pattern: getPattern("DoorHouseNo"),
      jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo"
    }),
    tradeLocBuilidingName: getTextField({
      label: {
        labelName: "Building/Colony Name",
        labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Building/Colony Name",
        labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName"
    }),
    tradeLocStreetName: getTextField({
      label: {
        labelName: "Street Name",
        labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Street Name",
        labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "Licenses[0].tradeLicenseDetail.address.street"
    }),
    tradeLocMohalla: getTextField({
      label: {
        labelName: "Locality",
        labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
      },
      placeholder: {
        labelName: "Enter Locality",
        labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_PLACEHOLDER"
      },
      required: true,
      props: {
        className: "applicant-details-error"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "Licenses[0].tradeLicenseDetail.address.landmark"
    }),

    tradeLocCity: getTextField({
      label: {
        labelName: "City",
        labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter City",
        labelKey: "BPA_NEW_TRADE_DETAILS_CITY_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "Licenses[0].tradeLicenseDetail.address.tenantId"
    }),
    tradeLocPincode: getTextField({
      label: {
        labelName: "Pincode",
        labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Pincode",
        labelKey: "TL_NEW_TRADE_DETAILS_PIN_PLACEHOLDER"
      },
      pattern: getPattern("Pincode"),
      jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode"
    })
  })
});

export const permanentAddr = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Permanent Address",
      labelKey: "BPA_PERMANENT_ADDRESS_HEADER_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),

  tradeDetailsConatiner: getCommonContainer({
    tradeLocDoorHouseNo: getTextField({
      label: {
        labelName: "Door/House No.",
        labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Door/House No.",
        labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      },
      pattern: getPattern("DoorHouseNo"),
      jsonPath: "LicensesTemp[0].userData.address.doorNo"
    }),
    tradeLocBuilidingName: getTextField({
      label: {
        labelName: "Building/Colony Name",
        labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Building/Colony Name",
        labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "LicensesTemp[0].userData.address.buildingName"
    }),
    tradeLocStreetName: getTextField({
      label: {
        labelName: "Street Name",
        labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Street Name",
        labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "LicensesTemp[0].userData.address.street"
    }),
    tradeLocMohalla: getTextField({
      label: {
        labelName: "Locality",
        labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
      },
      placeholder: {
        labelName: "Enter Locality",
        labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_PLACEHOLDER"
      },
      required: true,
      props: {
        className: "applicant-details-error"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "LicensesTemp[0].userData.address.landmark"
    }),
    tradeLocCity: getTextField({
      label: {
        labelName: "City",
        labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter City",
        labelKey: "BPA_NEW_TRADE_DETAILS_CITY_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "LicensesTemp[0].userData.address.city"
    }),
    tradeLocPincode: getTextField({
      label: {
        labelName: "Pincode",
        labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Pincode",
        labelKey: "TL_NEW_TRADE_DETAILS_PIN_PLACEHOLDER"
      },
      pattern: getPattern("Pincode"),
      jsonPath: "LicensesTemp[0].userData.address.pincode"
    })
  })
});
