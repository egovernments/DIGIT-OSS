// import { tradeInstitutionDetails, tradeOwnerDetails } from "egov-tradelicence/ui-config/screens/specs/tradelicence/applyResource/review-owner";
// import { tradeAccessoriesDetails, tradeLocationDetails, tradeReviewDetails, tradetypeDetails } from "egov-tradelicence/ui-config/screens/specs/tradelicence/applyResource/review-trade";
import { billAmendDemandRevisionContainer } from "egov-billamend/ui-config/screens/specs/bill-amend/search-preview";
import { generateKeyValue, generatePDF, getDocumentsCard, getEstimateCardDetails } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import { getFromObject } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { getEstimateCardDetailsBillAmend } from "./generatePDF";

const getDate=(date)=>{

    let dateObj=new Date(date);
    return `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getYear()+1900}`;
    }
    const updateEstimate = (fees = [], searchBillDetails = {}) => {
        let amountType = "reducedAmount";
    
        let newFee = {};
        fees && Array.isArray(fees) && fees.map(fee => {
            amountType = fee.amountType;
            newFee[fee.taxHeadMasterCode] = { ...fee }
        })
        let newFees = [];
        Object.keys(searchBillDetails).map(key => {
            if (key != 'TOTAL') {
                newFees.push({ taxHeadMasterCode: key, taxAmount: getFromObject(newFee, `${key}.taxAmount`, 0) == 0 ? '0' : getFromObject(newFee, `${key}.taxAmount`, 0), amountType });
            }
    
        })
    
        return newFees;
    }
export const generateBillAmendAcknowledgement = (preparedFinalObject, fileName = "acknowledgement.pdf") => {

    billAmendDemandRevisionContainer.demandRevisionBasis.localiseValue = true;
 
    let UlbLogoForPdf = getFromObject(preparedFinalObject, 'UlbLogoForPdf', '');
    let Amendment = getFromObject(preparedFinalObject, 'Amendment', {});

    const modifiedDemand = { ...billAmendDemandRevisionContainer };
    let demandRevisionBasis = getFromObject(Amendment, "amendmentReason", "");
    switch (demandRevisionBasis) {
        case "COURT_CASE_SETTLEMENT":
            delete modifiedDemand.govtNotificationNumber;
            delete modifiedDemand.fromDate
            delete modifiedDemand.toDate
            break;
        case "ARREAR_WRITE_OFF":
        case "ONE_TIME_SETTLEMENT":
            delete modifiedDemand.courtOrderNo
            delete modifiedDemand.dateEffectiveFrom
            delete modifiedDemand.documentNo
            break;
        case "DCB_CORRECTION":
        case "REMISSION_FOR_PROPERTY_TAX":
        case "OTHERS":
            delete modifiedDemand.courtOrderNo
            delete modifiedDemand.dateEffectiveFrom
            delete modifiedDemand.govtNotificationNumber
            break;
        default:
            delete modifiedDemand.courtOrderNo
            delete modifiedDemand.dateEffectiveFrom
            delete modifiedDemand.govtNotificationNumber
    }
    const searchBillDetails = getFromObject(preparedFinalObject, 'Amendment.additionalDetails.searchBillDetails', {});
    let demandDetails = getFromObject(preparedFinalObject, 'Amendment.demandDetails', []);
    const estimateCardData = [{
        name: {
            labelName: 'BILL_TAX_HEADS',
            labelKey: 'BILL_TAX_HEADS'
        },
        value1: getLocaleLabels('BILL_OLD_AMOUNT','BILL_OLD_AMOUNT'),
        value2: getLocaleLabels('BILL_UPDATED_AMOUNT','BILL_UPDATED_AMOUNT'),
        value: getLocaleLabels('BILL_REDUCED_AMOUNT_RS','BILL_REDUCED_AMOUNT_RS')
    }]
    demandDetails=updateEstimate(demandDetails,searchBillDetails);



    demandDetails.map(demand => {
        if(typeof demand.taxAmount== "number"){
            if( demand.taxAmount > 0 ){
                estimateCardData[0].value=getLocaleLabels('DEBIT_NOTE','DEBIT_NOTE');
              }else{
                estimateCardData[0].value=getLocaleLabels('CREDIT_NOTE','CREDIT_NOTE');
              }
        }
       
        estimateCardData.push({
            name: {
                labelName: demand.taxHeadMasterCode,
                labelKey: demand.taxHeadMasterCode
            },
            value1:getFromObject(searchBillDetails, demand.taxHeadMasterCode, 0),
            value2:demand.taxAmount < 0 ? Number(getFromObject(searchBillDetails, demand.taxHeadMasterCode, 0)) - Math.abs(Number(demand.taxAmount)) : Number(getFromObject(searchBillDetails, demand.taxHeadMasterCode, 0)) + Number(demand.taxAmount),
            value: demand.taxAmount == 0 ? '0' : Math.abs(demand.taxAmount)
        })
    })
    
    const documentsUploadRedux = getFromObject(preparedFinalObject, 'bill-amend-review-document-data', []);
    const documentCard = getDocumentsCard(documentsUploadRedux);
    const estimateDetails = getEstimateCardDetailsBillAmend(estimateCardData, undefined, false, true,true)
    const billAmendDemandRevisionSummary = generateKeyValue(preparedFinalObject, modifiedDemand);

    let pdfData = {
        header: "BILLAMEND_APPLICATION", tenantId: 'pb.amritsar',
        applicationNoHeader: 'BILLAMEND_APPLICATIONNO', applicationNoValue: Amendment.amendmentId,
        additionalHeader: "BILLAMEND_APPLICATIONDATE", additionalHeaderValue:getDate(Amendment.auditDetails.createdTime) ,
        cards: [
            { header: "BILL_ADJUSTMENT_AMOUNT_DETAILS", type: 'header' },
            { items: estimateDetails, type: 'estimate' },
            { header: "BILL_DEMAND_REVISION_BASIS_DETAILS", items: billAmendDemandRevisionSummary },
            { header: 'BILL_DOCUMENTS', items: documentCard }]
    }

    generatePDF(UlbLogoForPdf, pdfData, fileName,true);
}