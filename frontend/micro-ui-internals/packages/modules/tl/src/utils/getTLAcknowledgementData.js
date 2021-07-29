import { pdfDocumentName, pdfDownloadLink, stringReplaceAll } from "./index";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

const getOwnerDetails = (application, t) => {
  application.owners = application?.tradeLicenseDetail?.owners?.filter((owner) => owner.active == true) || [];
  if (application?.tradeLicenseDetail?.subOwnerShipCategory == "INDIVIDUAL.SINGLEOWNER") {
    return {
      title: t("TL_OWNERSHIP_DETAILS_HEADER"),
      values: [
        { title: t("TL_OWNER_S_NAME_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.name || "NA" },
        { title: t("TL_OWNER_S_MOBILE_NUM_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.mobileNumber || "NA" },
        { title: t("TL_GUARDIAN_S_NAME_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.fatherOrHusbandName || "NA" },
        { title: t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.relationship || "NA" },
        { title: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.gender || "NA" },
        { title: t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.emailId || "NA" },
        { title: t("TL_OWNER_SPECIAL_CATEGORY"), value: application?.tradeLicenseDetail?.owners[0]?.ownerType ? t(`COMMON_MASTERS_OWNERTYPE_${application?.tradeLicenseDetail?.owners[0]?.ownerType}`) : "NA" },
        { title: t("TL_NEW_OWNER_DETAILS_ADDR_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.permanentAddress || "NA" },
      ],
    };
  } else { //if (application?.subOwnerShipCategory?.includes("INDIVIDUAL"))
    let values = [];
    application?.tradeLicenseDetail.owners.map((owner) => {
      let indOwner = [
        { title: t("TL_OWNER_S_NAME_LABEL"), value: owner?.name || "NA" },
        { title: t("TL_OWNER_S_MOBILE_NUM_LABEL"), value: owner?.mobileNumber || "NA" },
        { title: t("TL_GUARDIAN_S_NAME_LABEL"), value: owner?.fatherOrHusbandName || "NA" },
        { title: t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL"), value: owner?.relationship || "NA" },
        { title: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"), value: owner?.gender || "NA" },
        { title: t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL"), value: owner?.emailId || "NA" },
        { title: t("TL_OWNER_SPECIAL_CATEGORY"), value: owner?.ownerType ? t(`COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}`) : "NA" },
        { title: t("TL_NEW_OWNER_DETAILS_ADDR_LABEL"), value: owner?.permanentAddress || "NA" },
      ];
      values.push(...indOwner);
    });
    return {
      title: t("TL_OWNERSHIP_DETAILS_HEADER"),
      values: values,
    };
  }
};
const getTradeDetails = (application, t) => {
  return {
    title: t("TL_COMMON_TR_DETAILS"),
    values: [
      { title: t("TL_APPLICATION_TYPE"), value: application?.applicationType || "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"), value: application?.licenseType ? t(`TRADELICENSE_LICENSETYPE_${application?.licenseType}`) : "NA" },
      { title: t("TL_COMMON_TABLE_COL_TRD_NAME"), value: application?.tradeName || "NA" },
      { title: t("reports.tl.fromDate"), value: application?.validFrom ? Digit.DateUtils.ConvertTimestampToDate(application?.validFrom, "dd/MM/yyyy") : "NA" },
      { title: t("reports.tl.toDate"), value: application?.validTo ? Digit.DateUtils.ConvertTimestampToDate(application?.validTo, "dd/MM/yyyy") : "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL"), value: application?.tradeLicenseDetail?.structureType ? t(`COMMON_MASTERS_STRUCTURETYPE_${application?.tradeLicenseDetail?.structureType?.split('.')[0]}`) : "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL"), value: application?.tradeLicenseDetail?.structureType ? t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(application?.tradeLicenseDetail?.structureType, ".", "_")}`) : "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"), value: Digit.DateUtils.ConvertTimestampToDate(application?.commencementDate, "dd/MM/yyyy") || "NA", },
      { title: t("TL_NEW_GST_NUMBER_LABEL"), value: application?.tradeLicenseDetail?.additionalDetail?.gstNo || "NA" },
      { title: t("TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL"), value: application?.tradeLicenseDetail?.operationalArea || "NA" },
      { title: t("TL_NEW_NUMBER_OF_EMPLOYEES_LABEL"), value: application?.tradeLicenseDetail?.noOfEmployees || "NA" },
    ],
  };
};
const getAccessoriesDetails = (application, t) => {
  let values = [];
  application.tradeLicenseDetail?.accessories?.map((accessory) => {
    let accessoryCategory = "NA";
    if (accessory?.accessoryCategory) {
      accessoryCategory = stringReplaceAll(accessory?.accessoryCategory, ".", "_");
      accessoryCategory = t(`TRADELICENSE_ACCESSORIESCATEGORY_${stringReplaceAll(accessoryCategory, "-", "_")}`);
    }
    let value = [
      { title: t("TL_NEW_TRADE_DETAILS_ACC_LABEL"), value: accessoryCategory },
      { title: t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"), value: accessory?.uom || "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"), value: accessory?.uomValue || "NA" },
      { title: t("TL_ACCESSORY_COUNT_LABEL"), value: accessory?.count || "NA" }
    ];
    values.push(...value);
  });

  return {
    title: "",
    values: values,
  };
};

const getTradeUnitsDetails = (application, t) => {
  let values = [];
  application.tradeLicenseDetail?.tradeUnits?.map((unit) => {
    let tradeSubType = stringReplaceAll(unit?.tradeType, ".", "_");
    tradeSubType = stringReplaceAll(tradeSubType, "-", "_");
    let value = [
      { title: t("TRADELICENSE_TRADECATEGORY_LABEL"), value: unit?.tradeType ? t(`TRADELICENSE_TRADETYPE_${unit?.tradeType?.split('.')[0]}`) : "NA" },
      { title: t("TRADELICENSE_TRADETYPE_LABEL"), value: unit?.tradeType ? t(`TRADELICENSE_TRADETYPE_${unit?.tradeType?.split('.')[1]}`) : "NA" },
      { title: t("TL_NEW_TRADE_SUB_TYPE_LABEL"), value: tradeSubType ? t(`TRADELICENSE_TRADETYPE_${tradeSubType}`) : "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"), value: unit?.uom || "NA" },
      { title: t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"), value: unit?.uomValue || "NA" },
      { title: "", value: ""},
      { title: "", value: ""},
      { title: "", value: ""}
    ];
    values.push(...value);
  });

  return {
    title: "",
    values: values,
  };
};

const getAddressDetails = (application, t) => {
  return {
    title: "",
    values: [
      { title: t("CORE_COMMON_PINCODE"), value: application?.tradeLicenseDetail?.address?.pincode || "NA" },
      { title: t("MYCITY_CODE_LABEL"), value: t(application?.tradeLicenseDetail?.address?.city) || "NA" },
      { title: t("TL_LOCALIZATION_LOCALITY"), value: t(`TENANTS_MOHALLA_${application?.tradeLicenseDetail?.address?.locality?.code}`) || "NA" },
      { title: t("TL_LOCALIZATION_BUILDING_NO"), value: application?.tradeLicenseDetail?.address?.doorNo || "NA" },
      { title: t("TL_LOCALIZATION_STREET_NAME"), value: application?.tradeLicenseDetail?.address?.street || "NA" }
    ],
  };
};

const getPTAcknowledgementData = async (application, tenantInfo, t) => {
  const filesArray = application?.tradeLicenseDetail?.applicationDocuments?.map((value) => value?.fileStoreId);
  let res;
  if (filesArray) {
    res = await Digit.UploadServices.Filefetch(filesArray, application?.tenantId.split(".")[0]);
  }
  return {
    t: t,
    tenantId: tenantInfo?.code,
    title: `${t(tenantInfo?.i18nKey)} ${ulbCamel(t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`))}`,
    name: `${t(tenantInfo?.i18nKey)} ${ulbCamel(t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`))}`,
    email: "",
    phoneNumber: "",
    details: [
      // {
      //   title: t("NOC_TASK_DETAILS_HEADER"),
      //   values: [
      //     { title: t("TL_COMMON_TABLE_COL_LIC_NO"), value: application?.licenseNumber || "NA" },
      //     { title: t("TL_COMMON_TABLE_COL_APP_NO"), value: application?.applicationNumber },
      //     {
      //       title: t("TL_COMMON_TABLE_COL_APP_DATE"),
      //       value: Digit.DateUtils.ConvertTimestampToDate(application?.applicationDate, "dd/MM/yyyy"),
      //     },
      //   ],
      // },
      getTradeDetails(application, t),
      getTradeUnitsDetails(application, t),
      getAccessoriesDetails(application, t),
      getAddressDetails(application, t),
      getOwnerDetails(application, t),
      {
        title: t("TL_COMMON_DOCS"),
        values:
          application?.tradeLicenseDetail?.applicationDocuments?.length > 0
            ? application?.tradeLicenseDetail?.applicationDocuments.map((document, index) => {
              let documentLink = pdfDownloadLink(res?.data, document?.fileStoreId);
              return {
                title: t(`TL_NEW_${document?.documentType}` || "NA"),
                value: pdfDocumentName(documentLink, index) || "NA",
              };
            })
            : [],
      },
    ],
  };
};

export default getPTAcknowledgementData;
