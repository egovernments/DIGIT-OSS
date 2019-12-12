import React from "react";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
// import { connect } from "react-redux";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import PropertyInfoCard from "../PropertyInfoCard";

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);



const getAddressItems = (properties, loadMdmsData) => {

  const { address, propertyDetails } = properties;

  const { additionalDetails } = Boolean(propertyDetails) && propertyDetails[0]
  return (
    address && [

      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_CITY", localizationLabelsData),
        value: address.city || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_HOUSE_NO", localizationLabelsData),
        value: address.doorNo || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_COLONY_NAME", localizationLabelsData),
        value: address.buildingName || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_EXISTING_PID", localizationLabelsData),
        value: properties.oldPropertyId || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_STREET_NAME", localizationLabelsData),
        value: address.street || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PINCODE", localizationLabelsData),
        value: address.pincode || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_ROAD_TYPE", localizationLabelsData),
        value: additionalDetails && additionalDetails.roadType && getTranslatedLabel(('PROPERTYTAX_ROADTYPE_' + additionalDetails.roadType).toUpperCase(), localizationLabelsData) || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_THANA", localizationLabelsData),
        value: additionalDetails && additionalDetails.thana && getTranslatedLabel(('PROPERTYTAX_THANA_' + additionalDetails.thana.replace('-', '_')).toUpperCase(), localizationLabelsData) || "NA",
      },
      {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_MOHALLA", localizationLabelsData),
        value: address.locality.name || "NA",
      }
    ]
  );
}

const PropertyAddressInfo = ({ properties, editIcon, loadMdmsData }) => {

  let addressItems = [];
  const header = 'PT_PROPERTY_ADDRESS_SUB_HEADER';
  if (properties) {
    addressItems = getAddressItems(properties, loadMdmsData);
  }

  return (
    <PropertyInfoCard editIcon={editIcon} items={addressItems} header={header}></PropertyInfoCard>
  );
};

export default PropertyAddressInfo;
