export const setAddressDetailsLW = (data) => {
  let { locationDet } = data;

  let propAddress = {
    ...locationDet,
    // pincode: locationDet?.locality?.pincode[0],
    landmark: locationDet?.landmark,
    city: locationDet?.city?.name,
    doorNo: locationDet?.houseDoorNo,
    street: locationDet?.buildingColonyName,
    locality: {
      code: locationDet?.locality?.code || "NA",
      area: locationDet?.locality?.name,
    },
  };

  data.address = propAddress;
  return data;
};

export const setOwnerDetailsLW = (data) => {
  const { locationDet, owners } = data;
  
  let institution = {},
  owner = [],
  document = [];
  
  if (data?.owners?.ownershipCategory?.value === "INSTITUTIONALPRIVATE" || data?.owners?.ownershipCategory?.value === "INSTITUTIONALGOVERNMENT") {
    institution.designation = owners?.designation;
    institution.name = owners?.inistitutionName;
    institution.nameOfAuthorizedPerson = owners?.name;
    institution.tenantId = locationDet?.city?.code;
    institution.type = owners?.inistitutetype?.value;
    
    owner.push({
      altContactNumber: owners?.altContactNumber,
      correspondenceAddress: owners?.permanentAddress,
      designation: owners?.designation,
      emailId: owners?.emailId,
      isCorrespondenceAddress: owners?.isCorrespondenceAddress,
      mobileNumber: owners?.mobileNumber,
      name: owners?.name,
      ownerType: owners?.ownerType?.code || "NONE",
      documents: document,
    });
    data.institution = institution;
    data.owners = owner;
  } else {
      owner.push({
        emailId: owners?.emailId,
        fatherOrHusbandName: owners?.fatherOrHusbandName,
        gender: owners?.gender?.value,
        isCorrespondenceAddress: owners?.isCorrespondenceAddress,
        mobileNumber: owners?.mobileNumber,
        name: owners?.name,
        ownerType: owners?.ownerType?.code || "NONE",
        permanentAddress: owners?.permanentAddress,
        relationship: owners?.relationship?.code,
        documents: document,
      });
    data.owners = owner;
  }
  return data;
};

const getUsageTypeLW = (data) => {
  if (data?.isResdential?.code == "RESIDENTIAL") {
    return data?.isResdential?.code;
  } else {
    return data?.usageCategory?.code;
  }
};

export const setPropertyDetailsLW = (data) => {
  let propertyDetails = {};

  const { assemblyDet } = data;
  
  if (assemblyDet?.BuildingType?.code?.includes("VACANT")) {
    propertyDetails = {
      units: [],
      landArea: parseInt(assemblyDet?.floorarea),
      propertyType: assemblyDet?.BuildingType?.code,
      noOfFloors: 0,
      usageCategory: getUsageTypeLW(assemblyDet),
    };
  } else if (assemblyDet?.BuildingType?.code?.includes("SHAREDPROPERTY")) {
    /*  update this case tulika*/
    propertyDetails = {
      units: assemblyDet?.units,
      landArea: assemblyDet?.units?.reduce((acc, curr) => Number(curr?.constructionDetail?.builtUpArea) + acc, 0),
      propertyType: assemblyDet?.BuildingType?.code,
      noOfFloors: 1,
      superBuiltUpArea: assemblyDet?.units?.reduce((acc, curr) => Number(curr?.constructionDetail?.builtUpArea) + acc, 0),
      usageCategory: assemblyDet?.usageCategory,
    };
  } else if (assemblyDet?.BuildingType?.code?.includes("INDEPENDENTPROPERTY")) {
    /*  update this case tulika*/
    propertyDetails = {
      units: assemblyDet?.units,
      landArea: assemblyDet?.floorarea,
      propertyType: assemblyDet?.BuildingType?.code,
      noOfFloors: assemblyDet?.units?.length,
      superBuiltUpArea: null,
      usageCategory: assemblyDet?.usageCategory,
    };
  } else {
    propertyDetails = {
      units: [
        {
          occupancyType: "SELFOCCUPIED",
          floorNo: "0",
          constructionDetail: {
            builtUpArea: 16.67,
          },
          tenantId: data.tenantId,
          usageCategory: "RESIDENTIAL",
        },
      ],
      landArea: "2000",
      propertyType: assemblyDet?.PropertyType?.code,
      noOfFloors: 1,
      superBuiltUpArea: 16.67,
      usageCategory: getUsageTypeLW(data),
    };
  }

  data.propertyDetails = propertyDetails;
  return data;
};

export const convertToPropertyLightWeight = (data = {}) => {
  let isResdential = data.isResdential;
  let propertyType = data.PropertyType;
  let selfOccupied = data.selfOccupied;
  let Subusagetypeofrentedarea = data.Subusagetypeofrentedarea || null;
  let subusagetype = data.subusagetype || null;
  let IsAnyPartOfThisFloorUnOccupied = data.IsAnyPartOfThisFloorUnOccupied || null;
  let builtUpArea = data?.floordetails?.builtUpArea || null;
  let noOfFloors = data?.noOfFloors;
  let noOofBasements = data?.noOofBasements;
  let unit = data?.units;
  let basement1 = Array.isArray(data?.units) && data?.units["-1"] ? data?.units["-1"] : null;
  let basement2 = Array.isArray(data?.units) && data?.units["-2"] ? data?.units["-2"] : null;
  // data = setDocumentDetails(data);
  data = setOwnerDetailsLW(data);
  data = setAddressDetailsLW(data);
  data = setPropertyDetailsLW(data);

  const formdata = {
    Property: {
      tenantId: data.tenantId,
      address: data.address,

      ownershipCategory: data?.ownershipCategory?.value,
      owners: data.owners,
      institution: data.institution || null,

      documents: data.documents || [],
      ...data.propertyDetails,

      additionalDetails: {
        inflammable: false,
        heightAbove36Feet: false,
        isResdential: isResdential,
        propertyType: propertyType,
        selfOccupied: selfOccupied,
        Subusagetypeofrentedarea: Subusagetypeofrentedarea,
        subusagetype: subusagetype,
        IsAnyPartOfThisFloorUnOccupied: IsAnyPartOfThisFloorUnOccupied,
        builtUpArea: builtUpArea,
        noOfFloors: noOfFloors,
        noOofBasements: noOofBasements,
        unit: unit,
        basement1: basement1,
        basement2: basement2,
      },

      creationReason: "CREATE",
      source: "MUNICIPAL_RECORDS",
      channel: "CITIZEN",
    },
  };
  return formdata;
};
export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};