import { propertyDetails, locationDetails, propertyOwnerDetail, connectionHolderDetails, connectionHolderSameAsOwnerDetails } from "egov-wns/ui-config/screens/specs/wns/applyResource/review-trade";
import { connDetailsWater, connDetailsSewerage } from "egov-wns/ui-config/screens/specs/wns/applyResource/task-connectiondetails";
import { plumberDetails, roadDetails, additionDetailsWater, additionDetailsSewerage, activateDetailsMeter, activateDetailsNonMeter } from "egov-wns/ui-config/screens/specs/wns/applyResource/review-owner";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";
import { reviewModificationsEffectiveDate } from "egov-wns/ui-config/screens/specs/wns/applyResource/reviewModificationsEffective";
import { generateKeyValue, generatePDF, getDocumentsCard, getMultiItems, getMultipleItemCard, generateKeyValueForModify } from "./generatePDF";
import { getQueryArg, getTransformedLocalStorgaeLabels, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

export const generateWSAcknowledgement = (preparedFinalObject, fileName = "print", service, connType) => {
    propertyDetails.reviewPropertyType.localiseValue = true;
    propertyDetails.reviewPropertyType.localiseValue = true;
    propertyDetails.reviewPropertyUsageType.localiseValue = true;
    propertyDetails.reviewPropertySubUsageType.localiseValue = true;
    roadDetails.reviewRoadType.localiseValue = true;

    connDetailsWater.taskApplicationType.localiseValue = true;
    connDetailsSewerage.taskApplicationType.localiseValue = true;

    plumberDetails.reviewPlumberProvidedBy.localiseValue = true;

    additionDetailsWater.reviewConnectionType.localiseValue = true;
    additionDetailsWater.reviewWaterSubSource.localiseValue = true;
    additionDetailsWater.reviewWaterSource.localiseValue = true;
    additionDetailsSewerage.reviewConnectionType.localiseValue = true;

    Object.keys(propertyOwnerDetail).forEach(owner => {
        if(owner == "gender" || owner == "relationship" || owner == "specialApplicantCategory") propertyOwnerDetail[owner].localiseValue = true
    });

    Object.keys(connectionHolderDetails).forEach(owner => {
        if(owner == "gender" || owner == "relationship" || owner == "specialApplicantCategory") propertyOwnerDetail[owner].localiseValue = true
    });
    

    let propDetail = generateKeyValue(preparedFinalObject, propertyDetails);
    let propertyDetail = propDetail.map(cur => {
        if (cur.key === "Rainwater harvesting Facility") {
            if (cur.value === true) { return ({ key: cur.key, value: "Yes" }) }
            else if(cur.value === false){ return ({ key: cur.key, value: "No" }) }
            else{ return ({ key: cur.key, value: "NA" })}
        } else {
            return ({ key: cur.key, value: cur.value })
        }
    })
    const locationDetail = generateKeyValue(preparedFinalObject, locationDetails);
    let connectionDetail = {};
    if (service === "WATER") {
        connectionDetail = generateKeyValue(preparedFinalObject, connDetailsWater);
    } else {
        connectionDetail = generateKeyValue(preparedFinalObject, connDetailsSewerage);
    }
    let additionDetail = {};
    if (service === "WATER") {
        additionDetail = generateKeyValue(preparedFinalObject, additionDetailsWater);
    } else {
        additionDetail = generateKeyValue(preparedFinalObject, additionDetailsSewerage);
    }
    let activateDetail = {};
    if (connType === "Metered") {
        activateDetail = generateKeyValue(preparedFinalObject, activateDetailsMeter);
    } else {
        activateDetail = generateKeyValue(preparedFinalObject, activateDetailsNonMeter);
    }


    let UlbLogoForPdf = getFromObject(preparedFinalObject, 'UlbLogoForPdf', '');
    let WaterConnection = getFromObject(preparedFinalObject, 'WaterConnection[0]', {});
    let isMode = (WaterConnection.applicationType !== null) ? WaterConnection.applicationType.split("_")[0] : "";
    let reviewModificationsEffective = [];
    let plumberDetail = [];
    let roadDetail = [];
    let roadDetailInfo = [];
    if (isMode === "MODIFY") {
        reviewModificationsEffective = generateKeyValueForModify(preparedFinalObject, reviewModificationsEffectiveDate);
    } else {
        plumberDetail = generateKeyValue(preparedFinalObject, plumberDetails);
        if (WaterConnection.roadCuttingInfo && WaterConnection.roadCuttingInfo.length > 1) {
            roadDetailInfo = getMultiItems(preparedFinalObject, roadDetails, 'WaterConnection[0].roadCuttingInfo')
            roadDetail = getMultipleItemCard(roadDetailInfo, 'WS_ROAD_CUTTING_CHARGE_DETAILS');
        } else {
            roadDetail = generateKeyValue(preparedFinalObject, roadDetails);
        }
    }

    let connHolderDetail = {};
    if (WaterConnection.connectionHolders === null) {
        let sameAsOwnerArray = generateKeyValue(preparedFinalObject, connectionHolderSameAsOwnerDetails);
        connHolderDetail = sameAsOwnerArray.map(cur => {
            return ({
                key: cur.key,
                value: "yes"
            })
        })
    } else {
        connHolderDetail = generateKeyValue(preparedFinalObject, connectionHolderDetails);
    }

    let ownerDetail = []
    let ownerDetailInfo = []
    if (WaterConnection.property.owners.length > 1) {
        ownerDetailInfo = getMultiItems(preparedFinalObject, propertyOwnerDetail, 'WaterConnection[0].property.owners')
        ownerDetail = getMultipleItemCard(ownerDetailInfo, 'WS_OWNER');
    } else {
        ownerDetail = generateKeyValue(preparedFinalObject, propertyOwnerDetail);
    }
    const documentsUploadRedux = getFromObject(preparedFinalObject, 'DocumentsData', []);
    const documentCard = getDocumentsCard(documentsUploadRedux);
    const tenantId = getQueryArg(window.location.href, "tenantId");


    let pdfData = {
        header: WaterConnection.applicationNo.includes("WS") ? "PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER" : "PDF_STATIC_LABEL_SW_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER", tenantId: tenantId,
        applicationNoHeader: WaterConnection.applicationType !== null ? WaterConnection.applicationType.split("_").join(" ") : "",
        additionalHeader: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_APPLICATION_NO', additionalHeaderValue: WaterConnection.applicationNo,
        cards: [
            { header: "PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_PROPERTY_DETAILS_HEADER", items: propertyDetail },
            { header: "PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_LOCATION_DETAILS_HEADER", items: locationDetail },
            { header: "PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_OWNER_DETAILS_HEADER", items: ownerDetail, type: ownerDetailInfo.length > 1 ? 'multiItem' : 'singleItem' },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_CONNECTION_DETAILS_HEADER', items: connectionDetail },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_CONNECTION_HOLDER_DETAILS_HEADER', items: connHolderDetail },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_DOCUMENTS_DETAILS_HEADER', items: documentCard, hide: documentCard.length === 0 },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_ADDITIONAL_CONNECTION_HEADER', items: additionDetail },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_PLUMBER_DETAILS_HEADER', items: plumberDetail, hide: plumberDetail.length === 0 },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_ROAD_CHARGES_HEADER', items: roadDetail, type: roadDetailInfo.length > 1 ? 'multiItem' : 'singleItem'}, //hide: (roadDetailInfo.length === 0 && roadDetail.length === 0)
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_ACTIVATION_DETAILS_HEADER', items: activateDetail },
            { header: 'PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_MODIFY_EFFECTIVE_DATE_HEADER', items: reviewModificationsEffective, hide: reviewModificationsEffective.length === 0 },

        ]
    }

    generatePDF(UlbLogoForPdf, pdfData, fileName);
    return true;
}