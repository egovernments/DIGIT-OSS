// import { connect } from "react-redux";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import React from "react";
import PropertyInfoCard from "../PropertyInfoCard";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";


const checkNA = (val = '') => {
  return val != null && val ? `${val}` : 'NA';
}
const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

const transform = (floor, key, generalMDMSDataById, propertyDetails) => {
  const { propertySubType, usageCategoryMajor } = propertyDetails;
  const { masterName, dataKey } = key;
  if (!masterName) {
    return floor["occupancyType"] === "RENTED" ? `INR ${floor["arv"]}` : `${Math.round(floor[dataKey] * 100) / 100} sq yards`;
  } else {
    if (floor[dataKey]) {
      if (dataKey === "usageCategoryDetail") {
        return generalMDMSDataById["UsageCategoryDetail"]
          ? generalMDMSDataById["UsageCategoryDetail"][floor[dataKey]].name
          : generalMDMSDataById["UsageCategorySubMinor"]
            ? generalMDMSDataById["UsageCategorySubMinor"][floor["usageCategorySubMinor"]].name
            : "NA";
      }
      // if (usageCategoryMajor === "RESIDENTIAL" && propertySubType === "SHAREDPROPERTY" && dataKey === "floorNo") {
      //   return "NA";
      // }
      if (floor[dataKey] === "NONRESIDENTIAL") {
        return generalMDMSDataById["UsageCategoryMinor"] ? generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name : "NA";
      } else {
        return generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][floor[dataKey]].name : "NA";
      }
    } else {
      return "NA";
    }
  }
};

export const getBuildingTypeInfo = (generalMDMSDataById, propertyDetails) => {
  if (!generalMDMSDataById) {
    return propertyDetails.propertySubType ? propertyDetails.propertySubType : propertyDetails.propertyType ? getLocaleLabels(`PROPERTYTAX_BILLING_SLAB_${propertyDetails.propertyType}`, `PROPERTYTAX_BILLING_SLAB_${propertyDetails.propertyType}`) : getLocaleLabels('NA','NA');
  } else {
    return getLocaleLabels(`PROPERTYTAX_BILLING_SLAB_${get(generalMDMSDataById, `PropertySubType.${propertyDetails.propertySubType}.code`, get(generalMDMSDataById, `PropertyType.${propertyDetails.propertyType}.code`, "NA"))}`, `PROPERTYTAX_BILLING_SLAB_${get(generalMDMSDataById, `PropertySubType.${propertyDetails.propertySubType}.code`, get(generalMDMSDataById, `PropertyType.${propertyDetails.propertyType}.code`, "NA"))}`)
  }
}

export const getUsageTypeInfo = (propertyDetails) => {
  return propertyDetails.usageCategoryMajor ? getTranslatedLabel('PROPERTYTAX_BILLING_SLAB_' + propertyDetails.usageCategoryMajor, localizationLabelsData) : "NA";
}

export const getPlotSizeInfo = (propertyDetails) => {
  return propertyDetails.propertySubType === "SHAREDPROPERTY"
    ? checkNA(propertyDetails.landArea) : propertyDetails.uom ? `${propertyDetails.landArea} ${propertyDetails.uom}` : `${Math.round(propertyDetails.landArea * 100) / 100} sq yards`;
}

export const getRainWaterHarvestingInfo = (properties) => {
  return get(properties, 'additionalDetails.isRainwaterHarvesting', false) ? getTranslatedLabel("PT_COMMON_YES", localizationLabelsData) : getTranslatedLabel("PT_COMMON_NO", localizationLabelsData)
}

export const getaddressPropertyEntryTypeInfo = (properties) => {
  return getTranslatedLabel(get(properties, "creationReason", "CREATE"), localizationLabelsData);
}

export const getUnitUsageTypeInfo = (unit, propertyDetails) => {
  return unit && unit.usageCategoryMinor ? getTranslatedLabel('PROPERTYTAX_BILLING_SLAB_' + unit && unit.usageCategoryMinor, localizationLabelsData) : (propertyDetails && propertyDetails.usageCategoryMinor ? getTranslatedLabel('PROPERTYTAX_BILLING_SLAB_' + propertyDetails && propertyDetails.usageCategoryMinor, localizationLabelsData) :
    (unit && unit.usageCategoryMajor ? getTranslatedLabel('PROPERTYTAX_BILLING_SLAB_' + unit && unit.usageCategoryMajor, localizationLabelsData) : "NA"));
}

export const getOccupancyInfo = (unit) => {
  return unit && unit.occupancyType ? getTranslatedLabel('PROPERTYTAX_OCCUPANCYTYPE_' + unit && unit.occupancyType, localizationLabelsData) : "NA";
}

export const getAssessmentInfo = (propertyDetails, generalMDMSDataById, properties, oldPropertydetails, OldProperty) => {
  const { units = [], noOfFloors } = propertyDetails || {};

  return (
    propertyDetails && [
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
        value: getUsageTypeInfo(propertyDetails), //noOfFloors
        oldValue: oldPropertydetails && getUsageTypeInfo(oldPropertydetails)
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", localizationLabelsData),
        value: getBuildingTypeInfo(generalMDMSDataById, propertyDetails),
        oldValue: oldPropertydetails && getBuildingTypeInfo(generalMDMSDataById, oldPropertydetails)
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_PLOT_SIZE", localizationLabelsData),
        value: getPlotSizeInfo(propertyDetails),
        oldValue: oldPropertydetails && getPlotSizeInfo(oldPropertydetails),
      },
      propertyDetails.propertySubType === "SHAREDPROPERTY"
        ? {
          key: getTranslatedLabel("PT_FLOOR_NO", localizationLabelsData),
          value: units && units.length > 0 ? `${units[0].floorNo}` : "NA",
          oldValue: oldPropertydetails && oldPropertydetails.units && oldPropertydetails.units.length > 0 ? `${oldPropertydetails.units[0].floorNo}` : "NA"
        } :
        {
          key: getTranslatedLabel("PT_ASSESMENT_INFO_NO_OF_FLOOR", localizationLabelsData),
          value: noOfFloors ? `${noOfFloors}` : "NA", //noOfFloors
          oldValue: oldPropertydetails && oldPropertydetails.noOfFloors ? `${noOfFloors}` : "NA"
        },
      {
        key: getTranslatedLabel("PT_COMMONS_IS_RAINWATER_HARVESTING", localizationLabelsData),
        value: getRainWaterHarvestingInfo(properties),
        oldValue: OldProperty && getRainWaterHarvestingInfo(OldProperty),
      },
      process.env.REACT_APP_NAME !== "Citizen" ? {
        key: getTranslatedLabel("PT_PROPERTY_ADDRESS_ENTRY_TYPE", localizationLabelsData),
        value: getaddressPropertyEntryTypeInfo(properties),
        oldValue: OldProperty && getaddressPropertyEntryTypeInfo(OldProperty),
      } : "",
    ]
  );
};

export const getUnitInfo = (units = [], propertyDetails, oldPropertydetails) => {
  units = units || [];
  units = units && units.filter(unit => unit && (unit.active || unit.id == undefined));
  let floors = [];
  units.map((unit, index) => {
    if (unit) {
      let floor = [{
        key: getTranslatedLabel("PT_ASSESSMENT_UNIT_USAGE_TYPE", localizationLabelsData),
        value: getUnitUsageTypeInfo(unit, propertyDetails),
        oldValue: oldPropertydetails && oldPropertydetails.units && oldPropertydetails.units[index] && getUnitUsageTypeInfo(oldPropertydetails.units[index], oldPropertydetails) || "NA",
      }, {

        key: getTranslatedLabel("PT_ASSESMENT_INFO_OCCUPLANCY", localizationLabelsData),
        value: getOccupancyInfo(unit),
        oldValue: oldPropertydetails && oldPropertydetails.units && oldPropertydetails.units[index] && getOccupancyInfo(oldPropertydetails.units[index]) || "NA",
      }, {

        key: getTranslatedLabel("PT_FORM2_BUILT_AREA", localizationLabelsData),
        value: unit.unitArea ? unit.unitArea + '' : "NA",
        oldValue: oldPropertydetails && oldPropertydetails.units && oldPropertydetails.units[index] && (`${Math.round(oldPropertydetails.units[index].unitArea * 9 * 100) / 100}`) || "NA",
      }];
      if (unit.occupancyType === "RENTED") {
        floor.push({
          key: getTranslatedLabel("PT_FORM2_TOTAL_ANNUAL_RENT", localizationLabelsData),
          value: unit.arv ? unit.arv + '' : "NA",
          oldValue: oldPropertydetails && oldPropertydetails.units && oldPropertydetails.units[index] && (oldPropertydetails.units[index].arv + '') || "NA",
        })
      }
      if (!floors[unit['floorNo']]) {
        floors[unit['floorNo']] = [floor];
      } else {
        floors[unit['floorNo']].push(floor);
      }
    }
  }
  )
  return floors;
}

const AssessmentInfo = ({ properties, editIcon, generalMDMSDataById, OldProperty }) => {
  let hideSubsectionLabel = false;
  let assessmentItems = [];
  let subUnitItems = [];
  let oldPropertydetails = '';
  const header = 'PT_ASSESMENT_INFO_SUB_HEADER';
  if (OldProperty && Object.keys(OldProperty).length > 0) {
    oldPropertydetails = OldProperty.propertyDetails[0];
  }
  if (properties) {
    const { propertyDetails } = properties;
    if (propertyDetails && propertyDetails.length > 0) {
      subUnitItems = getUnitInfo(propertyDetails[0]['units'], propertyDetails[0], oldPropertydetails);
      assessmentItems = getAssessmentInfo(propertyDetails[0], generalMDMSDataById, properties, oldPropertydetails, OldProperty);
      if (propertyDetails[0].propertySubType === "SHAREDPROPERTY") {
        hideSubsectionLabel = true;
      }
    }
  }

  return (
    <PropertyInfoCard editIcon={editIcon} items={assessmentItems} header={header} subSection={subUnitItems} hideSubsectionLabel={hideSubsectionLabel} ></PropertyInfoCard>
  );
};

export default AssessmentInfo;
