import React from "react";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
// import { connect } from "react-redux";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import PropertyInfoCard from "../PropertyInfoCard";

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

const getOwnerInfo = (latestPropertyDetails, generalMDMSDataById) => {
  const isInstitution =
    latestPropertyDetails.ownershipCategory === "INSTITUTIONALPRIVATE" || latestPropertyDetails.ownershipCategory === "INSTITUTIONALGOVERNMENT";
  const { institution, owners: ownerDetails = [] } = latestPropertyDetails || {};
  let owner = [];
  if (ownerDetails && (ownerDetails.length > 0)) {
    owner = ownerDetails[0];
  }

  return (
    ownerDetails && ownerDetails.map((owner) => {
      return ({
        items: [
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_INSTI", localizationLabelsData),
              value: (institution && institution.name) || "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME", localizationLabelsData),
              value: owner.name || "NA",
            },
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_DESIGNATION", localizationLabelsData),
              value: institution.designation || "NA",
            }
            : {
              key: getTranslatedLabel("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", localizationLabelsData),
              value: owner.fatherOrHusbandName || "NA",
            },
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
              value:
                (institution &&
                  institution.type &&
                  generalMDMSDataById &&
                  generalMDMSDataById["SubOwnerShipCategory"] &&
                  generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_GENDER", localizationLabelsData),
              value: owner.gender || "NA",
            },
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
              value:
                (institution &&
                  institution.type &&
                  generalMDMSDataById &&
                  generalMDMSDataById["SubOwnerShipCategory"] &&
                  generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_DOB", localizationLabelsData),
              value: owner.dob || "NA",
            },
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_OF_AUTH", localizationLabelsData),
              value: owner.name || "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
              value: owner.mobileNumber || "NA",
            },
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_TEL_NO", localizationLabelsData),
              value: owner.altContactNumber || "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_EMAIL_ID", localizationLabelsData),
              value: owner.emailId || "NA",
            },
          isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
              value: owner.mobileNumber || "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_USER_CATEGORY", localizationLabelsData),
              value:
                (owner &&
                  owner.ownerType &&
                  generalMDMSDataById &&
                  generalMDMSDataById["OwnerType"] &&
                  generalMDMSDataById["OwnerType"][owner.ownerType].name) ||
                "NA",
            }, isInstitution
            ? {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
              value: owner.correspondenceAddress  || "NA",
            }
            : {
              key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
              value: owner.permanentAddress|| "NA",    
            },
        ]
      })
    })
  )

};
const formatOwnerInfo = (itemsArray = []) => {
  let ownersInfo = []
  if (itemsArray.length == 1) {
    ownersInfo = itemsArray[0].items;
  } else {
    const emptySpaces = [{ key: ' ', value: ' ' }, { key: ' ', value: ' ' }, { key: ' ', value: ' ' }];
    const ownerHeader = { key: ' ', value: 'Owner-' };
    for (let index = 0; index < itemsArray.length; index++) {
      let ownerInfo = [];
      ownerInfo = itemsArray[index].items;    
      ownerInfo.unshift(...emptySpaces);
      ownerInfo.unshift({ ...ownerHeader, value: ownerHeader.value + '' + (index + 1) });
      ownersInfo.push(...ownerInfo)
    }
  }
  return ownersInfo;
}

const OwnerInfo = ({ properties, editIcon }) => {
  let ownerItems = [];
  const header = 'PT_OWNERSHIP_INFO_SUB_HEADER';
  if (properties) {
    const { propertyDetails } = properties;
    if (propertyDetails && propertyDetails.length > 0) {
      ownerItems = formatOwnerInfo(getOwnerInfo(propertyDetails[0]));
    }
  }
  return (
    <PropertyInfoCard editIcon={editIcon} items={ownerItems} header={header}></PropertyInfoCard>
  );
};

export default OwnerInfo;
