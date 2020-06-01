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

  AddressWithCheckBoxContainer: getCommonContainer({
    sameAsPermanentContainer: getCommonContainer({
      sameAsPermanent: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",

        componentPath: "CheckboxContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          label: {
            name: "Same As Permanent Address",
            key: "BPA_SAME_AS_PERMANENTADDR_LABEL"
          },
          jsonPath: "LicensesTemp[0].userData.isSameAddress",
          sourceJsonPaths: [
            "LicensesTemp[0].userData.address.buildingName",
            "LicensesTemp[0].userData.address.city",
            "LicensesTemp[0].userData.address.doorNo",
            "LicensesTemp[0].userData.address.landmark",
            "LicensesTemp[0].userData.address.pincode",
            "LicensesTemp[0].userData.address.street"
          ],
          destinationJsonPaths: [
            "Licenses[0].tradeLicenseDetail.address.buildingName",
            "Licenses[0].tradeLicenseDetail.address.city",
            "Licenses[0].tradeLicenseDetail.address.doorNo",
            "Licenses[0].tradeLicenseDetail.address.landmark",
            "Licenses[0].tradeLicenseDetail.address.pincode",
            "Licenses[0].tradeLicenseDetail.address.street"
          ],
          disbaleComponentJsonPaths: [
            "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children.tradeLocBuilidingName",
            "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children.tradeLocCity",
            "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children.tradeLocDoorHouseNo",
            "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children.tradeLocMohalla",
            "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children.tradeLocPincode",
            "components.div.children.formwizardSecondStep.children.corrospondanceAddr.children.cardContent.children.AddressWithCheckBoxContainer.children.addressContainer.children.tradeLocStreetName"
          ]
        },
        type: "array"
      }
    }),

    addressContainer: getCommonContainer({
      tradeLocDoorHouseNo: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "BPA_DETAILS_DOOR_NO_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "BPA_DETAILS_DOOR_NO_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo"
      }),
      tradeLocBuilidingName: getTextField({
        label: {
          labelName: "Building/Colony Name",
          labelKey: "BPA_DETAILS_BLDG_NAME_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Building/Colony Name",
          labelKey: "BPA_DETAILS_BLDG_NAME_PLACEHOLDER"
        },
        pattern: getPattern("BuildingStreet"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName"
      }),
      tradeLocStreetName: getTextField({
        label: {
          labelName: "Street Name",
          labelKey: "BPA_DETAILS_SRT_NAME_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Street Name",
          labelKey: "BPA_DETAILS_SRT_NAME_PLACEHOLDER"
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
          labelKey: "BPA_CITY_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        required: true,

        placeholder: {
          labelName: "Enter City",
          labelKey: "BPA_NEW_TRADE_DETAILS_CITY_PLACEHOLDER"
        },
        pattern: getPattern("BuildingStreet"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.city"
      }),
      tradeLocPincode: getTextField({
        label: {
          labelName: "Pincode",
          labelKey: "BPA_DETAILS_PIN_LABEL"
        },
        required: true,

        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Pincode",
          labelKey: "BPA_DETAILS_PIN_PLACEHOLDER"
        },
        pattern: getPattern("Pincode"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode"
      })
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
        labelKey: "BPA_DETAILS_DOOR_NO_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Door/House No.",
        labelKey: "BPA_DETAILS_DOOR_NO_PLACEHOLDER"
      },
      pattern: getPattern("DoorHouseNo"),
      jsonPath: "LicensesTemp[0].userData.address.doorNo"
    }),
    tradeLocBuilidingName: getTextField({
      label: {
        labelName: "Building/Colony Name",
        labelKey: "BPA_DETAILS_BLDG_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Building/Colony Name",
        labelKey: "BPA_DETAILS_BLDG_NAME_PLACEHOLDER"
      },
      pattern: getPattern("BuildingStreet"),
      jsonPath: "LicensesTemp[0].userData.address.buildingName"
    }),
    tradeLocStreetName: getTextField({
      label: {
        labelName: "Street Name",
        labelKey: "BPA_DETAILS_SRT_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Street Name",
        labelKey: "BPA_DETAILS_SRT_NAME_PLACEHOLDER"
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
        labelKey: "BPA_CITY_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      required: true,

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
        labelKey: "BPA_DETAILS_PIN_LABEL"
      },
      props: {
        className: "applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Pincode",
        labelKey: "BPA_DETAILS_PIN_PLACEHOLDER"
      },
      required: true,

      pattern: getPattern("Pincode"),
      jsonPath: "LicensesTemp[0].userData.address.pincode"
    })
  })
});
