export const setAddressDetailsLW = (data) => {
  let { locationDet } = data;

  let propAddress = {
    city: locationDet?.cityCode?.name,
    doorNo: locationDet?.houseDoorNo,
    street: locationDet?.buildingColonyName,
    landmark: locationDet?.landmarkName,
    locality: {
      code: locationDet?.locality?.code || "NA",
    },
  };

  data.address = propAddress;
  return data;
};

export const setOwnerDetails = (data) => {
  const { address, owners } = data;
  let institution = {},
    owner = [];
  if (owners && owners.length > 0) {
    if (data?.ownershipCategory?.value === "INSTITUTIONALPRIVATE" || data?.ownershipCategory?.value === "INSTITUTIONALGOVERNMENT") {
      institution.designation = owners[0]?.designation;
      institution.name = owners[0]?.inistitutionName;
      institution.nameOfAuthorizedPerson = owners[0]?.name;
      institution.tenantId = address?.city?.code;
      institution.type = owners[0]?.inistitutetype?.value;
      let document = [];
      if (owners[0]?.documents["proofIdentity"]?.fileStoreId) {
        document.push({
          fileStoreId: owners[0]?.documents["proofIdentity"]?.fileStoreId || "",
          documentType: owners[0]?.documents["proofIdentity"]?.documentType?.code || "",
        });
      }
      owner.push({
        altContactNumber: owners[0]?.altContactNumber,
        correspondenceAddress: owners[0]?.permanentAddress,
        designation: owners[0]?.designation,
        emailId: owners[0]?.emailId,
        sameAsPropertyAddress: owners[0]?.isCorrespondenceAddress,
        mobileNumber: owners[0]?.mobileNumber,
        name: owners[0]?.name,
        ownerType: owners[0]?.ownerType?.code || "NONE",
        documents: document,
      });
      data.institution = institution;
      data.owners = owner;
    } else {
      owners.map((ownr) => {
        let document = [];
        if (ownr?.ownerType?.code != "NONE") {
          if (ownr?.documents && ownr?.documents["specialProofIdentity"]) {
            document.push({
              fileStoreId: ownr?.documents["specialProofIdentity"]?.fileStoreId || "",
              documentType: ownr?.documents["specialProofIdentity"]?.documentType?.code || "",
            });
          }
        }
        if (ownr?.documents && ownr?.documents["proofIdentity"]?.fileStoreId) {
          document.push({
            fileStoreId: ownr?.documents["proofIdentity"]?.fileStoreId || "",
            documentType: ownr?.documents["proofIdentity"]?.documentType?.code || "",
          });
        }
        owner.push({
          emailId: ownr?.emailId,
          fatherOrHusbandName: ownr?.fatherOrHusbandName,
          gender: ownr?.gender?.value,
          sameAsPropertyAddress: ownr?.isCorrespondenceAddress,
          mobileNumber: ownr?.mobileNumber,
          name: ownr?.name,
          ownerType: ownr?.ownerType?.code || "NONE",
          permanentAddress: ownr?.permanentAddress,
          relationship: ownr?.relationship?.code,
          documents: document,
        });
      });
      data.owners = owner;
    }
  }
  return data;
};

export const setOwnerDetailsLW = (data) => {
  const { locationDet, owners } = data;
  
  let institution = {},
  owner = [],
  document = [];

  data.ownershipCategory = data?.owners?.[0]?.ownershipCategory;
  
  if (data.ownershipCategory.includes("INSTITUTIONALPRIVATE") || data.ownershipCategory.includes("INSTITUTIONALGOVERNMENT")) {
    institution.designation = owners?.[0]?.designation;
    institution.name = owners?.[0]?.institutionName;
    institution.type = owners?.[0]?.institutionType?.code?.split(".")?.[1];
    institution.landlineNumber = owners?.[0]?.altContactNumber;
    institution.tenantId = locationDet?.cityCode?.code;
    
    owner.push({
      altContactNumber: owners?.[0]?.altContactNumber,
      permanentAddress: owners?.[0]?.permanentAddress,
      correspondenceAddress: owners?.[0]?.permanentAddress,
      sameAsPropertyAddress: owners?.[0]?.isCorrespondenceAddress || owners?.[0]?.isCoresAddr,
      mobileNumber: owners?.[0]?.mobileNumber,
      name: owners?.[0]?.name,
      ownerType: "NONE",
      status: "ACTIVE",
      documents: document,
    });
    data.institution = institution;
    data.owners = owner;
  } else {
    owners.map(own=>{
      owner.push({
        emailId: own?.emailId,
        fatherOrHusbandName: own?.fatherOrHusbandName,
        gender: own?.gender?.value,
        sameAsPropertyAddress: own?.isCorrespondenceAddress || owners?.[0]?.isCoresAddr,
        mobileNumber: own?.mobileNumber,
        name: own?.name,
        ownerType: own?.ownerType?.code || "NONE",
        permanentAddress: own?.permanentAddress,
        relationship: own?.relationship?.code,
        documents: document,
      });
    })
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
  
  propertyDetails = {
    propertyType: assemblyDet?.BuildingType?.code,
    usageCategory: getUsageTypeLW(assemblyDet),
    // subUsageCategory: 'NONRESIDENTIAL.COMMERCIAL.HOTELS.2STARORBELOW',
    landArea: parseInt(assemblyDet?.floorarea),
    superBuiltUpArea: parseInt(assemblyDet?.constructionArea),
  };

  data.propertyDetails = propertyDetails;
  return data;
};

export const convertToPropertyLightWeight = (data = {}) => {
  let propertyType = data.PropertyType;
  let noOfFloors = 1;
  let ownershipCategory= data?.owners?.[0]?.ownershipCategory;
  data = setOwnerDetailsLW(data);
  data = setAddressDetailsLW(data);
  data = setPropertyDetailsLW(data);

  const formdata = {
    Property: {
      tenantId: data.tenantId,
      address: data.address,
      propertyType: propertyType,
      ...data.propertyDetails,
      ownershipCategory: ownershipCategory,
      usageCategory: data?.assemblyDet?.usageCategoryMajor?.code,
      owners: data.owners,
      noOfFloors: noOfFloors,
      additionalDetails: {
        isRainwaterHarvesting: false,
      },
      creationReason: "CREATE",
      source: "MUNICIPAL_RECORDS",
      channel: "SYSTEM",
    },
  };
  
  if (ownershipCategory.includes("INSTITUTIONALPRIVATE") || ownershipCategory.includes("INSTITUTIONALGOVERNMENT")) {
    formdata.Property.institution = data?.institution;
  }
  return formdata;
};

export const convertToUpdatePropertyLightWeight = (data = {}) => {
  let propertyType = data.PropertyType;
  let noOfFloors = 1;

  data = setOwnerDetailsLW(data);
  data = setAddressDetailsLW(data);
  data = setPropertyDetailsLW(data);

  const formdata = {
    Property: {
      id: data.id,
      accountId: data.accountId,
      acknowldgementNumber: data.acknowldgementNumber,
      propertyId: data.propertyId,
      status: data.status || "INWORKFLOW",
      tenantId: data.tenantId,
      address: data.address,
      propertyType: propertyType,
      ownershipCategory: data?.ownershipCategory,
      owners: data.owners,
      noOfFloors: noOfFloors,
      additionalDetails: {
        isRainwaterHarvesting: false,
      },
      ...data.propertyDetails,
      creationReason: getCreationReason(data),
      source: "MUNICIPAL_RECORDS",
      channel: "CITIZEN",
      workflow: getWorkflow(data),
    },
  };

  let propertyInitialObject = JSON.parse(sessionStorage.getItem("propertyInitialObject"));
  if (checkArrayLength(propertyInitialObject?.units) && checkIsAnArray(formdata.Property?.units) && data?.isEditProperty) {
    propertyInitialObject.units = propertyInitialObject.units.filter((unit) => unit.active);
    let oldUnits = propertyInitialObject.units.map((unit) => {
      return { ...unit, active: false };
    });
    formdata.Property?.units.push(...oldUnits);
  }

  if (checkArrayLength(propertyInitialObject?.owners) && checkIsAnArray(formdata.Property?.owners)) {
    formdata.Property.owners = [...propertyInitialObject.owners];
  }
  if (propertyInitialObject?.auditDetails) {
    formdata.Property["auditDetails"] = { ...propertyInitialObject.auditDetails };
  }

  return formdata;
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};