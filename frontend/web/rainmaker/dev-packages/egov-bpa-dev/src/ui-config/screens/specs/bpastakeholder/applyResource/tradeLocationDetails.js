import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer
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
          "Licenses[0].tradeLicenseDetail.owners[0].address.addressLine1"
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
        jsonPath: "Licenses[0].tradeLicenseDetail.address.addressLine1"
      })
    })
  },
  {
    style: { overflow: "visible" }
  }
);
