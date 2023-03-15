import {
    stringReplaceAll,
    getTransaltedLocality,
    convertEpochToDateDMY,
    mdmsData
} from "./index";

function getReasonDocNoHeader(amendmentReason){
    if(amendmentReason === "COURT_CASE_SETTLEMENT")
    return "WS_COURT_ORDER_NO";
    else if(amendmentReason === "ARREAR_WRITE_OFF" || amendmentReason === "ONE_TIME_SETTLEMENT")
    return "WS_GOVERNMENT_NOTIFICATION_NUMBER";
    else
    return "WS_DOCUMENT_NO";
  }

const getHeaderDetails = async (application, t,tenantId) => {
    const dynamicHeaderData = await mdmsData(tenantId, t)
    let values = [];
    if (application?.amendmentId) values.push({ title: `${t("PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL")}:`, value: application?.amendmentId });
    if (application?.consumerCode) values.push({ title: `${t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")}:`, value: application?.consumerCode });

    const DemandRevision = {
        title:t("WS_DEMAND_REVISION_BASIS_DETAILS"),
        values:[
            {
                title:t("WS_DEMAND_REVISION_BASIS"),
                value: t(application?.amendmentReason) || t("CS_NA")
            },
            {
                title: t(getReasonDocNoHeader(application?.amendmentReason)),
                value: application?.reasonDocumentNumber || t("CS_NA")
            },
            {
                title: t("WS_COMMON_FROM_DATE_LABEL"),
                value: convertEpochToDateDMY(application?.effectiveFrom)
            },
            {...application?.amendmentReason !== "COURT_CASE_SETTLEMENT" && {   
                title: t("WS_COMMON_TO_DATE_LABEL"),
                value: convertEpochToDateDMY(application?.effectiveTill)
            }}
            ]
    }

    const documents = application?.documents

    const Attachments = {
        title: t("WS_COMMON_DOCUMENTS_DETAILS"),
        isAttachments: true,
        values: documents?.map(doc => t(doc?.documentType))
    }

    return {
        title: "",
        isHeader: true,
        header: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_HEADER_LABEL`),
        subHeader: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_SUB_HEADER_LABEL`),
        description: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_DES_HEADER_LABEL`),
        typeOfApplication: t("WS_BILL_AMEND_APP"),
        date: Digit.DateUtils.ConvertEpochToDate(application?.auditDetails?.createdTime) || "NA",
        values: values,
        DemandRevision,
        Attachments,
        ...dynamicHeaderData
    }
}


const getWSAcknowledgementData = async (amendment,tenantInfo,t,tableData,app) => {
    const header = await getHeaderDetails(amendment,t,tenantInfo)
    return {
        tenantId: tenantInfo,
        headerDetails: header
        ,
        bodyDetails: tableData[1],
        t
        ,
    };
};

export default getWSAcknowledgementData;