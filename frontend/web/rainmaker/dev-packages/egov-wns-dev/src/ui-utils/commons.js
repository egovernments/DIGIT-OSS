import { httpRequest } from "./api";
import {
    convertDateToEpoch,
    getCheckBoxJsonpath,
    getSafetyNormsJson,
    getHygeneLevelJson,
    getLocalityHarmedJson
} from "../ui-config/screens/specs/utils";
import { prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTranslatedLabel, updateDropDowns, ifUserRoleExists } from "../ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "redux/store";
import get from "lodash/get";
import set from "lodash/set";
import { getQueryArg, getFileUrlFromAPI, getFileUrl, getTransformedLocale, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import printJS from 'print-js';
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons"

export const pushTheDocsUploadedToRedux = async (state, dispatch) => {
    let reduxDocuments = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux", {});
    let uploadedDocs = [];
    if (reduxDocuments !== null && reduxDocuments !== undefined) {
        dispatch(prepareFinalObject("DocumentsData", []));
        Object.keys(reduxDocuments).forEach(async key => {
            if (reduxDocuments !== undefined && reduxDocuments[key] !== undefined && reduxDocuments[key].documents !== undefined) {
                reduxDocuments[key].documents.forEach(element => {
                    if (reduxDocuments[key].dropdown !== undefined) {
                        element.documentType = reduxDocuments[key].dropdown.value;
                    } else {
                        element.documentType = reduxDocuments[key].documentType;
                    }
                    element.documentCode = reduxDocuments[key].documentCode;
                    element.status = "ACTIVE";
                    element.id = reduxDocuments[key].id;
                });
                uploadedDocs = uploadedDocs.concat(reduxDocuments[key].documents);
                let docArrayFromFileStore = await setDocsForEditFlow(state);
                uploadedDocs.forEach(obj => {
                    let element = obj.fileStoreId;
                    Object.keys(docArrayFromFileStore).forEach(resp => {
                        docArrayFromFileStore[resp].forEach(arr => { if (arr.fileStoreId === element) { obj.fileName = arr.fileName; } })
                    })
                })
                dispatch(prepareFinalObject("applyScreen.documents", uploadedDocs));
                let docs = get(state, "screenConfiguration.preparedFinalObject");
                await setDocuments(docs, "applyScreen.documents", "UploadedDocs", dispatch, "WS");
                await setDocuments(docs, "applyScreen.documents", "DocumentsData", dispatch, "WS");
                let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
                dispatch(prepareFinalObject("applyScreen", applyScreenObject));
                if (getQueryArg(window.location.href, "action") === "edit") {
                    dispatch(prepareFinalObject("WaterConnection[0]", applyScreenObject));
                }
            }
        });
    }
}
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
        let result = findAndReplace(response, null, "NA");
        let waterSource = result.WaterConnection[0].waterSource.split(".")[0];
        let waterSubSource = result.WaterConnection[0].waterSource.split(".")[1];
        result.WaterConnection[0].waterSource = waterSource;
        result.WaterConnection[0].waterSubSource = waterSubSource;
        return result;
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
        return findAndReplace(response, null, "NA");
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
        return findAndReplace(response, null, "NA");
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
        return findAndReplace(response, null, "NA");
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
                if (response.WaterConnection[i].connectionNo !== null && response.WaterConnection[i].connectionNo !== undefined) {
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
                        response.WaterConnection[i].due = "NA"
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getMyApplicationResults = async (queryObject, dispatch) => {
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
                if (response.WaterConnection[i].applicationNo !== null && response.WaterConnection[i].applicationNo !== undefined) {
                    try {
                        const data = await httpRequest(
                            "post",
                            `billing-service/bill/v2/_fetchbill?consumerCode=${response.WaterConnection[i].applicationNo}&tenantId=${response.WaterConnection[i].property.tenantId}&businessService=WS.ONE_TIME_FEE`,
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
                        response.WaterConnection[i].due = "NA"
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getSWMyApplicationResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            // "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (response.SewerageConnections.length > 0) {
            for (let i = 0; i < response.SewerageConnections.length; i++) {
                response.SewerageConnections[i].service = "Sewerage"
                if (response.SewerageConnections[i].applicationNo !== undefined && response.SewerageConnections[i].applicationNo !== null) {
                    try {
                        const data = await httpRequest(
                            "post",
                            `billing-service/bill/v2/_fetchbill?consumerCode=${response.SewerageConnections[i].applicationNo}&tenantId=${response.SewerageConnections[i].property.tenantId}&businessService=SW.ONE_TIME_FEE`,
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
                        response.SewerageConnections[i].due = "NA"
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getPropertyResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/property-services/property/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
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
        return findAndReplace(response, null, "NA");
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
            WaterConnection: get(state.screenConfiguration.preparedFinalObject, "WaterConnection")
        };
    getQueryArg(window.location.href, "action") === "edit" &&
        (await setDocsForEditFlow(state));
    if (payload) {
        dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
    }
    // const licenseType = payload && get(payload, "Licenses[0].licenseType");
    // const structureSubtype =
    //     payload && get(payload, "Licenses[0].tradeLicenseDetail.structureType");
    // const tradeTypes = setFilteredTradeTypes(
    //     state,
    //     dispatch,
    //     licenseType,
    //     structureSubtype
    // );
    // const tradeTypeDdData = getTradeTypeDropdownData(tradeTypes);
    // tradeTypeDdData &&
    //     dispatch(
    //         prepareFinalObject(
    //             "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
    //             tradeTypeDdData
    //         )
    //     );
    updateDropDowns(payload, action, state, dispatch, queryValue);
    if (queryValuePurpose !== "cancel") {
        set(payload, getSafetyNormsJson(queryValuePurpose), "yes");
        set(payload, getHygeneLevelJson(queryValuePurpose), "yes");
        set(payload, getLocalityHarmedJson(queryValuePurpose), "No");
    }
    set(payload, getCheckBoxJsonpath(queryValuePurpose), true);

    setApplicationNumberBox(state, dispatch);

    // createOwnersBackup(dispatch, payload);
};

export const getBoundaryData = async (
    action,
    state,
    dispatch,
    queryObject,
    code) => {
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

export const validateFeildsForBothWaterAndSewerage = (applyScreenObject) => {
    if (
        applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "" &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedTaps") &&
        applyScreenObject["proposedTaps"] !== undefined &&
        applyScreenObject["proposedTaps"] !== "" &&
        applyScreenObject["proposedTaps"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedPipeSize") &&
        applyScreenObject["proposedPipeSize"] !== undefined &&
        applyScreenObject["proposedPipeSize"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedWaterClosets") &&
        applyScreenObject["proposedWaterClosets"] !== undefined &&
        applyScreenObject["proposedWaterClosets"] !== "" &&
        applyScreenObject["proposedWaterClosets"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedToilets") &&
        applyScreenObject["proposedToilets"] !== undefined &&
        applyScreenObject["proposedToilets"] !== "" &&
        applyScreenObject["proposedToilets"].match(/^[0-9]*$/i)
    ) { return true; } else { return false; }
}

export const validateFeildsForWater = (applyScreenObject) => {
    if (
        applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "" &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedTaps") &&
        applyScreenObject["proposedTaps"] !== undefined &&
        applyScreenObject["proposedTaps"] !== "" &&
        applyScreenObject["proposedTaps"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedPipeSize") &&
        applyScreenObject["proposedPipeSize"] !== undefined &&
        applyScreenObject["proposedPipeSize"] !== ""
    ) { return true; } else { return false; }
}

export const validateFeildsForSewerage = (applyScreenObject) => {
    if (
        applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "" &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedWaterClosets") &&
        applyScreenObject["proposedWaterClosets"] !== undefined &&
        applyScreenObject["proposedWaterClosets"] !== "" &&
        applyScreenObject["proposedWaterClosets"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedToilets") &&
        applyScreenObject["proposedToilets"] !== undefined &&
        applyScreenObject["proposedToilets"] !== "" &&
        applyScreenObject["proposedToilets"].match(/^[0-9]*$/i)
    ) { return true; } else { return false }
}

export const prepareDocumentsUploadData = (state, dispatch) => {
    let documents = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.ws-services-masters.Documents",
        []
    );
    documents = documents.filter(item => {
        return item.active;
    });
    let documentsContract = [];
    let tempDoc = {};
    documents.forEach(doc => {
        let card = {};
        card["code"] = doc.documentType;
        card["title"] = doc.documentType;
        card["cards"] = [];
        tempDoc[doc.documentType] = card;
    });

    documents.forEach(doc => {
        // Handle the case for multiple muildings
        let card = {};
        card["name"] = doc.code;
        card["code"] = doc.code;
        card["required"] = doc.required ? true : false;
        if (doc.hasDropdown && doc.dropdownData) {
            let dropdown = {};
            dropdown.label = "WS_SELECT_DOC_DD_LABEL";
            dropdown.required = true;
            dropdown.menu = doc.dropdownData.filter(item => {
                return item.active;
            });
            dropdown.menu = dropdown.menu.map(item => {
                return { code: item.code, label: getTransformedLocale(item.code) };
            });
            card["dropdown"] = dropdown;
        }
        tempDoc[doc.documentType].cards.push(card);
    });

    Object.keys(tempDoc).forEach(key => {
        documentsContract.push(tempDoc[key]);
    });

    dispatch(prepareFinalObject("documentsContract", documentsContract));
};

const parserFunction = (state) => {
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {})));
    let parsedObject = {
        roadCuttingArea: parseInt(queryObject.roadCuttingArea),
        meterInstallationDate: convertDateToEpoch(queryObject.meterInstallationDate),
        connectionExecutionDate: convertDateToEpoch(queryObject.connectionExecutionDate),
        proposedWaterClosets: parseInt(queryObject.proposedWaterClosets),
        proposedToilets: parseInt(queryObject.proposedToilets),
        noOfTaps: parseInt(queryObject.noOfTaps),
        noOfWaterClosets: parseInt(queryObject.noOfWaterClosets),
        noOfToilets: parseInt(queryObject.noOfToilets),
        proposedTaps: parseInt(queryObject.proposedTaps),
        meterId: parseInt(queryObject.meterId),
        additionalDetails: {
            initialMeterReading: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.initialMeterReading !== undefined
            ) ? parseInt(queryObject.additionalDetails.initialMeterReading) : null
        }
    }
    queryObject = { ...queryObject, ...parsedObject }
    return queryObject;
}

export const setDocsForEditFlow = async (state) => {
    const applicationDocuments = get(state.screenConfiguration.preparedFinalObject, "applyScreen.documents", []);
    let uploadedDocuments = {};
    let fileStoreIds = applicationDocuments && applicationDocuments.map(item => item.fileStoreId).join(",");
    const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    if (fileUrlPayload !== undefined && fileUrlPayload !== null) {
        applicationDocuments && applicationDocuments.forEach((item, index) => {
            uploadedDocuments[index] = [{
                fileName: (fileUrlPayload && fileUrlPayload[item.fileStoreId] &&
                    decodeURIComponent(
                        getFileUrl(fileUrlPayload[item.fileStoreId])
                            .split("?")[0]
                            .split("/")
                            .pop()
                            .slice(13)
                    )) || `Document - ${index + 1}`,
                fileStoreId: item.fileStoreId,
                fileUrl: Object.values(fileUrlPayload)[index]
            }];
        });
    }
    return uploadedDocuments;
};

export const setWSDocuments = async (payload, sourceJsonPath, businessService) => {
    const uploadedDocData = get(payload, sourceJsonPath);
    const fileStoreIds =
        uploadedDocData &&
        uploadedDocData
            .map((item) => {
                return item.fileStoreId;
            })
            .join(",");
    const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    const reviewDocData =
        uploadedDocData &&
        uploadedDocData.map((item, index) => {
            return {
                title: `${businessService}_${item.documentType}`.replace(".", "_") || "",
                link: (fileUrlPayload && fileUrlPayload[item.fileStoreId] && getFileUrl(fileUrlPayload[item.fileStoreId])) || "",
                linkText: "View",
                name:
                    (fileUrlPayload &&
                        fileUrlPayload[item.fileStoreId] &&
                        decodeURIComponent(
                            getFileUrl(fileUrlPayload[item.fileStoreId])
                                .split("?")[0]
                                .split("/")
                                .pop()
                                .slice(13)
                        )) ||
                    `Document - ${index + 1}`,
            };
        });
    return reviewDocData;
};

export const prefillDocuments = async (payload, destJsonPath, dispatch) => {
    let documentsUploadRedux = {};
    // const uploadedDocData = get(payload, sourceJsonPath);
    let uploadedDocs = await setWSDocuments(payload, "applyScreen.documents", "WS");
    documentsUploadRedux = uploadedDocs && uploadedDocs.length && uploadedDocs.map((item, key) => {
        let docUploadRedux = {};
        docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.applyScreen.documents[key].fileStoreId }] };
        let splittedString = payload.applyScreen.documents[key].documentType.split(".");
        if (splittedString[1] === "ADDRESSPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
        else if (splittedString[1] === "IDENTITYPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
        else { docUploadRedux[key].documentType = payload.applyScreen.documents[key].documentType; }
        docUploadRedux[key].id = payload.applyScreen.documents[key].id;
        docUploadRedux[key].isDocumentRequired = true;
        docUploadRedux[key].isDocumentTypeRequired = true;
        return docUploadRedux;
    });
    let docs = {};
    for (let i = 0; i < documentsUploadRedux.length; i++) {
        docs[i] = documentsUploadRedux[i][i];
    }
    dispatch(prepareFinalObject("documentsUploadRedux", docs));
    dispatch(prepareFinalObject(destJsonPath, docs));
};

export const applyForWaterOrSewerage = async (state, dispatch) => {
    if (get(state, "screenConfiguration.preparedFinalObject.applyScreen.water") && get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage")) {
        let response = await applyForBothWaterAndSewerage(state, dispatch);
        return response;
    } else if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        let response = await applyForSewerage(state, dispatch);
        return response;
    } else {
        let response = await applyForWater(state, dispatch);
        return response;
    }
}

export const applyForWater = async (state, dispatch) => {
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let method = waterId ? "UPDATE" : "CREATE";
    let queryObject = parserFunction(state);
    try {
        const tenantId = ifUserRoleExists("CITIZEN") ? "pb.amritsar" : getTenantId();
        let response;
        if (method === "UPDATE") {
            let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
            set(queryObjectForUpdate, "tenantId", tenantId);
            queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
            set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdate, "waterSource", (queryObjectForUpdate.waterSource + "." + queryObjectForUpdate.waterSubSource));
            queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
            await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdate });
            let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
            let searchResponse = await getSearchResults(searchQueryObject);
            dispatch(prepareFinalObject("WaterConnection", searchResponse.WaterConnection));
        } else {
            set(queryObject, "processInstance.action", "INITIATE")
            queryObject = findAndReplace(queryObject, "NA", null);
            response = await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: queryObject });
            dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
            setApplicationNumberBox(state, dispatch);
        }
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
}

export const applyForSewerage = async (state, dispatch) => {
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    let method = sewerId ? "UPDATE" : "CREATE";
    let queryObject = parserFunction(state);
    try {
        const tenantId = ifUserRoleExists("CITIZEN") ? "pb.amritsar" : getTenantId();
        let response;
        set(queryObject, "tenantId", tenantId);
        if (method === "UPDATE") {
            let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0]");
            queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
            set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdate, "connectionType", "Non Metered");
            queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
            await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: queryObjectForUpdate });
            let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
            let searchResponse = await getSearchResultsForSewerage(searchQueryObject, dispatch);
            dispatch(prepareFinalObject("SewerageConnection", searchResponse.SewerageConnections));
        } else {
            set(queryObject, "processInstance.action", "INITIATE");
            queryObject = findAndReplace(queryObject, "NA", null);
            response = await httpRequest("post", "/sw-services/swc/_create", "", [], { SewerageConnection: queryObject });
            dispatch(prepareFinalObject("SewerageConnection", response.SewerageConnections));
            setApplicationNumberBox(state, dispatch);
        }
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
}

export const applyForBothWaterAndSewerage = async (state, dispatch) => {
    let method;
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    if (waterId && sewerId) { method = "UPDATE" } else { method = "CREATE" };
    let queryObject = parserFunction(state);
    try {
        const tenantId = ifUserRoleExists("CITIZEN") ? "pb.amritsar" : getTenantId();
        let response;
        set(queryObject, "tenantId", tenantId);
        if (method === "UPDATE") {
            let queryObjectForUpdateWater = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
            let queryObjectForUpdateSewerage = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0]");
            queryObjectForUpdateWater = { ...queryObjectForUpdateWater, ...queryObject }
            queryObjectForUpdateWater = findAndReplace(queryObjectForUpdateWater, "NA", null);
            queryObjectForUpdateSewerage = { ...queryObjectForUpdateSewerage, ...queryObject }
            queryObjectForUpdateSewerage = findAndReplace(queryObjectForUpdateSewerage, "NA", null);
            set(queryObjectForUpdateWater, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdateWater, "waterSource", (queryObjectForUpdateWater.waterSource + "." + queryObjectForUpdateWater.waterSubSource));
            set(queryObjectForUpdateSewerage, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdateSewerage, "connectionType", "Non Metered");
            (await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdateWater }) &&
                await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: queryObjectForUpdateSewerage }));
            let searchQueryObjectWater = [
                { key: "tenantId", value: queryObjectForUpdateWater.tenantId },
                { key: "applicationNumber", value: queryObjectForUpdateWater.applicationNo }
            ];
            let searchQueryObjectSewerage = [
                { key: "tenantId", value: queryObjectForUpdateSewerage.tenantId },
                { key: "applicationNumber", value: queryObjectForUpdateSewerage.applicationNo }
            ];
            let searchResponse = await getSearchResults(searchQueryObjectWater);
            let sewerageResponse = await getSearchResultsForSewerage(searchQueryObjectSewerage, dispatch);
            dispatch(prepareFinalObject("WaterConnection", searchResponse.WaterConnection));
            dispatch(prepareFinalObject("SewerageConnection", sewerageResponse.SewerageConnections));
        } else {
            set(queryObject, "processInstance.action", "INITIATE");
            queryObject = findAndReplace(queryObject, "NA", null);
            response = await httpRequest("post", "/ws-services/wc/_create", "_create", [], { WaterConnection: queryObject });
            const sewerageResponse = await httpRequest("post", "/sw-services/swc/_create", "_create", [], { SewerageConnection: queryObject });
            dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
            dispatch(prepareFinalObject("SewerageConnection", sewerageResponse.SewerageConnections));
        }
        setApplicationNumberBox(state, dispatch);
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
}


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
    let applicationNumberWater = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationNo", null);
    let applicationNumberSewerage = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].applicationNo", null);
    if (applicationNumberSewerage && applicationNumberWater) {
        handleApplicationNumberDisplayForBoth(dispatch, applicationNumberWater, applicationNumberSewerage)
    } else if (applicationNumberWater) {
        handleApplicationNumberDisplay(dispatch, applicationNumberWater)
    } else {
        handleApplicationNumberDisplay(dispatch, applicationNumberSewerage)
    }
};

export const handleApplicationNumberDisplay = (dispatch, applicationNumber) => {
    dispatch(handleField("apply", "components.div.children.headerDiv.children.header.children.applicationNumberWater", "visible", true));
    dispatch(handleField("apply", "components.div.children.headerDiv.children.header.children.applicationNumberWater", "props.number", applicationNumber));
}

const handleApplicationNumberDisplayForBoth = (dispatch, applicationNumberWater, applicationNumberSewerage) => {
    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberWater",
            "visible",
            true
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberWater",
            "props.number",
            applicationNumberWater
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberSewerage",
            "visible",
            true
        )
    );

    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberSewerage",
            "props.number",
            applicationNumberSewerage
        )
    );
}

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
        // console.log(payload.MdmsRes)
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
    try {
        let connectionNo = getQueryArg(window.location.href, "connectionNos");
        let queryObject = [
            {
                key: "tenantId",
                value: JSON.parse(getUserInfo()).tenantId
            },
            { key: "offset", value: "0" },
            { key: "connectionNumber", value: connectionNo }
        ];
        const data = await getSearchResults(queryObject)
        let res = findAndReplace(data, null, "NA")
        let connectionType = res.WaterConnection[0].connectionType
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

    try {
        const response = await getConsumptionDetails(queryObject, dispatch);
        const data = findAndReplace(response, null, "NA");
        if (data && data.meterReadings && data.meterReadings.length > 0) {
            dispatch(prepareFinalObject("consumptionDetails", data.meterReadings));
            dispatch(
                prepareFinalObject("consumptionDetailsCount", data.meterReadings.length)
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
            key: "uuid",
            value: JSON.parse(getUserInfo()).uuid.toString()
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
        return findAndReplace(response, null, "NA");;
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
            key: "uuid",
            value: JSON.parse(getUserInfo()).uuid.toString()
        }
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
        return findAndReplace(response, null, "NA");;
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
                if (response.SewerageConnections[i].connectionNo !== undefined && response.SewerageConnections[i].connectionNo !== null) {
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
                        response.SewerageConnections[i].due = "NA"
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
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

export const findAndReplace = (obj, oldValue, newValue) => {
    Object.keys(obj).forEach(key => {
        if ((obj[key] instanceof Object) || (obj[key] instanceof Array)) findAndReplace(obj[key], oldValue, newValue)
        obj[key] = obj[key] === oldValue ? newValue : obj[key]
    })
    return obj
}

// api call to calculate water estimate
export const waterEstimateCalculation = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "ws-calculator/waterCalculator/_estimate",
            "_estimate",
            [],

            {
                isconnectionCalculation: false,
                CalculationCriteria: queryObject
            }
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

// api call to calculate sewerage estimate
export const swEstimateCalculation = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "sw-calculator/sewerageCalculator/_estimate",
            "_estimate",
            [],
            {
                isconnectionCalculation: false,
                CalculationCriteria: queryObject
            }
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};
// to download application 
export const downloadApp = async (wnsConnection, type, mode = "download") => {
    let tenantName = wnsConnection[0].property.tenantId;
    tenantName = tenantName.split('.')[1];

    wnsConnection[0].tenantName = tenantName.toUpperCase();
    const appNo = wnsConnection[0].applicationNo;
    let queryStr = [{ key: "tenantId", value: getTenantId().split('.')[0] }];
    let apiUrl, appService, estKey, queryObjectForEst
    if (wnsConnection[0].service === "WATER") {
        apiUrl = "ws-calculator/waterCalculator/_estimate";
        appService = "ws-applicationwater";
        queryObjectForEst = [{
            applicationNo: appNo,
            tenantId: getTenantId(),
            waterConnection: wnsConnection[0]
        }]

    } else {
        apiUrl = "sw-calculator/sewerageCalculator/_estimate";
        appService = "ws-applicationsewerage";
        queryObjectForEst = [{
            applicationNo: appNo,
            tenantId: getTenantId(),
            sewerageConnection: wnsConnection[0]
        }]
    }

    const DOWNLOADCONNECTIONDETAILS = {
        GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
        },
    };


    switch (type) {
        case 'application':
            queryStr.push({ key: "key", value: appService })
            break
        case 'estimateNotice':
            appService = "ws-estimationnotice";
            queryStr.push({ key: "key", value: appService });
            break;
        case 'sanctionLetter':
            appService = "ws-sanctionletter";
            queryStr.push({ key: "key", value: appService });
            break;
    }

    try {
        const estResponse = await httpRequest(
            "post",
            apiUrl,
            "_estimate",
            [],

            {
                isconnectionCalculation: false,
                CalculationCriteria: queryObjectForEst
            }
        );

        wnsConnection[0].totalAmount = estResponse.Calculation[0].totalAmount;
        wnsConnection[0].applicationFee = estResponse.Calculation[0].fee;
        wnsConnection[0].serviceFee = estResponse.Calculation[0].charge;
        wnsConnection[0].tax = estResponse.Calculation[0].taxAmount;

        let obj = {};
        if (type === 'estimateNotice' || type === 'sanctionLetter') {
            estResponse.Calculation[0].taxHeadEstimates.map((val) => {
                val.taxHeadCode = val.taxHeadCode.substring(3)
            });
            wnsConnection[0].pdfTaxhead = estResponse.Calculation[0].taxHeadEstimates;

            obj = {
                WnsConnection: wnsConnection
            }
        }

        if (type === 'application') {
            if (wnsConnection[0].service === "WATER") {
                obj = {
                    WaterConnection: wnsConnection
                }
            } else {
                obj = {
                    SewerageConnection: wnsConnection
                }
            }
        } 

        await httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, obj, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
            .then(res => {
                res.filestoreIds[0]
                if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                    res.filestoreIds.map(fileStoreId => {
                        downloadReceiptFromFilestoreID(fileStoreId, mode)
                    })
                } else {
                    console.log("Error In Download");
                }

            });
    } catch (exception) {
        alert('Some Error Occured while downloading!');
    }
}
