import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getCommonHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "../viewBillResource/footer";
import { handleNA } from '../../utils';

export const ownerDetailsHeader = getCommonContainer({
  header: getCommonHeader({
    labelKey: "WS_COMMON_OWN_DETAIL"
  })
})

export const ownershipType = getLabelWithValue(
  {
    labelName: "Ownership Type ",
    labelKey: "WS_OWN_DETAIL_OWNERSHIP_TYPE_LABEL"
  },
  {
    jsonPath: "applyScreen.property.ownershipCategory",
    callBack: handleNA
  }
)

export const ownerName = getLabelWithValue(
  {
    labelName: "Name",
    labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].name",
    callBack: handleNA
  }
)
export const ownerMobileNumber = getLabelWithValue(
  {
    labelName: "Mobile Number",
    labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
  },
  {
    jsonPath:
      "applyScreen.property.owners[0].mobileNumber",
    callBack: handleNA
  }
)
export const gender = getLabelWithValue(
  {
    labelName: "Gender",
    labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].gender",
    callBack: handleNA
  }
)
export const dateOfBirth = getLabelWithValue(
  {
    labelName: "Date Of Birth",
    labelKey: "WS_OWN_DETAIL_DOB_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].dob",
    callBack: handleNA
  }
)
export const Relationship = getLabelWithValue(
  {
    labelName: "Relationship",
    labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].relationship",
    callBack: handleNA
  }
)
export const fatherName = getLabelWithValue(
  {
    labelName: "Father/Husband Name",
    labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
  },
  {
    jsonPath: "applyScreen.property.owners[0].fatherOrHusbandName",
    callBack: handleNA
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
    jsonPath: "applyScreen.property.owners[0].emailId",
    callBack: handleNA
  }
)
export const correspondenceAddress = getLabelWithValue(
  {
    labelName: "Correspondence Address",
    labelKey: "WS_OWN_DETAIL_CROSADD"
  },
  {
    jsonPath: "applyScreen.property.owners[0].correspondenceAddress",
    callBack: handleNA
  }
)
export const specialApplicantCategory = getLabelWithValue(
  {
    labelName: "Special Applicant Category",
    labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].ownerType",
    callBack: handleNA
  }
)

export const getOwnerDetails = (isEditable = true) => {
  return getCommonGrayCard({
    ownerHeader: getCommonSubHeader({
      labelKey: "WS_OWN_DETAIL_HEADER_INFO"
    }),
    headerDiv: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        className: "common-div-css search-preview",
        scheama: getCommonGrayCard({
          // div1: specialApplicantCategory,
          //   style: { marginBottom: "10px" }
          // },
          // children: {
          //   header: {
          //     gridDefination: {
          //       xs: 12,
          //       sm: 10
          //     },
          //     ...getCommonSubHeader({
          //     labelKey:"WS_OWN_DETAIL_HEADER_INFO"
          //     })
          //   },

          // }
          // },

          // multiOwner: {
          //   uiFramework: "custom-containers",
          //   componentPath: "MultiItem",
          //   props: {
          //     scheama: getCommonGrayCard({
          viewFive: getCommonContainer({
            ownerMobileNumber: getLabelWithValue(
              {
                labelName: "Mobile Number",
                labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
              },
              {
                jsonPath:
                  "applyScreen.property.owners[0].mobileNumber"
              }),
            ownerName: getLabelWithValue(
              {
                labelName: "Name",
                labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
              },
              {
                jsonPath: "applyScreen.property.owners[0].name",
                // callBack: handleNA
              }
            ),
            gender: getLabelWithValue(
              {
                labelName: "Gender",
                labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
              },
              {
                jsonPath: "applyScreen.property.owners[0].gender"
              }
            ),
            dateOfBirth: getLabelWithValue(
              {
                labelName: "Date Of Birth",
                labelKey: "WS_OWN_DETAIL_DOB_LABEL"
              },
              {
                jsonPath: "applyScreen.property.owners[0].dob"
              }
            ),
            email: getLabelWithValue(
              {
                labelName: "Email",
                labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL"
              },
              {
                jsonPath: "applyScreen.property.owners[0].emailId"
              }
            ),
            fatherName: getLabelWithValue(
              {
                labelName: "Father/Husband Name",
                labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
              },
              {
                jsonPath: "applyScreen.property.owners[0].fatherOrHusbandName",
              }
            ),
            Relationship: getLabelWithValue(
              {
                labelName: "Relationship",
                labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
              },
              { jsonPath: "applyScreen.property.owners[0].relationship" }
            ),
            //   ownerCategory,

            correspondenceAddress: getLabelWithValue(
              {
                labelName: "Correspondence Address",
                labelKey: "WS_OWN_DETAIL_CROSADD"
              },
              { jsonPath: "applyScreen.property.owners[0].correspondenceAddress" }
            ),
            specialApplicantCategory: getLabelWithValue(
              {
                labelName: "Special Applicant Category",
                labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
              },
              { jsonPath: "applyScreen.property.owners[0].ownerType" }
            )
          }),
        }),
        items: [],
        hasAddItem: false,
        sourceJsonPath: "applyScreen.property.owners",
        prefixSourceJsonPath: "children.cardContent.children.viewFive.children",
        afterPrefixJsonPath: "children.value.children.key"
      },
      type: "array"
    },
  });
}


