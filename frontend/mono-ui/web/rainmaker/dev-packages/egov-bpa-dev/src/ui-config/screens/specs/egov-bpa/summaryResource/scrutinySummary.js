import {
    getBreak,





    getCommonCard, getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { checkValueForNA } from "../../utils/index";
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
                label: {
                    labelName: "Uploaded Diagram",
                    labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM"
                },
                linkDetail: {
                    labelName: "uploadedDiagram.dxf",
                    labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM_DXF"
                },
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
                label: {
                    labelName: "Scrutiny Report",
                    labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT"
                },
                linkDetail: {
                    labelName: "ScrutinyReport.pdf",
                    labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT_PDF"
                },
                jsonPath: "scrutinyDetails.planReport",
            },
            type: "array"
        }
    }),
    proposedBuildingDetailsHeadr: getHeader({
        labelName: "Proposed Building Details",
        labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL"
    }),
    break3: getBreak(),
    proposedBuildingDetailsSummary: getCommonCard({
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
                        localePrefix: {
                            moduleName: "BPA",
                            masterName: "OCCUPANCYTYPE"
                        },
                        jsonPath: "scrutinyDetails.planDetail.occupancies[0].typeHelper.type.code",
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
                        scheama: getCommonContainer({
                            blocksContainer: getCommonContainer({
                                header: getLabel(
                                    "Block",
                                    "",
                                    {
                                        jsonPath: "edcr.blockDetail[0].titleData",
                                        style: {
                                            width: "50%",
                                            marginTop: "5px",
                                            marginLeft: "7px"
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
                                        callBack: value => {
                                            let returnVAlue;
                                            if (value && value.occupancyType && value.occupancyType.length) {
                                                returnVAlue = "";
                                                let occupancy = value.occupancyType;
                                                for (let tp = 0; tp < occupancy.length; tp++) {
                                                    if (tp === (occupancy.length - 1)) {
                                                        returnVAlue += getLocaleLabels(getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`), getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)) //occupancy[tp].label;
                                                    } else {
                                                        returnVAlue += getLocaleLabels(getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`), getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)) + "," //occupancy[tp].label + ",";
                                                    }
                                                }
                                            }
                                            return returnVAlue || "NA";
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
                                        // columns: {
                                        //     "Floor Description": {},
                                        //     "Level": {},
                                        //     "Occupancy/Sub Occupancy": {},
                                        //     "Buildup Area": {},
                                        //     "Floor Area": {},
                                        //     "Carpet Area": {},
                                        // },
                                        columns: [
                                            { key: "Floor Description", name: "BPA_COMMON_TABLE_COL_FLOOR_DES"},
                                            { key: "Level", name: "BPA_COMMON_TABLE_COL_FLOOR_LEVEL"},
                                            { key: "Occupancy/Sub Occupancy", name: "BPA_COMMON_TABLE_COL_OCCUP"},
                                            { key: "Buildup Area", name: "BPA_COMMON_TABLE_COL_BUILD_AREA"},
                                            { key: "Floor Area", name: "BPA_COMMON_TABLE_COL_FLOOR_AREA"},
                                            { key: "Carpet Area", name: "BPA_COMMON_TABLE_COL_CARPET_AREA"}
                                        ],
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
                                            rowHover: false
                                        }
                                    }
                                },
                                breakP: getBreak(),
                                breakP1: getBreak(),
                            }),
                        }),
                        items: [],
                        isReviewPage: true,
                        prefixSourceJsonPath: "children.blocksContainer.children",
                        sourceJsonPath: "edcr.blockDetail",
                        afterPrefixJsonPath: "children.value.children.key"
                    },
                    type: "array"
                },
                breakP2: getBreak()
            }
        }
    }),
    break4: getBreak(),
    DemolitionDetails: getHeader({
        labelName: "Demolition Details",
        labelKey: "BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL"
    }),
    break1: getBreak(),
    demolitionDetailsContainer: getCommonContainer({
        demolitionArea: getLabelWithValue(
            {
                labelName: "Demolition Area",
                labelKey: "BPA_APPLICATION_DEMOLITION_AREA_LABEL"
            },
            {
                jsonPath: "scrutinyDetails.planDetail.planInformation.demolitionArea",
                callBack: value => {
                    if (value) { return value; }
                    else if (value == "0") { return "0" }
                    else { return checkValueForNA }
                }
            }
        )
    }),
    proposedBuildingDetails1: getHeader({
        labelName: "Proposed Building Abstract",
        labelKey: "BPA_PROPOSED_BUILDING_ABSTRACT_HEADER"
    }),
    brk: getBreak(),

    totalBuildUpAreaDetailsContainer: getCommonContainer({
        buitUpArea: getLabelWithValue(
            {
                labelName: "Total Buildup Area (sq.mtrs)",
                labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
            },
            {
                jsonPath: "scrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea",
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

    })
});
