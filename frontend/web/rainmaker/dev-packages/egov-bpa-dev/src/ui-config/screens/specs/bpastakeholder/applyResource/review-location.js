import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";

export const getLocationDetails = (isEditable = true) => {
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
            labelName: "Address Details",
            labelKey: "BPA_NEW_ADDRESS_HEADER_DETAILS"
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
              labelKey: "TL_SUMMARY_EDIT"
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
      reviewPermanantAddress: getLabelWithValue(
        {
          labelName: "Permanant Address",
          labelKey: "BPA_PERMANANT_ADDRESS_LABEL"
        },
        {
          jsonPath:
            "Licenses[0].tradeLicenseDetail.owners[0].address.addressLine1"
        }
      ),
      reviewCommunicationAddress: getLabelWithValue(
        {
          labelName: "Communication Address",
          labelKey: "BPA_COMMUNICATION_ADDRESS_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.addressLine1" }
      )
    })
  });
};
