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
  "COMMERCIAL-INDEPENDENTPROPERTY": {
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
  "COMMERCIAL-SHAREDPROPERTY": {
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
  "INDUSTRIAL-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/IndustrialIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/IndustrialIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/IndustrialIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/IndustrialIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "INDUSTRIAL-SHAREDPROPERTY": {
    path: "PropertyTaxPay/IndustrialIndependantProperty",
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/IndustrialIndependantProperty",
    },
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/IndustrialSharedProperty" ,isCoreConfiguration:true})(GenericForm),
    hasPlot: false,
    hasFloor: true,
  },
  "RELIGIOUS-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/ReligiousIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/ReligiousIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/ReligiousIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/ReligiousIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "RELIGIOUS-SHAREDPROPERTY": {
    path: "PropertyTaxPay/ReligiousIndependantProperty",
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/ReligiousIndependantProperty",
    },
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/ReligiousSharedProperty" ,isCoreConfiguration:true})(GenericForm),
    hasPlot: false,
    hasFloor: true,
  },
  "INSTITUTIONAL-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/InstitutionalIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/InstitutionalIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({
      formKey: "floorDetails",
      makeCopy: true,
      path: "PropertyTaxPay/InstitutionalIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/InstitutionalIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "INSTITUTIONAL-SHAREDPROPERTY": {
    path: "PropertyTaxPay/InstitutionalIndependantProperty",
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/InstitutionalIndependantProperty",
    },
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/InstitutionalSharedProperty" ,isCoreConfiguration:true})(GenericForm),
    hasPlot: false,
    hasFloor: true,
  },
  "OTHERS-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/OtherIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/OtherIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/OtherIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/OtherIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "OTHERS-SHAREDPROPERTY": {
    path: "PropertyTaxPay/OtherIndependantProperty",
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/OtherIndependantProperty",
    },
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/OtherSharedProperty" ,isCoreConfiguration:true})(GenericForm),
    hasPlot: false,
    hasFloor: true,
  },
  "PUBLICSPACES-INDEPENDENTPROPERTY": {
    path: "PropertyTaxPay/PublicSpaceIndependantProperty",
    plotForm: formHoc({
      formKey: "plotDetails",
      isCoreConfiguration: true,
      path: "PropertyTaxPay/PublicSpaceIndependantProperty",
      isCoreConfiguration: true,
    })(GenericForm),
    floorForm: formHoc({ formKey: "floorDetails", makeCopy: true, path: "PropertyTaxPay/PublicSpaceIndependantProperty", isCoreConfiguration: true })(
      GenericForm
    ),
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/PublicSpaceIndependantProperty",
    },
    hasPlot: true,
    hasFloor: true,
  },
  "PUBLICSPACES-SHAREDPROPERTY": {
    path: "PropertyTaxPay/PublicSpaceIndependantProperty",
    floorObject: {
      formKey: "floorDetails",
      isCoreConfiguration: true,
      makeCopy: true,
      copyName: "floorDetails",
      path: "PropertyTaxPay/PublicSpaceIndependantProperty",
    },
    // plotForm: formHoc({ formKey: "plotDetails",isCoreConfiguration:true, path: "PropertyTaxPay/PublicSpaceSharedProperty" ,isCoreConfiguration:true})(GenericForm),
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
