import get from "lodash/get";
import findIndex from "lodash/findIndex";
import isEmpty from "lodash/isEmpty";
import { httpRequest } from "./api";
import envVariables from "../envVariables";
import userService from "../services/userService";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";

let requestInfo = {};

const intConversion = string => {
  return string ? parseInt(string) : null;
};

const fireNOCRowMapper = async (row, mapper = {}) => {
  let fireNoc = isEmpty(mapper) ? {} : mapper;
  fireNoc.id = row.fid;
  fireNoc.tenantId = row.tenantid;
  fireNoc.fireNOCNumber = row.firenocnumber;
  fireNoc.provisionFireNOCNumber = row.provisionfirenocnumber;
  fireNoc.oldFireNOCNumber = row.oldfirenocnumber;
  fireNoc.dateOfApplied = intConversion(row.dateofapplied);
  let auditDetails = {
    createdBy: row.createdby,
    lastModifiedBy: row.lastmodifiedby,
    createdTime: intConversion(row.createdtime),
    lastModifiedTime: intConversion(row.lastmodifiedtime)
  };
  let owners = await fireNocOwnersRowMapper(
    row,
    get(fireNoc, "fireNOCDetails.applicantDetails.owners", [])
  );
  let fireNOCDetails = {
    id: row.firenocdetailsid,
    applicationNumber: row.applicationnumber,
    status: row.status,
    fireNOCType: row.firenoctype,
    firestationId: row.firestationid,
    applicationDate: intConversion(row.applicationdate),
    financialYear: row.financialyear,
    issuedDate: intConversion(row.issueddate),
    validFrom: intConversion(row.validfrom),
    validTo: intConversion(row.validto),
    action: row.action,
    channel: row.channel,
    noOfBuildings: row.noofbuildings,
    buildings: fireNocBuildingsRowMapper(
      row,
      get(fireNoc, "fireNOCDetails.buildings", [])
    ),
    propertyDetails: {
      id: row.puuid,
      propertyId: row.propertyid,
      address: {
        tenantId: row.tenantid,
        doorNo: row.pdoorno,
        latitude: row.platitude,
        longitude: row.plongitude,
        addressNumber: row.paddressNumber,
        buildingName: row.pbuildingname,
        city: row.pcity,
        locality: {
          code: row.plocality
        },
        pincode: row.ppincode,
        street: row.pstreet
      }
    },
    applicantDetails: {
      ownerShipType: row.ownertype,
      owners,
      additionalDetail: get(row, "additionaldetail.ownerAuditionalDetail", {})
    },
    additionalDetail: row.additionaldetail,
    auditDetails
  };
  //building tranformation , it should refactor in future

  //ownertranformation
  fireNoc.fireNOCDetails = fireNOCDetails;
  fireNoc.auditDetails = auditDetails;
  return fireNoc;
};

const fireNocOwnersRowMapper = async (row, mapper = []) => {
  let ownerIndex = findIndex(mapper, { useruuid: row.useruuid });
  let ownerObject = {
    id: row.ownerid,
    userName: row.username,
    useruuid: row.useruuid,
    active: row.active,
    ownerType: row.applicantcategory,
    relationship: row.relationship,
    tenantId: row.tenantId,
    fatherOrHusbandName: ""
  };

  if (ownerIndex != -1) {
    mapper[ownerIndex] = {
      ...ownerObject,
      ...mapper[ownerIndex]
    };
    mapper[ownerIndex].ownerType = row.applicantcategory;
  } else {
    let user = {};
    if (row.useruuid) {
      user = await searchUser(requestInfo, row.useruuid);
    }
    user = {
      ...ownerObject,
      ...user
    };
    mapper.push(user);
  }
  return mapper;
};

const fireNocBuildingsRowMapper = (row, mapper = []) => {
  let buildingIndex = findIndex(mapper, { id: row.buildingid });
  let buildingObject = {
    id: row.buildingid,
    tenantId: row.tenantid,
    name: row.buildingname,
    usageType: row.usagetype,
    uoms: fireNocUomsRowMapper(row),
    applicationDocuments: fireNocApplicationDocumentsRowMapper(row)
  };
  if (buildingIndex != -1) {
    buildingObject.uoms = fireNocUomsRowMapper(
      row,
      get(mapper[buildingIndex], "uoms", [])
    );
    buildingObject.applicationDocuments = fireNocApplicationDocumentsRowMapper(
      row,
      get(mapper[buildingIndex], "applicationDocuments", [])
    );
    mapper[buildingIndex] = buildingObject;
  } else {
    mapper.push(buildingObject);
  }
  return mapper;
};

const fireNocUomsRowMapper = (row, mapper = []) => {
  let uomIndex = findIndex(mapper, { id: row.uomuuid });
  let uomObject = {
    id: row.uomuuid,
    code: row.code,
    value: intConversion(row.value),
    isActiveUom: row.activeuom,
    active: row.active
  };
  if (uomIndex != -1) {
    mapper[uomIndex] = uomObject;
  } else {
    mapper.push(uomObject);
  }
  return mapper;
};

const fireNocApplicationDocumentsRowMapper = (row, mapper = []) => {
  let applicationDocumentIndex = findIndex(mapper, { id: row.documentuuid });
  let applicationDocumentObject = {
    id: row.documentuuid,
    tenantId: row.tenantid,
    documentType: row.documenttype,
    fileStoreId: row.filestoreid,
    documentUid: row.documentuid
  };
  if (applicationDocumentIndex != -1) {
    mapper[applicationDocumentIndex] = applicationDocumentObject;
  } else {
    if (row.documentuuid) {
      mapper.push(applicationDocumentObject);
    }
  }
  return mapper;
};

export const mergeSearchResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let fireNoc = {};
    let index = findIndex(result, { id: response[i].fid });
    if (index != -1) {
      fireNoc = await fireNOCRowMapper(response[i], result[index]);
      result[index] = fireNoc;
    } else {
      fireNoc = await fireNOCRowMapper(response[i]);
      result.push(fireNoc);
    }
  }
  removeEmpty(result);
  return result;
};

const removeEmpty = obj => {
  Object.keys(obj).forEach(function(key) {
    if (obj[key] && typeof obj[key] === "object") removeEmpty(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });
};

const searchUser = async (requestInfo, uuid) => {
  let userSearchReqCriteria = {};
  let userSearchResponse = {};
  userSearchReqCriteria.uuid = [uuid];
  userSearchResponse = await userService.searchUser(
    requestInfo,
    userSearchReqCriteria
  );
  let users = get(userSearchResponse, "user", []);
  return users.length ? users[0] : {};
};

export const searchByMobileNumber = async (mobileNumber, tenantId) => {
  var userSearchReqCriteria = {};
  userSearchReqCriteria.userType = "CITIZEN";
  userSearchReqCriteria.tenantId = tenantId;
  userSearchReqCriteria.mobileNumber = mobileNumber;
  var userSearchResponse = await userService.searchUser(
    requestInfo,
    userSearchReqCriteria
  );
  return userSearchResponse;
};
