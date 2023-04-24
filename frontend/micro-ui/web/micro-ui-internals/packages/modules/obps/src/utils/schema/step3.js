import * as Yup from "yup";
const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/pdf"];

const VALIDATION_SCHEMA = Yup.object().shape({
  licenseApplied: Yup.string().nullable().required("This field is required."),
  // licenseNumber: Yup.string()
  //   .nullable(true)
  //   .min(10)
  //   .max(20)
  //   .matches(/^[^\s][a-zA-Z0-9\s]+$/, "Please enter valid input")
  //   .required("This field is required."),

  // potential: Yup.object().nullable(true).required("This field is required"),

  // siteLoc: Yup.object().nullable(true).required("This field is required"),

  // areaOfParentLicenceAcres: Yup.string()
  //   .nullable(true)
  //   .matches(/^[^\s][a-zA-Z0-9\s]+$/, "Please enter valid input")
  //   .required("This field is required."),
  // thirdParty: Yup.string().nullable(true).required("This field is required."),
  migrationLic: Yup.string().nullable().required("This field is required."),

  encumburance: Yup.string().nullable().required("This field is required."),
  rewardDate: Yup.string().nullable().required("This field is required."),
  // rehanRemark: Yup.string().nullable().required("This field is required."),
  // pattaRemark: Yup.string().nullable(true).required("This field is required."),
  // gairRemark: Yup.string().nullable(true).required("This field is required."),
  // loanRemark: Yup.string().nullable(true).required("This field is required."),
  // anyOtherRemark: Yup.string().nullable().required("This field is required."),
  litigation: Yup.string().nullable().required("This field is required."),
  // court: Yup.string().nullable(true).required("This field is required."),
  // courtyCaseNo: Yup.string(true).nullable().required("This field is required."),
  insolvency: Yup.string().nullable().required("This field is required."),
  // insolvencyRemark: Yup.string().nullable(true).required("This field is required."),
  appliedLand: Yup.string().nullable().required("This field is required."),
  revenueRasta: Yup.string().nullable().required("This field is required."),
  waterCourse: Yup.string().nullable().required("This field is required."),
  // waterCourseRemark: Yup.string().nullable(true).required("This field is required."),
  compactBlock: Yup.string().nullable().required("This field is required."),
  // compactBlockRemark: Yup.string().nullable(true).required("This field is required."),
  landSandwiched: Yup.string().nullable().required("This field is required."),
  landSchedule: Yup.string().nullable().required("This field is required."),
  // landSandwichedRemark: Yup.string().nullable(true).required("This field is required."),
  acquistion: Yup.string().nullable().required("This field is required."),
  // orderUpload: Yup.string().nullable().required("This field is required."),
  siteApproachable: Yup.string().nullable().required("This field is required."),
  northSurroundings: Yup.string().nullable().required("This field is required."),
  southSurroundings: Yup.string().nullable().required("This field is required."),
  eastSurroundings: Yup.string().nullable().required("This field is required."),
  westSurroundings: Yup.string().nullable().required("This field is required."),
  // minimumApproachFour: Yup.string().nullable().required("This field is required."),
  // minimumApproachEleven: Yup.string().nullable().required("This field is required."),
  // alreadyConstructedSector: Yup.string().nullable().required("This field is required."),
  // adjoiningOwnLand: Yup.string().nullable().required("This field is required."),
  // applicantHasDonated: Yup.string().nullable().required("This field is required."),
  // adjoiningOthersLand: Yup.string().nullable().required("This field is required."),
  // landOwnerDonated: Yup.string().nullable().required("This field is required."),
  // parentLicenceApproach: Yup.string().nullable().required("This field is required."),
  availableExistingApproach: Yup.string().nullable().required("This field is required."),
  // irrevocableConsent: Yup.string().nullable().required("This field is required."),
  vacant: Yup.string().nullable().required("This field is required."),
  // vacantRemark: Yup.string().nullable().required("This field is required."),
  ht: Yup.string().nullable().required("This field is required."),
  // htRemark: Yup.string().nullable().required("This field is required."),
  gas: Yup.string().nullable().required("This field is required."),
  // gasRemark: Yup.string().nullable(true).required("This field is required."),
  nallah: Yup.string().nullable().required("This field is required."),
  // nallahRemark: Yup.string().nullable().required("This field is required."),
  road: Yup.string().nullable().required("This field is required."),
  // roadWidth: Yup.string().nullable().required("This field is required."),
  // roadRemark: Yup.string().nullable().required("This field is required."),
  utilityLine: Yup.string().nullable().required("This field is required."),
  // landSchedule: Yup.string().required("A text is required"),
  landSchedule: Yup.string().required("Only pdf,jpeg,png image required"),
  mutation: Yup.string().required("Only pdf,jpeg,png image required"),

  jambandhi: Yup.string().required("Only pdf,jpeg,png image required"),
  // detailsOfLease: Yup.string().required("Only pdf,jpeg,png image required"),
  // addSalesDeed: Yup.string().required("Only pdf,jpeg,png image required"),
  copyofSpaBoard: Yup.string().required("Only pdf,jpeg,png image required"),
  // copyofSpaBoard: Yup.string()
  //   .required("Only pdf,jpeg,png image required")
  //   .test("fileSize", "File too large", (value) => value && value.size <= FILE_SIZE)
  //   .test("fileFormat", "Unsupported Format", (value) => value && SUPPORTED_FORMATS.includes(value.type)),
});
// const MODAL_VALIDATION_SCHEMA = Yup.object().shape({
//   previousLicensenumber: Yup.string().nullable().required("This field is required."),
//   areaOfParentLicence: Yup.string().nullable().required("This field is required."),
//   purposeOfParentLicence: Yup.string().required("This field is required."),
//   validity: Yup.string().nullable().required("This field is required."),
//   date: Yup.string().required("This field is required."),
//   areaAppliedmigration: Yup.string().required("This field is required."),
//   khasraNumber: Yup.string().required("This field is required."),
//   area: Yup.string().required("This field is required."),
// });

export { VALIDATION_SCHEMA };
