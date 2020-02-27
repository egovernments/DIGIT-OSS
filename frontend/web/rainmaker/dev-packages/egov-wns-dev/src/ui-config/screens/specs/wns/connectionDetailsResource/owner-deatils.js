import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "../viewBillResource/footer";

export const ownerName = getLabelWithValue(
  {
    labelName: "Name",
    labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
  },
  { jsonPath: "WaterConnection[0].property.owners[0].name" }
)
export const ownerMobileNumber = getLabelWithValue(
  {
    labelName: "Mobile Number",
    labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
  },
  {
    jsonPath:
      "WaterConnection[0].property.owners[0].mobileNumber"
  }
)
export const gender = getLabelWithValue(
  {
    labelName: "Gender",
    labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].property.owners[0].gender"
  }
)
export const guardian = getLabelWithValue(
  {
    labelName: "Guardian",
    labelKey: "WS_OWN_DETAIL_GUARDIAN_LABEL"
  },
  { jsonPath: "WaterConnection[0].property.owners[0].relationship" }
)
export const guardianName = getLabelWithValue(
  {
    labelName: "Guardian Name",
    labelKey: "WS_OWN_DETAIL_GUARDIAN_NAME_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].property.owners[0].fatherOrHusbandName",
  }
)
export const ownerCategory = getLabelWithValue(
  {
    labelName: "Owner Category",
    labelKey: "WS_OWN_DETAIL_CATEGORY_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].property.ownershipCategory",
  }
)
export const email = getLabelWithValue(
  {
    labelName: "Email",
    labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].property.owners[0].emailId"
  }
)
export const correspondenceAddress = getLabelWithValue(
  {
    labelName: "Correspondence Address",
    labelKey: "WS_OWN_DETAIL_CROSADD"
  },
  { jsonPath: "WaterConnection[0].property.owners[0].correspondenceAddress" }
)

export const getOwnerDetails = (isEditable = true) => {
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
            labelKey: "WS_COMMON_OWN_DETAIL"
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
    multiOwner: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        scheama: getCommonGrayCard({
          viewFive: getCommonContainer({
            ownerMobileNumber,
            ownerName,
            gender,
            guardian,
            guardianName,
            ownerCategory,
            email,
            correspondenceAddress
          }),
        }),
        items: [],
        hasAddItem: false,
        sourceJsonPath: "WaterConnection[0].property.owners",
        prefixSourceJsonPath: "children.cardContent.children.viewFive.children",
        afterPrefixJsonPath: "children.value.children.key"
      },
      type: "array"
    }
  });
}


