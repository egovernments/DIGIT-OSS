import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import get from "lodash/get";
import { getAssessmentInfo, getUnitInfo } from "../../common/propertyTax/Property/components/AssessmentInfo";
import { getOwnerInformation } from "../../common/propertyTax/Property/components/OwnerInfo";
import { getAddressItems } from "../../common/propertyTax/Property/components/PropertyAddressInfo";
import { generatePDF, getDocumentsCard, getMultipleItemCard } from "./generatePDF";

export const generatePTAcknowledgment = (property, generalMDMSDataById, UlbLogoForPdf, fileName = "acknowledgement.pdf") => {

    property.subOwnershipCategory = get(property, 'propertyDetails[0].subOwnershipCategory', '');
    const unitCard = getUnitInfo(get(property, "propertyDetails[0].units", []));
    let unitInfoCard = []
    if (unitCard.length >= 1) {
        let unitItems = [];
        unitCard.map((unit, index) => {
            if (unit.length > 1) {
                let unitItem = { items: unit[0] }
                if (get(property, 'propertyDetails[0].propertySubType', '') !== "SHAREDPROPERTY") {
                    unitItem.header = getLocaleLabels(`PROPERTYTAX_FLOOR_${index}`, `PROPERTYTAX_FLOOR_${index}`);
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
                if (get(property, 'propertyDetails[0].propertySubType', '') !== "SHAREDPROPERTY") {
                    unitItem.header = getLocaleLabels(`PROPERTYTAX_FLOOR_${index}`, `PROPERTYTAX_FLOOR_${index}`);
                }
                unitItems.push(unitItem)
            }
        })
        unitInfoCard = unitItems
    }
    property.owners = property.owners.filter(owner => owner.status == "ACTIVE")
    const ownerInfo = getOwnerInformation(property, generalMDMSDataById);
    const addressCard = getAddressItems(property);
    const ownerCard = getMultipleItemCard(ownerInfo, 'PT_OWNER');
    const assessmentCard = getAssessmentInfo(get(property, 'propertyDetails[0]', {}), generalMDMSDataById);

    let isLegacy =false;

    if(property && property.source==='LEGACY_RECORD')
    {
            isLegacy=true
    }
    const documentCard = !isLegacy ? getDocumentsCard(property.documentsUploaded):"N/A";



    let legacyPdfData = {
        header: "PT_ACKNOWLEDGEMENT", tenantId: property.tenantId,
        applicationNoHeader: 'PT_PROPERRTYID', applicationNoValue: property.propertyId,
        additionalHeader: "PT_APPLICATION_NO", additionalHeaderValue: property.acknowldgementNumber,
        cards: [
            { header: "PT_PROPERTY_ADDRESS_SUB_HEADER", items: addressCard },
            { header: "PT_ASSESMENT_INFO_SUB_HEADER", items: assessmentCard },
            { items: unitInfoCard, type: "multiItem", hide: unitInfoCard.length === 0 },
            { header: 'PT_OWNERSHIP_INFO_SUB_HEADER', items: ownerCard, type: ownerInfo.length > 1 ? 'multiItem' : 'singleItem' },
        ]
    }
    let assessmentPdfData = {
        header: "PT_ACKNOWLEDGEMENT", tenantId: property.tenantId,
        applicationNoHeader: 'PT_PROPERRTYID', applicationNoValue: property.propertyId,
        additionalHeader: "PT_APPLICATION_NO", additionalHeaderValue: property.acknowldgementNumber,
        cards: [
            { header: "PT_PROPERTY_ADDRESS_SUB_HEADER", items: addressCard },
            { header: "PT_ASSESMENT_INFO_SUB_HEADER", items: assessmentCard },
            { items: unitInfoCard, type: "multiItem", hide: unitInfoCard.length === 0 },
            { header: 'PT_OWNERSHIP_INFO_SUB_HEADER', items: ownerCard, type: ownerInfo.length > 1 ? 'multiItem' : 'singleItem' },
            { header: 'PT_COMMON_DOCS', items: documentCard }
        ]
    }
    let pdfData ={} ;
    
    pdfData = isLegacy ? legacyPdfData:assessmentPdfData;
    
    generatePDF(UlbLogoForPdf, pdfData, fileName);

}