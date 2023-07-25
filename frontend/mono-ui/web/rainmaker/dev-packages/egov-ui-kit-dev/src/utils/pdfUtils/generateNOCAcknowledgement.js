import { applicantSummaryDetails, institutionSummaryDetail } from "egov-firenoc/ui-config/screens/specs/fire-noc/summaryResource/applicantSummary";
import { nocSummaryDetail } from "egov-firenoc/ui-config/screens/specs/fire-noc/summaryResource/nocSummary";
import { propertyLocationSummaryDetail, propertySummaryDetails } from "egov-firenoc/ui-config/screens/specs/fire-noc/summaryResource/propertySummary";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getLocale, getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";
import QRCode from "qrcode";
import { generateKeyValue, generatePDF, getDocumentsCard, getMultiItems, getMultipleItemCard } from "./generatePDF";

const getMessageFromLocalization = code => {
    let messageObject = JSON.parse(getLocalization(`localization_${getLocale()}`)).find(
        item => {
            return item.code == code;
        }
    );
    return messageObject ? messageObject.message : code;
};

const ifNotNull = value => {
    return !["", "NA", "null", null].includes(value);
};
const nullToNa = value => {
    return ["", "NA", "null", null].includes(value) ? "NA" : value;
};
const createAddress = (doorNo, buildingName, street, locality, city) => {
    let address = "";
    address += ifNotNull(doorNo) ? doorNo + ", " : "";
    address += ifNotNull(buildingName) ? buildingName + ", " : "";
    address += ifNotNull(street) ? street + ", " : "";
    address += locality + ", ";
    address += city;
    return address;
};

const epochToDate = et => {
    if (!et) return null;
    var date = new Date(Math.round(Number(et)));
    var formattedDate =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return formattedDate;
};

const getQRCode = async (qrText) => {
    const qrcode = qrText = await QRCode.toDataURL(qrText);
    return qrcode;
}

export const generateNOCAcknowledgement = async (preparedFinalObject, fileName = "acknowledgement.pdf") => {

    propertyLocationSummaryDetail.city.localiseValue = true;
    propertyLocationSummaryDetail.applicableFireStation.localiseValue = true;
    propertyLocationSummaryDetail.mohalla.localiseValue = true;

    propertySummaryDetails.buildingUsageType.localiseValue = true;
    propertySummaryDetails.buildingUsageSubType.localiseValue = true;

    let UlbLogoForPdf = getFromObject(preparedFinalObject, 'UlbLogoForPdf', '');
    let FireNOC = getFromObject(preparedFinalObject, 'FireNOCs[0]', {});

    const documentsUploadRedux = getFromObject(preparedFinalObject, 'FireNOCs[0].fireNOCDetails.additionalDetail.documents', []);
    const documentCard = getDocumentsCard(documentsUploadRedux);

    const nocSummary = generateKeyValue(preparedFinalObject, nocSummaryDetail);
    const propertySummary = generateKeyValue(preparedFinalObject, propertySummaryDetails);
    const propertyLocationSummary = generateKeyValue(preparedFinalObject, propertyLocationSummaryDetail);

    let applicantSummary = []
    let applicantSummaryInfo = []
    const ownershipType = getFromObject(FireNOC, "fireNOCDetails.applicantDetails.ownerShipType", "");
    if (ownershipType.startsWith("INSTITUTION")) {
        applicantSummary = generateKeyValue(preparedFinalObject, institutionSummaryDetail)
    } else if (ownershipType.includes("SINGLEOWNER")) {
        applicantSummary = generateKeyValue(preparedFinalObject, applicantSummaryDetails)
    } else {
        applicantSummaryInfo = getMultiItems(preparedFinalObject, applicantSummaryDetails, 'FireNOCs[0].fireNOCDetails.applicantDetails.owners')
        applicantSummary = getMultipleItemCard(applicantSummaryInfo, 'NOC_OWNER')
    }
    let applicationDate = nullToNa(
        epochToDate(
            getFromObject(preparedFinalObject, "FireNOCs[0].fireNOCDetails.applicationDate", "NA")
        )
    );
    let data = {};
    data.city = nullToNa(
        getMessageFromLocalization(
            `TENANT_TENANTS_${getTransformedLocale(
                getFromObject(
                    preparedFinalObject,
                    "FireNOCs[0].fireNOCDetails.propertyDetails.address.city",
                    "NA"
                )
            )}`
        )
    );
    data.door = nullToNa(
        getFromObject(
            preparedFinalObject,
            "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo",
            "NA"
        )
    );
    data.buildingName = nullToNa(
        getFromObject(
            preparedFinalObject,
            "FireNOCs[0].fireNOCDetails.propertyDetails.address.buildingName",
            "NA"
        )
    );
    data.street = nullToNa(
        getFromObject(
            preparedFinalObject,
            "FireNOCs[0].fireNOCDetails.propertyDetails.address.street",
            "NA"
        )
    );
    data.mohalla = nullToNa(
        getMessageFromLocalization(
            `revenue.locality.${getTransformedLocale(
                getFromObject(
                    preparedFinalObject,
                    "FireNOCs[0].fireNOCDetails.propertyDetails.address.locality.code",
                    "NA"
                )
            )}`
        )
    );

    data.address = createAddress(
        data.door,
        data.buildingName,
        data.street,
        data.mohalla,
        data.city
    );
    data.propertyType = nullToNa(
        getFromObject(preparedFinalObject, "FireNOCs[0].fireNOCDetails.noOfBuildings", "NA")
    );
    let qrText = `Application: ${FireNOC.fireNOCDetails.applicationNumber}, Date: ${
        applicationDate
        }, Buildings: ${data.propertyType}, Applicant: ${
        FireNOC.fireNOCDetails.applicantDetails.owners[0].name
        }, Address: ${data.address}`;

    let qrcode = await getQRCode(qrText);

    let pdfData = {
        header: "NOC_APPLICATION", tenantId: FireNOC.tenantId, qrcode: qrcode,
        applicationNoHeader: 'NOC_PDF_APPLICATION_NO', applicationNoValue: FireNOC.fireNOCDetails.applicationNumber,
        additionalHeader: "NOC_PDF_APPLICATION_DATE", additionalHeaderValue: applicationDate,
        cards: [
            { header: "NOC_NOC_DETAILS_HEADER", items: nocSummary },
            { header: "NOC_COMMON_PROPERTY_DETAILS", items: propertySummary },
            { header: "NOC_COMMON_PROPERTY_LOCATION_SUMMARY", items: propertyLocationSummary },
            { header: ownershipType.startsWith("INSTITUTION") ? 'NOC_INSTITUTION_DETAILS_HEADER' : "NOC_APPLICANT_DETAILS_HEADER", items: applicantSummary, type: applicantSummaryInfo.length > 1 ? 'multiItem' : 'singleItem' },
            { header: 'NOC_SUMMARY_DOCUMENTS_HEADER', items: documentCard }]
    }
    generatePDF(UlbLogoForPdf, pdfData, fileName);
}