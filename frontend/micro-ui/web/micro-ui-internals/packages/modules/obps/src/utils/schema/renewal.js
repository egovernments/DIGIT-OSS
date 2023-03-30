import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  licenseNo: Yup.string().required("This field is required."),
  validUpto: Yup.string().required("This field is required."),
  renewalRequiredUpto: Yup.string().required("This field is required."),
  colonizerName: Yup.string().required("This field is required."),
  colonyType: Yup.string().required("This field is required."),
  areaAcres: Yup.string().required("This field is required."),
  sectorNo: Yup.string().required("This field is required."),
  revenueEstate: Yup.string().required("This field is required."),
  transferredPortion: Yup.string().nullable().required("This field is required."),
  imposedSpecificCondition: Yup.string().nullable().required("This field is required."),
  courtCases: Yup.string().nullable().required("This field is required."),
  obtainedOCPart: Yup.string().nullable().required("This field is required."),
  obtainedCCPart: Yup.string().nullable().required("This field is required."),
  coveredArea: Yup.string().nullable().required("This field is required.").min(1).max(8),
  proportionateSiteArea: Yup.string().nullable().required("This field is required.").min(1).max(8),
});

export { VALIDATION_SCHEMA };
