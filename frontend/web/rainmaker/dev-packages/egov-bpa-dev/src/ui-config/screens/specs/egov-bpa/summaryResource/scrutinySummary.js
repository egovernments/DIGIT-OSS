import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
    getCommonCard,
    getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep, checkValueForNA } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { changeStep } from "../applyResource/footer";

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
                        changeStep(state, dispatch, "", 1);
                    }
                }
            }
        }
    },
    buildingPlanScrutinyHeaderDetails: getHeader({
        labelName: "Building Plan Scrutiny Application Details",
        labelKey: "BPA_APPLICATION_SCRUNITY_DETAILS_TITLE"
    }),
    breakeDCR: getBreak(),
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "applicant-summary",
            scheama: getCommonGrayCard({
                buildingPlanScrutinyDetailsContainer: getCommonContainer({
                    buildingplanscrutinyapplicationnumber: getLabelWithValue(
                        {
                            labelName: "eDCR Number",
                            labelKey: "BPA_EDCR_NO_LABEL"
                        },
                        {
                            jsonPath: "scrutinyDetails.edcrNumber"
                        }
                    ),
                    uploadedfile: {
                        uiFramework: "custom-atoms-local",
                        moduleName: "egov-bpa",
                        componentPath: "downloadFile",
                        gridDefination: {
                            xs: 12,
                            sm: 12,
                            md: 3
                        },
                        props: {
                            label: 'Uploaded Diagram',
                            linkDetail: 'uploadedDiagram.dxf',
                            jsonPath: "scrutinyDetails.updatedDxfFile",
                        },
                        type: "array"
                    },
                    scrutinyreport: {
                        uiFramework: "custom-atoms-local",
                        moduleName: "egov-bpa",
                        componentPath: "downloadFile",
                        gridDefination: {
                            xs: 12,
                            sm: 12,
                            md: 3
                        },
                        props: {
                            label: 'Scrutiny Report',
                            linkDetail: 'ScrutinyReport.pdf',
                            jsonPath: "scrutinyDetails.planReport",
                        },
                        type: "array"
                    }
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "scrutinyDetails",
            sourceJsonPath: "BPA",
            prefixSourceJsonPath: "children.cardContent.children.applicantContainer.children",
            afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
    },
    proposedBuildingDetailsHeadr:getHeader({
        labelName: "Proposed Building Details",
        labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL"
    }),
    break3: getBreak(),
    proposedBuildingDetails: getCommonCard({
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          props: {
            style: {
              width: "50%",
              display: "inline-block",
              fontSize: "18px",
              paddingLeft: "10px"
            }
          },
          children: {
            proposedLabel: getLabel({
              labelName: "Proposed Building Details",
              labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL"
            })
          }
        },
        occupancy: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          props: {
            className: "occupancytypeblock",
          },
          children: {
            occupancyType: getLabelWithValue(
                {
                    labelName: "Occupancy Type",
                    labelKey: "BPA_OCCUPANCY_TYPE"
                },
                {
                    jsonPath: "BPA.occupancyType",
                    localePrefix: {
                        moduleName: "BPA",
                        masterName: "OCCUPANCYTYPE"
                      },
                    callBack: checkValueForNA
                }
            ),
          }
        },
        proposedContainer: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          visible: true,
          props: {
            className: "mymuicontainer",
          },
          children: {
            component: {
              uiFramework: "custom-containers",
              componentPath: "MultiItem",
              props: {
                hasAddItem: false,
                scheama: getCommonGrayCard({
                  blocksContainer: getCommonContainer({
                    header: getLabel(
                      "Block",
                      "",
                      {
                        jsonPath: "edcr.blockDetail[0].titleData",
                        style: {
                          width: "50%",
                          marginTop: "5px"
                        }
                      }
                    ),
                    subOccupancyType: getLabelWithValue(
                        {
                            labelName: "Sub Occupancy Type",
                            labelKey: "BPA_SUB_OCCUP_TYPE_LABEL"
                        },
                        {
                            jsonPath: `edcr.blockDetail[0]`,
                            localePrefix: {
                                moduleName: "BPA",
                                masterName: "SUBOCCUPANCYTYPE"
                            },
                            callBack: value => {
                                let returnVAlue;
                                if (value && value.occupancyType && value.occupancyType.length) {
                                    returnVAlue = "";
                                    let occupancy = value.occupancyType;
                                    for (let tp = 0; tp < occupancy.length; tp++) {
                                        if (tp === (occupancy.length - 1)) {
                                            returnVAlue += getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)
                                        } else {
                                            returnVAlue += getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`) + ","
                                        }
                                    }
                                }
                                return returnVAlue || checkValueForNA;
                            },
                        }
                    ),
                    proposedBuildingDetailsContainer: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "Table",
                      props: {
                        className: "mymuitable",
                        jsonPath: "edcr.blockDetail[0].blocks",
                        style: { marginBottom: 20 },
                        columns: {
                          "Floor Description": {},
                          "Level": {},
                          "Occupancy/Sub Occupancy": {},
                          "Buildup Area": {},
                          "Floor Area": {},
                          "Carpet Area": {},
                        },
                        title: "",
                        options: {
                          filterType: "dropdown",
                          responsive: "stacked",
                          selectableRows: false,
                          pagination: false,
                          selectableRowsHeader: false,
                          sortFilterList: false,
                          sort: false,
                          filter: false,
                          search: false,
                          print: false,
                          download: false,
                          viewColumns: false,
                        }
                      }
                    },
                  }),
                }),
                items: [],
                isReviewPage: true,
                prefixSourceJsonPath: "children.cardContent.children.blocksContainer.children",
                sourceJsonPath: "edcr.blockDetail",
                afterPrefixJsonPath: "children.value.children.key"
              },
              type: "array"
            },
            breakP: getBreak(),
            breakq: getBreak()
          }
        }
      }),
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
    proposedBuildingDetails1:getHeader({
        labelName: "Proposed Building Abstract",
        labelKey: "BPA_PROPOSED_BUILDING_ABSTRACT_HEADER"
    }),
    brk: getBreak(),
    cardFive:{
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "applicant-summary",
            scheama: getCommonGrayCard({
                totalBuildUpAreaDetailsContainer: getCommonContainer({
                    buitUpArea: getLabelWithValue(
                        {
                            labelName: "Total Buildup Area (sq.mtrs)",
                            labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
                        },
                        {
                            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.totalBuitUpArea",
                            callBack: checkValueForNA
                        }
                    ),
                    totalFloors: getLabelWithValue(
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
                    buildingHeight: getLabelWithValue(
                        {
                            labelName: "High From Ground Level From Mumty (In Mtrs)",
                            labelKey: "BPA_APPLICATION_HIGH_FROM_GROUND"
                        },
                        {
                            jsonPath:
                                "scrutinyDetails.planDetail.blocks[0].building.buildingHeight",
                                callBack: checkValueForNA
                        }
                    ),
                    isCharitableTrustBuilding: getLabelWithValue(
                        {
                            labelName: "Is Charitable TrustBuilding ?",
                            labelKey: "BPA_IS_CHARITABLE_TRUSTBUILDING_LABEL"
                        },
                        {
                            jsonPath: "BPA.additionalDetails.isCharitableTrustBuilding",
                            callBack: checkValueForNA
                        }
                    ),
                    isAffordableHousingScheme: getLabelWithValue(
                        {
                            labelName: "Is Affordable Housing Scheme ?",
                            labelKey: "BPA_IS_AFFRORADABLE_HOUSING_LABEL"
                        },
                        {
                            jsonPath: "BPA.additionalDetails.isAffordableHousingScheme",
                            callBack: checkValueForNA
                        }
                    ),
                    annualExpectedExpenditure: getLabelWithValue(
                        {
                            labelName: "Annual Expected Expenditure",
                            labelKey: "BPA_ANNUAL_EXPECTED_EXPENDITURE_LABEL"
                        },
                        {
                            jsonPath: "BPA.additionalDetails.annualExpectedExpenditure",
                            callBack: checkValueForNA
                        }
                    ),
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
