import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getIconStyle,
  objectToDropdown,
  getTodaysDateInYMD,
  getFinancialYearDates,
  getNextMonthDateInYMD,
  setFilteredTradeTypes,
  getUniqueItemsFromArray,
  fillOldLicenseData,
  getTradeTypeDropdownData
} from "../../utils";
import {
  prepareFinalObject as pFO,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import filter from "lodash/filter";

export const organizationDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Organization Details",
      labelKey: "BPA_NEW_ORGANIZATION_DETAILS_PROV_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  organizationDetailsConatiner: getCommonContainer({
    nameOfOrganization: getTextField({
      label: {
        labelName: "Name of Organization",
        labelKey: "BPA_ORGANIZATION_NAME"
      },
      placeholder: {
        labelName: "Enter Name of Organization",
        labelKey: "BPA_ORGANIZATION_NAME_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      jsonPath: "Licenses[0].tradeLicenseDetail.institution.instituionName"
    }),

    contactNo: getTextField({
      label: {
        labelName: "Contact No.",
        labelKey: "BPA_ORGANIZATION_CONTACT_NO"
      },
      placeholder: {
        labelName: "Enter Contact No",
        labelKey: "BPA_ORGANIZATION_CONTACT_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      jsonPath: "Licenses[0].tradeLicenseDetail.institution.contactNo"
    }),
    partnerName: getTextField({
      label: {
        labelName: "Name of Partners/Directors/Contact Person",
        labelKey: "BPA_ORGANIZATION_CONTACT_PERSON_NAME"
      },
      placeholder: {
        labelName: "Enter Name of Partners/Directors/Contact Person",
        labelKey: "BPA_ORGANIZATION_CONTACT_PERSON_NAME_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      jsonPath: "Licenses[0].tradeLicenseDetail.institution.name"
    }),
    designation: getTextField({
      label: {
        labelName: "Designation",
        labelKey: "BPA_ORGANIZATION_DESIGNATION"
      },
      placeholder: {
        labelName: "Enter Designation",
        labelKey: "BPA_ORGANIZATION_DESIGNATION_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      jsonPath: "Licenses[0].tradeLicenseDetail.institution.designation"
    }),
    orgRegistraionNo: getTextField({
      label: {
        labelName: "Organization Registration NO/CIN Number",
        labelKey: "BPA_ORGANIZATION_REGISTRATION_NO"
      },
      placeholder: {
        labelName: "Enter Organization Registration NO/CIN Number",
        labelKey: "BPA_ORGANIZATION_REGISTRATION_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      jsonPath:
        "Licenses[0].tradeLicenseDetail.institution.organisationRegistrationNo"
    }),
    orgAddress: getTextField({
      label: {
        labelName: "Address of Organization",
        labelKey: "BPA_ORGANIZATION_ADDRESS"
      },
      placeholder: {
        labelName: "Enter Address of Organization",
        labelKey: "BPA_ORGANIZATION_ADDRESS_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      jsonPath: "Licenses[0].tradeLicenseDetail.institution.address"
    })
  })
});
