import {
    getCommonHeader,
    getSelectField,
    getCommonContainer,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    sortByEpoch,
    getEpochForDate,
    getBpaTextToLocalMapping
} from "../utils";
import {
    handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { fetchDataForStakeHolder } from "./functions";
import get from "lodash/get";
import store from "ui-redux/store";


const header = getCommonHeader(
    {
        labelName: "My Applications",
        labelKey: "BPA_MY_APPLICATIONS"
    },
    {
        classes: {
            root: "common-header-cont"
        }
    }
);

const screenConfig = {
    uiFramework: "material-ui",
    name: "my-applications-stakeholder",
    beforeInitScreen: (action, state, dispatch) => {
        fetchDataForStakeHolder(action, state, dispatch, true);
        return action;
    },

    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
                header: header,
                filterCard: getCommonContainer({
                    applicationType: {
                        ...getSelectField({
                            label: {
                                labelName: "Application Type",
                                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
                            },
                            placeholder: {
                                labelName: "Select Application Type",
                                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
                            },
                            jsonPath: "filterData[0].applicationType",
                            props: {
                                style: { marginLeft: "20px" }
                            },
                            visible: false,
                            data: [
                                {
                                    code: "BPA_APPLY_SERVICE",
                                    label: "BPA"
                                },
                                {
                                    code: "BPAREG_SERVICE",
                                    label: "Stakeholder"
                                }
                            ],
                            gridDefination: {
                                xs: 12,
                                sm: 3
                            }
                        }),
                        afterFieldChange: (action, state, dispatch) => {
                            fieldChange(action, state, dispatch);
                        }
                    },
                    serviceType: {
                        ...getSelectField({
                            label: {
                                labelName: "Service Type",
                                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
                            },
                            placeholder: {
                                labelName: "Select Service Type",
                                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
                            },
                            optionLabel: "name",
                            sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
                            jsonPath: "filterData[0].serviceType",
                            localePrefix: {
                                moduleName: "WF",
                                masterName: "BPA"
                            },
                            props: {
                                style: { marginLeft: "20px" }
                            },
                            visible: false,
                            gridDefination: {
                                xs: 12,
                                sm: 3
                            }
                        }),
                        afterFieldChange: (action, state, dispatch) => {
                            fieldChange(action, state, dispatch);
                        }
                    },
                    applicationStatus: {
                        ...getSelectField({
                            label: {
                                labelName: "Status",
                                labelKey: "BPA_STATUS_LABEL"
                            },
                            optionLabel: "name",
                            placeholder: {
                                labelName: "Select Status",
                                labelKey: "BPA_STATUS_PLACEHOLDER"
                            },
                            jsonPath: "filterData[0].status",
                            data: [{ code: getBpaTextToLocalMapping("PENDINGPAYMENT") }, { code: getBpaTextToLocalMapping("REJECTED") }, { code: getBpaTextToLocalMapping("APPROVED") }, { code: getBpaTextToLocalMapping("INITIATED") }, { code: getBpaTextToLocalMapping("CITIZEN_APPROVAL_INPROCESS") }, { code: getBpaTextToLocalMapping("INPROGRESS") }, { code: getBpaTextToLocalMapping("PENDING_FEE") }, { code: getBpaTextToLocalMapping("DOC_VERIFICATION_INPROGRESS") }, { code: getBpaTextToLocalMapping("FIELDINSPECTION_INPROGRESS") }, { code: getBpaTextToLocalMapping("NOC_VERIFICATION_INPROGRESS") }, { code: getBpaTextToLocalMapping("APPROVAL_INPROGRESS") }, { code: getBpaTextToLocalMapping("PENDING_APPL_FEE") }, { code: getBpaTextToLocalMapping("PENDING_SANC_FEE_PAYMENT") }, { code: getBpaTextToLocalMapping("CITIZEN_ACTION_PENDING_AT_DOC_VERIF") }, { code: getBpaTextToLocalMapping("CITIZEN_ACTION_PENDING_AT_FI_VERIF") }, { code: getBpaTextToLocalMapping("CITIZEN_ACTION_PENDING_AT_NOC_VERIF") }],
                            props: {
                                style: { marginLeft: "20px" }
                            },
                            visible: false,
                            gridDefination: {
                                xs: 12,
                                sm: 3
                            }
                        }),
                        afterFieldChange: (action, state, dispatch) => {
                            fieldChange(action, state, dispatch);
                        }
                    },
                    clearBtn: {
                        componentPath: "Button",
                        gridDefination: {
                            xs: 12,
                            sm: 3
                        },
                        props: {
                            variant: "contained",
                            style: {
                                color: "white",
                                margin: "8px",
                                backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                                borderRadius: "2px",
                                width: "220px",
                                height: "48px"
                            }
                        },
                        visible: false,
                        children: {
                            buttonLabel: getLabel({
                                labelName: "Clear Filter",
                                labelKey: "Clear Filter"
                            })
                        },
                        onClickDefination: {
                            action: "condition"
                        }
                    }
                }),
                applicationsCard: {
                    uiFramework: "custom-molecules",
                    name: "my-applications-stakeholder",
                    componentPath: "Table",
                    props: {
                        columns: [
                            {
                                name: "Application No", labelKey: "EDCR_COMMON_TABLE_APPL_NO"
                            },
                            {
                                name: "Building Plan Scrutiny No", labelKey: "EDCR_COMMON_TABLE_SCRUTINY_NO"
                            },
                            {
                                name: "City", labelKey: "EDCR_COMMON_TABLE_CITY_LABEL"
                            },
                            {
                                name: "Applicant Name", labelKey: "EDCR_COMMON_TABLE_APPL_NAME"
                            },
                            {
                                name: "Status", labelKey: "EDCR_COMMON_TABLE_COL_STATUS"
                            },
                            {
                                name: "Download Scrutiny Number", labelKey: "EDCR_DOWNLOAD_REPORT"
                            },
                            {
                                name: "Building Plan Download", labelKey: "EDCR_DOWNLOAD_BUILDING_PLAN"
                            },
                            {
                                name: "tenantId",
                                labelKey: "tenantId",
                                options: {
                                    display: false
                                }
                            },
                            {
                                name: "serviceType",
                                labelKey: "serviceType",
                                options: {
                                    display: false
                                }
                            },
                            {
                                name: "type",
                                labelKey: "type",
                                options: {
                                    display: false
                                }
                            }
                        ],
                        title: {
                            labelName: "Search Results for eDCR Applications",
                            labelKey: "BPA_EDCR_SEARCH_RESULTS_FOR_APP"
                        },
                        rows: "",
                        options: {
                            filter: false,
                            download: false,
                            responsive: "stacked",
                            selectableRows: false,
                            hover: true,
                            data: [],
                            rowsPerPageOptions: [10, 15, 20],
                            onCellClick: (row, index) => {
                                onCellClick(row, index);
                            },
                        },
                        customSortColumn: {
                            column: "Application Date",
                            sortingFn: (data, i, sortDateOrder) => {
                                const epochDates = data.reduce((acc, curr) => {
                                    acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
                                    return acc;
                                }, []);
                                const order = sortDateOrder === "asc" ? true : false;
                                const finalData = sortByEpoch(epochDates, !order).map(item => {
                                    item.pop();
                                    return item;
                                });
                                return { data: finalData, currentOrder: !order ? "asc" : "desc" };
                            }
                        }
                    }
                }
            }
        }
    }
};

const onCellClick = (row, index) => {
    let state = store.getState();
    let cellData = get(
        state.screenConfiguration,
        "screenConfig.my-applications-stakeholder.components.div.children.applicationsCard.props.data",
        []
    );
    if (cellData[index.rowIndex].EDCR_DOWNLOAD_REPORT == row) {
        window.open(cellData[index.rowIndex].EDCR_DOWNLOAD_REPORT1)
    }
    if (cellData[index.rowIndex].EDCR_DOWNLOAD_BUILDING_PLAN == row) {
        window.open(cellData[index.rowIndex].EDCR_DOWNLOAD_BUILDING_PLAN1)
    }
};

export default screenConfig;