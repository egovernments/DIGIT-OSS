import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";
import { getAssessmentInfo, getUnitInfo } from "../../common/propertyTax/Property/components/AssessmentInfo";
import { getOwnerInfo } from "../../common/propertyTax/Property/components/OwnerInfo";
import { getAddressItems } from "../../common/propertyTax/Property/components/PropertyAddressInfo";
import { generatePDF, getDocumentsCard, getMultipleItemCard } from "./generatePDF";

export const generatePTAcknowledgment = (property, generalMDMSDataById, UlbLogoForPdf, fileName = "acknowledgement.pdf") => {

    property.subOwnershipCategory = getFromObject(property, 'propertyDetails[0].subOwnershipCategory', '');
    const unitCard = getUnitInfo(getFromObject(property, "propertyDetails[0].units", []), property);
    let unitInfoCard = []
    if (unitCard.length >= 1) {
        let unitItems = [];
        Object.values(unitCard).map((unit, index) => {
            if (unit.length > 1) {
                let unitItem = { items: unit[0] }
                if (getFromObject(property, 'propertyDetails[0].propertySubType', '') !== "SHAREDPROPERTY") {
                    unitItem.header = getLocaleLabels(`PROPERTYTAX_FLOOR_${Object.keys(unitCard)[index]}`, `PROPERTYTAX_FLOOR_${Object.keys(unitCard)[index]}`);
                }
                let subItems = [];
                unit.map((subUnit, ind) => {
                    if (subUnit.length > 4) {
                        subItems.push(...subUnit);
                    } else {
                        if (subUnit.length == 3) {
                            subUnit.unshift({ key: ' ', value: getLocaleLabels(`PT_UNIT_${ind}`, `PT_UNIT_${ind}`) })
                        } else {
                            for (let i = subUnit.length; i < 4; i++) {
                                subUnit.push({ key: ' ', value: ' ' })
                            }
                        }
                        subItems.push(...subUnit);
                    }
                })
                unitItem.items = subItems;
                unitItems.push(unitItem)
            } else {
                let unitItem = { items: unit[0] }
                if (getFromObject(property, 'propertyDetails[0].propertySubType', '') !== "SHAREDPROPERTY") {
                    unitItem.header = getLocaleLabels(`PROPERTYTAX_FLOOR_${Object.keys(unitCard)[index]}`, `PROPERTYTAX_FLOOR_${Object.keys(unitCard)[index]}`);
                }
                unitItems.push(unitItem)
            }
        })
        unitInfoCard = unitItems
    }
    property.owners = property.owners.filter(owner => owner.status == "ACTIVE")
    const ownerInfo = getOwnerInfo(property, generalMDMSDataById);
    const addressCard = getAddressItems(property);
    const ownerCard = getMultipleItemCard(ownerInfo, 'PT_OWNER');
    const assessmentCard = getAssessmentInfo(getFromObject(property, 'propertyDetails[0]', {}), generalMDMSDataById,property);
    const documentCard = getDocumentsCard(property.documentsUploaded);

    let pdfData = {
        header: "PT_ACKNOWLEDGEMENT", tenantId: property.tenantId,
        applicationNoHeader: 'PT_PROPERRTYID', applicationNoValue: property.propertyId,
        additionalHeader: "PT_APPLICATION_NO", additionalHeaderValue: property.acknowldgementNumber,
        cards: [
            { header: "PT_PROPERTY_ADDRESS_SUB_HEADER", items: addressCard },
            { header: "PT_ASSESMENT_INFO_SUB_HEADER", items: assessmentCard },
            { items: unitInfoCard, type: "multiItem", hide: unitInfoCard.length === 0 },
            { header: 'PT_OWNERSHIP_INFO_SUB_HEADER', items: ownerCard, type: ownerInfo.length > 1 ? 'multiItem' : 'singleItem' },
            { header: 'PT_COMMON_DOCS', items: documentCard }]
    }
    generatePDF(UlbLogoForPdf, pdfData, fileName);
}