import get from "lodash/get";
import some from "lodash/some";
const fireNOCSchema = require("../model/fireNOC.js");
const fireNOCSearchSchema = require("../model/fireNOCSearch.js");
var xss = require('xss');

const getAjvInstance = () => {
  const Ajv = require("ajv");
  const ajv = new Ajv({ allErrors: true });
  return ajv;
};

export const validateFireNOCModel = (data, mdmsData) => {
  const fireStations = get(mdmsData, "MdmsRes.firenoc.FireStations", []);
  const uoms = get(mdmsData, "MdmsRes.firenoc.UOMs", []);
  const ownerShipCategory = get(
    mdmsData,
    "MdmsRes.common-masters.OwnerShipCategory",
    []
  );
  const buildingType = get(mdmsData, "MdmsRes.firenoc.BuildingType", []);
  const financialYear = get(mdmsData, "MdmsRes.egf-master.FinancialYear", []);
  const boundary = get(mdmsData, "MdmsRes.firenoc.boundary", []);
  // const gender = [
  //   {
  //     code: "MALE"
  //   },
  //   {
  //     code: "FEMALE"
  //   },
  //   {
  //     code: "TRANSGENDER"
  //   }
  // ];
  const ajv = getAjvInstance();
  // console.log(financialYear);

  ajv.addKeyword("valid_htmlData", {
    validate: function(schema, data) {
      return (xss(data)==data) ? true : false;
    },
    errors: false
  });



  ajv.addKeyword("valid_firestation", {
    validate: function(schema, data) {
      return some(fireStations, { code: data });
    },
    errors: false
  });

  ajv.addKeyword("valid_uom", {
    validate: function(schema, data) {
      return some(uoms, { code: data });
    },
    errors: false
  });

  ajv.addKeyword("valid_ownerShipCategory", {
    validate: function(schema, data) {
      return some(ownerShipCategory, { code: data });
    },
    errors: false
  });

  ajv.addKeyword("valid_buildingType", {
    validate: function(schema, data) {
      return some(buildingType, { code: data });
    },
    errors: false
  });

  ajv.addKeyword("valid_financialYear", {
    validate: function(schema, data) {
      return some(financialYear, { code: data });
    },
    errors: false
  });

  ajv.addKeyword("valid_boundary", {
    validate: function(schema, data) {
      return some(boundary, { code: data });
    },
    errors: false
  });

  // ajv.addKeyword("valid_gender", {
  //   validate: function(schema, data) {
  //     return some(gender, { code: data });
  //   },
  //   errors: false
  // });

  let validate = ajv.compile(fireNOCSchema);
  var valid = validate(data);
  let errors = [];
  if (!valid) {
    errors = validate.errors;
  }
  return errors;
};

export const validateFireNOCSearchModel = data => {
  const ajv = getAjvInstance();
  let validate = ajv.compile(fireNOCSearchSchema);
  var valid = validate(data);
  let errors = [];
  if (!valid) {
    errors = validate.errors;
  }
  return errors;
};
