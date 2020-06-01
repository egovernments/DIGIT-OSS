import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { checkValueForNA } from "../../utils";

export const getOrganizationDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Organization Details",
            labelKey: "BPA_COMMON_TR_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "BPA_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewOrgName: getLabelWithValue(
        {
          labelName: "Name of Organization",
          labelKey: "BPA_ORGANIZATION_NAME"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.institution.instituionName",
          callBack: checkValueForNA
        }
      ),
      reviewContactNo: getLabelWithValue(
        {
          labelName: "Contact No.",
          labelKey: "BPA_ORGANIZATION_CONTACT_NO"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.institution.contactNo",
          callBack: checkValueForNA
        }
      ),
      reviewpartnerName: getLabelWithValue(
        {
          labelName: "Name of Partners/Directors/Contact Person",
          labelKey: "BPA_ORGANIZATION_CONTACT_PERSON_NAME"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.institution.name",
          callBack: checkValueForNA
        }
      ),
      reviewDesignation: getLabelWithValue(
        {
          labelName: "Designation",
          labelKey: "BPA_ORGANIZATION_DESIGNATION"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.institution.designation",
          callBack: checkValueForNA
        }
      ),
      reviewOrgRegistraionNo: getLabelWithValue(
        {
          labelName: "Organization Registration NO/CIN Number",
          labelKey: "BPA_ORGANIZATION_REGISTRATION_NO"
        },
        {
          jsonPath:
            "Licenses[0].tradeLicenseDetail.institution.organisationRegistrationNo",
          callBack: checkValueForNA
        }
      ),
      reviewOrgAddress: getLabelWithValue(
        {
          labelName: "Address of Organization",
          labelKey: "BPA_ORGANIZATION_ADDRESS"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.institution.address",
          callBack: checkValueForNA
        }
      )
    })
  });
};
