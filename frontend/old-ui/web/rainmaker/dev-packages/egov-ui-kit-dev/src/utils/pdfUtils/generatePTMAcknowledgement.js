import { mutationSummaryDetails } from "egov-pt/ui-config/screens/specs/pt-mutation/applyResourceMutation/mutationSummary";
import { transfereeInstitutionSummaryDetails, transfereeSummaryDetails } from "egov-pt/ui-config/screens/specs/pt-mutation/searchPreviewResource/transfereeSummary";
import { transferorInstitutionSummaryDetails, transferorSummaryDetails } from "egov-pt/ui-config/screens/specs/pt-mutation/searchPreviewResource/transferorSummary";
import { registrationSummaryDetails } from "egov-pt/ui-config/screens/specs/pt-mutation/summaryResource/registrationSummary";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";
import { getAddressItems } from "../../common/propertyTax/Property/components/PropertyAddressInfo";
import { generateKeyValue, generatePDF, getDocumentsCard, getMultiItems, getMultipleItemCard } from "./generatePDF";

export const generatePTMAcknowledgement = (preparedFinalObject, fileName = "acknowledgement.pdf") => {
    registrationSummaryDetails.transferReason.localiseValue=true;
    transferorSummaryDetails.ownerType.localiseValue=true;
    transfereeSummaryDetails.ownerType.localiseValue=true;
    transfereeInstitutionSummaryDetails.institutionType.localiseValue=true;
    transferorInstitutionSummaryDetails.institutionType.localiseValue=true;
    const mutationDetails = generateKeyValue(preparedFinalObject, mutationSummaryDetails);
    const registrationDetails = generateKeyValue(preparedFinalObject, registrationSummaryDetails);
    let UlbLogoForPdf = getFromObject(preparedFinalObject, 'UlbLogoForPdf', '');
    let property = getFromObject(preparedFinalObject, 'Property', {});
    let transfereeOwners = getFromObject(
        property,
        "ownersTemp", []
    );
    let transferorOwners = getFromObject(
        property,
        "ownersInit", []
    );
    let transfereeOwnersDid = true;
    let transferorOwnersDid = true;
    transfereeOwners.map(owner => {
        if (owner.ownerType != 'NONE') {
            transfereeOwnersDid = false;
        }
    })
    transferorOwners.map(owner => {
        if (owner.ownerType != 'NONE') {
            transferorOwnersDid = false;
        }
    })

    if (transfereeOwnersDid) {
        delete transfereeSummaryDetails.ownerSpecialDocumentType
        delete transfereeSummaryDetails.ownerDocumentId
    }
    if (transferorOwnersDid) {
        delete transferorSummaryDetails.ownerSpecialDocumentType
        delete transferorSummaryDetails.ownerSpecialDocumentID
    }
    let transferorDetails = []
    let transferorDetailsInfo = []
    if (getFromObject(property, "ownershipCategoryInit", "").startsWith("INSTITUTION")) {
        transferorDetails = generateKeyValue(preparedFinalObject, transferorInstitutionSummaryDetails)
    } else if (getFromObject(property, "ownershipCategoryInit", "").includes("SINGLEOWNER")) {
        transferorDetails = generateKeyValue(preparedFinalObject, transferorSummaryDetails)
    } else {
        transferorDetailsInfo = getMultiItems(preparedFinalObject, transferorSummaryDetails, 'Property.ownersTemp[0]')
        transferorDetails = getMultipleItemCard(transferorDetailsInfo, 'PT_OWNER')
    }
    let transfereeDetails = []
    let transfereeDetailsInfo = []
    if (getFromObject(property, "ownershipCategoryTemp", "").startsWith("INSTITUTION")) {
        transfereeDetails = generateKeyValue(preparedFinalObject, transfereeInstitutionSummaryDetails)
    } else if (getFromObject(property, "ownershipCategoryTemp", "").includes("SINGLEOWNER")) {
        transfereeDetails = generateKeyValue(preparedFinalObject, transfereeSummaryDetails)
    } else {
        transfereeDetailsInfo = getMultiItems(preparedFinalObject, transfereeSummaryDetails, 'Property.ownersInit[0]')
        transfereeDetails = getMultipleItemCard(transferorDetailsInfo, 'PT_OWNER')
    }

    const addressCard = getAddressItems(getFromObject(preparedFinalObject, 'Property', {}));
    const documentsUploadRedux = getFromObject(preparedFinalObject, 'documentsUploadRedux', []);
    const documentCard = getDocumentsCard(documentsUploadRedux);
    let pdfData = {
        header: "PTM_ACKNOWLEDGEMENT", tenantId: property.tenantId,
        applicationNoHeader: 'PT_PROPERRTYID', applicationNoValue: property.propertyId,
        additionalHeader: "PT_APPLICATION_NO", additionalHeaderValue: property.acknowldgementNumber,
        cards: [
            { header: "PT_PROPERTY_ADDRESS_SUB_HEADER", items: addressCard },
            { header: 'PT_MUTATION_TRANSFEROR_DETAILS', items: transferorDetails, type: transferorDetailsInfo.length > 1 ? 'multiItem' : 'singleItem' },
            { header: 'PT_MUTATION_TRANSFEREE_DETAILS', items: transfereeDetails, type: transfereeDetailsInfo.length > 1 ? 'multiItem' : 'singleItem' },
            { header: "PT_MUTATION_DETAILS", items: mutationDetails, hide: !getFromObject(preparedFinalObject, 'PropertyConfiguration[0].Mutation.MutationDetails', false) },
            { header: "PT_MUTATION_REGISTRATION_DETAILS", items: registrationDetails },
            { header: 'PT_SUMMARY_DOCUMENTS_HEADER', items: documentCard }]
    }
    generatePDF(UlbLogoForPdf, pdfData, fileName);
}