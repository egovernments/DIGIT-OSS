import {
    stringReplaceAll,
    getTransaltedLocality,
    convertEpochToDateDMY,
    mdmsData
} from "./index";

const compare = (newVal, oldVal, t) => {
    return oldVal === newVal ? t("WS_NO_CHANGE") : oldVal
}
const getPropertyAddress = (property) => {
    const doorNo = property?.doorNo;
    const street = property?.street;
    const landMark = property?.landmark;
    const locality = property?.locality?.name;
    const city = property?.city;
    const pinCode = property?.pincode;
    const formattedAddress = `${doorNo ? doorNo + ", " : ""}${street ? street + ", " : ""}${landMark ? landMark + ", " : ""}${locality ? locality + ", " : ""}${city ? city : ""}${pinCode ? ", " + pinCode : ""}`
    return formattedAddress;
}

const getPropertyDetails = (application, oldApplication, t) => {
    const owners = application?.owners?.filter((owner) => owner.active == true) || [];
    const names = owners?.map(owner => owner.name)?.join(",");
    const oldOwners = oldApplication?.owners?.filter((owner) => owner.active == true) || [];
    const oldNames = oldOwners?.map(owner => owner.name)?.join(",");
    const changeInNames = !(oldNames === names)
    return {
        title: [t("WS_COMMON_PROPERTY_DETAILS"), t("WS_CURRENT_VALUE"), t("WS_OLD_VALUE")],
        values: [
            { val1: t("WS_PROPERTY_ID_LABEL"), val2: t(`${application?.propertyId}`) || t("CS_NA"), val3: compare(application?.propertyId, oldApplication?.propertyId, t) },
            { val1: t("WS_OWN_DETAIL_NAME"), val2: names || t("CS_NA"), val3: changeInNames ? oldNames : t("WS_NO_CHANGE") },
            { val1: t("WS_PROPERTY_ADDRESS_LABEL"), val2: getPropertyAddress(application?.address) || t("CS_NA"), val3: changeInNames ? getPropertyAddress(oldApplication?.address) : t("WS_NO_CHANGE") }
        ],
    };
};
const getConnectionDetails = (application, oldApplication, t) => {
    return {
        title: [t("WS_COMMON_CONNECTION_DETAILS"), t(""), t("")],
        values: application?.applicationType == "MODIFY_WATER_CONNECTION" ? [
            { val1: t("WS_SERV_DETAIL_CONN_TYPE"), val2: application?.connectionType, val3: compare(application?.connectionType, oldApplication?.connectionType, t) },
            { val1: t("WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED"), val2: application?.noOfTaps || t("CS_NA"), val3: compare(application?.noOfTaps, oldApplication?.noOfTaps, t) },
            { val1: t("WS_TASK_DETAILS_CONN_DETAIL_PIPE_SIZE_PROPOSED"), val2: application?.pipeSize || t("CS_NA"), val3: compare(application?.pipeSize, oldApplication?.pipeSize, t) },
            { val1: t("WS_SERV_DETAIL_WATER_SOURCE"), val2: t(`WS_SERVICES_MASTERS_WATERSOURCE_${application?.waterSource.split(".")[0]}`), val3: compare(t(`WS_SERVICES_MASTERS_WATERSOURCE_${application?.waterSource.split(".")[0]}`), t(`WS_SERVICES_MASTERS_WATERSOURCE_${oldApplication?.waterSource.split(".")[0]}`), t) },
            { val1: t("WS_SERV_DETAIL_WATER_SUB_SOURCE"), val2: t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(application?.waterSource, ".", "_")}`), val3: compare(t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(application?.waterSource, ".", "_")}`), t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(oldApplication?.waterSource, ".", "_")}`), t) },
            { val1: t("WS_SERV_DETAIL_CONN_EXECUTION_DATE"), val2: convertEpochToDateDMY(application?.connectionExecutionDate), val3: compare(application?.connectionExecutionDate, oldApplication?.connectionExecutionDate, t) !== t("WS_NO_CHANGE") ? convertEpochToDateDMY(compare(application?.connectionExecutionDate, oldApplication?.connectionExecutionDate, t)) : t("WS_NO_CHANGE") },
            { val1: t("WS_SERV_DETAIL_METER_ID"), val2: application?.meterId, val3: compare(application?.meterId, oldApplication?.meterId, t) },
            { val1: t("WS_ADDN_DETAIL_METER_INSTALL_DATE"), val2: convertEpochToDateDMY(application?.meterInstallationDate), val3: compare(convertEpochToDateDMY(application?.meterInstallationDate), convertEpochToDateDMY(oldApplication?.meterInstallationDate), t) },
            { val1: t("WS_INITIAL_METER_READING_LABEL"), val2: application?.additionalDetails?.initialMeterReading || t("CS_NA"), val3: compare(application?.additionalDetails?.initialMeterReading, oldApplication?.additionalDetails?.initialMeterReading, t) },
            { val1: t("WS_MODIFICATIONS_EFFECTIVE_DATE"), val2: convertEpochToDateDMY(application?.dateEffectiveFrom), val3: compare(convertEpochToDateDMY(application?.dateEffectiveFrom), convertEpochToDateDMY(oldApplication?.dateEffectiveFrom), t) }
        ] : [
            { val1: t("WS_SERV_DETAIL_CONN_TYPE"), val2: application?.connectionType, val3: compare(application?.connectionType, oldApplication?.connectionType, t) },
            { val1: t("WS_NO_WATER_CLOSETS_LABEL"), val2: application?.noOfWaterClosets || t("CS_NA"), val3: compare(application?.noOfWaterClosets, oldApplication?.noOfWaterClosets, t) },
            { val1: t("WS_SERV_DETAIL_NO_OF_TOILETS"), val2: application?.noOfToilets || t("CS_NA"), val3: compare(application?.noOfToilets, oldApplication?.noOfToilets, t) },
            { val1: t("WS_SERV_DETAIL_CONN_EXECUTION_DATE"), val2: convertEpochToDateDMY(application?.connectionExecutionDate), val3: compare(application?.connectionExecutionDate, oldApplication?.connectionExecutionDate, t) },
            { val1: t("WS_MODIFICATIONS_EFFECTIVE_DATE"), val2: convertEpochToDateDMY(application?.dateEffectiveFrom), val3: compare(convertEpochToDateDMY(application?.dateEffectiveFrom), convertEpochToDateDMY(oldApplication?.dateEffectiveFrom), t) }
        ],
    };
};

const getConnectionHolderDetails =  (application, oldApplication, t) => {
    const oldOwnerExist = oldApplication?.connectionHolders?.length > 0
    const newOwnerExist = application?.connectionHolders?.length > 0

    if (oldOwnerExist && newOwnerExist) {
        return {
            title: [t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"), t(""), t("")],
            values: [
                { val1: t("WS_OWN_DETAIL_NAME"), val2: application?.connectionHolders?.[0]?.name || t("CS_NA"), val3: compare(application?.connectionHolders?.[0]?.name, oldApplication?.connectionHolders?.[0]?.name, t) },
                { val1: t("CORE_COMMON_MOBILE_NUMBER"), val2: application?.connectionHolders?.[0]?.mobileNumber || t("CS_NA"), val3: compare(application?.connectionHolders?.[0]?.mobileNumber, oldApplication?.connectionHolders?.[0]?.mobileNumber, t) },
                { val1: t("WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"), val2: application?.connectionHolders?.[0]?.fatherOrHusbandName || t("CS_NA"), val3: compare(application?.connectionHolders?.[0]?.fatherOrHusbandName, oldApplication?.connectionHolders?.[0]?.fatherOrHusbandName, t) },
                { val1: t("WS_CORRESPONDANCE_ADDRESS_LABEL"), val2: application?.connectionHolders?.[0]?.correspondenceAddress || t("CS_NA"), val3: compare(application?.connectionHolders?.[0]?.correspondenceAddress, oldApplication?.connectionHolders?.[0]?.correspondenceAddress, t) },
            ]
        }
    }
    else if (newOwnerExist && !oldOwnerExist) {
        return {
            title: [t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"), t(""), t("")],
                values: [
                    { val1: t("WS_OWN_DETAIL_NAME"), val2: application?.connectionHolders?.[0]?.name || t("CS_NA"), val3: t("WS_SAME_AS_PROPERTY_OWNERS") },
                    { val1: t("CORE_COMMON_MOBILE_NUMBER"), val2: application?.connectionHolders?.[0]?.mobileNumber || t("CS_NA"), val3: t("WS_SAME_AS_PROPERTY_OWNERS") },
                    { val1: t("WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"), val2: application?.connectionHolders?.[0]?.fatherOrHusbandName || t("CS_NA"), val3: t("WS_SAME_AS_PROPERTY_OWNERS") },
                    { val1: t("WS_CORRESPONDANCE_ADDRESS_LABEL"), val2: application?.connectionHolders?.[0]?.correspondenceAddress || t("CS_NA"), val3: t("WS_SAME_AS_PROPERTY_OWNERS") },
                ]
        }
    }
    else if (!newOwnerExist && oldOwnerExist) {
        return {
            title: [t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"), t(""), t("")],
            values: [
                { val1: t("WS_OWN_DETAIL_NAME"), val3: oldApplication?.connectionHolders?.[0]?.name || t("CS_NA"), val2: t("WS_SAME_AS_PROPERTY_OWNERS") },
                { val1: t("CORE_COMMON_MOBILE_NUMBER"), val3: oldApplication?.connectionHolders?.[0]?.mobileNumber || t("CS_NA"), val2: t("WS_SAME_AS_PROPERTY_OWNERS") },
                { val1: t("WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"), val3: oldApplication?.connectionHolders?.[0]?.fatherOrHusbandName || t("CS_NA"), val2: t("WS_SAME_AS_PROPERTY_OWNERS") },
                { val1: t("WS_CORRESPONDANCE_ADDRESS_LABEL"), val3: oldApplication?.connectionHolders?.[0]?.correspondenceAddress || t("CS_NA"), val2: t("WS_SAME_AS_PROPERTY_OWNERS") },
            ]
        }
    }
    else {
        return {
            title: [t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"), t(""), t("")],
            values: [{ val1: t("WS_SAME_AS_PROPERTY_OWNERS"), val2: t("SCORE_YES") || t("CS_NA"), val3: t("SCORE_YES") }]
        }
    }
};
const getHeaderDetails = async (application, t,tenantId) => {
    const dynamicHeaderData = await mdmsData(tenantId, t)

    let values = [];
    if (application?.applicationNo) values.push({ title: `${t("PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL")}:`, value: application?.applicationNo });
    if (application?.connectionNo) values.push({ title: `${t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")}:`, value: application?.connectionNo });

    return {
        title: "",
        isHeader: true,
        header: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_HEADER_LABEL`),
        subHeader: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_SUB_HEADER_LABEL`),
        description: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_DES_HEADER_LABEL`),
        typeOfApplication: application?.applicationNo?.includes("SW") ? t("CS_COMMON_INBOX_MODIFYSWCONNECTION") : t("WS_COMMON_INBOX_MODIFYWSCONNECTION"),
        date: Digit.DateUtils.ConvertEpochToDate(application?.auditDetails?.createdTime) || "NA",
        values: values,
        ...dynamicHeaderData
    }
}


const getDocumentDetails = (application, t) => {
    const documents = application?.documents
    return {
        title: t("WS_COMMON_DOCUMENTS_DETAILS"),
        isAttachments: true,
        values: documents?.length > 0 ? documents?.map(doc => t(doc?.documentType)) : [t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")]
    };
};

const getWSAcknowledgementData = async (newApplication, property, tenantInfo, t, oldApplication) => {
    
    const header = await getHeaderDetails(newApplication,t,tenantInfo)
    const oldPropertyData = await Digit.PTService.search({ tenantId: tenantInfo, filters: { propertyIds: oldApplication?.propertyId } })
    const oldProperty = oldPropertyData?.Properties?.[0]
    return {
        tenantId: tenantInfo,
        headerDetails: [
            header
        ],
        bodyDetails: [
            getPropertyDetails(property, oldProperty, t),
            getConnectionHolderDetails(newApplication, oldApplication, t),
            getConnectionDetails(newApplication, oldApplication, t),
            getDocumentDetails(newApplication, t)
        ],
    };
};

export default getWSAcknowledgementData;