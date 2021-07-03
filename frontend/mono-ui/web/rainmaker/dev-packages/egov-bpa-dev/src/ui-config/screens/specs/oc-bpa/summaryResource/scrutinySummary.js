import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep, checkValueForNA } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { changeStep } from "../applyResource/footer";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
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
                        changeStep(state, dispatch, "", 0);
                    }
                }
            }
        }
    },
    ocBpaBasicDetailsContainer: getHeader({
        labelName: "Basic Details",
        labelKey: "BPA_BASIC_DETAILS_TITLE"
    }),
    break1: getBreak(),
    basicDetailsContainer: getCommonContainer({
        scrutinynumber: getLabelWithValue(
            {
                labelName: "Occupancy Certificate Scrutiny Number",
                labelKey: "BPA_OC_SCRUTINY_NO_LABEL"
            },
            {
                jsonPath: "BPA.edcrNumber",
                callBack: checkValueForNA
            }
        ),
        applicationtype: getLabelWithValue(
            {
                labelName: "Application Type",
                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
            },
            {
                localePrefix: {
                    moduleName: "WF",
                    masterName: "BPA"
                  },
                jsonPath: "BPA.applicationType",
                callBack: checkValueForNA
            }
        ),
        risktype: getLabelWithValue(
            {
                labelName: "Risk Type",
                labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
            },
            {
                localePrefix: {
                    moduleName: "WF",
                    masterName: "BPA"
                  },
                jsonPath: "BPA.riskType",
                callBack: checkValueForNA
            }
        ),
        servicetype: getLabelWithValue(
            {
                labelName: "Service Type",
                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
            },
            {
                jsonPath: "BPA.serviceType",
                callBack: checkValueForNA
            }
        ),
        applicationDate: getLabelWithValue(
            {
                labelName: "Application Date",
                labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
            },
            {
                jsonPath: "BPA.auditDetails.createdTime",
                callBack: value => {
                    return convertEpochToDate(value) || checkValueForNA;
                }
            }
        ),
        applicantName: getLabelWithValue(
            {
                labelName: "Applicant Name",
                labelKey: "EDCR_SCRUTINY_NAME_LABEL"
            },
            {
                jsonPath: "BPA.applicantName",
                callBack: checkValueForNA
            }
        ),
        // stakeHolderName: getLabelWithValue(
        //     {
        //         labelName: "Stake Holder Name",
        //         labelKey: "EDCR_SH_NAME_LABEL"
        //     },
        //     {
        //         jsonPath: "BPA.appliedBy",
        //         callBack: checkValueForNA
        //     }
        // ),
        remarks: getLabelWithValue(
            {
                labelName: "Remarks",
                labelKey: "BPA_BASIC_DETAILS_REMARKS_LABEL"
            },
            {
                jsonPath:
                    "BPA.additionalDetails.remarks",
                callBack: checkValueForNA
            }
        ),
        buildingPermitNum: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-bpa",
            componentPath: "downloadFile",
            gridDefination: {
                xs: 3,
                sm: 3,
                md: 3
            },
            props: {
                label: {
                    labelName: "Building Permit Number",
                    labelKey: "EDCR_BUILDING_PERMIT_NUM_LABEL"
                },
                linkDetail: {
                    labelName: "",
                    labelKey: ""
                },
                jsonPath: "BPA.permitNumberLink",
            },
            type: "array"
        }
    }),
    break2: getBreak(),
    buildingPlanScrutinyHeaderDetails: getHeader({
        labelName: "Occupancy certificate scrutiny details",
        labelKey: "BPA_OC_CER_SCRUNITY_DETAILS_TITLE"
    }),
    breake3: getBreak(),
    buildingPlanScrutinyDetailsContainer: getCommonContainer({
        buildingplanscrutinyapplicationnumber: getLabelWithValue(
            {
                labelName: "eDCR Number",
                labelKey: "BPA_EDCR_NO_LABEL"
            },
            {
                jsonPath: "ocScrutinyDetails.edcrNumber"
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
                jsonPath: "ocScrutinyDetails.updatedDxfFile",
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
                jsonPath: "ocScrutinyDetails.planReport",
            },
            type: "array"
        }
    }),
    breake4: getBreak(),
    proposedBuildingDetails: getHeader({
        labelName: "Actual Building details",
        labelKey: "BPA_ACTUAL_BUILDING_DETAILS_LABEL"
    }),
    break5: getBreak(),
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
                    labelName: "Actual Building details",
                    labelKey: "BPA_ACTUAL_BUILDING_DETAILS_LABEL"
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
                        jsonPath: "ocScrutinyDetails.planDetail.occupancies[0].typeHelper.type.code",
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
                                                        returnVAlue += getLocaleLabels(getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`),
                                                         getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)) //occupancy[tp].label;
                                                    } else {
                                                        returnVAlue += getLocaleLabels(getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`),
                                                         getTransformedLocale(`BPA_SUBOCCUPANCYTYPE_${occupancy[tp].value}`)) + "," //occupancy[tp].label + ",";
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
                breakP2: getBreak(),
                breakq: getBreak()
            }
        }
    }),
    break6: getBreak(),
    proposedBuildingAbstractDetails: getHeader({
        labelName: "Actual building abstract",
        labelKey: "BPA_ACTUAL_BUILDING_ABSTRACT_HEADER"
    }),
    break7: getBreak(),
    proposedBuildingAbstractContainer : getCommonContainer({
        buildingplanscrutinyapplicationnumber: getLabelWithValue(
            {
                labelName: "Total Buildup Area (sq.mtrs)",
                labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
            },
            {
                jsonPath: "ocScrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea",
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
                    "ocScrutinyDetails.planDetail.blocks[0].building.totalFloors",
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
                    "ocScrutinyDetails.planDetail.blocks[0].building.buildingHeight",
                callBack: checkValueForNA
            }
        )
    })
});
