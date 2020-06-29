// // import deepEqual from "lodash/deepEqual";
// const _=require("lodash");
// const Ajv = require("Ajv");
// const ajv = new Ajv({ allErrors:true });
// // const schema = require("../src/model/fireNOC.js");
// // console.log(schema);
// // // const axios = require("axios");
// //
// // const data = require("./fireNOCRequest.json");
// // // console.log(data);
// //
// // ajv.addSchema(schema, "swagger.json");
//
// // ajv
// //   .compileAsync({ $ref: "swagger.json#/definitions/FireNOCRequest" })
// //   .then(function(validate) {
// //     var valid = validate(data);
// //     if (!valid) console.log(validate.errors);
// //   });
// //
// // function loadSchema(uri) {
// //   return axios
// //     .get(uri)
// //     .then(function(res) {
// //       return res.body;
// //     })
// //     .catch(function(error) {
// //       throw new Error("Loading error: " + error.statusCode);
// //     });
// // }
// //
//
// // let validate=ajv.compile(schema);
// // //
// // var valid = validate(data);
// //
// // if (!valid) console.log(validate.errors);
//
//
// // console.log('test');
//
// // var data={
// //     "RequestInfo": {
// //         "apiId": "Rainmaker",
// //         "ver": ".01",
// //         "ts": "",
// //         "action": "search",
// //         "did": "1",
// //         "key": "",
// //         "msgId": "20170310130900|en_IN",
// //         "authToken": "2c472bb8-c6a9-4467-8657-16066f72f559",
// //         "userInfo": {
// //             "id": 26411,
// //             "userName": "EMP-107-000240",
// //             "salutation": null,
// //             "name": "Avijeet",
// //             "gender": "MALE",
// //             "mobileNumber": "8719875331",
// //             "emailId": null,
// //             "altContactNumber": null,
// //             "pan": null,
// //             "aadhaarNumber": null,
// //             "permanentAddress": null,
// //             "permanentCity": null,
// //             "permanentPinCode": null,
// //             "correspondenceAddress": "Correspondence",
// //             "correspondenceCity": null,
// //             "correspondencePinCode": null,
// //             "addresses": [
// //                 {
// //                     "pinCode": null,
// //                     "city": null,
// //                     "address": "Correspondence",
// //                     "type": "CORRESPONDENCE",
// //                     "id": 52619,
// //                     "tenantId": "pb.amritsar",
// //                     "userId": 26411,
// //                     "addressType": "CORRESPONDENCE",
// //                     "lastModifiedDate": null,
// //                     "lastModifiedBy": null
// //                 }
// //             ],
// //             "active": true,
// //             "locale": null,
// //             "type": "EMPLOYEE",
// //             "accountLocked": false,
// //             "accountLockedDate": 0,
// //             "fatherOrHusbandName": "A",
// //             "signature": null,
// //             "bloodGroup": null,
// //             "photo": null,
// //             "identificationMark": null,
// //             "createdBy": 24226,
// //             "lastModifiedBy": 1,
// //             "tenantId": "pb.amritsar",
// //             "roles": [
// //                 {
// //                     "code": "EMPLOYEE",
// //                     "name": "Employee",
// //                     "tenantId": "pb.amritsar"
// //                 },
// //                 {
// //                     "code": "NOC_CEMP",
// //                     "name": "NoC counter employee",
// //                     "tenantId": "pb.amritsar"
// //                 },
// //                 {
// //                     "code": "NOC_FIELD_INSPECTOR",
// //                     "name": "NoC Field Inpector",
// //                     "tenantId": "pb.amritsar"
// //                 },
// //                 {
// //                     "code": "SUPERUSER",
// //                     "name": "Super User",
// //                     "tenantId": "pb.amritsar"
// //                 },
// //                 {
// //                     "code": "NOC_APPROVER",
// //                     "name": "NoC counter Approver",
// //                     "tenantId": "pb.amritsar"
// //                 },
// //                 {
// //                     "code": "NOC_DOC_VERIFIER",
// //                     "name": "NoC Doc Verifier",
// //                     "tenantId": "pb.amritsar"
// //                 }
// //             ],
// //             "uuid": "52bb4f29-922a-4ba1-b3f1-33cfff16cd7e",
// //             "createdDate": "28-05-2019 17:31:16",
// //             "lastModifiedDate": "17-06-2019 12:25:33",
// //             "dob": "28/6/1991",
// //             "pwdExpiryDate": "26-08-2019 17:31:16"
// //         }
// //     },
// //     "FireNOCs": [
// //         {
// //             "id": "0a7e92f6-8728-421e-8997-124269fd9b9b",
// //             "tenantId": "pb.amritsar",
// //             "fireNOCNumber": null,
// //             "provisionFireNOCNumber": null,
// //             "oldFireNOCNumber": null,
// //             "dateOfApplied": null,
// //             "fireNOCDetails": {
// //                 "id": "6ab0c5dc-1b7f-4cba-bb65-c4b399b83554",
// //                 "applicationNumber": "PB-FN-2019-06-18-002430",
// //                 "status": "INITIATED",
// //                 "fireNOCType": "NEW",
// //                 "applicationDate": "1560866913904",
// //                 "financialYear": "2019-20",
// //                 "issuedDate": null,
// //                 "validFrom": null,
// //                 "validTo": null,
// //                 "action": "INITIATE",
// //                 "channel": "COUNTER",
// //                 "noOfBuildings": "SINGLE",
// //                 "buildings": [
// //                     {
// //                         "id": "d5befc6c-2ca8-4cd7-8593-ce2af5ed474e",
// //                         "tenantId": "pb.amritsar",
// //                         "name": "Dsrrh",
// //                         "usageType": "GROUP_A_RESIDENTIAL.SUBDIVISIONA-1",
// //                         "uoms": [
// //                             {
// //                                 "id": "0e8b4324-4a39-4c3a-90ad-b825ddb05623",
// //                                 "code": "HEIGHT_OF_BUILDING",
// //                                 "value": "5000",
// //                                 "isActiveUom": true,
// //                                 "active": true
// //                             },
// //                             {
// //                                 "id": "328a19b1-6c9b-4492-a841-7d77ac69026d",
// //                                 "code": "NO_OF_FLOORS",
// //                                 "value": "8",
// //                                 "isActiveUom": false,
// //                                 "active": true
// //                             },
// //                             {
// //                                 "id": "7775e32b-3083-4fcd-956f-c8b8b60ab2c4",
// //                                 "code": "NO_OF_BASEMENTS",
// //                                 "value": "1",
// //                                 "isActiveUom": false,
// //                                 "active": true
// //                             },
// //                             {
// //                                 "id": "2415792f-bad6-486a-9e71-188c8062486c",
// //                                 "code": "PLOT_SIZE",
// //                                 "value": "2000",
// //                                 "isActiveUom": false,
// //                                 "active": true
// //                             },
// //                             {
// //                                 "id": "3887ed36-7eb1-4919-a902-7621280a266e",
// //                                 "code": "BUILTUP_AREA",
// //                                 "value": "1000",
// //                                 "isActiveUom": false,
// //                                 "active": true
// //                             }
// //                         ],
// //                         "applicationDocuments": []
// //                     }
// //                 ],
// //                 "propertyDetails": {
// //                     "id": "7739b5c3-11d5-4748-894c-b976c3f6cfc2",
// //                     "propertyId": null,
// //                     "address": {
// //                         "tenantId": "pb.amritsar",
// //                         "doorNo": null,
// //                         "latitude": null,
// //                         "longitude": null,
// //                         "buildingName": null,
// //                         "city": "pb.amritsar",
// //                         "locality": {
// //                             "code": "SUN04"
// //                         },
// //                         "pincode": null,
// //                         "street": null
// //                     }
// //                 },
// //                 "applicantDetails": {
// //                     "ownerShipType": "INDIVIDUAL.SINGLEOWNER",
// //                     "owners": [
// //                         {
// //                             "id": 23442,
// //                             "userName": "9167765477",
// //                             "useruuid": "d9fb76e8-3c65-4e11-9f5f-2998c0f8b8a6",
// //                             "active": true,
// //                             "ownerType": "INDIVIDUAL.SINGLEOWNER",
// //                             "relationship": null,
// //                             "tenantId": "pb",
// //                             "fatherOrHusbandName": "A",
// //                             "salutation": null,
// //                             "name": "Avijeet",
// //                             "gender": "MALE",
// //                             "mobileNumber": "9167765477",
// //                             "emailId": "avi7@gm.com",
// //                             "altContactNumber": null,
// //                             "pan": "bnhpp5432k",
// //                             "aadhaarNumber": null,
// //                             "permanentAddress": "Some correspondance address",
// //                             "permanentCity": null,
// //                             "permanentPinCode": null,
// //                             "correspondenceAddress": "Corresponding address",
// //                             "correspondenceCity": null,
// //                             "correspondencePinCode": null,
// //                             "addresses": [
// //                                 {
// //                                     "pinCode": null,
// //                                     "city": null,
// //                                     "address": "Corresponding address",
// //                                     "type": "CORRESPONDENCE",
// //                                     "id": 52741,
// //                                     "tenantId": "pb",
// //                                     "userId": 23442,
// //                                     "addressType": "CORRESPONDENCE",
// //                                     "lastModifiedBy": null,
// //                                     "lastModifiedDate": null
// //                                 },
// //                                 {
// //                                     "pinCode": null,
// //                                     "city": null,
// //                                     "address": "Some correspondance address",
// //                                     "type": "PERMANENT",
// //                                     "id": 48685,
// //                                     "tenantId": "pb",
// //                                     "userId": 23442,
// //                                     "addressType": "PERMANENT",
// //                                     "lastModifiedBy": null,
// //                                     "lastModifiedDate": null
// //                                 }
// //                             ],
// //                             "locale": null,
// //                             "type": "CITIZEN",
// //                             "accountLocked": false,
// //                             "accountLockedDate": 0,
// //                             "signature": null,
// //                             "bloodGroup": null,
// //                             "photo": null,
// //                             "identificationMark": null,
// //                             "createdBy": 0,
// //                             "lastModifiedBy": 1,
// //                             "roles": [
// //                                 {
// //                                     "code": "CITIZEN",
// //                                     "name": "Citizen",
// //                                     "tenantId": "pb"
// //                                 }
// //                             ],
// //                             "uuid": "d9fb76e8-3c65-4e11-9f5f-2998c0f8b8a6",
// //                             "createdDate": 1532942447000,
// //                             "lastModifiedDate": 1560866902000,
// //                             "dob": 678047400000,
// //                             "pwdExpiryDate": 1541470800000
// //                         }
// //                     ],
// //                     "additionalDetail": {
// //                         "id": "009c3760-ad61-4f86-92d0-65e5818122fb",
// //                         "documents": []
// //                     }
// //                 },
// //                 "additionalDetail": {
// //                     "documents": [],
// //                     "ownerAuditionalDetail": {
// //                         "id": "009c3760-ad61-4f86-92d0-65e5818122fb",
// //                         "documents": []
// //                     }
// //                 },
// //                 "auditDetails": {
// //                     "createdBy": "52bb4f29-922a-4ba1-b3f1-33cfff16cd7e",
// //                     "lastModifiedBy": "",
// //                     "createdTime": "1560866913075",
// //                     "lastModifiedTime": "0"
// //                 }
// //             },
// //             "auditDetails": {
// //                 "createdBy": "52bb4f29-922a-4ba1-b3f1-33cfff16cd7e",
// //                 "lastModifiedBy": "",
// //                 "createdTime": "1560866913075",
// //                 "lastModifiedTime": "0"
// //             }
// //         }
// //     ]
// // };
// //
// //
// // const  removeEmpty=(obj)=> {
// //   Object.keys(obj).forEach(function(key) {
// //     if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
// //     else if (obj[key] == null) delete obj[key]
// //   });
// // };
// //
// // removeEmpty(data);
// //
// // console.log(data.FireNOCs);
//
//
// ajv.addKeyword('constant', {
//   validate: function (schema, data) {
//     return false
//   },
//   errors: false
// });
//
// var schema = {
//   "constant": 2
// };
// var validate = ajv.compile(schema);
// console.log(validate(2)); // true
// console.log(validate(3)); // false
//
// var schema = {
//   "constant": {
//     "foo": "bar"
//   }
// };
// var validate = ajv.compile(schema);
//
// var valid = validate(3);
//
// console.log(valid);
//
// if (!valid) console.log(validate.errors);
// console.log(validate({foo: 'bar'})); // true
// console.log(validate({foo: 'baz'})); // false
