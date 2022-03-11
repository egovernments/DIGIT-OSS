import commonConfig from "config/common.js";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { disableField, enableField, getFileUrl, getFileUrlFromAPI, getQueryArg, getTransformedLocale, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import { getLocale, getLocalization, getTenantIdCommon, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { convertDateToEpoch, getTranslatedLabel } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";
export const serviceConst = {
    "WATER": "WATER",
    "SEWERAGE": "SEWERAGE"
}

export const pushTheDocsUploadedToRedux = async (state, dispatch) => {
    let reduxDocuments = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux", { });
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
                dispatch(prepareFinalObject("applyScreen.documents", uploadedDocs));
                let docArrayFromFileStore = await setDocsForEditFlow(state);
                uploadedDocs.forEach(obj => {
                    let element = obj.fileStoreId;
                    Object.keys(docArrayFromFileStore).forEach(resp => {
                        docArrayFromFileStore[resp].forEach(arr => { if (arr.fileStoreId === element) { obj.fileName = arr.fileName; } })
                    })
                })
                let docs = get(state, "screenConfiguration.preparedFinalObject");
                await setDocuments(docs, "applyScreen.documents", "UploadedDocs", dispatch, "WS");
                await setDocuments(docs, "applyScreen.documents", "DocumentsData", dispatch, "WS");
                let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", { }), "NA", null);
                let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
                dispatch(prepareFinalObject("applyScreen", applyScreenObj));
                if (getQueryArg(window.location.href, "action") === "edit") {
                    dispatch(prepareFinalObject("WaterConnection[0]", applyScreenObj));
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

export const getPropertyObj = async (waterConnection, locality, tenantId, isFromSearch) => {
    let uuidsArray = [];
    let uuids = "";
    let propertyArr = [];
    for (var i = 0; i < waterConnection.length; i++) {
        if (waterConnection[i].propertyId && waterConnection[i].propertyId !== null && waterConnection[i].propertyId !== "NA") {
            if (!uuidsArray.includes(waterConnection[i]['propertyId'])) {
                uuidsArray.push(waterConnection[i]['propertyId']);
                uuids += waterConnection[i]['propertyId'] + ",";
            }
            if (uuidsArray.length % 50 === 0 || (uuidsArray.length > 0 && i === (waterConnection.length - 1))) {
                let queryObject1 = [];
                uuids = uuids.substring(0, uuids.length - 1);
                if (process.env.REACT_APP_NAME === "Citizen") {
                    queryObject1 = [{ key: "propertyIds", value: uuids }];
                } else {
                    queryObject1 = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "propertyIds", value: uuids }];
                }

                if (locality) {
                    queryObject1.push({ key: "locality", value: locality })
                }
                if (tenantId) {
                    queryObject1.push({ key: "tenantId", value: tenantId })
                }
                if (!window.location.href.includes("propertyId") || isFromSearch) {
                    let payload = await getPropertyResultsWODispatch(queryObject1);
                    if (payload.Properties.length > 0) {
                        for (var j = 0; j < payload.Properties.length; j++) {
                            propertyArr[payload.Properties[j].propertyId] = payload.Properties[j]
                        }
                    }
                }
                uuids = "";
                uuidsArray = [];
            }
        } else {
            waterConnection[i].property = null;
        }
    }
    let tempPropertyObj = null
    if (Object.keys(propertyArr).length > 0) {
        for (var i = 0; i < waterConnection.length; i++) {
            if (waterConnection[i].propertyId && waterConnection[i].propertyId !== null && waterConnection[i].propertyId !== "NA") {
                if (propertyArr[waterConnection[i].propertyId]) {
                    tempPropertyObj = (propertyArr[waterConnection[i].propertyId]) ? propertyArr[waterConnection[i].propertyId] : null
                    waterConnection[i].property = tempPropertyObj;
                    waterConnection[i].tenantId = (tempPropertyObj && tempPropertyObj.tenantId) ? tempPropertyObj.tenantId : null;
                    tempPropertyObj = null;
                }
            }
        }
    }
    if (get(waterConnection[0], "property.owners")) {
        waterConnection[0].property.owners = waterConnection[0].property.owners.filter(owner => owner.status == "ACTIVE");
    }
    if (get(waterConnection[0], "property.units") == "NA" && get(waterConnection[0], "property.additionalDetails") && get(waterConnection[0], "property.additionalDetails.subUsageCategory")) {
        waterConnection[0].property.units = [];
        waterConnection[0].property.units.push({ usageCategory: get(waterConnection[0], "property.additionalDetails.subUsageCategory") })
    }
    return waterConnection;
}


export const getSearchResults = async (queryObject, filter = false) => {
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );
        if (response.WaterConnection && response.WaterConnection.length == 0) {
            return response;
        }
        let currentTime = new Date().getTime();
        if (filter) {
            response.WaterConnection = response.WaterConnection.filter(app => currentTime > app.dateEffectiveFrom && (app.applicationStatus == 'APPROVED' || app.applicationStatus == 'CONNECTION_ACTIVATED'));
            response.WaterConnection = response.WaterConnection.sort((row1, row2) => row2.auditDetails.createdTime - row1.auditDetails.createdTime);
        }

        let result = findAndReplace(response, null, "NA");
        result.WaterConnection[0].waterSourceSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource;
        let waterSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[0];
        let waterSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[1];
        result.WaterConnection[0].waterSource = waterSource;
        result.WaterConnection[0].waterSubSource = waterSubSource;
        result.WaterConnection = await getPropertyObj(result.WaterConnection);
        return result;
    } catch (error) { 

     }
};

export const getSearchResultsForSewerage = async (queryObject, dispatch, filter = false) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (response.SewerageConnections && response.SewerageConnections.length == 0) {
            dispatch(toggleSpinner());
            return response;
        }
        let currentTime = new Date().getTime();
        if (filter) {
            response.SewerageConnections = response.SewerageConnections.filter(app => currentTime > app.dateEffectiveFrom && (app.applicationStatus == 'APPROVED' || app.applicationStatus == 'CONNECTION_ACTIVATED'));
            response.SewerageConnections = response.SewerageConnections.sort((row1, row2) => row2.auditDetails.createdTime - row1.auditDetails.createdTime);
        }
        let result = findAndReplace(response, null, "NA");
        result.SewerageConnections = await getPropertyObj(result.SewerageConnections);
        dispatch(toggleSpinner());
        return result;
    } catch (error) {
        dispatch(toggleSpinner());
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
    }
};

//Workflow process instances for application status
export const getWorkFlowData = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "egov-workflow-v2/egov-wf/process/_search",
            "_search",
            queryObject
        );
        return response;
    } catch (error) {
    }
};

export const getWSMyResults = async (queryObject, consumer, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );

        if (response.WaterConnection.length > 0) {
            response.WaterConnection = await getPropertyObj(response.WaterConnection);
            for (let i = 0; i < response.WaterConnection.length; i++) {
                response.WaterConnection[i].service = _.capitalize(serviceConst.WATER)
                let consumerCode = "", bService = ""
                if (consumer === 'APPLICATION') {
                    consumerCode = response.WaterConnection[i].applicationNo
                    bService = 'WS.ONE_TIME_FEE'
                } else if (consumer === 'CONNECTION') {
                    consumerCode = response.WaterConnection[i].connectionNo
                    bService = 'WS'
                }
                if (consumerCode !== null && consumerCode !== undefined) {
                    try {
                        const data = await httpRequest(
                            "post",
                            `billing-service/bill/v2/_fetchbill`,
                            "_fetchbill",
                            [{
                                key: "consumerCode",
                                value:  consumerCode
                            },
                            {
                                key: "tenantId",
                                value:  response.WaterConnection[i].property.tenantId
                            },
                            {
                                key: "businessService",
                                value:  bService
                            }
                       ]
                        );
                        if (data && data !== undefined) {
                            if (data.Bill !== undefined && data.Bill.length > 0) {
                                if (data.Bill[0].totalAmount !== 0) {
                                    response.WaterConnection[i].due = data.Bill[0].totalAmount
                                } else {
                                    response.WaterConnection[i].due = "NA"
                                }
                            }

                        } else {
                            response.WaterConnection[i].due = 0
                        }

                    } catch (err) {
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
        if (response && response.Properties && response.Properties.length > 0) {
            for (var k = 0; k < response.Properties.length; k++) {
                if (response.Properties[k] && response.Properties[k].owners && response.Properties[k].owners.length > 0) {
                    if (response.Properties[k].ownershipCategory == "INDIVIDUAL.SINGLEOWNER" || response.Properties[k].ownershipCategory == "INDIVIDUAL.MULTIPLEOWNERS") {
                        for (var i = 0; i < response.Properties[k].owners.length; i++) {
                            response.Properties[k].owners[i].correspondenceAddress = response.Properties[k].owners[i].permanentAddress
                        }
                    }
                }
            }
        }
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
    }

};

export const getPropertyResultsWODispatch = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/property-services/property/_search",
            "_search",
            queryObject
        );
        if (response && response.Properties && response.Properties.length > 0) {
            for (var k = 0; k < response.Properties.length; k++) {
                if (response.Properties[k] && response.Properties[k].owners && response.Properties[k].owners.length > 0) {
                    if (response.Properties[k].ownershipCategory == "INDIVIDUAL.SINGLEOWNER" || response.Properties[k].ownershipCategory == "INDIVIDUAL.MULTIPLEOWNERS") {
                        for (var i = 0; i < response.Properties[k].owners.length; i++) {
                            response.Properties[k].owners[i].correspondenceAddress = response.Properties[k].owners[i].permanentAddress
                        }
                    }
                }
            }
        }
        return findAndReplace(response, null, "NA");
    } catch (error) {
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

export const validateFeildsForBothWaterAndSewerage = (applyScreenObject) => {
    let rValue = false;
    if (applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "") {
        rValue = true;
        if (isModifyMode()) {
            return rValue
        }
    }
    if (rValue &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedTaps") &&
        applyScreenObject["proposedTaps"] !== undefined &&
        applyScreenObject["proposedTaps"] !== "" &&
        applyScreenObject["proposedTaps"].toString().match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedPipeSize") &&
        applyScreenObject["proposedPipeSize"] !== undefined &&
        applyScreenObject["proposedPipeSize"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedWaterClosets") &&
        applyScreenObject["proposedWaterClosets"] !== undefined &&
        applyScreenObject["proposedWaterClosets"] !== "" &&
        applyScreenObject["proposedWaterClosets"].toString().match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedToilets") &&
        applyScreenObject["proposedToilets"] !== undefined &&
        applyScreenObject["proposedToilets"] !== "" &&
        applyScreenObject["proposedToilets"].toString().match(/^[0-9]*$/i)
    ) { return true; } else { return false; }
}

export const validateConnHolderDetails = (holderData) => {
    if (holderData.connectionHolders == null) {
        return true
    } else if (holderData.connectionHolders && holderData.connectionHolders.length > 0) {
        let holderOwners = holderData.connectionHolders;
        let valid = [];
        for (let i = 0; i < holderOwners.length; i++) {
            if (
                holderOwners[i].hasOwnProperty("mobileNumber") && holderOwners[i]['mobileNumber'] !== undefined && holderOwners[i]["mobileNumber"] !== "" &&
                holderOwners[i].hasOwnProperty("name") && holderOwners[i]['name'] !== undefined && holderOwners[i]["name"] !== "" &&
                holderOwners[i].hasOwnProperty("fatherOrHusbandName") && holderOwners[i]['fatherOrHusbandName'] !== undefined && holderOwners[i]["fatherOrHusbandName"] !== "" &&
                holderOwners[i].hasOwnProperty("correspondenceAddress") && holderOwners[i]['correspondenceAddress'] !== undefined && holderOwners[i]["correspondenceAddress"] !== "" &&
                holderOwners[i].hasOwnProperty("gender") &&
                holderOwners[i]["gender"] !== undefined &&
                holderOwners[i]["gender"] !== "" &&
                holderOwners[i].hasOwnProperty("ownerType") &&
                holderOwners[i]["ownerType"] !== undefined &&
                holderOwners[i]["ownerType"] !== "" &&
                holderOwners[i].hasOwnProperty("relationship") &&
                holderOwners[i]["relationship"] !== undefined &&
                holderOwners[i]["relationship"] !== ""
            ) { valid.push(1) } else { valid.push(0) }
        }
        if (valid.includes(0)) { return false; } else { return true; }
    }
}

export const validateFeildsForWater = (applyScreenObject) => {
    let rValue = false;
    if (applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "") {
        rValue = true;
        if (isModifyMode()) {
            return rValue
        }
    }
    if (rValue &&
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
        applyScreenObject["proposedTaps"].toString().match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedPipeSize") &&
        applyScreenObject["proposedPipeSize"] !== undefined &&
        applyScreenObject["proposedPipeSize"] !== ""
    ) { return true; } else { return false; }
}

export const validateFeildsForSewerage = (applyScreenObject) => {
    let rValue = false;
    if (applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "") {
        rValue = true;
        if (isModifyMode()) {
            return rValue
        }
    }
    if (rValue &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedWaterClosets") &&
        applyScreenObject["proposedWaterClosets"] !== undefined &&
        applyScreenObject["proposedWaterClosets"] !== "" &&
        applyScreenObject["proposedWaterClosets"].toString().match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedToilets") &&
        applyScreenObject["proposedToilets"] !== undefined &&
        applyScreenObject["proposedToilets"] !== "" &&
        applyScreenObject["proposedToilets"].toString().match(/^[0-9]*$/i)
    ) { return true; } else { return false }
}

export const handleMandatoryFeildsOfProperty = (applyScreenObject) => {
    let propertyObject = findAndReplace(applyScreenObject, "NA", null);
    if (
        propertyObject.hasOwnProperty("propertyId") && propertyObject['propertyId'] !== undefined && propertyObject["propertyId"] !== "" &&
        propertyObject.hasOwnProperty("propertyType") && propertyObject["propertyType"] !== undefined && propertyObject["propertyType"] !== "" &&
        propertyObject.hasOwnProperty("usageCategory") && propertyObject["usageCategory"] !== undefined && propertyObject["usageCategory"] !== "" &&
        propertyObject.hasOwnProperty("landArea") && propertyObject["landArea"] !== undefined && propertyObject["landArea"] !== "" &&
        // propertyObject.hasOwnProperty("rainWaterHarvesting") && propertyObject["rainWaterHarvesting"] !== undefined && propertyObject["rainWaterHarvesting"] !== "" &&
        propertyObject.hasOwnProperty("owners") && propertyObject["owners"] !== undefined && propertyObject["owners"] !== "" &&
        validatePropertyOwners(applyScreenObject) &&
        handleAddressObjectInProperty(applyScreenObject.address)
    ) { return true; } else { return false; }
}

const handleAddressObjectInProperty = (address) => {
    if (address !== undefined && address !== null && address !== { }) {
        if (
            address.hasOwnProperty("city") && address['city'] !== undefined && address["city"] !== "" && address["city"] !== null &&
            address.hasOwnProperty("doorNo") && address["doorNo"] !== undefined && address["doorNo"] !== "" && address["doorNo"] !== null &&
            address.hasOwnProperty("locality") && address.locality.name !== undefined && address.locality.name !== "" && address.locality.name !== null
        ) { return true; } else { return false; }
    }
}

const validatePropertyOwners = (applyScreenObject) => {
    if (applyScreenObject.owners && applyScreenObject.owners.length > 0) {
        let owners = applyScreenObject.owners;
        let valid = [];
        for (let i = 0; i < owners.length; i++) {
            if (
                owners[i].hasOwnProperty("mobileNumber") && owners[i]['mobileNumber'] !== undefined && owners[i]["mobileNumber"] !== "" &&
                owners[i].hasOwnProperty("name") && owners[i]['name'] !== undefined && owners[i]["name"] !== "" &&
                owners[i].hasOwnProperty("fatherOrHusbandName") && owners[i]['fatherOrHusbandName'] !== undefined && owners[i]["fatherOrHusbandName"] !== "" &&
                owners[i].hasOwnProperty("correspondenceAddress") && owners[i]['correspondenceAddress'] !== undefined && owners[i]["correspondenceAddress"] !== ""
            ) { valid.push(1) } else { valid.push(0) }
        }
        if (valid.includes(0)) { return false; } else { return true; }
    }
}

export const prepareDocumentsUploadData = (state, dispatch) => {
    let currentDoc = (isModifyMode()) ? 'ModifyConnectionDocuments' : 'Documents';
    let documents = get(
        state,
        `screenConfiguration.preparedFinalObject.applyScreenMdmsData.ws-services-masters.${currentDoc}`,
        []
    );
    documents = documents.filter(item => {
        return item.active;
    });
    let documentsContract = [];
    let tempDoc = { };
    documents.forEach(doc => {
        let card = { };
        card["code"] = doc.documentType;
        card["title"] = doc.documentType;
        card["cards"] = [];
        tempDoc[doc.documentType] = card;
    });

    documents.forEach(doc => {
        // Handle the case for multiple muildings
        let card = { };
        card["name"] = doc.code;
        card["code"] = doc.code;
        card["required"] = doc.required ? true : false;
        if (doc.hasDropdown && doc.dropdownData) {
            let dropdown = { };
            dropdown.label = "WS_SELECT_DOC_DD_LABEL";
            dropdown.required = true;
            dropdown.menu = doc.dropdownData.filter(item => {
                return item.active;
            });
            dropdown.menu = dropdown.menu.map(item => {
                return { code: item.code, label: getTransformedLocale(item.code), name: getTransformedLocale(item.code) };
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
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "applyScreen", { })));
    let parsedObject = {
        roadCuttingArea: parseInt(queryObject.roadCuttingArea),
        meterInstallationDate: convertDateToEpoch(queryObject.meterInstallationDate),
        connectionExecutionDate: convertDateToEpoch(queryObject.connectionExecutionDate),
        dateEffectiveFrom: convertDateToEpoch(queryObject.dateEffectiveFrom),
        proposedWaterClosets: parseInt(queryObject.proposedWaterClosets),
        proposedToilets: parseInt(queryObject.proposedToilets),
        noOfTaps: parseInt(queryObject.noOfTaps),
        noOfWaterClosets: parseInt(queryObject.noOfWaterClosets),
        noOfToilets: parseInt(queryObject.noOfToilets),
        proposedTaps: parseInt(queryObject.proposedTaps),
        propertyId: (queryObject.property) ? queryObject.property.propertyId : null,
        additionalDetails: {
            initialMeterReading: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.initialMeterReading !== undefined
            ) ? parseFloat(queryObject.additionalDetails.initialMeterReading) : null,
            detailsProvidedBy: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.detailsProvidedBy !== undefined &&
                queryObject.additionalDetails.detailsProvidedBy !== null
            ) ? queryObject.additionalDetails.detailsProvidedBy : "",
        }
    }
    queryObject = { ...queryObject, ...parsedObject }
    return queryObject;
}

export const prepareDocumentsUploadRedux = async (state, dispatch) => {
    const { documentsUploadRedux } = state.screenConfiguration.preparedFinalObject;
    let documentsList = get(state, "screenConfiguration.preparedFinalObject.documentsContract", []);
    let index = 0;
    documentsList.forEach(docType => {
        docType.cards &&
            docType.cards.forEach(card => {
                if (card.subCards) {
                    card.subCards.forEach(subCard => {
                        let oldDocType = get(
                            documentsUploadRedux,
                            `[${index}].documentType`
                        );
                        let oldDocCode = get(
                            documentsUploadRedux,
                            `[${index}].documentCode`
                        );
                        let oldDocSubCode = get(
                            documentsUploadRedux,
                            `[${index}].documentSubCode`
                        );
                        if (
                            oldDocType != docType.code ||
                            oldDocCode != card.name ||
                            oldDocSubCode != subCard.name
                        ) {
                            documentsUploadRedux[index] = {
                                documentType: docType.code,
                                documentCode: card.name,
                                documentSubCode: subCard.name
                            };
                        }
                        index++;
                    });
                } else {
                    let oldDocType = get(documentsUploadRedux, `[${index}].documentType`);
                    let oldDocCode = get(documentsUploadRedux, `[${index}].documentCode`);
                    if (oldDocType != docType.code || oldDocCode != card.name) {
                        documentsUploadRedux[index] = {
                            documentType: docType.code,
                            documentCode: card.name,
                            isDocumentRequired: card.required,
                            isDocumentTypeRequired: card.dropdown
                                ? card.dropdown.required
                                : false
                        };
                    }
                }
                index++;
            });
    });
    prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
};

export const setDocsForEditFlow = async (state) => {
    const applicationDocuments = get(state.screenConfiguration.preparedFinalObject, "applyScreen.documents", []);
    let uploadedDocuments = { };
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
    if (uploadedDocData !== "NA" && uploadedDocData.length > 0) {
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
    }
};

export const downloadAndPrintForNonApply = async (state, dispatch) => {
    let documentPath;
    const {
        WaterConnection,
        SewerageConnection
    } = state.screenConfiguration.preparedFinalObject;
    if (
        (WaterConnection.length > 0 &&
            SewerageConnection.length > 0) ||
        WaterConnection.length > 0
    ) {
        documentPath = 'WaterConnection[0].documents';
    } else if (SewerageConnection.length > 0) {
        documentPath = 'SewerageConnection[0].documents';
    }
    await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        documentPath,
        "DocumentsData",
        dispatch,
        "WS"
    );
}

export const prepareDocUploadRedux = async (state, dispatch) => {
    let documentsUploadRedux = { }, uploadedDocs = [];
    let payload = state.screenConfiguration.preparedFinalObject;
    let documentPath;
    const {
        WaterConnection,
        SewerageConnection
    } = state.screenConfiguration.preparedFinalObject;
    if (
        (
            WaterConnection !== undefined &&
            WaterConnection.length > 0 &&
            SewerageConnection !== undefined &&
            SewerageConnection.length > 0
        ) ||
        (
            WaterConnection !== undefined &&
            WaterConnection.length > 0
        )
    ) {
        documentPath = payload.WaterConnection[0].documents;
        uploadedDocs = await setWSDocuments(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].documents", "WS");
    } else if (SewerageConnection !== undefined && SewerageConnection.length > 0) {
        documentPath = payload.SewerageConnection[0].documents;
        uploadedDocs = await setWSDocuments(state.screenConfiguration.preparedFinalObject, "SewerageConnection[0].documents", "WS");
    }
    if (uploadedDocs !== undefined && uploadedDocs !== null && uploadedDocs.length > 0) {
        documentsUploadRedux = uploadedDocs && uploadedDocs.length && uploadedDocs.map((item, key) => {
            let docUploadRedux = { };
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: documentPath[key].fileStoreId }] };
            let splittedString = documentPath[key].documentType.split(".");
            if (splittedString[1] === "ADDRESSPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else if (splittedString[1] === "IDENTITYPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else { docUploadRedux[key].documentType = documentPath[key].documentType; }
            docUploadRedux[key].id = documentPath[key].id;
            docUploadRedux[key].isDocumentRequired = true;
            docUploadRedux[key].isDocumentTypeRequired = true;
            return docUploadRedux;
        });
        let docs = { };
        for (let i = 0; i < documentsUploadRedux.length; i++) {
            docs[i] = documentsUploadRedux[i][i];
        }
        dispatch(prepareFinalObject("documentsUploadRedux", docs))
    }
};

export const prefillDocuments = async (payload, destJsonPath, dispatch) => {
    let documentsUploadRedux = { };
    // const uploadedDocData = get(payload, sourceJsonPath);
    let uploadedDocs = await setWSDocuments(payload, "applyScreen.documents", "WS");
    if (uploadedDocs !== undefined && uploadedDocs !== null && uploadedDocs.length > 0) {
        documentsUploadRedux = uploadedDocs && uploadedDocs.length && uploadedDocs.map((item, key) => {
            let docUploadRedux = { };
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.applyScreen.documents[key].fileStoreId }] };
            let splittedString = payload.applyScreen.documents[key].documentType.split(".");
            if (splittedString[1] === "ADDRESSPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else if (splittedString[1] === "IDENTITYPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else {
                docUploadRedux[key].dropdown = { value: payload.applyScreen.documents[key].documentType };
            }
            docUploadRedux[key].documentType = payload.applyScreen.documents[key].documentType;
            docUploadRedux[key].id = payload.applyScreen.documents[key].id;
            docUploadRedux[key].isDocumentRequired = true;
            docUploadRedux[key].isDocumentTypeRequired = true;
            return docUploadRedux;
        });
        let docs = { };
        for (let i = 0; i < documentsUploadRedux.length; i++) {
            docs[i] = documentsUploadRedux[i][i];
        }

        var tempDoc = { }, docType = "";
        var dList = (isModifyMode()) ? payload.applyScreenMdmsData['ws-services-masters'].ModifyConnectionDocuments : payload.applyScreenMdmsData['ws-services-masters'].Documents;
        if (dList !== undefined && dList !== null) {
            dList = (isModifyMode()) ? getDisplayDocFormat(dList) : dList;
            for (var i = 0; i < dList.length; i++) {
                for (var key in docs) {
                    docType = docs[key].documentType
                    if (dList[i].code === docType.substring(0, docType.lastIndexOf("."))) {
                        tempDoc[i] = docs[key];
                    } else if (dList[i].code === docType) {
                        tempDoc[i] = docs[key];
                    }
                }
            }
        } else {
            tempDoc = docs;
        }

        dispatch(prepareFinalObject("documentsUploadRedux", tempDoc));
        dispatch(prepareFinalObject(destJsonPath, tempDoc));
    }
};
export const dataExists = (code, temp) => {
    return temp.some(function (el) {
        return el.code === code;
    });
}
export const checkValue = (i, documentTypea, temp, dataList) => {
    for (var j = i; j < dataList.length; j++) {
        let isCheck = dataExists(dataList[j].code, temp);
        if (documentTypea == dataList[j].documentType && !isCheck) {
            return dataList[j];
        }
    }
}
export const getDisplayDocFormat = (dataList) => {
    var tempDoc = [];
    for (var i = 0; i < dataList.length; i++) {
        if (i == 0) {
            tempDoc[i] = dataList[i];
        } else {
            let getNextDoc = checkValue(i, tempDoc[i - 1].documentType, tempDoc, dataList);
            if (getNextDoc) {
                tempDoc[i] = getNextDoc;
            } else {
                tempDoc[i] = dataList.find(function (el) {
                    return tempDoc.find((o, i) => { return (el.code != o.code && !dataExists(el.code, tempDoc)) });
                });
            }
        }
    }
    return tempDoc;
}
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
    let queryObject = parserFunction(state);
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let method = waterId ? "UPDATE" : "CREATE";
    try {
        const tenantId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.tenantId");
        let response;
        queryObject.tenantId = (queryObject && queryObject.property && queryObject.property.tenantId) ? queryObject.property.tenantId : null;
        if (method === "UPDATE") {
            queryObject.additionalDetails.appCreatedDate = get(
                state.screenConfiguration.preparedFinalObject,
                "WaterConnection[0].additionalDetails.appCreatedDate"
            )
            let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
            let waterSource = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceType", null);
            let waterSubSource = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSubSource", null);
            queryObjectForUpdate.waterSource = queryObjectForUpdate.waterSource ? queryObjectForUpdate.waterSource : waterSource;
            queryObjectForUpdate.waterSubSource = queryObjectForUpdate.waterSubSource ? queryObjectForUpdate.waterSubSource : waterSubSource;
            set(queryObjectForUpdate, "tenantId", tenantId);
            queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
            set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdate, "waterSource", getWaterSource(queryObjectForUpdate.waterSource, queryObjectForUpdate.waterSubSource));
            disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            disableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (typeof queryObjectForUpdate.additionalDetails !== 'object') {
                queryObjectForUpdate.additionalDetails = { };
            }
            queryObjectForUpdate.additionalDetails.locality = queryObjectForUpdate.property.address.locality.code;
            queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
            await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdate });
            let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
            let searchResponse = await getSearchResults(searchQueryObject);
            dispatch(prepareFinalObject("WaterConnection", searchResponse.WaterConnection));
            enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        } else {
            disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            disableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (typeof queryObject.additionalDetails !== 'object') {
                queryObject.additionalDetails = { };
            }
            queryObject.additionalDetails.locality = queryObject.property.address.locality.code;
            set(queryObject, "processInstance.action", "INITIATE")
            queryObject = findAndReplace(queryObject, "NA", null);
            if (isModifyMode()) {
                set(queryObject, "waterSource", getWaterSource(queryObject.waterSource, queryObject.waterSubSource));
            }
            set(queryObject, "channel",process.env.REACT_APP_NAME === "Citizen" ?"CITIZEN":"CFC_COUNTER");
            response = await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: queryObject });
            dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
            enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            enableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (isModifyMode()) {
                response.WaterConnection = await getPropertyObj(response.WaterConnection, "", "", true);
                response.WaterConnection[0].water = true;
                let waterSource = response.WaterConnection[0].waterSource.split(".");
                response.WaterConnection[0].waterSource = waterSource[0];
                response.WaterConnection[0].service = "Water";
                response.WaterConnection[0].waterSubSource = waterSource[1];
                dispatch(prepareFinalObject("applyScreen", response.WaterConnection[0]));
                dispatch(prepareFinalObject("modifyAppCreated", true));
            }
            if (!isModifyMode()) {
                setApplicationNumberBox(state, dispatch);
            }
        }
        return true;
    } catch (error) {
        enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
        enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        return false;
    }
}

export const applyForSewerage = async (state, dispatch) => {
    let queryObject = parserFunction(state);
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    let method = sewerId ? "UPDATE" : "CREATE";
    try {
        const tenantId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].property.tenantId");
        let response;
        set(queryObject, "tenantId", tenantId);
        queryObject.tenantId = (queryObject && queryObject.property && queryObject.property.tenantId) ? queryObject.property.tenantId : null;
        if (method === "UPDATE") {
            queryObject.additionalDetails.appCreatedDate = get(
                state.screenConfiguration.preparedFinalObject,
                "SewerageConnection[0].additionalDetails.appCreatedDate"
            )
            let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0]");
            queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
            set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdate, "connectionType", "Non Metered");
            disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            disableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (typeof queryObjectForUpdate.additionalDetails !== 'object') {
                response.SewerageConnection[0].additionalDetails = { };
            }
            queryObjectForUpdate.additionalDetails.locality = queryObjectForUpdate.property.address.locality.code;
            queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
            await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: queryObjectForUpdate });
            let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
            let searchResponse = await getSearchResultsForSewerage(searchQueryObject, dispatch);
            dispatch(prepareFinalObject("SewerageConnection", searchResponse.SewerageConnections));
            enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        } else {
            disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            disableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (typeof queryObject.additionalDetails !== 'object') {
                response.SewerageConnection[0].additionalDetails = { };
            }
            queryObject.additionalDetails.locality = queryObject.property.address.locality.code;
            set(queryObject, "processInstance.action", "INITIATE");
            queryObject = findAndReplace(queryObject, "NA", null);
            set(queryObject, "channel",process.env.REACT_APP_NAME === "Citizen" ?"CITIZEN":"CFC_COUNTER");
            response = await httpRequest("post", "/sw-services/swc/_create", "", [], { SewerageConnection: queryObject });
            dispatch(prepareFinalObject("SewerageConnection", response.SewerageConnections));
            enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            enableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (isModifyMode()) {
                response.SewerageConnections = await getPropertyObj(response.SewerageConnections, "", "", true);
                response.SewerageConnections[0].sewerage = true;
                response.SewerageConnections[0].service = "Sewerage";
                dispatch(prepareFinalObject("applyScreen", response.SewerageConnections[0]));
                dispatch(prepareFinalObject("modifyAppCreated", true));
            }
            if (!isModifyMode()) {
                setApplicationNumberBox(state, dispatch);
            }
        }
        return true;
    } catch (error) {
        enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
        enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        return false;
    }
}

export const applyForBothWaterAndSewerage = async (state, dispatch) => {
    let method;
    let queryObject = parserFunction(state);
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    if (waterId && sewerId) { method = "UPDATE" } else { method = "CREATE" };
    try {
        const tenantId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.tenantId");
        let response;
        set(queryObject, "tenantId", tenantId);
        queryObject.tenantId = (queryObject && queryObject.property && queryObject.property.tenantId) ? queryObject.property.tenantId : null;
        if (method === "UPDATE") {
            let queryObjectForUpdateWater = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
            let waterSource = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceType", null);
            let waterSubSource = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSubSource", null);
            queryObjectForUpdateWater.waterSource = queryObjectForUpdateWater.waterSource ? queryObjectForUpdateWater.waterSource : waterSource;
            queryObjectForUpdateWater.waterSubSource = queryObjectForUpdateWater.waterSubSource ? queryObjectForUpdateWater.waterSubSource : waterSubSource;
            let queryObjectForUpdateSewerage = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0]");
            queryObjectForUpdateWater = { ...queryObjectForUpdateWater, ...queryObject }
            queryObjectForUpdateWater = findAndReplace(queryObjectForUpdateWater, "NA", null);
            queryObjectForUpdateSewerage = { ...queryObjectForUpdateSewerage, ...queryObject }
            queryObjectForUpdateSewerage = findAndReplace(queryObjectForUpdateSewerage, "NA", null);
            set(queryObjectForUpdateWater, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdateWater, "waterSource", getWaterSource(queryObjectForUpdateWater.waterSource, queryObjectForUpdateWater.waterSubSource));
            set(queryObjectForUpdateSewerage, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdateSewerage, "connectionType", "Non Metered");

            set(
                queryObjectForUpdateSewerage,
                "additionalDetails.appCreatedDate", get(
                    state.screenConfiguration.preparedFinalObject,
                    "SewerageConnection[0].additionalDetails.appCreatedDate"
                )
            );
            set(
                queryObjectForUpdateWater,
                "additionalDetails.appCreatedDate", get(
                    state.screenConfiguration.preparedFinalObject,
                    "WaterConnection[0].additionalDetails.appCreatedDate"
                )
            );
            disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            disableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (typeof queryObjectForUpdateWater.additionalDetails !== 'object') {
                queryObjectForUpdateWater.additionalDetails = { };
            }
            queryObjectForUpdateWater.additionalDetails.locality = queryObjectForUpdateWater.property.address.locality.code;
            if (typeof queryObjectForUpdateSewerage.additionalDetails !== 'object') {
                queryObjectForUpdateSewerage.additionalDetails = { };
            }
            queryObjectForUpdateSewerage.additionalDetails.locality = queryObjectForUpdateSewerage.property.address.locality.code;
            await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdateWater });
            await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: queryObjectForUpdateSewerage });
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
            enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        } else {
            disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            disableField('apply', "components.div.children.footer.children.payButton", dispatch);
            if (typeof queryObject.additionalDetails !== 'object') {
                queryObject.additionalDetails = { };
            }
            queryObject.additionalDetails.locality = queryObject.property.address.locality.code;
            set(queryObject, "processInstance.action", "INITIATE");
            set(queryObject, "channel",process.env.REACT_APP_NAME === "Citizen" ?"CITIZEN":"CFC_COUNTER");
            queryObject = findAndReplace(queryObject, "NA", null);
            response = await httpRequest("post", "/ws-services/wc/_create", "_create", [], { WaterConnection: queryObject });
            const sewerageResponse = await httpRequest("post", "/sw-services/swc/_create", "_create", [], { SewerageConnection: queryObject });
            dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
            dispatch(prepareFinalObject("SewerageConnection", sewerageResponse.SewerageConnections));
            enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
            enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        }
        if (!isModifyMode()) {
            setApplicationNumberBox(state, dispatch);
        }
        return true;
    } catch (error) {
        enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
        enableField('apply', "components.div.children.footer.children.payButton", dispatch);
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
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
        let data = payload.MdmsRes['ws-services-calculation'].MeterStatus.map(ele => {
            return { code: ele }
        })
        payload.MdmsRes['ws-services-calculation'].MeterStatus = data;
        dispatch(prepareFinalObject("meterMdmsData", payload.MdmsRes));

    } catch (e) {
    }
};
export const getMdmsDataForAutopopulated = async (dispatch) => {
    try {
        let connectionNo = getQueryArg(window.location.href, "connectionNos");
        let queryObject = [
            {
                key: "tenantId",
                value: getTenantIdCommon()
            },
            { key: "offset", value: "0" },
            { key: "connectionNumber", value: connectionNo }
        ];
        const data = await getSearchResults(queryObject)
        let res = findAndReplace(data, null, "NA")
        let connectionType = res.WaterConnection[0].connectionType
        let mdmsBody = {
            MdmsCriteria: {
                tenantId: commonConfig.tenantId,
                "moduleDetails": [
                    {
                        "moduleName": "ws-services-masters",
                        "masterDetails": [
                            {
                                "name": "billingPeriod",
                                "filter": "*"
                            }
                        ]
                    }
                ]
            }
        };
        try {
            let payload = await httpRequest(
                "post",
                "/egov-mdms-service/v1/_search",
                "_search",
                [],
                mdmsBody
            );

            let billingCycle;
            payload.MdmsRes['ws-services-masters'].billingPeriod.map((x) => {
                if (x.connectionType === connectionType) {
                    billingCycle = x.billingCycle
                }
            })
            dispatch(prepareFinalObject("billingCycle", billingCycle));
        } catch (e) {
        }
    } catch (e) {
    }
}

export const getMeterReadingData = async (dispatch) => {
    let queryObject = [
        {
            key: "tenantId",
            value: getTenantIdCommon()
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
    }
};

export const getPastPaymentsForWater = async (dispatch) => {
    dispatch(toggleSpinner());

    let queryObjectForWS = [
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber
        },
        {
            key: "tenantId",
            value: getTenantIdCommon()
        },
        {
            key: "searchType",
            value: "CONNECTION"
        }
    ];

    // let queryObject = [
    //     {
    //         key: "tenantId",
    //         value: getTenantIdCommon()
    //     },
    //     // {
    //     //     key: "businessService",
    //     //     value: "WS"
    //     // },
    //     {
    //         key: "uuid",
    //         value: JSON.parse(getUserInfo()).uuid.toString()
    //     },
    // ];
    try {

        const responseOfWS = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObjectForWS
        );
        const consumerCodesList = [];
        if(responseOfWS && responseOfWS.WaterConnection) {
            responseOfWS.WaterConnection.map(data => {
                if(data.connectionNo)consumerCodesList.push(data.connectionNo);
            });
        }

        let uniqueConsumberCodes = consumerCodesList.filter((item, i, ar) => ar.indexOf(item) === i);

        let queryObject = [
            {
                key: "tenantId",
                value: getTenantIdCommon()
            },
            {
                key: "consumerCodes",
                value: uniqueConsumberCodes.join(',')
            }
        ];

        const response = await httpRequest(
            "post",
            getPaymentSearchAPI("WS", true),
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        if (response && response.Payments) {
            const userNumber = Number(JSON.parse(getUserInfo()).mobileNumber);
            const filteredArray = response.Payments.filter(data => data.mobileNumber == userNumber);
            // dispatch(prepareFinalObject("pastPaymentsForWater", response.Payments));
            dispatch(prepareFinalObject("pastPaymentsForWater", filteredArray));
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
    // let queryObject = [
    //     {
    //         key: "tenantId",
    //         value: getTenantIdCommon()
    //     },
    //     // {
    //     //     key: "businessService",
    //     //     value: "SW"
    //     // },
    //     {
    //         key: "uuid",
    //         value: JSON.parse(getUserInfo()).uuid.toString()
    //     }
    // ];
    let queryObjectForSW = [
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber
        },
        {
            key: "tenantId",
            value: getTenantIdCommon()
        },
        {
            key: "searchType",
            value: "CONNECTION"
        }
    ];
    try {
        const responseOfSW = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObjectForSW
        );
        const consumerCodesList = [];
        if(responseOfSW && responseOfSW.SewerageConnections) {
            responseOfSW.SewerageConnections.map(data => {
                if(data.connectionNo)consumerCodesList.push(data.connectionNo);
            });
        }

        let uniqueConsumberCodes = consumerCodesList.filter((item, i, ar) => ar.indexOf(item) === i);

        let queryObject = [
            {
                key: "tenantId",
                value: getTenantIdCommon()
            },
            {
                key: "consumerCodes",
                value: uniqueConsumberCodes.join(',')
            }
        ];
        const response = await httpRequest(
            "post",
            getPaymentSearchAPI("SW", true),
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        if (response && response.Payments) {
            const userNumber = Number(JSON.parse(getUserInfo()).mobileNumber);
            const filteredArray = response.Payments.filter(data => data.mobileNumber == userNumber)
            // dispatch(prepareFinalObject("pastPaymentsForSewerage", response.Payments));
            dispatch(prepareFinalObject("pastPaymentsForSewerage", filteredArray));
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
        dispatch(prepareFinalObject("metereading", { }));
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

export const wsDownloadConnectionDetails = (receiptQueryString, mode) => {
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
        case serviceConst.WATER:
            try {
                httpRequest("post", FETCHCONNECTIONDETAILS.GET.URL, FETCHCONNECTIONDETAILS.GET.ACTION, receiptQueryString).then(async (payloadReceiptDetails) => {
                    const queryStr = [
                        { key: "key", value: "ws-consolidatedacknowlegment" },
                        { key: "tenantId", value: commonConfig.tenantId }
                    ]

                    payloadReceiptDetails.WaterConnection = await getPropertyObj(payloadReceiptDetails.WaterConnection);
                    if (payloadReceiptDetails.WaterConnection[0].property.additionalDetails.isRainwaterHarvesting !== undefined && payloadReceiptDetails.WaterConnection[0].property.additionalDetails.isRainwaterHarvesting !== null) {
                        if (payloadReceiptDetails.WaterConnection[0].property.additionalDetails.isRainwaterHarvesting === true) {
                            payloadReceiptDetails.WaterConnection[0].property.additionalDetails.isRainwaterHarvesting = 'SCORE_YES'
                        } else {
                            payloadReceiptDetails.WaterConnection[0].property.additionalDetails.isRainwaterHarvesting = 'SCORE_NO'
                        }
                    }
                    httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, { WaterConnection: payloadReceiptDetails.WaterConnection }, { 'Accept': commonConfig.singleInstance ? 'application/pdf,application/json': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            downloadReceiptFromFilestoreID(res.filestoreIds[0], mode);
                        });
                })

            } catch (exception) {
                alert('Some Error Occured while downloading!');
            }
            break;
        case serviceConst.SEWERAGE:
            try {
                httpRequest("post", FETCHSWCONNECTIONDETAILS.GET.URL, FETCHSWCONNECTIONDETAILS.GET.ACTION, receiptQueryString).then(async (payloadReceiptDetails) => {
                    const queryStr = [
                        { key: "key", value: "ws-consolidatedsewerageconnection" },
                        { key: "tenantId", value: commonConfig.tenantId }
                    ]
                    payloadReceiptDetails.SewerageConnections = await getPropertyObj(payloadReceiptDetails.SewerageConnections);
                    httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, { SewerageConnections: payloadReceiptDetails.SewerageConnections }, { 'Accept': commonConfig.singleInstance ? 'application/pdf,application/json': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            downloadReceiptFromFilestoreID(res.filestoreIds[0], mode);
                        });
                })

            } catch (exception) {
                alert('Some Error Occured while downloading!');
            }
            break;
    }
}


export const getSWMyResults = async (queryObject, consumer, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (response.SewerageConnections.length > 0) {
            response.SewerageConnections = await getPropertyObj(response.SewerageConnections);
            for (let i = 0; i < response.SewerageConnections.length; i++) {
                response.SewerageConnections[i].service = _.capitalize(serviceConst.SEWERAGE)
                let consumerCode = "", bService = ""
                if (consumer === 'APPLICATION') {
                    consumerCode = response.SewerageConnections[i].applicationNo
                    bService = 'SW.ONE_TIME_FEE'
                } else if (consumer === 'CONNECTION') {
                    consumerCode = response.SewerageConnections[i].connectionNo
                    bService = 'SW'
                }
                if (consumerCode !== undefined && consumerCode !== null) {
                    try {
                        const data = await httpRequest(
                            "post",
                            `billing-service/bill/v2/_fetchbill?consumerCode=${consumerCode}&tenantId=${response.SewerageConnections[i].property.tenantId}&businessService=${bService}`,
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
    }

};

export const billingPeriodMDMS = (toPeriod, payloadbillingPeriod, service) => {
    const connectionType = getQueryArg(window.location.href, "connectionType");
    let demandExipryDate = 0;
    if (service === serviceConst.WATER &&
        payloadbillingPeriod['ws-services-masters'] &&
        payloadbillingPeriod['ws-services-masters'].billingPeriod !== undefined &&
        payloadbillingPeriod['ws-services-masters'].billingPeriod !== null) {
        payloadbillingPeriod['ws-services-masters'].billingPeriod.forEach(obj => {
            if (obj.connectionType === 'Metered' && connectionType === "Metered") {
                demandExipryDate = obj.demandExpiryDate;
            } else if (obj.connectionType === 'Non Metered' && connectionType === "Non Metered") {
                demandExipryDate = obj.demandExpiryDate;
            }
        });
    }

    if (service === serviceConst.SEWERAGE &&
        payloadbillingPeriod['sw-services-calculation'] &&
        payloadbillingPeriod['sw-services-calculation'].billingPeriod !== undefined &&
        payloadbillingPeriod['sw-services-calculation'].billingPeriod !== null) {
        payloadbillingPeriod['sw-services-calculation'].billingPeriod.forEach(obj => {
            if (obj.connectionType === 'Non Metered') {
                demandExipryDate = obj.demandExpiryDate;
            }
        });
    }
    return toPeriod + demandExipryDate;
}

export const downloadBill = (receiptQueryString, mode) => {
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

    const requestBody = {
        "MdmsCriteria": {
            "tenantId": getTenantIdCommon(),
            "moduleDetails": [
                { "moduleName": "ws-services-masters", "masterDetails": [{ "name": "billingPeriod" }] },
                { "moduleName": "sw-services-calculation", "masterDetails": [{ "name": "billingPeriod" }] }
            ]
        }
    }

    try {

        httpRequest("post", FETCHBILL.GET.URL, FETCHBILL.GET.ACTION, receiptQueryString).then((payloadReceiptDetails) => {
            const queryStr = [
                { key: "key", value: "ws-bill" },
                { key: "tenantId", value: commonConfig.tenantId }
            ]
            let data = [];
            payloadReceiptDetails.Bill[0].billDetails.map(curEl => data.push(curEl));
            let sortData = data.sort((a, b) => b.toPeriod - a.toPeriod);
            let tenant = sortData[0].tenantId;
            let demandId = sortData[0].demandId;
            const queryString = [
                { key: "demandId", value: demandId },
                { key: "tenantId", value: tenant }
            ]
            let billTotalAmount = payloadReceiptDetails.Bill[0].totalAmount;

            httpRequest(
                "post",
                "/billing-service/demand/_search",
                "_demand",
                queryString
            ).then((getDemandBills) => {
                let demandAmount = getDemandBills.Demands[0].demandDetails.reduce((accum, item) => accum + item.taxAmount, 0);
                let partiallyPaid = getDemandBills.Demands[0].demandDetails.reduce((accm, item) => accm + item.collectionAmount, 0);
                if (billTotalAmount <= 0) {
                    // We do have Advance. This value is already adjusted from the actual demand.
                    // i.e. The entire demand is adjusted hence billTotalAmount becomes <= 0
                    payloadReceiptDetails.Bill[0].AdvanceAdjustedValue = partiallyPaid > 0 ? partiallyPaid : 0;
                } else {
                    // We have some Bill Amount. There are two possibilities.
                    // 1 - There was some advance and it is adjusted
                    // 2 - This is the balance of the previous Bill amount after partial payment - no adjustment
                    if (partiallyPaid >= 0) {
                        //There is some amount paid partially. Hence AdvanceAdjusted must be 0
                        payloadReceiptDetails.Bill[0].AdvanceAdjustedValue = 0;
                    } else {
                        payloadReceiptDetails.Bill[0].AdvanceAdjustedValue = demandAmount - billTotalAmount;
                    }
                }

                // We need to calculate Arrears only when the bill[0].totalAmount is > 0
                // Else we have advance Amount.
                if (billTotalAmount > 0) {
                    sortData.shift();
                    let totalAmount = 0;
                    let previousArrears = 0;
                    if (sortData.length > 0) {
                        let totalArrearsAmount = sortData.map(el => el.amount + totalAmount);
                        previousArrears = totalArrearsAmount.reduce((a, b) => a + b);
                    }
                    payloadReceiptDetails.Bill[0].arrearAmount = previousArrears.toFixed(2);
                }

                payloadReceiptDetails.Bill[0].billDetails.sort((a, b) => b.toPeriod - a.toPeriod);
                httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], requestBody).then((payloadbillingPeriod) => {
                    let waterMeteredDemandExipryDate = 0, waterNonMeteredDemandExipryDate = 0, sewerageNonMeteredDemandExpiryDate = 0;
                    const service = (payloadReceiptDetails.Bill && payloadReceiptDetails.Bill.length > 0 && payloadReceiptDetails.Bill[0].businessService) ? payloadReceiptDetails.Bill[0].businessService : 'WS';
                    if (service === 'WS' &&
                        payloadbillingPeriod.MdmsRes['ws-services-masters'] &&
                        payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined &&
                        payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
                        payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
                            if (obj.connectionType === 'Metered' && getQueryArg(window.location.href, "connectionType") === "Metered") {
                                payloadReceiptDetails.Bill[0].billDetails[0]['expiryDate'] = payloadReceiptDetails.Bill[0].billDetails[0].toPeriod + obj.demandExpiryDate;
                            } else if (obj.connectionType === 'Non Metered' && getQueryArg(window.location.href, "connectionType") === "Non Metered") {
                                payloadReceiptDetails.Bill[0].billDetails[0]['expiryDate'] = payloadReceiptDetails.Bill[0].billDetails[0].toPeriod + obj.demandExpiryDate;
                            }
                        });
                    }

                    if (service === "SW" &&
                        payloadbillingPeriod.MdmsRes['sw-services-calculation'] &&
                        payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined &&
                        payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
                        payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
                            if (obj.connectionType === 'Non Metered') {
                                payloadReceiptDetails.Bill[0].billDetails[0]['expiryDate'] = payloadReceiptDetails.Bill[0].billDetails[0].toPeriod + obj.demandExpiryDate;
                            }
                        });
                    }

                    httpRequest("post", DOWNLOADBILL.GET.URL, DOWNLOADBILL.GET.ACTION, queryStr, { Bill: payloadReceiptDetails.Bill }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            downloadReceiptFromFilestoreID(res.filestoreIds[0], mode);
                        });
                })
            })
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
    }

};

// api call to calculate water estimate
export const waterSewerageBillingSearch = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "billing-service/bill/v2/_search",
            "",
            queryObject,
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
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
    }

};
// to download application 
export const downloadApp = async (wnsConnection, type, mode, dispatch) => {
    let estFileStrID = wnsConnection[0].additionalDetails.estimationFileStoreId
    let sanFileStrID = wnsConnection[0].additionalDetails.sanctionFileStoreId

    if (type === 'estimateNotice' && estFileStrID !== undefined && estFileStrID !== null) {
        downloadReceiptFromFilestoreID(estFileStrID, mode)
        return false;
    } else if (type === 'sanctionLetter' && sanFileStrID !== undefined && sanFileStrID !== null) {
        downloadReceiptFromFilestoreID(sanFileStrID, mode)
        return false;
    }

    let tenantName = wnsConnection[0].property.tenantId;
    tenantName = tenantName.split('.')[1];

    wnsConnection[0].tenantName = tenantName.toUpperCase();
    const appNo = wnsConnection[0].applicationNo;

    let queryStr = [{ key: "tenantId", value: commonConfig.tenantId }];
    let apiUrl, appService, estKey, queryObjectForEst
    if (wnsConnection[0].service === serviceConst.WATER) {

        // for Estimate api 
        if (wnsConnection[0].property.rainWaterHarvesting !== undefined && wnsConnection[0].property.rainWaterHarvesting !== null) {
            if (wnsConnection[0].property.rainWaterHarvesting === 'SCORE_YES') {
                wnsConnection[0].property.rainWaterHarvesting = true
            } else if (wnsConnection[0].property.rainWaterHarvesting === 'SCORE_NO') {
                wnsConnection[0].property.rainWaterHarvesting = false
            }
        }
        apiUrl = "ws-calculator/waterCalculator/_estimate";
        appService = "ws-applicationwater";
        queryObjectForEst = [{
            applicationNo: appNo,
            tenantId: getTenantIdCommon(),
            waterConnection: wnsConnection[0]
        }]

    } else {
        apiUrl = "sw-calculator/sewerageCalculator/_estimate";
        appService = "ws-applicationsewerage";
        queryObjectForEst = [{
            applicationNo: appNo,
            tenantId: getTenantIdCommon(),
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

        let obj = { };
        if (type === 'estimateNotice' || type === 'sanctionLetter') {
            estResponse.Calculation[0].taxHeadEstimates.map((val) => {
                val.taxHeadCode = val.taxHeadCode.substring(3)
            });
            wnsConnection[0].pdfTaxhead = estResponse.Calculation[0].taxHeadEstimates;

            obj = {
                WnsConnection: wnsConnection
            }
        }

        if (type === 'sanctionLetter') {
            const slaDetails = await httpRequest(
                "post",
                `egov-workflow-v2/egov-wf/businessservice/_search?tenantId=${wnsConnection[0].property.tenantId}&businessService=WS`,
                "_search"
            );

            var states = [], findSLA = false;
            for (var i = 0; i < slaDetails.BusinessServices.length; i++) {
                states = slaDetails.BusinessServices[i].states;
                if (findSLA) break;
                if (states.length > 0) {
                    for (var j = 0; j < states.length; j++) {
                        if (states[j]['state'] && states[j]['state'] !== undefined && states[j]['state'] !== null && states[j]['state'] !== "" && states[j]['state'] === 'PENDING_FOR_CONNECTION_ACTIVATION') {
                            wnsConnection[0].sla = states[j]['sla'] / 86400000;
                            findSLA = true;
                            break;
                        }
                    }
                }
            }
            let connectionExecutionDate = new Date(wnsConnection[0].connectionExecutionDate);
            wnsConnection[0].slaDate = connectionExecutionDate.setDate(connectionExecutionDate.getDate() + wnsConnection[0].sla);
        }


        if (type === 'application') {
            if (wnsConnection[0].property && wnsConnection[0].property.units && wnsConnection[0].property.units.length > 0 && wnsConnection[0].property.units[0].usageCategory) {
                wnsConnection[0].property.propertySubUsageType = wnsConnection[0].property.units[0].usageCategory;
            }
            if (wnsConnection[0].service === serviceConst.WATER) {
                if (wnsConnection[0].property.rainWaterHarvesting !== undefined && wnsConnection[0].property.rainWaterHarvesting !== null) {
                    if (wnsConnection[0].property.rainWaterHarvesting === true) {
                        wnsConnection[0].property.rainWaterHarvesting = 'SCORE_YES'
                    } else {
                        wnsConnection[0].property.rainWaterHarvesting = 'SCORE_NO'
                    }
                }
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
                        if (type === "sanctionLetter") {
                            store.dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.sanctionFileStoreId", fileStoreId));
                        } else if (type === "estimateNotice") {
                            store.dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.estimationFileStoreId", fileStoreId));
                        }
                        downloadReceiptFromFilestoreID(fileStoreId, mode)
                    })
                } else {
                }

            });
    } catch (exception) {
        alert('Some Error Occured while downloading!');
    }
}

export const getDomainLink = () => {
    let link = "";
    if (process.env.NODE_ENV !== "development") {
        link += "/" + process.env.REACT_APP_NAME.toLowerCase()
    }
    return link
}

export const isActiveProperty = (propertyObj) => {
    let storeData = store.getState();
    let ptWorkflowDetails = get(storeData, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PropertyTax.PTWorkflow", []);
    let status = true;
    if (ptWorkflowDetails && ptWorkflowDetails.length > 0) {
        ptWorkflowDetails.forEach(data => {
            if (data.enable) {
                if ((data.businessService).includes("WNS")) {
                    if (propertyObj.status === 'INACTIVE' || propertyObj.status === 'INWORKFLOW') {
                        status = false;
                    }
                } else {
                    if (propertyObj.status === 'INACTIVE') {
                        status = false;
                    }
                }
            }
        });
    } else {
        if (propertyObj.status === 'INACTIVE' || propertyObj.status === 'INWORKFLOW') {
            status = false;
        }
    }

    return status;
}
export const isEditAction = () => {
    let isMode = getQueryArg(window.location.href, "action");
    return (isMode && isMode.toUpperCase() === 'EDIT');
}
export const isModifyMode = () => {
    let isMode = getQueryArg(window.location.href, "mode");
    return (isMode && isMode.toUpperCase() === 'MODIFY');
}

export const isModifyModeAction = () => {
    let isMode = getQueryArg(window.location.href, "modeaction");
    return (isMode && isMode.toUpperCase() === 'EDIT');
}

export const showHideFieldsFirstStep = (dispatch, propertyId, value) => {
    if (propertyId) {
        dispatch(
            handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyID.children.propertyID",
                "props.value",
                propertyId
            )
        );
    }
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails",
            "visible",
            value
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.Details",
            "visible",
            value
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails",
            "visible",
            value
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails",
            "visible",
            value
        )
    );
}

export const getWaterSource = (waterSource, waterSubSource) => {
    //Check waterSource has both major and minor
    if (waterSource && waterSource != "NA") {
        let source = waterSource.split(".");
        if (source[0] && source[0] !== "NA" && source[1] && source[1] !== "NA") {
            return waterSource;
        }
        if (waterSubSource && waterSubSource !== 'NA') {
            waterSource += "." + waterSubSource;
        }
    }
    return waterSource;
}

export const isWorkflowExists = async (queryObj) => {
    try {
        const payload = await httpRequest(
            "post",
            "/egov-workflow-v2/egov-wf/process/_search",
            "_search",
            queryObj
        );
        let isApplicationApproved = false;
        if (payload && payload.ProcessInstances && payload.ProcessInstances.length > 0) {
            for (let pInstance of payload.ProcessInstances) {
                isApplicationApproved = pInstance.state.isTerminateState;
                if (!isApplicationApproved) {
                    break;
                }
            }
        }
        return isApplicationApproved;
    } catch (error) {
    }
}

export const getMdmsDataForBill = async (tenantId) => {
    try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
            MdmsCriteria: {
                tenantId: tenantId,
                moduleDetails: [
                    { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }] },
                    { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }] }
                ]
            }
        }
        //Read metered & non-metered demand expiry date and assign value.
        return await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

    } catch (err) { }
}

export const getOpenSearchResultsForWater = async (queryObject, requestBody, dispatch) => {
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            requestBody
        );
        if (response.WaterConnection && response.WaterConnection.length == 0) {
            return response;
        }
        let currentTime = new Date().getTime(), locality, tenantId;
        let result = findAndReplace(response, null, "NA");
        result.WaterConnection[0].waterSourceSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource;
        let waterSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[0];
        let waterSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[1];
        result.WaterConnection[0].waterSource = waterSource;
        result.WaterConnection[0].waterSubSource = waterSubSource;
        requestBody.forEach(value => { if (value.key == "locality") { locality = value.value; } else if (value.key == "tenantId") { tenantId = value.value } });
        result.WaterConnection = await getPropertyObj(result.WaterConnection, locality, tenantId);
        return result;
    } catch (error) { }


};

export const getOpenSearchResultsForSewerage = async (queryObject, requestBody, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            requestBody
        );
        if (response.SewerageConnections && response.SewerageConnections.length == 0) {
            dispatch(toggleSpinner());
            return response;
        }
        let currentTime = new Date().getTime();
        let result = findAndReplace(response, null, "NA"), locality, tenantId;
        requestBody.forEach(value => { if (value.key == "locality") { locality = value.value; } else if (value.key == "tenantId") { tenantId = value.value } })
        result.SewerageConnections = await getPropertyObj(result.SewerageConnections, locality, tenantId);
        dispatch(toggleSpinner());
        return result;
    } catch (error) {
        dispatch(toggleSpinner());
    }
};

export const transformById = (payload, id) => {
    return (
        payload &&
        payload.reduce((result, item) => {
            result[item[id]] = {
                ...item
            };

            return result;
        }, { })
    );
};

export const getLocaleLabels = (label, labelKey, localizationLabels) => {
    if (!localizationLabels)
        localizationLabels = transformById(
            JSON.parse(getLocalization(`localization_${getLocale()}`)),
            "code"
        );
    if (labelKey) { label = labelKey }
    if (label) {
        let translatedLabel = getTranslatedLabel(label, localizationLabels);
        if (!translatedLabel || label === translatedLabel) {
            return translatedLabel;
        } else {
            return translatedLabel;
        }
    } else {
        return label;
    }
};