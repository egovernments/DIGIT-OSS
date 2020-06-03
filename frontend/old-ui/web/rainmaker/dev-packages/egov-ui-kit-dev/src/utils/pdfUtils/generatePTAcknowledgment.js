import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { getAssessmentInfo, getUnitInfo } from "../../common/propertyTax/Property/components/AssessmentInfo";
import { getOwnerInfo } from "../../common/propertyTax/Property/components/OwnerInfo";
import { getAddressItems } from "../../common/propertyTax/Property/components/PropertyAddressInfo";
import { generatePDF } from "./generatePDF";
import get from "lodash/get";

export const generatePTAcknowledgment = (property, generalMDMSDataById, UlbLogoForPdf, fileName = "download") => {

    property.subOwnershipCategory = get(property,'propertyDetails[0].subOwnershipCategory','');
    const addressCard = getAddressItems(property);
    property.owners = property.owners.filter(owner => owner.status == "ACTIVE")
    const ownerCard = getOwnerInfo(property, generalMDMSDataById);
    const assessmentCard = getAssessmentInfo(get(property,'propertyDetails[0]',{}), generalMDMSDataById);
    const unitCard = getUnitInfo(get(property,"propertyDetails[0].units",[]), property);
    let ownerInfoCard = ownerCard[0].items.filter(item => item);
    const documentCard = property.documentsUploaded.map(item => {
        return { key: getLocaleLabels(item.title, item.title), value: item.name }
    })
    if (ownerCard.length > 1) {
        let items = [];
        ownerCard.map((owner, index) => {
            items.push({ header: getLocaleLabels(`PT_OWNER_${index}`, `PT_OWNER_${index}`), items: owner.items.filter(item => item) })
        })
        ownerInfoCard = items
    }
    let unitInfoCard = []
    if (unitCard.length >= 1) {
        let unitItems = [];
        unitCard.map((unit, index) => {
            if (unit.length > 1) {
                let unitItem = { items: unit[0] }
                if (get(property,'propertyDetails[0].propertySubType','') !== "SHAREDPROPERTY") {
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
                if (get(property,'propertyDetails[0].propertySubType','') !== "SHAREDPROPERTY") {
                    unitItem.header = getLocaleLabels(`PROPERTYTAX_FLOOR_${index}`, `PROPERTYTAX_FLOOR_${index}`);
                }
                unitItems.push(unitItem)
            }

        })
        unitInfoCard = unitItems
    }

    let pdfData = {
        header: "PT_ACKNOWLEDGEMENT", tenantId: "pb.amritsar", applicationNoHeader:
            'PT_PROPERRTYID', additionalHeader: "PT_APPLICATION_NO", applicationNoValue:
            property.propertyId, additionalHeaderValue: property.acknowldgementNumber, cards:
            [{ header: "PT_PROPERTY_ADDRESS_SUB_HEADER", items: addressCard },
            { header: "PT_ASSESMENT_INFO_SUB_HEADER", items: assessmentCard },
            { items: unitInfoCard, type: "multiItem" },
            { header: 'PT_OWNERSHIP_INFO_SUB_HEADER', items: ownerInfoCard, type: ownerCard.length > 1 ? 'multiItem' : 'singleItem' },
            { header: 'PT_COMMON_DOCS', items: documentCard }]
    }

    generatePDF(UlbLogoForPdf, pdfData, fileName);
}