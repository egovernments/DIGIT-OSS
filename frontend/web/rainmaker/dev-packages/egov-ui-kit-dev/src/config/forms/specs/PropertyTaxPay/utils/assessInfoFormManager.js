import formHoc from "egov-ui-kit/hocs/form";
import GenericForm from "egov-ui-kit/common/GenericForm";

const combinationToFormkeyMapping = {
  "RESIDENTIAL-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/ResidentialIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/ResidentialIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/ResidentialIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/ResidentialIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "RESIDENTIAL-SHAREDPROPERTY": {
    path: "PropertyTaxPay/ResidentialSharedProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/ResidentialSharedProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/ResidentialIndependantProperty",
    },
    hasPlot: true,
    hasFloor: false,
  },
  "MIXED-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/MixedIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/MixedIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/MixedIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/MixedIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "MIXED-SHAREDPROPERTY": {
    path: "PropertyTaxPay/MixedIndependantProperty",
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/MixedSharedProperty" ,isCoreConfiguration:true})(GenericForm),
    // floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/MixedIndependantProperty", isCoreConfiguration: true })(
    //   GenericForm
    // ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/MixedIndependantProperty",
    },
    hasPlot: false,
    hasFloor: true,
  },
  "NONRESIDENTIAL-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/CommercialIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/CommercialIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/CommercialIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/CommercialIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "NONRESIDENTIAL-SHAREDPROPERTY": {
    path: "PropertyTaxPay/CommercialIndependantProperty",
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/CommercialIndependantProperty",
    },
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/CommercialSharedProperty" ,isCoreConfiguration:true})(GenericForm),
    hasPlot: false,
    hasFloor: true,
  },
  "COMMON-VACANT": {
    path: "PropertyTaxPay/CommonVacantLandProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/CommonVacantLandProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    hasPlot: true,
    hasFloor: false,
  },
};

export const getPlotAndFloorFormConfigPath = (usage, propertyType) => {
  return combinationToFormkeyMapping.hasOwnProperty(`${usage}-${propertyType}`)
    ? combinationToFormkeyMapping[`${usage}-${propertyType}`]
    : combinationToFormkeyMapping["COMMON-VACANT"];
};
