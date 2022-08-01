import {
    stringReplaceAll,
    getTransaltedLocality,
    convertEpochToDateDMY,
    mdmsData
  } from "./index";
  
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
  
  const getPropertyDetails = (application, t) => {
    const owners = application?.owners?.filter((owner) => owner.active == true) || [];
    const names = owners?.map(owner => owner.name)?.join(",");
    return {
      title: t("WS_COMMON_PROPERTY_DETAILS"),
      values: [
        { title: t("WS_PROPERTY_ID_LABEL"), value: t(`${application?.propertyId}`) || t("CS_NA") },
        { title: t("WS_OWN_DETAIL_NAME"), value: names || t("CS_NA") },
        { title: t("WS_PROPERTY_ADDRESS_LABEL"), value: getPropertyAddress(application?.address) || t("CS_NA") }
      ],
    };
  };
  
  
  const getConnectionHolderDetails = (owner, t) => {
    return {
      title: t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER"),
      values: owner?.connectionHolders?.length > 0 ? [
        { title: t("WS_OWN_DETAIL_NAME"), value: owner?.connectionHolders?.[0]?.name || t("CS_NA") },
        //{ title: t("WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL"), value: owner?.connectionHolders?.[0]?.gender || t("CS_NA") },
        { title: t("CORE_COMMON_MOBILE_NUMBER"), value: owner?.connectionHolders?.[0]?.mobileNumber || t("CS_NA") },
        { title: t("WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"), value: owner?.connectionHolders?.[0]?.fatherOrHusbandName || t("CS_NA") },
        //{ title: t("WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"), value: t(owner?.connectionHolders?.[0]?.relationship) || t("CS_NA") },
        //{ title: t("WS_OWNER_SPECIAL_CATEGORY"), value: owner?.connectionHolders?.[0]?.ownerType ? t(`COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}`) : t("CS_NA") },
        { title: t("WS_CORRESPONDANCE_ADDRESS_LABEL"), value: owner?.connectionHolders?.[0]?.correspondenceAddress || t("CS_NA") },
      ] : [
        { title: t("WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"), value: t("SCORE_YES") || t("CS_NA") }
      ],
    };
  };
  
  const getHeaderDetails = async (application, t,tenantId) => {
    
    const dynamicHeaderData = await mdmsData(tenantId,t)
    
    let values = [];
    if (application?.applicationNo) values.push({ title: `${t("PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL")}:`, value: application?.applicationNo });
    // if (application?.connectionNo) values.push({ title: `${t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")}:`, value: application?.connectionNo });
  
    return {
      title: "",
      isHeader: true,
      header: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_HEADER_LABEL`),
      subHeader: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_SUB_HEADER_LABEL`),
      description: t(`${application?.tenantId?.replace('.', '_')?.toUpperCase()}_DES_HEADER_LABEL`),
      typeOfApplication: application?.applicationNo?.includes("SW") ? t("WS_SEWERAGE_DISCONNECTION_APP"): t("WS_WATER_DISCONNECTION_APPLICATION"),
      date: Digit.DateUtils.ConvertEpochToDate(application?.additionalDetails?.appCreatedDate) || "NA",
      values: values,
      ...dynamicHeaderData
    }
  }
  
  const getDisconnectionDetails = (application, t) => {
    return {
        title: t("WS_DISCONNECTION_DETAILS"),
        values: [
          { title: t("WS_DISCONNECTION_TYPE"), value: application?.isDisconnectionTemporary === true ? t("WS_DISCONNECTIONTYPE_TEMPORARY") : t("WS_DISCONNECTIONTYPE_PERMANENT") || t("CS_NA") },
          { title: t("WS_PROPOSED_DISCONECTION_DATE"), value: Digit.DateUtils.ConvertEpochToDate(application?.dateEffectiveFrom) || t("CS_NA") },
          { title: t("WS_DISCONNECTION_REASON"), value: application?.disconnectionReason || t("CS_NA") },
        ],
      };
  };

  const getDocumentDetails = (application, t) => {
    const documents = application?.documents
    return {
      title: t("WS_COMMON_DOCUMENTS_DETAILS"),
      isAttachments:true,
      values: documents?.map(doc => t(doc?.documentType))
    };
  };
  
  
  const getWSDisconectionAcknowledgementData = async (application, property, tenantInfo, t) => {
    const filesArray = application?.DisconnectionResponse?.documents?.map((value) => value?.fileStoreId);
    let res;
    if (filesArray) {
      res = await Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getStateId());
    }
    const header = await getHeaderDetails(application, t, tenantInfo)
    return {
      t: t,
      tenantId: tenantInfo,
    //   title: `PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER`,
    //   name: `${t("PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER")}`,
    //   email: "",
    //   phoneNumber: "",
      headerDetails: [
        header
      ],
      details: [
        getPropertyDetails(property, t),
        getConnectionHolderDetails(application, t),
        getDisconnectionDetails(application, t),
        getDocumentDetails(application,t)
      ],
    };
  };
  
  export default getWSDisconectionAcknowledgementData;