
import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getQueryArg,
    getTransformedLocale,
    getFileUrl,
    getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import _ from "lodash";
import groupBy from "lodash/groupBy";
import { getLoggedinUserRole } from "./index";
import { httpRequest } from "../../../../ui-utils/api";

const getDocumentCodes = (documentType) => {
    var code = getTransformedLocale(documentType);
    code = code.substring(0, code.lastIndexOf("_"));
    return code;
}

export const requiredDocumentsData = async (state, dispatch, action) => {
    try {
        let mdmsData = get(
            state.screenConfiguration.preparedFinalObject,
            "applyScreenMdmsData"
        );
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const queryObject = [
            { key: "businessIds", value: applicationNumber },
            { key: "tenantId", value: tenantId }
        ];
        const wfPayload = await httpRequest(
            "post",
            "egov-workflow-v2/egov-wf/process/_search",
            "",
            queryObject
        );
        const wfState = get(wfPayload, "ProcessInstances[0]");
        let appState;
        dispatch(prepareFinalObject("applicationProcessInstances", get(wfPayload, "ProcessInstances[0]")));

        if (mdmsData && mdmsData.BPA && wfState) {
            let documents = mdmsData.BPA.DocTypeMapping;
            documents.forEach(doc => {
                if (doc.WFState === wfState.state.state) {
                    appState = wfState.state.state;
                }
            });
        };
        let proInstance = wfPayload.ProcessInstances[0];
        let nextActions = get(proInstance, "nextActions");
        let isVisibleTrue = false;
        if (nextActions && nextActions.length > 0) isVisibleTrue = true;
        prepareDocumentsView(state, dispatch, action, appState, isVisibleTrue);
    } catch (e) {
        console.log(e);
    }
}
const prepareDocumentsView = async (state, dispatch, action, appState, isVisibleTrue) => {
    let documentsPreview = [];

    // Get all documents from response
    let Noc = get(
        state,
        "screenConfiguration.preparedFinalObject.Noc",
        {}
    );

    let applicantDocuments = jp.query(
        Noc,
        "$.documents.*"
    );

    let uploadedAppDocuments = [];

    let allDocuments = [
        ...applicantDocuments
    ];

    let fileStoreIds = jp.query(allDocuments, "$.*.fileStoreId");
    let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    allDocuments.map((doc, index) => {
        uploadedAppDocuments.push(doc);
        let obj = {};
        obj.title = getTransformedLocale(doc.documentType);
        obj.fileStoreId = doc.fileStoreId;
        obj.linkText = "View";
        obj.wfState = doc.wfState;
        if (doc.auditDetails) {
            obj["createdTime"] = doc.auditDetails.createdTime;
        }

        obj["link"] =
            (fileUrls &&
                fileUrls[doc.fileStoreId] &&
                getFileUrl(fileUrls[doc.fileStoreId])) ||
            "";
        obj["name"] =
            (fileUrls[doc.fileStoreId] &&
                decodeURIComponent(
                    getFileUrl(fileUrls[doc.fileStoreId])
                        .split("?")[0]
                        .split("/")
                        .pop()
                        .slice(13)
                )) ||
            `Document - ${index + 1}`;
        obj.createdBy = getLoggedinUserRole(doc.wfState);
        obj.additionalDetails = doc.additionalDetails;
        obj['auditDetails'] = doc.auditDetails;
        documentsPreview.push(obj);
        return obj;
    });
    dispatch(prepareFinalObject("documentDetailsPreview", documentsPreview));
    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if ((isEmployee && isVisibleTrue) || (!isEmployee && isVisibleTrue)) {
        prepareDocsInEmployee(state, dispatch, action, appState, uploadedAppDocuments, documentsPreview);
    } else {
        prepareFinalCards(state, dispatch, documentsPreview, [], isVisibleTrue)
    }
};

const prepareFinalCards = (state, dispatch, documentsPreview, requiredDocsFromMdms, isVisibleTrue) => {
    let cards = [];
    documentsPreview.forEach((item) => {
        item.documentCode = getDocumentCodes(item.title)
    }
    )
    let documentCards = groupBy(documentsPreview, 'documentCode');
    let bpaDetails = get(
        state.screenConfiguration.preparedFinalObject,
        "Noc",
        {}
    );
    let cardReadOnly = false;
    let readOnly = false;
    if(isVisibleTrue === false) {
        cardReadOnly = true;
        readOnly = true;
    }

    documentCards && Object.keys(documentCards).map((doc) => {
        let card = {
            documentCode: doc,
            documents: documentCards[doc],
            wfState: documentCards[doc].wfState,
            readOnly: readOnly
        }
        cards.push(card);
    });
    if (requiredDocsFromMdms.length > 0) {
        const allCards = [].concat(...requiredDocsFromMdms.map(({ cards }) => cards || []));

        allCards && allCards.map((mdmsCard) => {
            let found = false;
            mdmsCard.documentCode = getTransformedLocale(mdmsCard.code);
            for (var i = 0; i < cards.length; i++) {
                if (mdmsCard.documentCode == cards[i].documentCode) {
                    cards[i].readOnly = cardReadOnly;
                    let mergedCard = { ...cards[i], ...mdmsCard };
                    cards[i] = { ...mergedCard };
                    found = true;
                }
            }

            if (!found) {
                mdmsCard.readOnly = cardReadOnly;
                cards.push(mdmsCard)
            }
        });
    }
    /**
     * @Todo should be handled at component level
     */
    cards.map(card => {
        if (card.documents) {
            card.documents.map(item => {
                if (!item.fileName) {
                    item.fileName = item.name;
                }
            })
        }
    });
    dispatch(prepareFinalObject("finalCardsforPreview", cards));

}

export const prepareDocsInEmployee = (state, dispatch, action, appState, uploadedAppDocuments, documentsPreview) => {
    let applicationDocuments = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NOC.DocumentTypeMapping",
        []
    );
    let documentsDropDownValues = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
        []
    );

    let documents = [];
    let nocType = get(state.screenConfiguration.preparedFinalObject, "Noc.nocType", "");

    applicationDocuments.forEach(doc => {
        if (doc.applicationType === "NEW" && doc.nocType === nocType) {
            documents.push(doc.docTypes)
        }
    });

    let documentsList = [];
    if (documents[0] && documents[0].length > 0) {
        documents[0].forEach(doc => {
            let code = doc.documentType;
            doc.dropDownValues = [];
            documentsDropDownValues.forEach(value => {
                let values = value.code.slice(0, code.length);
                if (code === values) {
                    doc.hasDropdown = true;
                    doc.dropDownValues.push(value);
                }
            });
            documentsList.push(doc);
        });
    }
    const bpaDocuments = documentsList;
    let documentsContract = [];
    let tempDoc = {};

    if (bpaDocuments && bpaDocuments.length > 0) {
        bpaDocuments.forEach(doc => {
            let card = {};
            card["code"] = doc.documentType.split(".")[0];
            card["title"] = doc.documentType.split(".")[0];
            card["cards"] = [];
            tempDoc[doc.documentType.split(".")[0]] = card;
        });
        bpaDocuments.forEach(doc => {
            let card = {};
            card["name"] = doc.documentType;
            card["code"] = doc.documentType;
            card["required"] = doc.required ? true : false;
            if (doc.hasDropdown && doc.dropDownValues) {
                let dropDownValues = {};
                dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
                dropDownValues.required = doc.required;
                dropDownValues.menu = doc.dropDownValues.filter(item => {
                    return true;
                });
                dropDownValues.menu = dropDownValues.menu.map(item => {
                    return { code: item.code, label: item.code };
                });
                card["dropDownValues"] = dropDownValues;
            }
            tempDoc[doc.documentType.split(".")[0]].cards.push(card);
        });
    }

    if (tempDoc) {
        Object.keys(tempDoc).forEach(key => {
            documentsContract.push(tempDoc[key]);
        });
    }
    let finalDocuments = [];
    if (documentsContract && documentsContract.length > 0) {

        let documentsCodes = [];

        documentsContract.forEach(documents => {
            documents.cards.forEach(cardDoc => {
                documentsCodes.push(cardDoc.code);
            });
        });

        let documentsDocTypes = [];
        uploadedAppDocuments.forEach(appDoc => {
            if (appDoc && appDoc.documentType) {
                let code = (appDoc.documentType).split('.')[0] + '.' + (appDoc.documentType).split('.')[1]
                documentsDocTypes.push(code);
            }
        });

        let result;
        if (documentsDocTypes && documentsDocTypes.length > 0) {
            documentsCodes.map(docs => {
                documentsDocTypes.map(doc => {
                    if (docs === doc) {
                        documentsContract[0].cards.map(items => {
                            if (items && items.code === doc) return items.required = false;
                        })
                    }
                })
                return docs;
            })
            result = documentsCodes;
        } else {
            result = documentsCodes;
        }

        let finalDocs = [];

        documentsContract.forEach(doc => {
            let cards = [];
            for (let i = 0; i < result.length > 0; i++) {
                let codes = result[i];
                doc.cards.forEach(docCards => {
                    if (docCards.code === codes) {
                        cards.push(docCards);
                    }
                })
            }
            finalDocs.push({
                cards: cards,
                code: doc.code,
                title: doc.code
            });
        });


        if (finalDocs && finalDocs.length > 0) {
            finalDocs.forEach(fDoc => {
                if (fDoc && fDoc.cards && fDoc.cards.length > 0) {
                    finalDocuments.push(fDoc);
                }
            })
        };

        if (finalDocuments && finalDocuments.length > 0) {
            dispatch(prepareFinalObject("documentsContract", finalDocuments));
        }
    }
    prepareFinalCards(state, dispatch, documentsPreview, finalDocuments);
};