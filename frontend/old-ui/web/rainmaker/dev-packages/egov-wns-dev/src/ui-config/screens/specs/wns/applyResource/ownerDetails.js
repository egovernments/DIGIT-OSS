import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getCommonHeader,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { changeStep } from "../viewBillResource/footer";
 
  export const ownerDetailsHeader = getCommonContainer({
      header: getCommonHeader({
  labelKey: "WS_COMMON_OWN_DETAIL"
})
  })

 export const ownershipType=getLabelWithValue(
    {
      labelName: "Ownership Type ",
      labelKey: "WS_OWN_DETAIL_OWNERSHIP_TYPE_LABEL"
    },
    { jsonPath: "applyScreen.property.ownershipCategory" }
  )
  
  export const ownerName = getLabelWithValue(
    {
      labelName: "Name",
      labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
    },
    { jsonPath: "applyScreen.property.owners[0].name" }
  )
  export const ownerMobileNumber = getLabelWithValue(
    {
      labelName: "Mobile Number",
      labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
    },
    {
      jsonPath:
        "applyScreen.property.owners[0].mobileNumber"
    }
  )
  export const gender = getLabelWithValue(
    {
      labelName: "Gender",
      labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
    },
    {
      jsonPath: "applyScreen.property.owners[0].gender"
    }
  )
  export const dateOfBirth = getLabelWithValue(
    {
      labelName: "Date Of Birth",
      labelKey: "WS_OWN_DETAIL_DOB_LABEL"
    },
    {
      jsonPath: "applyScreen.property.owners[0].dob"
    }
  )
  export const Relationship = getLabelWithValue(
    {
      labelName: "Relationship",
      labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
    },
    { jsonPath: "applyScreen.property.owners[0].relationship" }
  )
  export const fatherName = getLabelWithValue(
    {
      labelName: "Father/Husband Name",
      labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
    },
    {
      jsonPath: "applyScreen.property.owners[0].fatherOrHusbandName",
    }
  )
  // export const ownerCategory = getLabelWithValue(
  //   {
  //     labelName: "Owner Category",
  //     labelKey: "WS_OWN_DETAIL_CATEGORY_LABEL"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].property.ownershipCategory",
  //   }
  // )
  export const email = getLabelWithValue(
    {
      labelName: "Email",
      labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL"
    },
    {
      jsonPath: "applyScreen.property.owners[0].emailId"
    }
  )
  export const correspondenceAddress = getLabelWithValue(
    {
      labelName: "Correspondence Address",
      labelKey: "WS_OWN_DETAIL_CROSADD"
    },
    { jsonPath: "applyScreen.property.owners[0].correspondenceAddress" }
  )
  export const specialApplicantCategory = getLabelWithValue(
    {
      labelName: "Special Applicant Category",
      labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
    },
    { jsonPath: "applyScreen.property.owners[0].ownerType" }
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
            labelKey:"WS_OWN_DETAIL_HEADER_INFO"
            })
          },
        //   editSection: {
        //     componentPath: "Button",
        //     props: {
        //       color: "primary"
        //     },
        //     visible: isEditable,
        //     gridDefination: {
        //       xs: 12,
        //       sm: 2,
        //       align: "right"
        //     },
        //     children: {
        //       editIcon: {
        //         uiFramework: "custom-atoms",
        //         componentPath: "Icon",
        //         props: {
        //           iconName: "edit"
        //         }
        //       },
        //       buttonLabel: getLabel({
        //         labelName: "Edit",
        //         labelKey: "TL_SUMMARY_EDIT"
        //       })
        //     },
        //     onClickDefination: {
        //       action: "condition",
        //       callBack: (state, dispatch) => {
        //         changeStep(state, dispatch, "", 0);
        //       }
        //     }
        //   }
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
              dateOfBirth,
              email,
              fatherName,
              Relationship,
            //   ownerCategory,
              
              correspondenceAddress,
              specialApplicantCategory
            }),
          }),
          items: [],
          hasAddItem: false,
          sourceJsonPath: "WaterConnection[0].property.owners",
          prefixSourceJsonPath: "children.cardContent.children.viewFive.children",
          afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
      },
    });
  }
  
  
  