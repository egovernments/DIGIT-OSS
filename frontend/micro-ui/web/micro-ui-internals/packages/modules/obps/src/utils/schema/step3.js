import * as Yup from "yup";

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/pdf"];

const MAX_REMARKS_LENGTH = 500;

const VALIDATION_SCHEMA = Yup.object().shape({
  vacant: Yup.string().nullable().required("This field is required."),
  vacantRemark: Yup.string()
    .test({
      name: "vacant",
      test: function (value) {
        const newoptions = this.resolve(Yup.ref("vacant"));
        if (newoptions === "Y") {
          return !!value || this.createError({ message: "This field is required" });
        }
        return true;
      },
    })
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  ht: Yup.string().nullable().required("This field is required."),
  htRemark: Yup.string()
    .test({
      name: "ht",
      test: function (value) {
        const newoptions = this.resolve(Yup.ref("ht"));
        if (newoptions === "Y") {
          return !!value || this.createError({ message: "This field is required" });
        }
        return true;
      },
    })
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  gas: Yup.string().nullable().required("This field is required."),
  gasRemark: Yup.string()
    .test({
      name: "gas",
      test: function (value) {
        const newoptions = this.resolve(Yup.ref("gas"));
        if (newoptions === "Y") {
          return !!value || this.createError({ message: "This field is required" });
        }
        return true;
      },
    })
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  nallah: Yup.string().nullable().required("This field is required."),
  nallahRemark: Yup.string()
    .test({
      name: "nallah",
      test: function (value) {
        const newoptions = this.resolve(Yup.ref("nallah"));
        if (newoptions === "Y") {
          return !!value || this.createError({ message: "This field is required" });
        }
        return true;
      },
    })
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  compactBlockRemark: Yup.string()
    .test({
      name: "compactBlock",
      test: function (value) {
        const newoptions = this.resolve(Yup.ref("compactBlock"));
        if (newoptions === "Y") {
          return !!value || this.createError({ message: "This field is required" });
        }
        return true;
      },
    })
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  road: Yup.string().nullable().required("This field is required."),
  utilityLine: Yup.string().nullable().required("This field is required."),
  landSchedule: Yup.string().nullable().required("This field is required."),
  mutation: Yup.string().nullable().required("This field is required."),
  jambandhi: Yup.string().nullable().required("This field is required."),
  copyofSpaBoard: Yup.string()
    .nullable()
    .required("This field is required."),
  constructedRowWidth: Yup.string()
    .test({
      name: "conditional",
      test: function (value) {
        const newoptions = this.resolve(Yup.ref("siteApproachable"));
        if (newoptions === "N") {
          return !!value || this.createError({ message: "This field is required" });
        }
        return true;
      },
    }),
  remarks: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  specify: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  rehanRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  pattaRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  gairRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  loanRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  anyOtherRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  insolvencyRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  waterCourseRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`), roadRemark: Yup.string()
      .nullable()
      .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  utilityRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),
  othersLandFallRemark: Yup.string()
    .nullable()
    .max(MAX_REMARKS_LENGTH, ({ path }) => `Remarks must not exceed ${MAX_REMARKS_LENGTH} characters.`),

  // Add more fields and validations as needed
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

