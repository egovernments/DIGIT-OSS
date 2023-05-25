import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { convertEpochToDateAndHandleNA, handlePropertySubUsageType, handleNA } from '../../utils';


const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

export const ownerDetailsInfo = getHeader({
  labelKey: "WS_OWN_DETAIL_HEADER_INFO"
})

export const propertyDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL"
});

export const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});
const holderHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
  labelName: "Connection Holder Details"
})

export const snackbarWarningMessage=getCommonContainer({
  clickHereLink: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "SnackbarWarning",
    visible:false,
    gridDefination: { xs: 12, sm: 12}
  }
})
export const reviewConnectionDetails = (isEditable = true) => {
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
            labelName: "Connection Details",
            labelKey: "WS_COMMON_CONNECTION_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: { color: "primary" },
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
              props: { iconName: "edit" }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "WS_SUMMARY_EDIT"
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
    viewOne: getPropertyDetails,
    viewTwo: propertyLocationDetails ,
    viewThree: propertyOwnerDetails(),
    viewFour: getConnectionDetails(),
    viewFive:connHolderDetailsSummary(),
    viewSix:connHolderDetailsSameAsOwnerSummary()
  });
};

const propertyLocationDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div1: propertyLocationDetailsHeader,
      propertyLocationDetailsContainer: getCommonContainer({
        reviewCity: getLabelWithValueForModifiedLabel(
          {
            labelName: "City",
            labelKey: "WS_PROP_DETAIL_CITY"
          },
          { jsonPath: "applyScreen.property.address.city", callBack: handleNA },
          {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "applyScreenOld.property.address.city", callBack: handleNA },
        ),
        reviewDoorOrHouseNumber: getLabelWithValueForModifiedLabel(
          {
            labelName: "Door/House No.",
            labelKey: "WS_PROP_DETAIL_DHNO"
          },
          { jsonPath: "applyScreen.property.address.doorNo", callBack: handleNA },
          {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "applyScreenOld.property.address.doorNo", callBack: handleNA },
        ),
        reviewBuildingOrColonyName: getLabelWithValueForModifiedLabel(
          {
            labelName: "Building/Colony Name",
            labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
          },
          { jsonPath: "applyScreen.property.address.buildingName", callBack: handleNA },
          {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "applyScreenOld.property.address.buildingName", callBack: handleNA },
        ),
        reviewStreetName: getLabelWithValueForModifiedLabel(
          {
            labelName: "Street Name",
            labelKey: "WS_PROP_DETAIL_STREET_NAME"
          },
          { jsonPath: "applyScreen.property.address.street", callBack: handleNA },
          {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "applyScreenOld.property.address.street", callBack: handleNA }
        ),
        reviewLocalityOrMohalla: getLabelWithValueForModifiedLabel(
          {
            labelName: "Locality/Mohalla",
            labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
          },
          { jsonPath: "applyScreen.property.address.locality.name", callBack: handleNA },
          {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "applyScreenOld.property.address.locality.name", callBack: handleNA },
        ),
        reviewPincode: getLabelWithValueForModifiedLabel(
          {
            labelName: "Pincode",
            labelKey: "WS_PROP_DETAIL_PINCODE"
          },
          { jsonPath: "applyScreen.property.address.pincode", callBack: handleNA },
          {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "applyScreenOld.property.address.pincode", callBack: handleNA },
        ),
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "applyScreen.property.address",
    prefixSourceJsonPath:
      "children.cardContent.children.propertyLocationDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const getPropertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyDetailsHeader,
        getPropertyDetailsContainer: getCommonContainer({
          reviewPropertyId: getLabelWithValueForModifiedLabel(
            {
              labelName: "Property Id",
              labelKey: "WS_PROPERTY_ID_LABEL"
            },
            {
              jsonPath: "applyScreen.property.propertyId",
            },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            {
              jsonPath: "applyScreenOld.property.propertyId",
              callBack: handleNA,
            },
          ),
          reviewPropertyType: getLabelWithValueForModifiedLabel(
            {
              labelName: "Property Type",
              labelKey: "WS_PROPERTY_TYPE_LABEL"
            },
            {
              jsonPath: "applyScreen.property.propertyType",
              callBack: handleNA,
              localePrefix: {
                moduleName: "WS",
                masterName: "PROPTYPE"
              }
            },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            {
              jsonPath: "applyScreenOld.property.propertyType",
              callBack: handleNA,
              localePrefix: {
                moduleName: "WS",
                masterName: "PROPTYPE"
              }
            }
          ),
          reviewPropertyUsageType: getLabelWithValueForModifiedLabel(
            {
              labelName: "Property Usage Type",
              labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
            },
            {
              jsonPath: "applyScreen.property.usageCategory",
              callBack: handleNA,
              localePrefix: {
                moduleName: "WS",
                masterName: "PROPUSGTYPE"
              }
            },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            {
              jsonPath: "applyScreenOld.property.usageCategory",
              callBack: handleNA,
              localePrefix: {
                moduleName: "WS",
                masterName: "PROPUSGTYPE"
              }
            }

          ),

          reviewPropertySubUsageType: getLabelWithValueForModifiedLabel(
            {
              labelName: "Property Sub usage type",
              labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL"
            },
            {
              jsonPath: "applyScreen.property.units[0].usageCategory",
              callBack: handlePropertySubUsageType,
              localePrefix: {
                moduleName: "WS",
                masterName: "PROPSUBUSGTYPE"
              }
            },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            {
              jsonPath: "applyScreenOld.property.units[0].usageCategory",
              callBack: handlePropertySubUsageType,
              localePrefix: {
                moduleName: "WS",
                masterName: "PROPSUBUSGTYPE"
              }
            }

          ),
          reviewPlotSize: getLabelWithValueForModifiedLabel(
            {
              labelName: "Plot Size (in sq metres)",
              labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
            },
            { jsonPath: "applyScreen.property.landArea", callBack: handleNA },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            { jsonPath: "applyScreenOld.property.landArea", callBack: handleNA },
          ),
          reviewNumberOfFloors: getLabelWithValueForModifiedLabel(
            {
              labelName: "Number Of Floors",
              labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
            },
            { jsonPath: "applyScreen.property.noOfFloors", callBack: handleNA },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            { jsonPath: "applyScreenOld.property.noOfFloors", callBack: handleNA },
          ),
          rainwaterHarvestingFacility: getLabelWithValueForModifiedLabel(
            {
              labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
              labelName: "Rain Water Harvesting Facility"
            },
            {
              jsonPath: "applyScreen.property.additionalDetails.isRainwaterHarvesting",
              callBack: handleNA
            },
            {
              labelKey: "WS_OLD_LABEL_NAME"
            },
            {
              jsonPath: "applyScreenOld.property.additionalDetails.isRainwaterHarvesting",
              callBack: handleNA
            },
          )
        })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const propertyOwnerDetailsHeader = getHeader({
  labelKey: "WS_TASK_PROP_OWN_HEADER"
});


export const mobileNumber = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
  },
  { jsonPath: "applyScreen.property.owners[0].mobileNumber", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.property.owners[0].mobileNumber", callBack: handleNA }

)

export const name = getLabelWithValueForModifiedLabel(
  {
    labelName: "Name",
    labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
  },
  { jsonPath: "applyScreen.property.owners[0].name", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.property.owners[0].name", callBack: handleNA },
)

export const email = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_OWN_EMAIL_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].emailId",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.property.owners[0].emailId",
    callBack: handleNA
  },
)

export const gender = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].gender",
    callBack: handleNA,
    localePrefix: {
      moduleName: "COMMON",
      masterName: "GENDER"
    }
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.property.owners[0].gender",
    callBack: handleNA,
    localePrefix: {
      moduleName: "COMMON",
      masterName: "GENDER"
    }
  },
)

export const dateOfBirth = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_DOB_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].dob",
    callBack: convertEpochToDateAndHandleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.property.owners[0].dob",
    callBack: convertEpochToDateAndHandleNA
  }

)

export const fatherName = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
  },
  { jsonPath: "applyScreen.property.owners[0].fatherOrHusbandName", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.property.owners[0].fatherOrHusbandName", callBack: handleNA },
)

export const relationship = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
  },
  { jsonPath: "applyScreen.property.owners[0].relationship", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.property.owners[0].relationship", callBack: handleNA },
)

export const correspondenceAddress = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_CROSADD"
  },
  {
    jsonPath: "applyScreen.property.owners[0].correspondenceAddress",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.property.owners[0].correspondenceAddress",
    callBack: handleNA
  },
)

export const specialApplicantCategory = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].ownerType",
    localePrefix: {
      moduleName: "COMMON_MASTERS",
      masterName: "OWNERTYPE"
    },
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.property.owners[0].ownerType",
    callBack: handleNA
  },
)

const propertyOwnerDetails = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div3: ownerDetailsInfo,
        viewFive: getCommonContainer({
          // mobileNumber,
          // name,
          // gender,
          // dateOfBirth,
          // email,
          // fatherName,
          // relationship,
          // correspondenceAddress,
          // specialApplicantCategory,
          mobileNumber: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
            },
            { 
              jsonPath: "applyScreen.property.owners[0].mobileNumber", 
              callBack: handleNA 
            }
          ),
          name: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
            },
            { 
              jsonPath: "applyScreen.property.owners[0].name", 
              callBack: handleNA 
            }
          ),
          gender: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
            },
            {
              jsonPath: "applyScreen.property.owners[0].gender",
              callBack: handleNA,
              localePrefix: {
                moduleName: "COMMON",
                masterName: "GENDER"
              }
            }
          ),
          dateOfBirth: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_DOB_LABEL"
            },
            {
              jsonPath: "applyScreen.property.owners[0].dob",
              callBack: convertEpochToDateAndHandleNA
            }
          ),
          email: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_OWN_EMAIL_LABEL"
            },
            {
              jsonPath: "applyScreen.property.owners[0].emailId",
              callBack: handleNA
            }
          ),
          fatherName: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
            },
            { 
              jsonPath: "applyScreen.property.owners[0].fatherOrHusbandName", 
              callBack: handleNA 
            }
          ),
          relationship: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
            },
            { 
              jsonPath: "applyScreen.property.owners[0].relationship", 
              callBack: handleNA 
            }
          ),
          correspondenceAddress: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_CROSADD"
            },
            {
              jsonPath: "applyScreen.property.owners[0].correspondenceAddress",
              callBack: handleNA
            }
          ),
          specialApplicantCategory: getLabelWithValue(
            {
              labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
            },
            {
              jsonPath: "applyScreen.property.owners[0].ownerType",
              localePrefix: {
                moduleName: "COMMON_MASTERS",
                masterName: "OWNERTYPE"
              },
              callBack: handleNA
            }
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
  })
}

export const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

export const taskApplicationType = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_APPLY_FOR"
  },
  {
    jsonPath: "applyScreen.service",
    localePrefix: {
      moduleName: "WS",
      masterName: "APPLY"
    },
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.service",
    localePrefix: {
      moduleName: "WS",
      masterName: "APPLY"
    },
    callBack: handleNA
  },
);

export const taskNumberOfTapsPropsed = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED"
  },
  {
    jsonPath: "applyScreen.proposedTaps",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.proposedTaps",
    callBack: handleNA
  },
)
export const taskPipeSizeProposed = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_PIPE_SIZE_PROPOSED"
  },
  { jsonPath: "applyScreen.proposedPipeSize", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.proposedPipeSize", callBack: handleNA },
)

export const taskNoOfClosets = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_CLOSETS_PROPOSED"
  },
  { jsonPath: "applyScreen.proposedWaterClosets", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.proposedWaterClosets", callBack: handleNA },
);

export const taskNoOfToilets = getLabelWithValueForModifiedLabel(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TOILETS_PROPOSED"
  },
  { jsonPath: "applyScreen.proposedToilets", callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "applyScreenOld.proposedToilets", callBack: handleNA },
);

const getConnectionDetails = () => {
  return getCommonContainer({
    connectionDetailsHeader,
    view: renderService()
  })
}

export const renderService = () => {
  return getCommonContainer({
    taskApplicationType,
    taskNumberOfTapsPropsed,
    taskPipeSizeProposed,
    taskNoOfClosets,
    taskNoOfToilets
  });
}


export const connectionHolderDetails={
  mobileNumber: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"
    },
    { jsonPath: "applyScreen.connectionHolders[0].mobileNumber", callBack: handleNA },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "applyScreenOld.connectionHolders[0].mobileNumber", callBack: handleNA }
    
  ),
  name: getLabelWithValueForModifiedLabel(
    {
      labelName: "Name",
      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL"
    },
    { jsonPath: "applyScreen.connectionHolders[0].name", callBack: handleNA },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "applyScreenOld.connectionHolders[0].name", callBack: handleNA }
    
  ),
  gender: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL"
    },
    {
      jsonPath: "applyScreen.connectionHolders[0].gender",
      callBack: handleNA,
      localePrefix: {
        moduleName: "COMMON",
        masterName: "GENDER"
      }
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "applyScreenOld.connectionHolders[0].gender",
      callBack: handleNA,
      localePrefix: {
        moduleName: "COMMON",
        masterName: "GENDER"
      }
    },
  ),
  fatherName: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"
    },
    { jsonPath: "applyScreen.connectionHolders[0].fatherOrHusbandName", callBack: handleNA },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "applyScreenOld.connectionHolders[0].fatherOrHusbandName", callBack: handleNA }
  ),
  relationship: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"
    },
    { jsonPath: "applyScreen.connectionHolders[0].relationship", callBack: handleNA },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "applyScreenOld.connectionHolders[0].relationship", callBack: handleNA }
  ),
  correspondenceAddress: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD"
    },
    {
      jsonPath: "applyScreen.connectionHolders[0].correspondenceAddress",
      callBack: handleNA
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "applyScreenOld.connectionHolders[0].correspondenceAddress",
      callBack: handleNA
    }
  ),
  specialApplicantCategory: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
    },
    {
      jsonPath: "applyScreen.connectionHolders[0].ownerType",
      callBack: handleNA
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "applyScreenOld.connectionHolders[0].ownerType",
      callBack: handleNA
    }
  )
};

const connHolderDetailsSummary = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: holderHeader,
        connHoldDetail:getCommonContainer(connectionHolderDetails),
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "applyScreen.connectionHolders",
      prefixSourceJsonPath: "children.cardContent.children.connHoldDetail.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array",
    visible:true
  })
}


export const connectionHolderSameAsOwnerDetails={
 sameAsOwnerDetails : getLabelWithValue(
    {
      labelKey: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"
    },
    { jsonPath: "applyScreen.connectionHolders" }
  )
} 

const connHolderDetailsSameAsOwnerSummary = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: holderHeader,
        sameAsOwnerDetails:getCommonContainer(connectionHolderSameAsOwnerDetails),
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "connectionHolders[0].sameAsPropertyAddress",
      prefixSourceJsonPath: "children.cardContent.children.sameAsOwnerDetails.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array", 
    visible:true
  })
}

