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
    ownerDetails && [
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
          // key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
          // value:
          //   (institution &&
          //     institution.type &&
          //     generalMDMSDataById &&
          //     generalMDMSDataById["SubOwnerShipCategory"] &&
          //     generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
          //   "NA",
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
        },
      {
        key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
        value: owner.permanentAddress || "NA",
      },
    ]
  );
};
// const getAddressItems = () => {
//   return (
//     [
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_CITY", localizationLabelsData),
//         value: 'addressObj.city' || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_HOUSE_NO", localizationLabelsData),
//         value: 'addressObj.doorNo' || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_COLONY_NAME", localizationLabelsData),
//         value: 'addressObj.buildingName' || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_STREET_NAME", localizationLabelsData),
//         value: 'addressObj.street' || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_MOHALLA", localizationLabelsData),
//         value: 'addressObj.locality.name' || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PINCODE", localizationLabelsData),
//         value: 'addressObj.pincode' || "NA",
//       }
//     ]
//   );
// }

const OwnerInfo = ({ properties, editIcon }) => {

  let ownerItems = [];
  const header = 'PT_OWNERSHIP_INFO_SUB_HEADER';
  if (properties) {
    const { propertyDetails } = properties;
    console.log(properties, 'OwnerInfo properties-----');
    if (propertyDetails && propertyDetails.length > 0) {
      ownerItems = getOwnerInfo(propertyDetails[0]);
    }
  }
  return (
    <PropertyInfoCard editIcon={editIcon} items={ownerItems} header={header}></PropertyInfoCard>
  );
};

export default OwnerInfo;
