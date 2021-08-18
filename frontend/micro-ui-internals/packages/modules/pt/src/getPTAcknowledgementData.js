import {
  getFixedFilename,
  getPropertyTypeLocale,
  getPropertyOwnerTypeLocale,
  getPropertyUsageTypeLocale,
  getPropertySubUsageTypeLocale,
  getPropertyOccupancyTypeLocale,
  getMohallaLocale,
  pdfDocumentName,
  pdfDownloadLink,
  getCityLocale,
} from "./utils";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

const getOwner = (application, t) => {
  application.owners = application?.owners.filter((owner) => owner.status == "ACTIVE") || [];
  if (application?.ownershipCategory == "INDIVIDUAL.SINGLEOWNER") {
    return {
      title: t("PT_OWNERSHIP_INFO_SUB_HEADER"),
      values: [
        { title: t("PT_OWNERSHIP_INFO_NAME"), value: application?.owners[0]?.name || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_MOBILE_NO"), value: application?.owners[0]?.mobileNumber || "N/A" },
        { title: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"), value: application?.owners[0]?.fatherOrHusbandName || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_GENDER"), value:t( application?.owners[0]?.gender) || "N/A" },
        { title: t("PT_FORM3_OWNERSHIP_TYPE"), value: t(application?.ownershipCategory) || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_EMAIL_ID"), value: application?.owners[0]?.emailId || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_USER_CATEGORY"), value: t(getPropertyOwnerTypeLocale(application?.owners[0]?.ownerType)) || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_CORR_ADDR"), value: application?.owners[0]?.permanentAddress || "N/A" },
      ],
    };
  } else if (application?.ownershipCategory.includes("INDIVIDUAL")) {
    let values = [];
    application.owners.map((owner) => {
      let doc = [
        { title: t("PT_OWNERSHIP_INFO_NAME"), value: owner?.name || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_MOBILE_NO"), value: owner?.mobileNumber || "N/A" },
        { title: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"), value: owner?.fatherOrHusbandName || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_GENDER"), value: owner?.gender || "N/A" },
        { title: t("PT_FORM3_OWNERSHIP_TYPE"), value: t(application?.ownershipCategory) || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_EMAIL_ID"), value: owner?.emailId || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_USER_CATEGORY"), value: t(getPropertyOwnerTypeLocale(owner?.ownerType)) || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_CORR_ADDR"), value: owner?.permanentAddress || "N/A" },
      ];
      values.push(...doc);
    });
    return {
      title: t("PT_OWNERSHIP_INFO_SUB_HEADER"),
      values: values,
    };
  } else if (application?.ownershipCategory.includes("INSTITUTIONAL")) {
    return {
      title: t("PT_OWNERSHIP_INFO_SUB_HEADER"),
      values: [
        { title: t("PT_COMMON_INSTITUTION_NAME"), value: application?.institution?.name || "N/A" },
        { title: t("PT_TYPE_OF_INSTITUTION"), value: application?.institution?.type || "N/A" },
        { title: t("PT_OWNER_NAME"), value: application?.institution?.nameOfAuthorizedPerson || "N/A" },
        { title: t("PT_COMMON_AUTHORISED_PERSON_DESIGNATION"), value: application?.institution?.designation || "N/A" },
        { title: t("PT_FORM3_MOBILE_NUMBER"), value: application?.owners[0]?.mobileNumber || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_TEL_PHONE_NO"), value: application?.owners[0]?.altContactNumber || "N/A" },
        { title: t("PT_OWNERSHIP_INFO_CORR_ADDR"), value: application?.owners[0]?.correspondenceAddress || "N/A" },
        { title: t("PT_FORM3_OWNERSHIP_TYPE"), value: t(application?.ownershipCategory) || "N/A" },
      ],
    };
  } else {
    return {
      title: t("PT_OWNERSHIP_INFO_SUB_HEADER"),
      values: [{ title: t("PT_NO_OWNERS"), value: "N/A" }],
    };
  }
};
const getAssessmentInfo = (application, t) => {
  let values = [
    { title: t("PT_ASSESMENT_INFO_USAGE_TYPE"), value: t(getPropertyUsageTypeLocale(application?.usageCategory)) || "N/A" },
    { title: t("PT_ASSESMENT_INFO_TYPE_OF_BUILDING"), value: t(getPropertyTypeLocale(application?.propertyType)) || "N/A" },
    { title: t("PT_ASSESMENT_INFO_PLOT_SIZE"), value: t(application?.landArea) || "N/A" },
    { title: t("PT_ASSESMENT_INFO_NO_OF_FLOOR"), value: t(application?.noOfFloors) || "N/A" },
  ];
  application.units = application?.units?.filter((unit) => unit.active == true) || [];
  let flrno,
    i = 0;
  flrno = application.units && application.units[0]?.floorNo;
  application.units.map((unit) => {
    let doc = [
      {
        title: (flrno !== unit?.floorNo ? (i = 1) : (i = i + 1)) && i === 1 ? t(`PROPERTYTAX_FLOOR_${unit?.floorNo}`) : "",
      },
      {
        title: t(""),
      },
      {
        title: t(""),
      },
      {
        title: t(""),
      },
      { title: t(`Unit${i}`) },
      {
        title: t(""),
      },
      {
        title: t(""),
      },
      {
        title: t(""),
      },
      {
        title: (flrno = unit?.floorNo) > -3 ? t("PT_ASSESSMENT_UNIT_USAGE_TYPE") : "",
        value: (flrno = unit?.floorNo) > -3 ? t(getPropertySubUsageTypeLocale(unit?.usageCategory)) || "N/A" : "",
      },
      {
        title: (flrno = unit?.floorNo) > -3 ? t("PT_ASSESMENT_INFO_OCCUPLANCY") : "",
        value: (flrno = unit?.floorNo) > -3 ? t(getPropertyOccupancyTypeLocale(unit?.occupancyType)) || "N/A" : "",
      },
      {
        title: (flrno = unit?.floorNo) > -3 ? t("PT_FORM2_BUILT_AREA") : "",
        value: (flrno = unit?.floorNo) > -3 ? t(unit?.constructionDetail?.builtUpArea) || "N/A" : "",
      },
      {
        title:
          (flrno = unit?.floorNo) > -3
            ? t(getPropertyOccupancyTypeLocale(unit?.occupancyType)) === "Rented"
              ? t("PT_FORM2_TOTAL_ANNUAL_RENT")
              : t("")
            : "",
        value: (flrno = unit?.floorNo) > -3 ? (t(getPropertyOccupancyTypeLocale(unit?.occupancyType)) === "Rented" ?  unit?.arv&&`₹${t(unit?.arv)}`||'NA' : t("")) : "",
      },
    ];

    values.push(...doc);
  });
  return {
    title: t("PT_ASSESMENT_INFO_SUB_HEADER"),
    values: values,
  };
};

const getPTAcknowledgementData = async (application, tenantInfo, t) => {
  const filesArray = application?.documents?.map((value) => value?.fileStoreId);
  const res = await Digit.UploadServices.Filefetch(filesArray, application?.tenantId.split(".")[0]);
  return {
    t: t,
    tenantId: tenantInfo?.code,
    name: `${t(tenantInfo?.i18nKey)} ${ulbCamel(t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`))}`,
    email: tenantInfo?.emailId,
    phoneNumber: tenantInfo?.contactNumber,
    heading: t("PT_ACKNOWLEDGEMENT"),
    details: [
      {
        title: t("CS_TITLE_APPLICATION_DETAILS"),
        values: [
          { title: t("PT_APPLICATION_NO"), value: application?.acknowldgementNumber },
          { title: t("PT_PROPERRTYID"), value: application?.propertyId },
          {
            title: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
            value: Digit.DateUtils.ConvertTimestampToDate(application?.auditDetails?.createdTime, "dd/MM/yyyy"),
          },
        ],
      },
      getOwner(application, t),
      getAssessmentInfo(application, t),
      {
        title: t("PT_PROPERTY_ADDRESS_SUB_HEADER"),
        values: [
          { title: t("PT_PROPERTY_ADDRESS_PINCODE"), value: application?.address?.pincode || "N/A" },
          { title: t("PT_PROPERTY_ADDRESS_CITY"), value: t(getCityLocale(application?.tenantId)) || "N/A" },
          {
            title: t("PT_PROPERTY_ADDRESS_MOHALLA"),
            value: t(`${getMohallaLocale(application?.address?.locality?.code, application?.tenantId)}`) || "N/A",
          },
          { title: t("PT_PROPERTY_ADDRESS_STREET_NAME"), value: application?.address?.street || "N/A" },
          { title: t("PT_PROPERTY_ADDRESS_HOUSE_NO"), value: application?.address?.doorNo || "N/A" },
          { title: t("PT_PROPERTY_ADDRESS_LANDMARK"), value: application?.address?.landmark || "N/A" },
        ],
      },
      {
        title: t("PT_COMMON_DOCS"),
        values:
          application.documents.length > 0
            ? application.documents.map((document, index) => {
                let documentLink = pdfDownloadLink(res?.data, document?.fileStoreId);
                return {
                  title: t(document?.documentType || "N/A"),
                  value: pdfDocumentName(documentLink, index) || "N/A",
                };
              })
            : "NA",
      },
    ],
  };
};

export default getPTAcknowledgementData;
