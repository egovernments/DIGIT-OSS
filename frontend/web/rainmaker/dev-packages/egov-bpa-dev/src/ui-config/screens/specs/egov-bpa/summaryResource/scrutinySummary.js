import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep, checkValueForNA } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

const getHeader = label => {
    return {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-bpa",
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

export const scrutinySummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" }
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8
                },
                ...getCommonSubHeader({
                    labelName: "Scrutiny Details",
                    labelKey: "BPA_SCRUNITY_SUMMARY"
                })
            },
            editSection: {
                componentPath: "Button",
                props: {
                    color: "primary",
                    style: {
                        marginTop: "-10px",
                        marginRight: "-18px"
                    }
                },
                gridDefination: {
                    xs: 4,
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
                        gotoApplyWithStep(state, dispatch, 1);
                    }
                }
            }
        }
    },
    BlockWiseOccupancyAndUsageDetails: getHeader({
        labelName: "Block wise occupancy /sub occupancy and usage details",
        labelKey: "BPA_APPLICATION_BLOCK_WISE_OCCUPANCY_SUB_OCCUPANCY_USAGE_TITLE"
    }),
    break1: getBreak(),
    cardTwo: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "applicant-summary",
            scheama: getCommonGrayCard({
                blockWiseOccupancyAndUsageDetailscontainer: getCommonContainer({

                    // buildingplanscrutinyapplicationnumber: getLabelWithValue(
                    //     {
                    //         labelName: "Residential",
                    //         labelKey: "BPA_APPLICATION_RESIDENTIAL_LABEL"
                    //     },
                    //     {
                    //         jsonPath: "bpa.summary.residential",
                    //         callBack: checkValueForNA
                    //     }
                    // ),

                    occupancyType: getLabelWithValue(
                        {
                            labelName: "Occupancy Type",
                            labelKey: "BPA_OCCUPANCY_TYPE"
                        },
                        {
                            jsonPath: "BPA.occupancyType",
                            callBack: checkValueForNA
                        }
                    ),
                    subOccupancyType: getLabelWithValue(
                        {
                            labelName: "Sub Occupancy Type",
                            labelKey: "BPA_SUB_OCCUP_TYPE_LABEL"
                        },
                        {
                            jsonPath: "BPA.subOccupancyType",
                            callBack: checkValueForNA
                        }
                    ),
                    usages: getLabelWithValue(
                        {
                            labelName: "Usages",
                            labelKey: "BPA_USAGES_TYPE"
                        },
                        {
                            jsonPath: "BPA.usages",
                            callBack: checkValueForNA
                        }
                    )
                })
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            // sourceJsonPath: "BPAs[0].BPADetails.blockwiseusagedetails",
            sourceJsonPath: "BPA",            
            prefixSourceJsonPath:
                "children.cardContent.children.applicantContainer.children",
            afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
    },
    DemolitionDetails: getHeader({
        labelName: "Demolition Details",
        labelKey: "BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL"
    }),
    break1: getBreak(),
    cardThree: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "applicant-summary",
            scheama: getCommonGrayCard({
                demolitionDetailsContainer: getCommonContainer({
                    demolitionArea: getLabelWithValue(
                        {
                            labelName: "Demolition Area",
                            labelKey: "BPA_APPLICATION_DEMOLITION_AREA_LABEL"
                        },
                        {
                            jsonPath: "scrutinyDetails.planDetail.planInformation.demolitionArea",
                            callBack: checkValueForNA
                        }
                    )
                })
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "BPAs[0].BPADetails",
            prefixSourceJsonPath:
                "children.cardContent.children.applicantContainer.children",
            afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
    },
    proposedBuildingDetails:getHeader({
        labelName: "Demolition Details",
        labelKey: "BPA_APP_DETAILS_PROPOSED_BUILDING_DETAILS_LABEL"
    }),
    break3: getBreak(),
    cardFour: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
          className: "building-summary",
          scheama: getCommonGrayCard({
            buildingContainer: getCommonContainer({
                floorDescription: getLabelWithValue(
                    {
                      labelName: "Floor Description",
                      labelKey: "Floor Description"
                    },
                    {
                      jsonPath:
                        "scrutinyDetails.planDetail.blocks[0].building.floors[0]",
                        callBack: value => {
                        let floorNo = ['', 'Ground', 'First', 'Second', 'Third', 'Forth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
                        if(value) {
                            return `${floorNo[value.number+1]} floor` || "NA";
                        }
                        else {
                            return "NA"
                            }
                        }
                    }
                ),
                level: getLabelWithValue(
                    {
                      labelName: "Level",
                      labelKey: "Level"
                    },
                    {
                      jsonPath:
                        "scrutinyDetails.planDetail.blocks[0].building.floors[0]",
                      callBack: value => {
                        return value && (value.number).toString() || "NA";
                    }
                }
              ),
              occupancySubOccupancy: getLabelWithValue(
                {
                  labelName: "Occupancy/Sub Occupancy",
                  labelKey: "Occupancy/Sub Occupancy"
                },
                {
                  jsonPath:
                    "scrutinyDetails.planDetail.blocks[0].building.floors[0]",
                    callBack: value => {
                      return value && value.occupancies[0] && value.occupancies[0].type || "NA";
                    }
                }
              ),
              buildupArea: getLabelWithValue(
                  {
                    labelName: "Buildup Area",
                    labelKey: "Buildup Area"
                  },
                  {
                    jsonPath:
                      "scrutinyDetails.planDetail.blocks[0].building.floors[0]",
                      callBack: value => {
                        return value && value.occupancies[0] && value.occupancies[0].builtUpArea || "NA";
                      }
                  }
                ),
                floorArea: getLabelWithValue(
                  {
                    labelName: "Floor Area",
                    labelKey: "Floor Area"
                  },
                  {
                    jsonPath:
                      "scrutinyDetails.planDetail.blocks[0].building.floors[0]",
                      callBack: value => {
                          return value && (value.occupancies[0] && value.occupancies[0].floorArea).toString() || "NA";
                        }
                  }
                ),
                carpetArea: getLabelWithValue(
                  {
                    labelName: "Carpet Area",
                    labelKey: "Carpet Area"
                  },
                  {
                    jsonPath:
                      "scrutinyDetails.planDetail.blocks[0].building.floors[0]",
                      callBack: value => {
                          return (value && value.occupancies[0] && (value.occupancies[0].carpetArea).toString()) || "NA";
                        }
                  }
                )
            })
          }),
          items: [],
          hasAddItem: false,
          isReviewPage: true,
          sourceJsonPath: "scrutinyDetails.planDetail.blocks[0].building.floors",
          prefixSourceJsonPath:
            "children.cardContent.children.buildingContainer.children",
          afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
      },
    cardFive:{
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "applicant-summary",
            scheama: getCommonGrayCard({
                totalBuildUpAreaDetailsContainer: getCommonContainer({
                    buildingplanscrutinyapplicationnumber: getLabelWithValue(
                        {
                            labelName: "Total Buildup Area (sq.mtrs)",
                            labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
                        },
                        {
                            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.totalBuitUpArea",
                            callBack: checkValueForNA
                        }
                    ),
                    uploadedfile: getLabelWithValue(
                        {
                            labelName: "Number Of Floors",
                            labelKey: "BPA_APPLICATION_NO_OF_FLOORS"
                        },
                        {
                            jsonPath:
                                "scrutinyDetails.planDetail.blocks[0].building.totalFloors",
                                callBack: checkValueForNA
                        }
                    ),
                    scrutinyreport: getLabelWithValue(
                        {
                            labelName: "High From Ground Level From Mumty (In Mtrs)",
                            labelKey: "BPA_APPLICATION_HIGH_FROM_GROUND"
                        },
                        {
                            jsonPath:
                                "scrutinyDetails.planDetail.blocks[0].building.buildingHeight",
                                callBack: checkValueForNA
                        }
                    )
                })
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "scrutinyDetails.planDetail.blocks[0].building",
            prefixSourceJsonPath:
                "children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
            afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
    },
});
