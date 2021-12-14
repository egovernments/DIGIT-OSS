import { addIDGenId, uuidv1 } from "../utils";
import envVariables from "../envVariables";
import get from "lodash/get";
import userService from "../services/userService";
import isEmpty from "lodash/isEmpty";
import { status } from "./search";

export const addUUIDAndAuditDetails = async (request, method = "_update") => {
  let { FireNOCs, RequestInfo } = request;
  //for loop should be replaced new alternative
  for (var i = 0; i < FireNOCs.length; i++) {
    let id = get(FireNOCs[i], "id");
    FireNOCs[i].id = id && method != "_create" ? id : uuidv1();
    let fireNOCDetailID = get(FireNOCs[i], "fireNOCDetails.id");
    FireNOCs[i].fireNOCDetails.id =
      fireNOCDetailID && method != "_create" ? fireNOCDetailID : uuidv1();
    let fireNOCApplication = get(
      FireNOCs[i],
      "fireNOCDetails.applicationNumber"
    );
    FireNOCs[i].fireNOCDetails.applicationNumber =
      fireNOCApplication && method != "_create"
        ? fireNOCApplication
        : await addIDGenId(RequestInfo, [
            {
              idName: envVariables.EGOV_IDGEN_FN_CERTIFICATE_NO_NAME,
              tenantId: FireNOCs[i].tenantId,
              format: envVariables.EGOV_APPLICATION_FORMATE
            }
          ]);
    FireNOCs[i].fireNOCDetails.buildings = FireNOCs[
      i
    ].fireNOCDetails.buildings.map(building => {
      let buildingId = building.id;
      building.id = buildingId && method != "_create" ? buildingId : uuidv1();
      building.applicationDocuments = building.applicationDocuments.map(
        applicationDocument => {
          let applicationId = applicationDocument.id;
          applicationDocument.id =
            applicationId && method != "_create" ? applicationId : uuidv1();
          return applicationDocument;
        }
      );
      building.uoms = building.uoms.map(uom => {
        let uomId = uom.id;
        uom.id = uomId && method != "_create" ? uomId : uuidv1();
        return uom;
      });
      return building;
    });
    let addressId = get(
      FireNOCs[i],
      "fireNOCDetails.propertyDetails.address.id"
    );
    FireNOCs[i].fireNOCDetails.propertyDetails.address.id =
      addressId && method != "_create" ? addressId : uuidv1();
    let applicationDetailsId = get(
      FireNOCs[i],
      "fireNOCDetails.applicantDetails.additionalDetail.id"
    );
    FireNOCs[i].fireNOCDetails.applicantDetails.additionalDetail.id =
      applicationDetailsId && method != "_create"
        ? applicationDetailsId
        : uuidv1();
    let createdBy = get(FireNOCs[i], "auditDetails.createdBy");
    let createdTime = get(FireNOCs[i], "auditDetails.createdTime");
    FireNOCs[i].auditDetails = {
      createdBy:
        createdBy && method != "_create"
          ? createdBy
          : get(RequestInfo, "userInfo.uuid", ""),
      lastModifiedBy:
        createdBy && method != "_create"
          ? get(RequestInfo, "userInfo.uuid", "")
          : "",
      createdTime:
        createdTime && method != "_create" ? createdTime : new Date().getTime(),
      lastModifiedTime:
        createdTime && method != "_create" ? new Date().getTime() : 0
    };
    if (
      FireNOCs[i].fireNOCDetails.applicantDetails.owners &&
      !isEmpty(FireNOCs[i].fireNOCDetails.applicantDetails.owners)
    ) {
      let owners = FireNOCs[i].fireNOCDetails.applicantDetails.owners;
      for (var owneriter = 0; owneriter < owners.length; owneriter++) {
        let userResponse = {};
        let userSearchReqCriteria = {};
        let userSearchResponse = {};

        userSearchReqCriteria.mobileNumber = owners[owneriter].mobileNumber;
        userSearchReqCriteria.name = owners[owneriter].name;
        userSearchReqCriteria.tenantId = envVariables.EGOV_DEFAULT_STATE_ID;

        userSearchResponse = await userService.searchUser(
          RequestInfo,
          userSearchReqCriteria
        );
        
        if (get(userSearchResponse, "user", []).length > 0) {
        userResponse = await userService.updateUser(RequestInfo, {
        ...userSearchResponse.user[0],
        ...owners[owneriter]
        });
        }
        else{
          userResponse = await createUser(
            RequestInfo,
            owners[owneriter],
            envVariables.EGOV_DEFAULT_STATE_ID
          );
        }

        let ownerUUID = get(owners[owneriter], "ownerUUID");
        owners[owneriter] = {
          ...owners[owneriter],
          ...get(userResponse, "user.0", []),
          ownerUUID: ownerUUID && method != "_create" ? ownerUUID : uuidv1()
        };
      }
    }
    FireNOCs[i].dateOfApplied = FireNOCs[i].dateOfApplied
      ? FireNOCs[i].dateOfApplied
      : new Date().getTime();
    FireNOCs[i].fireNOCDetails.applicationDate = FireNOCs[i].fireNOCDetails
      .applicationDate
      ? FireNOCs[i].fireNOCDetails.applicationDate
      : new Date().getTime();
    FireNOCs[i].fireNOCDetails.additionalDetail = {
      ...FireNOCs[i].fireNOCDetails.additionalDetail,
      ownerAuditionalDetail:
        FireNOCs[i].fireNOCDetails.applicantDetails.additionalDetail
    };
    // FireNOCs[i].fireNOCDetails.status =
    //   status[FireNOCs[i].fireNOCDetails.action];
    FireNOCs[i] = await checkApproveRecord(FireNOCs[i], RequestInfo);
  }
  request.FireNOCs = FireNOCs;
  return request;
};

const createUser = async (requestInfo, owner, tenantId) => {
  let userSearchReqCriteria = {};
  let userSearchResponse = {};
  let userCreateResponse = {};
  if (!owner.uuid) {
    //uuid of user not present
    userSearchReqCriteria.userType = "CITIZEN";
    userSearchReqCriteria.tenantId = tenantId;
    userSearchReqCriteria.mobileNumber = owner.mobileNumber;
    userSearchResponse = await userService.searchUser(
      requestInfo,
      userSearchReqCriteria
    );
    if (get(userSearchResponse, "user", []).length > 0) {
      //assign to user

      userCreateResponse = await userService.updateUser(requestInfo, {
        ...userSearchResponse.user[0],
        ...owner
      });
    } else {
      // console.log("user not found");

      owner = addDefaultUserDetails(tenantId, owner);
      // console.log("userSearchResponse.user[0]", userSearchResponse.user[0]);
      // console.log("owner", owner);
      userCreateResponse = await userService.createUser(requestInfo, {
        ...userSearchResponse.user[0],
        ...owner
      });
      // console.log("Create passed");
    }
  } else {
    //uuid present
    userSearchReqCriteria.uuid = [owner.uuid];
    userSearchResponse = await userService.searchUser(
      requestInfo,
      userSearchReqCriteria
    );
    if (get(userSearchResponse, "user", []).length > 0) {
      userCreateResponse = await userService.updateUser(requestInfo, {
        ...userSearchResponse.user[0],
        ...owner
      });
      // console.log("Update passed");
    }
  }
  return userCreateResponse;
};

const checkApproveRecord = async (fireNoc = {}, RequestInfo) => {
  if (fireNoc.fireNOCDetails.action == "APPROVE") {
    let fireNOCNumber = fireNoc.fireNOCNumber;
    fireNoc.fireNOCNumber = fireNOCNumber
      ? fireNOCNumber
      : await addIDGenId(RequestInfo, [
          {
            idName: envVariables.EGOV_IDGEN_FN_CERTIFICATE_NO_NAME,
            tenantId: fireNoc.tenantId,
            format: envVariables.EGOV_CIRTIFICATE_FORMATE
          }
        ]);
    fireNoc.fireNOCDetails.validFrom = new Date().getTime();
    let validTo = new Date();
    validTo.setFullYear(validTo.getFullYear() + 1);
    validTo.setDate(validTo.getDate() - 1);
    fireNoc.fireNOCDetails.validTo = validTo.getTime();
    fireNoc.fireNOCDetails.issuedDate = new Date().getTime();
  }
  return fireNoc;
};

const addDefaultUserDetails = (tenantId, owner) => {
  if (!owner.userName || isEmpty(owner.userName))
    owner.userName = owner.mobileNumber;
  owner.active = true;
  owner.tenantId = envVariables.EGOV_DEFAULT_STATE_ID;
  owner.type = "CITIZEN";
  owner.roles = [
    {
      code: "CITIZEN",
      name: "Citizen",
      tenantId: envVariables.EGOV_DEFAULT_STATE_ID
    }
  ];
  return owner;
};

export const updateStatus = (FireNOCs, workflowResponse) => {
  let workflowStatus = {};
  for (let i = 0; i < workflowResponse.ProcessInstances.length; i++) {
    workflowStatus = {
      ...workflowStatus,
      [workflowResponse.ProcessInstances[i].businessId]:
        workflowResponse.ProcessInstances[i].state.state
    };
  }
  FireNOCs = FireNOCs.map(firenoc => {
    firenoc.fireNOCDetails.status =
      workflowStatus[firenoc.fireNOCDetails.applicationNumber];
    return firenoc;
  });
  return FireNOCs;
};

export const enrichAssignees = async (FireNOCs, RequestInfo) => {

  for (var i = 0; i < FireNOCs.length; i++) {
    if(FireNOCs[i].fireNOCDetails.action === 'SENDBACKTOCITIZEN'){
      let assignes = []; 
      let owners = FireNOCs[i].fireNOCDetails.applicantDetails.owners;
      for (let owner of owners)
        assignes.push(owner.uuid);

      let uuids = await getUUidFromUserName(owners, RequestInfo);
      if(uuids.length > 0)
        assignes = [...new Set([...assignes, ...uuids])];

      FireNOCs[i].fireNOCDetails.additionalDetail.assignee = assignes;
    }
  }
  return FireNOCs;
};

const getUUidFromUserName = async (owners, RequestInfo) => {
  let uuids = [];
  let mobileNumbers = [];

  for(let owner of owners)
    mobileNumbers.push(owner.mobileNumber);

  var mobileNumberSet = [...new Set(mobileNumbers)];

  for(let mobileNumber of mobileNumberSet){
    let userSearchReqCriteria = {};
    let userSearchResponse = {};

    userSearchReqCriteria.userName = mobileNumber;
    userSearchReqCriteria.tenantId = envVariables.EGOV_DEFAULT_STATE_ID;

    userSearchResponse = await userService.searchUser(
      RequestInfo,
      userSearchReqCriteria
    );

    if (get(userSearchResponse, "user", []).length > 0) {
      uuids.push(userSearchResponse.user[0].uuid);
    }

  }
  let uuidsSet = [...new Set(uuids)];

  return uuidsSet;
};
