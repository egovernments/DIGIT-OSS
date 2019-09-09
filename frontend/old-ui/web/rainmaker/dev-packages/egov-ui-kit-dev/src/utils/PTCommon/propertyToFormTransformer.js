import ownerInfo from "egov-ui-kit/config/forms/specs/PropertyTaxPay/ownerInfo";
import ownershipType from "egov-ui-kit/config/forms/specs/PropertyTaxPay/ownershipType";
import institutionAuthority from "egov-ui-kit/config/forms/specs/PropertyTaxPay/OwnerInformation/Institution/institutionAuthority";
import institutionDetails from "egov-ui-kit/config/forms/specs/PropertyTaxPay/OwnerInformation/Institution/institutionDetails";
// import propertyAddress from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyAddress";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import capitalize from "lodash/capitalize";
import { transformPropertyDataToAssessInfo } from "egov-ui-kit/utils/PTCommon";
import { getPlotAndFloorFormConfigPath } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/assessInfoFormManager";
import set from "lodash/set";

const propertyAddress =
  process.env.REACT_APP_NAME === "Citizen"
    ? require("egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyAddress").default
    : require("config/forms/specs/PropertyTaxPay/propertyAddress").default;

const addData = (config, currentForm) => {
  let res = { ...config };
  Object.keys(config.fields).forEach((field) => {
    const jsonPath = config.fields[field].jsonPath;
    if (jsonPath) {
      let value = currentForm[jsonPath.substring(jsonPath.lastIndexOf(".") + 1, jsonPath.length)] || "";
      if (jsonPath.toLowerCase().indexOf("gender") !== -1) {
        value = capitalize(value) || "Male";
      } else if (jsonPath.toLowerCase().indexOf("document") !== -1) {
        value = get(currentForm, `documents[0].${jsonPath.substring(jsonPath.lastIndexOf(".") + 1, jsonPath.length)}`, "");
      }
      set(res, `fields.${field}.value`, value);
    }
  });
  delete res.name;
  return res;
};

export const getOwnerShipDetails = (property) => {
  const ownerShipForms = {
    ownershipType: addData(cloneDeep(ownershipType), get(property, "propertyDetails[0]", {})),
  };
  return ownerShipForms;
};

// export const getAllOwnerDetails = (property, isSingleOwner = false) => {
//   const ownerDataFromApi = get(property, "propertyDetails[0].owners", [])
//   let ownerForms = {}
//   ownerDataFromApi.forEach((ownerDetails, index) => {
//     ownerForms = {
//       ...ownerForms,
//       [isSingleOwner ? "ownerInfo" : `ownerInfo_${index}`]: addData(cloneDeep(ownerInfo), ownerDetails),
//     }
//   })
//   return ownerForms
// }

export const getAllOwnerDetails = (property, isSingleOwner = false) => {
  const ownerDataFromApi = get(property, "propertyDetails[0].owners", []);
  let ownerForms = {};
  ownerDataFromApi.forEach((ownerDetails, index) => {
    let singleownerDetails = addData(cloneDeep(ownerInfo), ownerDetails);
    // singleownerDetails.fields.ownerRelationship.value = "father"; // What is this?
    ownerForms = {
      ...ownerForms,
      [isSingleOwner ? "ownerInfo" : `ownerInfo_${index}`]: singleownerDetails,
    };
  });
  return ownerForms;
};

export const getpropertyAddressDetails = (propertyRes) => {
  const { Properties } = propertyRes;
  const oldPIDPath = get(propertyAddress, "fields.oldPID.jsonPath", "");
  const mohallaPath = get(propertyAddress, "fields.mohalla.jsonPath", "");
  let propertyAddressForm = {
    propertyAddress: addData(cloneDeep(propertyAddress), get(Properties[0], "address", {})),
  };
  set(propertyAddressForm, "propertyAddress.fields.oldPID.value", get(propertyRes, oldPIDPath, ""));
  set(propertyAddressForm, "propertyAddress.fields.mohalla.value", get(propertyRes, mohallaPath, ""));
  set(propertyAddressForm, "propertyAddress.fields.city.value", get(Properties[0], "tenantId", ""));

  return propertyAddressForm;
};

export const getInstituteDetails = (property) => {
  const instituteDetailsForms = {
    institutionDetails: addData(cloneDeep(institutionDetails), get(property, "propertyDetails[0].institution", {})),
  };
  return instituteDetailsForms;
};

export const getInstituteAuthority = (propertyResponse) => {
  const { Properties } = propertyResponse;
  const instituteDataFromApi = get(Properties[0], "propertyDetails[0].owners", []);
  const designationPath = get(institutionAuthority, "fields.designation.jsonPath", "");
  let instituteAuthorityForm = {};
  instituteDataFromApi.forEach((instituteDetails, index) => {
    if (!!instituteDetails.altContactNumber) {
      instituteAuthorityForm = {
        institutionAuthority: addData(cloneDeep(institutionAuthority), instituteDetails),
      };
    }
  });
  set(instituteAuthorityForm, "institutionAuthority.fields.designation.value", get(propertyResponse.Properties[0], designationPath, ""));
  if (
    get(instituteAuthorityForm, "institutionAuthority.fields.mobile.value", "") ===
    get(instituteAuthorityForm, "institutionAuthority.fields.telephone.value", "")
  ) {
    set(instituteAuthorityForm, "institutionAuthority.fields.mobile.value", "");
  }

  return instituteAuthorityForm;
};

export const getAssesmentDetails = (propertyResponse) => {
  return transformPropertyDataToAssessInfo(propertyResponse);
};

export const convertRawDataToFormConfig = (propertyResponse) => {
  const { Properties } = propertyResponse;
  let properties = Properties;

  // let res = {};
  let ownerForms = {};
  let institutionAuthority = {};
  let institutionDetails = {};
  let ownerShipForm = getOwnerShipDetails(properties[0]);
  let propertyAddress = getpropertyAddressDetails(propertyResponse);
  let assessmentForms = getAssesmentDetails(propertyResponse);
  const ownershipType = get(ownerShipForm, "ownershipType.fields.typeOfOwnership.value", "");
  const typeOfOwnershipPath = get(ownerShipForm, "ownershipType.fields.ownershipCategory.jsonPath", "");
  const ownershipCategoryFromApi = get(properties[0], "propertyDetails[0].ownershipCategory", "");

  if (ownershipType === "MULTIPLEOWNERS" || ownershipType === "SINGLEOWNER") {
    ownerForms = getAllOwnerDetails(properties[0], ownershipType === "SINGLEOWNER");
  } else if (ownershipType.toLowerCase().indexOf("insti") !== -1 || ownershipCategoryFromApi.toLowerCase().indexOf("insti") !== -1) {
    institutionAuthority = getInstituteAuthority(propertyResponse);
    institutionDetails = getInstituteDetails(properties[0]);
    set(ownerShipForm, "ownershipType.fields.typeOfOwnership.value", get(propertyResponse, "Properties[0].propertyDetails[0].ownershipCategory", ""));
  } else {
    //TODO
    set(ownerShipForm, "ownershipType.fields.typeOfOwnership.value", "SINGLEOWNER");
  }

  return {
    // ...res,
    ...propertyAddress,
    ...assessmentForms,
    ...ownerForms,
    ...ownerShipForm,
    ...institutionAuthority,
    ...institutionDetails,
    // selectedTabIndex: 3,
  };
};
