import { Router } from "express";
import { requestInfoToResponseInfo } from "../utils";
import { mergeSearchResults, searchByMobileNumber } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import keys from "lodash/keys";
import { actions } from "../utils/search";
import { validateFireNOCSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
const asyncHandler = require("express-async-handler");
import db from "../db";

export default ({ config }) => {
  let api = Router();
  api.post(
    "/_search",
    asyncHandler(async (request, res, next) => {
      let response = await searchApiResponse(request, next);
      res.json(response);
    })
  );
  return api;
};
export const searchApiResponse = async (request, next = {}) => {
  let response = {
    ResponseInfo: requestInfoToResponseInfo(request.body.RequestInfo, true),
    FireNOCs: []
  };
  const queryObj = JSON.parse(JSON.stringify(request.query));
  //console.log("request", request.query);
  //console.log("Query object:"+JSON.stringify(queryObj));
  let errors = validateFireNOCSearchModel(queryObj);
  if (errors.length > 0) {
    next({
      errorType: "custom",
      errorReponse: {
        ResponseInfo: requestInfoToResponseInfo(request.body.RequestInfo, true),
        Errors: errors
      }
    });
    return;
  }
  console.log(queryObj);
  let text =
    " SELECT * FROM (SELECT FN.uuid as FID,FN.tenantid,FN.fireNOCNumber,FN.provisionfirenocnumber,FN.oldfirenocnumber,FN.dateofapplied,FN.createdBy,FN.createdTime,FN.lastModifiedBy,FN.lastModifiedTime,FD.uuid as firenocdetailsid,FD.action,FD.applicationnumber,FD.fireNOCType,FD.applicationdate,FD.financialYear,FD.firestationid,FD.issuedDate,FD.validFrom,FD.validTo,FD.action,FD.status,FD.channel,FD.propertyid,FD.noofbuildings,FD.additionaldetail,FBA.uuid as puuid,FBA.doorno as pdoorno,FBA.latitude as platitude,FBA.longitude as plongitude,FBA.buildingName as pbuildingname,FBA.addressnumber as paddressnumber,FBA.pincode as ppincode,FBA.locality as plocality,FBA.city as pcity,FBA.street as pstreet,FB.uuid as buildingid ,FB.name as buildingname,FB.usagetype,FO.uuid as ownerid,FO.ownertype,FO.applicantcategory,FO.useruuid,FO.relationship,FUOM.uuid as uomuuid,FUOM.code,FUOM.value,FUOM.activeuom,FBD.uuid as documentuuid,FUOM.active,FBD.documentType,FBD.filestoreid,FBD.documentuid,FBD.createdby as documentCreatedBy,FBD.lastmodifiedby as documentLastModifiedBy,FBD.createdtime as documentCreatedTime,FBD.lastmodifiedtime as documentLastModifiedTime,DENSE_RANK () OVER(ORDER BY FN.uuid) rn FROM eg_fn_firenoc FN JOIN eg_fn_firenocdetail FD ON (FN.uuid = FD.firenocuuid) JOIN eg_fn_address FBA ON (FD.uuid = FBA.firenocdetailsuuid) JOIN eg_fn_owner FO ON (FD.uuid = FO.firenocdetailsuuid) JOIN eg_fn_buidlings FB ON (FD.uuid = FB.firenocdetailsuuid) JOIN eg_fn_buildinguoms FUOM ON (FB.uuid = FUOM.buildinguuid) LEFT OUTER JOIN eg_fn_buildingdocuments FBD on(FB.uuid = FBD.buildinguuid) ";
  // FBD.active=true AND FO.active=true AND FUOM.active=true AND";
  //if citizen
  const roles = get(request.body, "RequestInfo.userInfo.roles");
  const userUUID = get(request.body, "RequestInfo.userInfo.uuid");
  const isUser = some(roles, { code: "CITIZEN" }) && userUUID;
  if (isUser) {
    const mobileNumber = get(request.body, "RequestInfo.userInfo.mobileNumber");
    const tenantId = envVariables.EGOV_DEFAULT_STATE_ID;
    
    
    //text = `${text} where (FN.createdby = '${userUUID}' OR`;    
    // text = `${text} where FN.createdby = '${userUUID}' OR`;
    queryObj.mobileNumber = queryObj.mobileNumber
      ? queryObj.mobileNumber
      : mobileNumber;
    queryObj.tenantId = queryObj.tenantId ? queryObj.tenantId : tenantId;
    //console.log("mobileNumber", mobileNumber);
    //console.log("tenedrIDD", tenantId);

    if(queryObj.tenantId == envVariables.EGOV_DEFAULT_STATE_ID)
      text = `${text} where FN.tenantid LIKE '${queryObj.tenantId}%' AND`;
    else
      text = `${text} where FN.tenantid = '${queryObj.tenantId}' AND`;
  } else {
    if (!isEmpty(queryObj) && !(keys(queryObj).length==2 && 
    queryObj.hasOwnProperty("offset") && queryObj.hasOwnProperty("limit"))) {
      text = text + " where ";
    }
    if (queryObj.tenantId) {
      if(queryObj.tenantId == envVariables.EGOV_DEFAULT_STATE_ID)
        text = `${text} FN.tenantid LIKE '${queryObj.tenantId}%' AND`;
      else
        text = `${text} FN.tenantid = '${queryObj.tenantId}' AND`;
    }
  }
  // if (queryObj.status) {
  //   queryObj.action = actions[queryObj.status];
  // }
  const queryKeys = Object.keys(queryObj);
  let sqlQuery = text;
  if (queryObj.hasOwnProperty("mobileNumber")) {
    // console.log("mobile number");
    let userSearchResponse = await searchByMobileNumber(
      queryObj.mobileNumber,
      envVariables.EGOV_DEFAULT_STATE_ID
    );
    // console.log(userSearchResponse);
    let searchUserUUID = get(userSearchResponse, "user.0.uuid");
    // if (searchUserUUID) {
    //   // console.log(searchUserUUID);
    var userSearchResponseJson = JSON.parse(JSON.stringify(userSearchResponse));  
    var userUUIDArray =[];
    for(var i =0;i<userSearchResponseJson.user.length;i++){
      userUUIDArray.push(userSearchResponseJson.user[i].uuid);
    }
    /*
    if (isUser) {
      sqlQuery = `${sqlQuery} FO.useruuid='${searchUserUUID ||
        queryObj.mobileNumber}') AND`;
    } else {
        sqlQuery = `${sqlQuery} FO.useruuid in (`;
        if(userUUIDArray.length > 0){
          for(var j =0;j<userUUIDArray.length;j++){
            if(j==0)
              sqlQuery = `${sqlQuery}'${userUUIDArray[j]}'`;

            sqlQuery = `${sqlQuery}, '${userUUIDArray[j]}'`;
          }      
        }
        else
          sqlQuery = `${sqlQuery}'${queryObj.mobileNumber}'`;

        sqlQuery = `${sqlQuery}) AND`;  
    }*/

    sqlQuery = `${sqlQuery} FO.useruuid in (`;
        if(userUUIDArray.length > 0){
          for(var j =0;j<userUUIDArray.length;j++){
            if(j==0)
              sqlQuery = `${sqlQuery}'${userUUIDArray[j]}'`;

            sqlQuery = `${sqlQuery}, '${userUUIDArray[j]}'`;
          }      
        }
        else
          sqlQuery = `${sqlQuery}'${queryObj.mobileNumber}'`;

        sqlQuery = `${sqlQuery}) AND`;  


    // }
  }
  if (queryObj.hasOwnProperty("ids")) {
    // console.log(queryObj.ids.split(","));
    let ids = queryObj.ids.split(",");
    for (var i = 0; i < ids.length; i++) {
      if (ids.length > 1) {
        sqlQuery = `${sqlQuery} FN.uuid = '${ids[i]}' OR`;
      } else {
        sqlQuery = `${sqlQuery} FN.uuid = '${ids[i]}' AND`;
      }
    }
  }
  if (queryKeys) {
    queryKeys.forEach(item => {
      if (queryObj[item]) {
        if (
          item != "fromDate" &&
          item != "toDate" &&
          item != "tenantId" &&
          // item != "status" &&
          item != "ids" &&
          item != "mobileNumber" &&
          item != "offset" &&
          item != "limit"
        ) {
          queryObj[item]=queryObj[item].toUpperCase();
          sqlQuery = `${sqlQuery} ${item}='${queryObj[item]}' AND`;
        }
      }
    });
  }

  if (
    queryObj.hasOwnProperty("fromDate") &&
    queryObj.hasOwnProperty("toDate")
  ) {
    sqlQuery = `${sqlQuery} FN.createdtime >= ${queryObj.fromDate} AND FN.createdtime <= ${queryObj.toDate} `;
  } else if (
    queryObj.hasOwnProperty("fromDate") &&
    !queryObj.hasOwnProperty("toDate")
  ) {
    sqlQuery = `${sqlQuery} FN.createdtime >= ${queryObj.fromDate} `;
  }

  
  

  if (!isEmpty(queryObj) && ( queryObj.hasOwnProperty("limit" || queryObj.hasOwnProperty("offset")))) {
    let offset =0;
    let limit =10;
    if( queryObj.hasOwnProperty("offset") ){
      offset = queryObj.offset*1;
      
   }
  if( queryObj.hasOwnProperty("limit") ){
    limit = (queryObj.limit*1)+offset;
 }
 if( offset !=0){
  offset = offset+1;
}
 if(keys(queryObj).length!=2){
  sqlQuery = `${sqlQuery.substring(0, sqlQuery.length - 3)} ) s WHERE s.rn  BETWEEN ${offset} AND ${limit+offset}   `;
 }else{
  sqlQuery = `${sqlQuery}  ) s WHERE s.rn  BETWEEN ${offset} AND ${limit} ORDER BY fid `;
 }
  
}else if(isEmpty(queryObj)){
  sqlQuery = `${sqlQuery}  ) s`;
}else if(!isEmpty(queryObj)){
  sqlQuery = `${sqlQuery.substring(0, sqlQuery.length - 3)}  ) s ORDER BY fid `;
}

  console.log("SQL QUery:" +sqlQuery);
  const dbResponse = await db.query(sqlQuery);
  //console.log("dbResponse"+JSON.stringify(dbResponse));
  if (dbResponse.err) {
    console.log(err.stack);
  } else {
     //console.log(JSON.stringify(dbResponse.rows));
    response.FireNOCs =
      dbResponse.rows && !isEmpty(dbResponse.rows)
        ? await mergeSearchResults(
            dbResponse.rows,
            request.query,
            request.body.RequestInfo
          )
        : [];
  }
  return response;

  // , async (err, dbRes) => {
  //   if (err) {
  //     console.log(err.stack);
  //   } else {
  //     // console.log(JSON.stringify(res.rows));
  //     response.FireNOCs =
  //       dbRes.rows && !isEmpty(dbRes.rows)
  //         ? await mergeSearchResults(
  //             dbRes.rows,
  //             request.query,
  //             request.body.RequestInfo
  //           )
  //         : [];
  //    return (response);
  //   }
  // });
};
