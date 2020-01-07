import { httpRequest } from "./api";
import {
    convertDateToEpoch,
    getCurrentFinancialYear,
    getCheckBoxJsonpath,
    getSafetyNormsJson,
    getHygeneLevelJson,
    getLocalityHarmedJson,
    setFilteredTradeTypes,
    getTradeTypeDropdownData
} from "../ui-config/screens/specs/utils";
import { prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTranslatedLabel, updateDropDowns, ifUserRoleExists } from "../ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "redux/store";
import get from "lodash/get";
import set from "lodash/set";
import { getQueryArg, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
    setBusinessServiceDataToLocalStorage,
    getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import printJS from 'print-js';

export const updateTradeDetails = async requestBody => {
    try {
        const payload = await httpRequest(
            "post",
            "/tl-services/v1/_update",
            "", [],
            requestBody
        );
        return payload;
    } catch (error) {
        store.dispatch(toggleSnackbar(true, error.message, "error"));
    }
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
    alert(1);
    console.log(label, labelKey)
    if (labelKey) {
        let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
        if (!translatedLabel || labelKey === translatedLabel) {
            return label;
        } else {
            return translatedLabel;
        }
    } else {
        return label;
    }
};

export const getSearchResults = async queryObject => {
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );
        return response;
    } catch (error) { console.log(error) }
};

export const getSearchResultsForSewerage = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error)
    }
};

export const getDescriptionFromMDMS = async (requestBody, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search", [],
            requestBody
        );
        dispatch(toggleSpinner());
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

export const fetchBill = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/billing-service/bill/v2/_fetchbill",
            "_fetchBill",
            queryObject
        );
        dispatch(toggleSpinner());
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error)
    }
};

// api call to get my connection details
export const getMyConnectionResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );

        if (response.WaterConnection.length > 0) {
            for (let i = 0; i < response.WaterConnection.length; i++) {
                response.WaterConnection[i].service = "Water"
                try {
                    const data = await httpRequest(
                        "post",
                        `billing-service/bill/v2/_fetchbill?consumerCode=${response.WaterConnection[i].connectionNo}&tenantId=${response.WaterConnection[i].property.tenantId}&businessService=WS`,
                        "_fetchbill",
                        // queryObject
                    );
                    if (data && data !== undefined) {
                        if (data.Bill !== undefined && data.Bill.length > 0) {
                            response.WaterConnection[i].due = data.Bill[0].totalAmount
                        }

                    } else {
                        response.WaterConnection[i].due = 0
                    }

                } catch (err) {
                    console.log(err)
                    response.WaterConnection[i].due = "-"
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};


export const getConsumptionDetails = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-calculator/meterConnection/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

const setDocsForEditFlow = async (state, dispatch) => {
    const applicationDocuments = get(
        state.screenConfiguration.preparedFinalObject,
        "Licenses[0].tradeLicenseDetail.applicationDocuments", []
    );
    let uploadedDocuments = {};
    let fileStoreIds =
        applicationDocuments &&
        applicationDocuments.map(item => item.fileStoreId).join(",");
    const fileUrlPayload =
        fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    applicationDocuments &&
        applicationDocuments.forEach((item, index) => {
            uploadedDocuments[index] = [{
                fileName:
                    (fileUrlPayload &&
                        fileUrlPayload[item.fileStoreId] &&
                        decodeURIComponent(
                            fileUrlPayload[item.fileStoreId]
                                .split(",")[0]
                                .split("?")[0]
                                .split("/")
                                .pop()
                                .slice(13)
                        )) ||
                    `Document - ${index + 1}`,
                fileStoreId: item.fileStoreId,
                fileUrl: Object.values(fileUrlPayload)[index],
                documentType: item.documentType,
                tenantId: item.tenantId,
                id: item.id
            }];
        });
    dispatch(
        prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", uploadedDocuments)
    );
};

export const updatePFOforSearchResults = async (
    action,
    state,
    dispatch,
    queryValue,
    queryValuePurpose,
    tenantId
) => {
    let queryObject = [{
        key: "tenantId",
        value: tenantId ? tenantId : getTenantId()
    },
    { key: "applicationNumber", value: queryValue }
    ];
    const isPreviouslyEdited = getQueryArg(window.location.href, "edited");
    const payload = !isPreviouslyEdited ?
        await getSearchResults(queryObject) :
        {
            Licenses: get(state.screenConfiguration.preparedFinalObject, "Licenses")
        };
    getQueryArg(window.location.href, "action") === "edit" &&
        (await setDocsForEditFlow(state, dispatch));
    if (payload) {
        dispatch(prepareFinalObject("Licenses[0]", payload.Licenses[0]));
    }
    const licenseType = payload && get(payload, "Licenses[0].licenseType");
    const structureSubtype =
        payload && get(payload, "Licenses[0].tradeLicenseDetail.structureType");
    const tradeTypes = setFilteredTradeTypes(
        state,
        dispatch,
        licenseType,
        structureSubtype
    );
    const tradeTypeDdData = getTradeTypeDropdownData(tradeTypes);
    tradeTypeDdData &&
        dispatch(
            prepareFinalObject(
                "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
                tradeTypeDdData
            )
        );
    updateDropDowns(payload, action, state, dispatch, queryValue);
    if (queryValuePurpose !== "cancel") {
        set(payload, getSafetyNormsJson(queryValuePurpose), "yes");
        set(payload, getHygeneLevelJson(queryValuePurpose), "yes");
        set(payload, getLocalityHarmedJson(queryValuePurpose), "No");
    }
    set(payload, getCheckBoxJsonpath(queryValuePurpose), true);

    setApplicationNumberBox(state, dispatch);

    createOwnersBackup(dispatch, payload);
};

export const getBoundaryData = async (
    action,
    state,
    dispatch,
    queryObject,
    code,
    componentPath
) => {
    try {
        let payload = await httpRequest(
            "post",
            "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
            "_search",
            queryObject, {}
        );
        const tenantId =
            process.env.REACT_APP_NAME === "Employee" ?
                get(
                    state.screenConfiguration.preparedFinalObject,
                    "Licenses[0].tradeLicenseDetail.address.city"
                ) :
                getQueryArg(window.location.href, "tenantId");

        const mohallaData =
            payload &&
            payload.TenantBoundary[0] &&
            payload.TenantBoundary[0].boundary &&
            payload.TenantBoundary[0].boundary.reduce((result, item) => {
                result.push({
                    ...item,
                    name: `${tenantId
                        .toUpperCase()
                        .replace(/[.]/g, "_")}_REVENUE_${item.code
                            .toUpperCase()
                            .replace(/[._:-\s\/]/g, "_")}`
                });
                return result;
            }, []);

        dispatch(
            prepareFinalObject(
                "applyScreenMdmsData.tenant.localities",
                // payload.TenantBoundary && payload.TenantBoundary[0].boundary,
                mohallaData
            )
        );

        dispatch(
            handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
                "props.suggestions",
                mohallaData
            )
        );
        if (code) {
            let data = payload.TenantBoundary[0].boundary;
            let messageObject =
                data &&
                data.find(item => {
                    return item.code == code;
                });
            if (messageObject)
                dispatch(
                    prepareFinalObject(
                        "Licenses[0].tradeLicenseDetail.address.locality.name",
                        messageObject.name
                    )
                );
        }
    } catch (e) {
        console.log(e);
    }
};

const createOwnersBackup = (dispatch, payload) => {
    const owners = get(payload, "Licenses[0].tradeLicenseDetail.owners");
    owners &&
        owners.length > 0 &&
        dispatch(
            prepareFinalObject(
                "LicensesTemp[0].tradeLicenseDetail.owners",
                JSON.parse(JSON.stringify(owners))
            )
        );
};

// const getMultipleAccessories = licenses => {
//   let accessories = get(licenses, "tradeLicenseDetail.accessories");
//   let mergedAccessories =
//     accessories &&
//     accessories.reduce((result, item) => {
//       if (item && item !== null && item.hasOwnProperty("accessoryCategory")) {
//         if (item.hasOwnProperty("id")) {
//           if (item.hasOwnProperty("active") && item.active) {
//             if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
//               set(item, "active", false);
//               result.push(item);
//             } else {
//               result.push(item);
//             }
//           }
//         } else {
//           if (!item.hasOwnProperty("isDeleted")) {
//             result.push(item);
//           }
//         }
//       }
//       return result;
//     }, []);

//   return mergedAccessories;
// };

const getMultipleOwners = owners => {
    let mergedOwners =
        owners &&
        owners.reduce((result, item) => {
            if (item && item !== null && item.hasOwnProperty("mobileNumber")) {
                if (item.hasOwnProperty("active") && item.active) {
                    if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
                        set(item, "active", false);
                        result.push(item);
                    } else {
                        result.push(item);
                    }
                } else {
                    if (!item.hasOwnProperty("isDeleted")) {
                        result.push(item);
                    }
                }
            }
            return result;
        }, []);

    return mergedOwners;
};

export const applyTradeLicense = async (state, dispatch, activeIndex) => {
    try {
        let queryObject = JSON.parse(
            JSON.stringify(
                get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
            )
        );
        let documents = get(
            queryObject[0],
            "tradeLicenseDetail.applicationDocuments"
        );
        set(
            queryObject[0],
            "validFrom",
            convertDateToEpoch(queryObject[0].validFrom, "dayend")
        );
        set(queryObject[0], "wfDocuments", documents);
        set(
            queryObject[0],
            "validTo",
            convertDateToEpoch(queryObject[0].validTo, "dayend")
        );
        if (queryObject[0] && queryObject[0].commencementDate) {
            queryObject[0].commencementDate = convertDateToEpoch(
                queryObject[0].commencementDate,
                "dayend"
            );
        }
        let owners = get(queryObject[0], "tradeLicenseDetail.owners");
        owners = (owners && convertOwnerDobToEpoch(owners)) || [];

        //set(queryObject[0], "tradeLicenseDetail.owners", getMultipleOwners(owners));
        const cityId = get(
            queryObject[0],
            "tradeLicenseDetail.address.tenantId",
            ""
        );
        const tenantId = ifUserRoleExists("CITIZEN") ? cityId : getTenantId();
        // const BSqueryObject = [
        //     { key: "tenantId", value: tenantId },
        //     { key: "businessService", value: "newTL" }
        // ];
        if (process.env.REACT_APP_NAME === "Citizen") {
            let currentFinancialYr = getCurrentFinancialYear();
            //Changing the format of FY
            let fY1 = currentFinancialYr.split("-")[1];
            fY1 = fY1.substring(2, 4);
            currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
            set(queryObject[0], "financialYear", currentFinancialYr);
            // setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
        }

        set(queryObject[0], "tenantId", tenantId);

        if (queryObject[0].applicationNumber) {
            //call update

            let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
            let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
            set(
                queryObject[0],
                "tradeLicenseDetail.tradeUnits",
                getMultiUnits(tradeUnits)
            );
            set(
                queryObject[0],
                "tradeLicenseDetail.accessories",
                getMultiUnits(accessories)
            );
            set(
                queryObject[0],
                "tradeLicenseDetail.owners",
                getMultipleOwners(owners)
            );

            let action = "INITIATE";
            if (
                queryObject[0].tradeLicenseDetail &&
                queryObject[0].tradeLicenseDetail.applicationDocuments
            ) {
                if (getQueryArg(window.location.href, "action") === "edit") {
                    // const removedDocs = get(
                    //   state.screenConfiguration.preparedFinalObject,
                    //   "LicensesTemp[0].removedDocs",
                    //   []
                    // );
                    // set(queryObject[0], "tradeLicenseDetail.applicationDocuments", [
                    //   ...get(
                    //     state.screenConfiguration.prepareFinalObject,
                    //     "Licenses[0].tradeLicenseDetail.applicationDocuments",
                    //     []
                    //   ),
                    //   ...removedDocs
                    // ]);
                } else if (activeIndex === 1) {
                    set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
                } else action = "APPLY";
            }
            // else if (
            //   queryObject[0].tradeLicenseDetail &&
            //   queryObject[0].tradeLicenseDetail.applicationDocuments &&
            //   activeIndex === 1
            // ) {
            // } else if (
            //   queryObject[0].tradeLicenseDetail &&
            //   queryObject[0].tradeLicenseDetail.applicationDocuments
            // ) {
            //   action = "APPLY";
            // }
            set(queryObject[0], "action", action);
            const isEditFlow = getQueryArg(window.location.href, "action") === "edit";
            !isEditFlow &&
                (await httpRequest("post", "/tl-services/v1/_update", "", [], {
                    Licenses: queryObject
                }));
            let searchQueryObject = [
                { key: "tenantId", value: queryObject[0].tenantId },
                { key: "applicationNumber", value: queryObject[0].applicationNumber }
            ];
            let searchResponse = await getSearchResults(searchQueryObject);
            if (isEditFlow) {
                searchResponse = { Licenses: queryObject };
            } else {
                dispatch(prepareFinalObject("Licenses", searchResponse.Licenses));
            }
            const updatedtradeUnits = get(
                searchResponse,
                "Licenses[0].tradeLicenseDetail.tradeUnits"
            );
            const tradeTemp = updatedtradeUnits.map((item, index) => {
                return {
                    tradeSubType: item.tradeType.split(".")[1],
                    tradeType: item.tradeType.split(".")[0]
                };
            });
            dispatch(prepareFinalObject("LicensesTemp.tradeUnits", tradeTemp));
            createOwnersBackup(dispatch, searchResponse);
        } else {
            let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
            let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
            // let owners = get(queryObject[0], "tradeLicenseDetail.owners");
            let mergedTradeUnits =
                tradeUnits &&
                tradeUnits.filter(item => !item.hasOwnProperty("isDeleted"));
            let mergedAccessories =
                accessories &&
                accessories.filter(item => !item.hasOwnProperty("isDeleted"));
            let mergedOwners =
                owners && owners.filter(item => !item.hasOwnProperty("isDeleted"));

            set(queryObject[0], "tradeLicenseDetail.tradeUnits", mergedTradeUnits);
            set(queryObject[0], "tradeLicenseDetail.accessories", mergedAccessories);
            set(queryObject[0], "tradeLicenseDetail.owners", mergedOwners);
            set(queryObject[0], "action", "INITIATE");
            //Emptying application docs to "INITIATE" form in case of search and fill from old TL Id.
            if (!queryObject[0].applicationNumber)
                set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
            const response = await httpRequest(
                "post",
                "/tl-services/v1/_create",
                "", [], { Licenses: queryObject }
            );
            dispatch(prepareFinalObject("Licenses", response.Licenses));
            createOwnersBackup(dispatch, response);
        }
        /** Application no. box setting */
        setApplicationNumberBox(state, dispatch);
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
};

const convertOwnerDobToEpoch = owners => {
    let updatedOwners =
        owners &&
        owners
            .map(owner => {
                return {
                    ...owner,
                    dob: owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
                };
            })
            .filter(item => item && item !== null);
    return updatedOwners;
};

export const getImageUrlByFile = file => {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            const fileurl = e.target.result;
            resolve(fileurl);
        };
    });
};

export const getFileSize = file => {
    const size = parseFloat(file.size / 1024).toFixed(2);
    return size;
};

export const isFileValid = (file, acceptedFiles) => {
    const mimeType = file["type"];
    return (
        (mimeType &&
            acceptedFiles &&
            acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
        false
    );
};

const setApplicationNumberBox = (state, dispatch) => {
    let applicationNumber = get(
        state,
        "screenConfiguration.preparedFinalObject.Licenses[0].applicationNumber",
        null
    );
    if (applicationNumber) {
        dispatch(
            handleField(
                "apply",
                "components.div.children.headerDiv.children.header.children.applicationNumber",
                "visible",
                true
            )
        );
        dispatch(
            handleField(
                "apply",
                "components.div.children.headerDiv.children.header.children.applicationNumber",
                "props.number",
                applicationNumber
            )
        );
    }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
    for (let i = 0; i < arr.length; i++) {
        if (conditionCheckerFn(arr[i])) {
            return arr[i];
        }
    }
};


export const getMdmsDataForMeterStatus = async (dispatch) => {
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            "moduleDetails": [
                {
                    "moduleName": "ws-services-calculation",
                    "masterDetails": [
                        {
                            "name": "MeterStatus",
                            "filter": "$.*.name"
                        }
                    ]
                }
            ]
        }
    };
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        console.log(payload.MdmsRes)
        let data = payload.MdmsRes['ws-services-calculation'].MeterStatus.map(ele => {
            return { code: ele }
        })
        payload.MdmsRes['ws-services-calculation'].MeterStatus = data;
        dispatch(prepareFinalObject("meterMdmsData", payload.MdmsRes));

    } catch (e) {
        console.log(e);
    }
};
export const getMdmsDataForAutopopulated = async (dispatch) => {
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
                {
                    moduleName: "ws-services-masters",
                    masterDetails: [
                        {
                            name: "billingPeriod"
                        }
                    ]
                },
            ]
        }
    };
    try {
        // let payload = null;
        // payload = await httpRequest(
        //     "post",
        //     "http://192.168.1.68:8094/egov-mdms-service-test/v1/_search",
        //     "_search",
        //     [],
        //     mdmsBody
        // );

        let connectionNo = getQueryArg(window.location.href, "connectionNos");
        let queryObject = [
            {
                key: "tenantId",
                value: JSON.parse(getUserInfo()).tenantId
            },
            { key: "offset", value: "0" },
            { key: "connectionNumber", value: connectionNo }
        ];
        let res = await getSearchResults(queryObject)
        console.log(res)
        let connectionType = res.WaterConnection[0].connectionType
        console.log(connectionType, "res")
        let payload = {
            "MdmsRes": {
                "ws-services-masters": {
                    "billingPeriod": [
                        {
                            "active": true,
                            "connectionType": "Metered",
                            "billingCycle": "monthly"
                        },
                        {
                            "active": true,
                            "connectionType": "Non Metered",
                            "billingCycle": "quarterly"
                        }
                    ]
                }
            }
        }

        let billingCycle;
        payload.MdmsRes['ws-services-masters'].billingPeriod.map((x) => {
            if (x.connectionType === connectionType) {
                billingCycle = x.billingCycle
            }
        })
        dispatch(prepareFinalObject("billingCycle", billingCycle));

    } catch (e) {
        console.log(e);
    }
}

export const getMeterReadingData = async (dispatch) => {
    let queryObject = [
        {
            key: "tenantId",
            value: "pb.amritsar"
        },
        {
            key: "connectionNos",
            value: getQueryArg(window.location.href, "connectionNos")
        },
        { key: "offset", value: "0" }
    ];


    // const mdmsRes = await getMdmsData(dispatch);
    // let tenants =
    //   mdmsRes &&
    //   mdmsRes.MdmsRes &&
    //   mdmsRes.MdmsRes.tenant.citymodule.find(item => {
    //     if (item.code === "TL") return true;
    //   });
    // dispatch(
    //   prepareFinalObject(
    //     "applyScreenMdmsData.common-masters.citiesByModule.TL",
    //     tenants
    //   )
    // );
    try {
        const response = await getConsumptionDetails(queryObject, dispatch);
        // const response =
        // {
        //     "ResponseInfo": {
        //         "apiId": "",
        //         "ver": ".",
        //         "ts": null,
        //         "resMsgId": "uief87324",
        //         "msgId": "",
        //         "status": "successful"
        //     },
        //     "meterReadings": [
        //         {
        //             "id": "c6326927-0f4c-46ea-b05f-b7bd3a046aca",
        //             "billingPeriod": "Apr - 2019",
        //             "meterStatus": "Working",
        //             "lastReading": 70,
        //             "lastReadingDate": 1575028112,
        //             "currentReading": 347,
        //             "currentReadingDate": 1575028312,
        //             "connectionNo": "WS/107/2019-20/000022"
        //         }
        //     ]
        // }
        if (response && response.meterReadings && response.meterReadings.length > 0) {
            dispatch(prepareFinalObject("consumptionDetails", response.meterReadings));
            dispatch(
                prepareFinalObject("consumptionDetailsCount", response.meterReadings.length)
            );
        }
    } catch (error) {
        console.log(error);
    }
};

export const getPastPaymentsForWater = async (dispatch) => {
    dispatch(toggleSpinner());
    let queryObject = [
        {
            key: "tenantId",
            value: "pb.amritsar"
        },
        {
            key: "businessServices",
            value: "WS"
        },
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber.toString()
        },
    ];
    try {
        const response = await httpRequest(
            "post",
            "/collection-services/payments/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        if (response && response.Payments) {
            dispatch(prepareFinalObject("pastPaymentsForWater", response.Payments));
        }
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
}

export const getPastPaymentsForSewerage = async (dispatch) => {
    dispatch(toggleSpinner());
    let queryObject = [
        {
            key: "tenantId",
            value: "pb.amritsar"
        },
        {
            key: "businessServices",
            value: "SW"
        },
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber.toString()
        },
    ];
    try {
        const response = await httpRequest(
            "post",
            "/collection-services/payments/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        if (response && response.Payments) {
            dispatch(prepareFinalObject("pastPaymentsForSewerage", response.Payments));
        }
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
}

export const createMeterReading = async (dispatch, body) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-calculator/meterConnection/_create",
            "", [], { meterReadings: body }
        );
        if (response && response !== undefined && response !== null) {
            getMeterReadingData(dispatch);
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
                    "value",
                    "Working"
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                    "disabled",
                    false
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                    "disabled",
                    false
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont",
                    "visible",
                    true
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
                    "visible",
                    false
                )
            );
            let todayDate = new Date()
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                    "value",
                    todayDate
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                    "value",
                    ""
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont.props",
                    "value",
                    ""
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
                    "labelName",
                    ""
                )
            );
        }
        dispatch(
            handleField(
                "meter-reading",
                "components.div.children.meterReadingEditable",
                "visible",
                false
            )
        );
        dispatch(prepareFinalObject("metereading", {}));
        dispatch(toggleSpinner());
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
}

export const wsDownloadConnectionDetails = (receiptQueryString, mode, dispatch) => {
    const FETCHCONNECTIONDETAILS = {
        GET: {
            URL: "/ws-services/wc/_search",
            ACTION: "_post",
        },
    };
    const DOWNLOADCONNECTIONDETAILS = {
        GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
        },
    };

    const FETCHSWCONNECTIONDETAILS = {
        GET: {
            URL: "/sw-services/swc/_search",
            ACTION: "_post",
        },
    };
    const service = getQueryArg(window.location.href, "service")

    switch (service) {
        case 'WATER':
            try {
                httpRequest("post", FETCHCONNECTIONDETAILS.GET.URL, FETCHCONNECTIONDETAILS.GET.ACTION, receiptQueryString).then(async (payloadReceiptDetails) => {
                    const queryStr = [
                        { key: "key", value: "ws-consolidatedacknowlegment" },
                        { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
                    ]

                    if (payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting !== undefined && payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting !== null) {
                        if (payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting === true) {
                            payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting = 'SCORE_YES'
                        } else {
                            payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting = 'SCORE_NO'
                        }
                    }

                    if (payloadReceiptDetails.WaterConnection[0].property.propertyType !== null && payloadReceiptDetails.WaterConnection[0].property.propertyType !== undefined) {
                        const propertyTpe = "[?(@.code  == " + JSON.stringify(payloadReceiptDetails.WaterConnection[0].property.propertyType) + ")]"
                        let propertyTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "PropertyType", filter: `${propertyTpe}` }] }] } }
                        const mdmsPropertyType = await getDescriptionFromMDMS(propertyTypeParams, dispatch)
                        payloadReceiptDetails.WaterConnection[0].property.propertyTypeValue = mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name;//propertyType from Mdms
                    }

                    if (payloadReceiptDetails.WaterConnection[0].property.usageCategory !== null && payloadReceiptDetails.WaterConnection[0].property.usageCategory !== undefined) {
                        const propertyUsageType = "[?(@.code  == " + JSON.stringify(payloadReceiptDetails.WaterConnection[0].property.usageCategory) + ")]"
                        let propertyUsageTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "UsageCategoryMajor", filter: `${propertyUsageType}` }] }] } }
                        const mdmsPropertyUsageType = await getDescriptionFromMDMS(propertyUsageTypeParams, dispatch)
                        payloadReceiptDetails.WaterConnection[0].property.propertyUsageType = mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor[0].name;//propertyUsageType from Mdms
                    }


                    httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, { WaterConnection: payloadReceiptDetails.WaterConnection }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            getFileUrlFromAPI(res.filestoreIds[0]).then((fileRes) => {
                                if (mode === 'download') {
                                    var win = window.open(fileRes[res.filestoreIds[0]], '_blank');
                                    win.focus();
                                }
                                else {
                                    printJS(fileRes[res.filestoreIds[0]])
                                }
                            });

                        });
                })

            } catch (exception) {
                alert('Some Error Occured while downloading!');
            }
            break;
        case 'SEWERAGE':
            try {
                httpRequest("post", FETCHSWCONNECTIONDETAILS.GET.URL, FETCHSWCONNECTIONDETAILS.GET.ACTION, receiptQueryString).then(async (payloadReceiptDetails) => {
                    const queryStr = [
                        { key: "key", value: "ws-consolidatedsewerageconnection" },
                        { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
                    ]

                    if (payloadReceiptDetails.SewerageConnections[0].property.propertyType !== null && payloadReceiptDetails.SewerageConnections[0].property.propertyType !== undefined) {
                        const propertyTpe = "[?(@.code  == " + JSON.stringify(payloadReceiptDetails.SewerageConnections[0].property.propertyType) + ")]"
                        let propertyTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "PropertyType", filter: `${propertyTpe}` }] }] } }
                        const mdmsPropertyType = await getDescriptionFromMDMS(propertyTypeParams, dispatch)
                        payloadReceiptDetails.SewerageConnections[0].property.propertyTypeValue = mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name;//propertyType from Mdms
                    }

                    if (payloadReceiptDetails.SewerageConnections[0].property.usageCategory !== null && payloadReceiptDetails.SewerageConnections[0].property.usageCategory !== undefined) {
                        const propertyUsageType = "[?(@.code  == " + JSON.stringify(payloadReceiptDetails.SewerageConnections[0].property.usageCategory) + ")]"
                        let propertyUsageTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "UsageCategoryMajor", filter: `${propertyUsageType}` }] }] } }
                        const mdmsPropertyUsageType = await getDescriptionFromMDMS(propertyUsageTypeParams, dispatch)
                        payloadReceiptDetails.SewerageConnections[0].property.propertyUsageType = mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor[0].name;//propertyUsageType from Mdms
                    }

                    httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, { SewerageConnections: payloadReceiptDetails.SewerageConnections }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            getFileUrlFromAPI(res.filestoreIds[0]).then((fileRes) => {
                                if (mode === 'download') {
                                    var win = window.open(fileRes[res.filestoreIds[0]], '_blank');
                                    win.focus();
                                }
                                else {
                                    printJS(fileRes[res.filestoreIds[0]])
                                }
                            });

                        });
                })

            } catch (exception) {
                alert('Some Error Occured while downloading!');
            }
            break;
    }
}


export const getSWMyConnectionResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (response.SewerageConnections.length > 0) {
            for (let i = 0; i < response.SewerageConnections.length; i++) {
                response.SewerageConnections[i].service = "Sewerage"
                try {
                    const data = await httpRequest(
                        "post",
                        `billing-service/bill/v2/_fetchbill?consumerCode=${response.SewerageConnections[i].connectionNo}&tenantId=${response.SewerageConnections[i].property.tenantId}&businessService=SW`,
                        "_fetchbill",
                        // queryObject
                    );
                    if (data && data !== undefined) {
                        if (data.Bill !== undefined && data.Bill.length > 0) {
                            response.SewerageConnections[i].due = data.Bill[0].totalAmount
                        }

                    } else {
                        response.SewerageConnections[i].due = 0
                    }

                } catch (err) {
                    console.log(err)
                    response.SewerageConnections[i].due = "-"
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return response;
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const downloadBill = (receiptQueryString, mode = "download") => {
    const FETCHBILL = {
        GET: {
            URL: "/billing-service/bill/v2/_fetchbill",
            ACTION: "_get",
        },
    };
    const DOWNLOADBILL = {
        GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
        },
    };

    try {
        httpRequest("post", FETCHBILL.GET.URL, FETCHBILL.GET.ACTION, receiptQueryString).then((payloadReceiptDetails) => {
            const queryStr = [
                { key: "key", value: "consolidatedbill" },
                { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
            ]
            httpRequest("post", DOWNLOADBILL.GET.URL, DOWNLOADBILL.GET.ACTION, queryStr, { Bill: payloadReceiptDetails.Bill }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                .then(res => {
                    getFileUrlFromAPI(res.filestoreIds[0]).then((fileRes) => {
                        if (mode === 'download') {
                            var win = window.open(fileRes[res.filestoreIds[0]], '_blank');
                            win.focus();
                        }
                        else {
                            printJS(fileRes[res.filestoreIds[0]])
                        }
                    });

                });
        })

    } catch (exception) {
        alert('Some Error Occured while downloading Bill!');
    }
}