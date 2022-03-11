import { pdfDocumentName, pdfDownloadLink, stringReplaceAll,getTransaltedLocality } from "./index";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

const getOwnerDetails = (application, t) => {
  application.owners = application?.owners?.filter((owner) => owner.active == true) || [];
  if (application?.subOwnerShipCategory == "INDIVIDUAL.SINGLEOWNER") {
    return {
      title: t("WS_OWNERSHIP_DETAILS_HEADER"),
      values: [
        { title: t("WS_OWNER_S_NAME_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.name || t("CS_NA") },
        { title: t("WS_OWNER_S_MOBILE_NUM_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.mobileNumber || t("CS_NA") },
        { title: t("WS_NEW_OWNER_DETAILS_GENDER_LABEL"), value: t(application?.tradeLicenseDetail?.owners[0]?.gender) || t("CS_NA") },
        { title: t("WS_NEW_OWNER_DETAILS_EMAIL_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.emailId || t("CS_NA") },
        { title: t("WS_OWNER_SPECIAL_CATEGORY"), value: application?.tradeLicenseDetail?.owners[0]?.ownerType ? t(`COMMON_MASTERS_OWNERTYPE_${application?.tradeLicenseDetail?.owners[0]?.ownerType}`) : t("CS_NA") },
        { title: t("WS_NEW_OWNER_DETAILS_ADDR_LABEL"), value: application?.tradeLicenseDetail?.owners[0]?.permanentAddress || t("CS_NA") },
      ],
    };
  } else {
    let values = [];
    application?.owners.map((owner) => {
      let indOwner = [
        { title: t("WS_OWN_DETAIL_NAME"), value: owner?.name || t("CS_NA") },
        { title: t("CORE_COMMON_MOBILE_NUMBER"), value: owner?.mobileNumber || t("CS_NA") },
        { title: t("WS_OWN_DETAIL_GENDER_LABEL"), value: t(owner?.gender) || t("CS_NA") },
        { title: t("CS_PROFILE_EMAIL"), value: owner?.emailId || t("CS_NA") },
        { title: t("WS_OWNER_SPECIAL_CATEGORY"), value: owner?.ownerType ? t(`COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}`) : t("CS_NA") },
        { title: t("WS_NEW_OWNER_DETAILS_ADDR_LABEL"), value: owner?.permanentAddress || t("CS_NA") },
      ];
      values.push(...indOwner);
    });
    return {
      title: t("WS_OWNERSHIP_DETAILS_HEADER"),
      values: values,
    };
  }
};
const getPropertyDetails = (application, t) => {
  return {
    title: t("WS_COMMON_PROPERTY_DETAILS"),
    values: [
      { title: t("WS_PROPERTY_ID_LABEL"), value: t(`${application?.acknowldgementNumber}`) || t("CS_NA") },
      { title: t("WS_PROPERTY_TYPE_LABEL"), value: application?.propertyType ? t(`WS_PROPTYPE_${stringReplaceAll(application?.propertyType,".","_")}`) : t("CS_NA") },
      { title: t("WS_SERV_DETAIL_PROP_USE_TYPE"), value: application?.usageCategory || t("CS_NA") },
      { title: t("WS_PROPERTY_SUB_USAGE_TYPE_LABEL"), value: application?.usageCategory.split(".")[1] ? t(`COMMON_MASTERS_STRUCTURETYPE_${application?.usageCategory.split(".")[1] }`) : t("CS_NA") },
      { title: t("WS_PROP_DETAIL_PLOT_SIZE_LABEL"), value: application?.landArea },
      { title: t("WS_PROPERTY_NO_OF_FLOOR_LABEL"), value: application?.noOfFloors },
    ],
  };
};



const getAddressDetails = (application, t) => {
  return {
    title: "WS_ADDRESS_DETAILS",
    values: [
    { title: t("WS_PROP_DETAIL_CITY"), value: application?.address?.city || t("CS_NA") },
    { title: t("WS_PROP_DETAIL_DHNO"), value: application?.address?.doorNo || t("CS_NA") },
    { title: t("TL_LOCALIZATION_BUILDING_NO"), value: application?.tradeLicenseDetail?.address?.doorNo || t("CS_NA") },
    { title: t("WS_PROP_DETAIL_STREET_NAME"), value: application?.tradeLicenseDetail?.address?.street || t("CS_NA") },
      { title: t("CORE_COMMON_PINCODE"), value: application.address?.pincode || t("CS_NA") },
      { title: t("TL_LOCALIZATION_LOCALITY"), value: t(getTransaltedLocality(application?.address)) || t("CS_NA") },
    ],
  };
};

const getConnectionDetails = (application, t) => {
    return {
      title: "WS_COMMON_CONNECTION_DETAIL",
      values: [
      { title: t("WS_APPLY_FOR"), value: t(application?.applicationType) || t("CS_NA") },
      { title: t("WS_NO_TAPS"), value: application?.proposedTaps || t("CS_NA") },
      { title: t("WS_CONN_DETAIL_PIPE_SIZE"), value: application?.proposedPipeSize || t("CS_NA") },
      ],
    };
  };

  const getConnectionHolderDetails = (owner, t) => {
    return {
      title: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      values: [
        { title: t("WS_OWN_DETAIL_NAME"), value: owner?.connectionHolders?.name || t("CS_NA") },
        { title: t("CORE_COMMON_MOBILE_NUMBER"), value: owner?.connectionHolders?.mobileNumber || t("CS_NA") },
        { title: t("TL_GUARDIAN_S_NAME_LABEL"), value: owner?.connectionHolders?.fatherOrHusbandName || t("CS_NA") },
        { title: t("WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"), value: owner?.connectionHolders?.relationship || t("CS_NA") },
        { title: t("WS_OWN_DETAIL_GENDER_LABEL"), value: t(owner?.connectionHolders?.gender) || t("CS_NA") },
        { title: t("WS_OWNER_SPECIAL_CATEGORY"), value: owner?.connectionHolders?.ownerType ? t(`COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}`) : t("CS_NA") },
        { title: t("WS_NEW_OWNER_DETAILS_ADDR_LABEL"), value: owner?.connectionHolders?.permanentAddress || t("CS_NA") },
      ],
    };
  };

const getWSAcknowledgementData = async (application,property, tenantInfo, t) => {
  const filesArray = application?.tradeLicenseDetail?.applicationDocuments?.map((value) => value?.fileStoreId);
  let res;
  if (filesArray) {
    res = await Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getStateId());
  }
  return {
    t: t,
    tenantId: tenantInfo?.code,
    title: `PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER`,
    name: `${t("PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER")}`,
    email: "",
    phoneNumber: "",
    details: [
      getPropertyDetails(property, t),
      getAddressDetails(property, t),
      getOwnerDetails(property, t),
      getConnectionDetails(application,t),
      getConnectionHolderDetails(application,t),
      /* {
        title: t("TL_COMMON_DOCS"),
        values:
          application?.tradeLicenseDetail?.applicationDocuments?.length > 0
            ? application?.tradeLicenseDetail?.applicationDocuments.map((document, index) => {
              let documentLink = pdfDownloadLink(res?.data, document?.fileStoreId);
              return {
                title: t(`TL_NEW_${document?.documentType}` || t("CS_NA")),
                value: pdfDocumentName(documentLink, index) || t("CS_NA"),
              };
            })
            : [],
      }, */
    ],
  };
};

export default getWSAcknowledgementData;