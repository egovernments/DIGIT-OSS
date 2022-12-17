import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  licenseApplied: Yup.string().nullable().required("This field is required."),
  //   licenseNumber: Yup.string()
  //     .nullable(true)
  //     .max(20)
  //     .matches(/^[^\s][a-zA-Z0-9\s]+$/, "Please enter valid input")
  //     .required("This field is required."),
  migrationLic: Yup.string().nullable().required("This field is required."),
  encumburance: Yup.string().nullable().required("This field is required."),
  litigation: Yup.string().nullable().required("This field is required."),
  court: Yup.string().nullable().required("This field is required."),
  insolvency: Yup.string().nullable().required("This field is required."),
  appliedLand: Yup.string().nullable().required("This field is required."),
  revenueRasta: Yup.string().nullable().required("This field is required."),
  waterCourse: Yup.string().nullable().required("This field is required."),
  compactBlock: Yup.string().nullable().required("This field is required."),
  landSandwiched: Yup.string().nullable().required("This field is required."),
  acquistion: Yup.string().nullable().required("This field is required."),
  sectionFour: Yup.string().required("This field is required."),
  sectionSix: Yup.string().required("This field is required."),
  orderUpload: Yup.string().nullable().required("This field is required."),
  siteApproachable: Yup.string().nullable().required("This field is required."),
  vacant: Yup.string().nullable().required("This field is required."),
  construction: Yup.string().nullable().required("This field is required."),
  ht: Yup.string().nullable().required("This field is required."),
  gas: Yup.string().nullable().required("This field is required."),
  nallah: Yup.string().nullable().required("This field is required."),
  road: Yup.string().nullable().required("This field is required."),
  marginalLand: Yup.string().nullable().required("This field is required."),
  utilityLine: Yup.string().nullable().required("This field is required."),
  landSchedule: Yup.string().required("This field is required."),
  mutation: Yup.string().required("This field is required."),
  jambandhi: Yup.string().required("This field is required."),
  detailsOfLease: Yup.string().required("This field is required."),
  addSalesDeed: Yup.string().required("This field is required."),
  copyofSpaBoard: Yup.string().required("This field is required."),
  revisedLanSchedule: Yup.string().required("This field is required."),
  copyOfShajraPlan: Yup.string().required("This field is required."),
});

export { VALIDATION_SCHEMA };
