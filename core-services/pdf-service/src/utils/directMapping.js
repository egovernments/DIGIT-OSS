import get from "lodash/get";
import logger from "../config/logger";
import axios from "axios";
import envVariables from "../EnvironmentVariables";
import {
  getLocalisationkey,
  findLocalisation,
  getDateInRequiredFormat,
  getValue
} from "./commons";

var jp = require("jsonpath");

let externalHost = envVariables.EGOV_EXTERNAL_HOST;
/**
 *
 * @param {*} req - current module object, picked from request body
 * @param {*} dataconfig  - data config
 * @param {*} variableTovalueMap - map used for filling values by template engine 'mustache'
 * @param {*} localisationMap - Map to store localisation key, value pair
 * @param {*} requestInfo - request info from request body
 */

function escapeRegex(string) {
  if(typeof string == "string")
  return string.replace(/[\\"]/g, '\\$&'); 
   else
    return string;
  }

export const directMapping = async (
  req,
  dataconfig,
  variableTovalueMap,
  requestInfo,
  unregisteredLocalisationCodes,
  pdfKey
) => {
  var directArr = [];
  var localisationCodes = [];
  var localisationModules = [];
  var variableToModuleMap = {};
  // using jp-jsonpath because loadash can not handele '*'
  var objectOfDirectMapping = jp.query(
    dataconfig,
    "$.DataConfigs.mappings.*.mappings.*.direct.*"
  );
  objectOfDirectMapping = getValue(
    objectOfDirectMapping,
    [],
    "$.DataConfigs.mappings.*.mappings.*.direct.*"
  );
  directArr = objectOfDirectMapping.map(item => {
    return {
      jPath: item.variable,
      val:
        item.value &&
        getValue(jp.query(req, item.value.path), "NA", item.value.path),
      valJsonPath: item.value && item.value.path,
      type: item.type,
      url: item.url,
      format: item.format,
      localisation: item.localisation,
      uCaseNeeded: item.isUpperCaseRequired
    };
  });

  for (var i = 0; i < directArr.length; i++) {
    //for array type direct mapping
    if (directArr[i].type == "citizen-employee-title") {
      if (get(requestInfo, "userInfo.type", "NA").toUpperCase() == "EMPLOYEE") {
        variableTovalueMap[directArr[i].jPath] = "Employee Copy";
      } else {
        variableTovalueMap[directArr[i].jPath] = "Citizen Copy";
      }
    }
    if (directArr[i].type == "selectFromRequestInfo") {
      directArr[i].val = getValue(
        jp.query(requestInfo, directArr[i].valJsonPath),
        "NA",
        directArr[i].valJsonPath
      );

      if (typeof directArr[i].val == "object" && directArr[i].val.length > 0)
        directArr[i].val = directArr[i].val[0];

      variableTovalueMap[directArr[i].jPath] = directArr[i].val;
    } 
    else if (directArr[i].type == "external_host") {
      variableTovalueMap[directArr[i].jPath] = externalHost;
    }
    else if (directArr[i].type == "function") {
      var fun = Function("type", directArr[i].format);
      variableTovalueMap[directArr[i].jPath] = fun(directArr[i].val[0]);
    } else if (directArr[i].type == "image") {
      try {
        var response = await axios.get(directArr[i].url, {
          responseType: "arraybuffer"
        });
        variableTovalueMap[directArr[i].jPath] =
          "data:" +
          response.headers["content-type"] +
          ";base64," +
          Buffer.from(response.data).toString("base64");
        //  logger.info("loaded image: "+directArr[i].url);
      } catch (error) {
        logger.error(error.stack || error);
        throw {
          message: `error while loading image from: ${directArr[i].url}`
        };
      }
    } else if (directArr[i].type == "array") {
      let arrayOfOwnerObject = [];
      // let ownerObject = JSON.parse(JSON.stringify(get(formatconfig, directArr[i].jPath + "[0]", [])));

      let { format = {}, val = [], variable } = directArr[i];
      let { scema = [] } = format;

      //taking values about owner from request body
      for (let j = 0; j < val.length; j++) {
        // var x = 1;
        let ownerObject = {};
        for (let k = 0; k < scema.length; k++) {
          let fieldValue = get(val[j], scema[k].value, "NA");
          fieldValue = fieldValue == null ? "NA" : fieldValue;
          if (scema[k].type == "date") {
            let myDate = new Date(fieldValue);
            if (isNaN(myDate) || fieldValue === 0) {
              ownerObject[scema[k].variable] = "NA";
            } else {
              let replaceValue = getDateInRequiredFormat(fieldValue,scema[k].format);
              // set(formatconfig,externalAPIArray[i].jPath[j].variable,replaceValue);
              ownerObject[scema[k].variable] = replaceValue;
            }
          } else {
            if (
              fieldValue !== "NA" &&
              scema[k].localisation &&
              scema[k].localisation.required
            ) {
              let loc = scema[k].localisation;
              fieldValue = await getLocalisationkey(
                loc.prefix,
                fieldValue,
                loc.isCategoryRequired,
                loc.isMainTypeRequired,
                loc.isSubTypeRequired,
                loc.delimiter
              );
              if(!localisationCodes.includes(fieldValue))
                localisationCodes.push(fieldValue);

              if(!localisationModules.includes(loc.module))
                localisationModules.push(loc.module);

              variableToModuleMap[scema[k].variable] = loc.module;
            }
            let currentValue = fieldValue;
            if (typeof currentValue == "object" && currentValue.length > 0)
              currentValue = currentValue[0];

            currentValue= escapeRegex(currentValue);
            ownerObject[scema[k].variable] = currentValue;
          }
          // set(ownerObject[x], "text", get(val[j], scema[k].key, ""));
          // x += 2;
        }
        arrayOfOwnerObject.push(ownerObject);
      }
      // set(formatconfig, directArr[i].jPath, arrayOfOwnerObject);
      variableTovalueMap[directArr[i].jPath] = arrayOfOwnerObject;
    }

    //setting value in pdf for array-column type direct mapping
    else if (directArr[i].type == "array-column") {
      let arrayOfBuiltUpDetails = [];
      let isOrderedList = false;
      // let arrayOfFields=get(formatconfig, directArr[i].jPath+"[0]",[]);
      // arrayOfBuiltUpDetails.push(arrayOfFields);

      let { format = {}, val = [], variable } = directArr[i];
      let { scema = [] } = format;
      //to get data of multiple floor Built up details
      for (let j = 0; j < val.length; j++) {
        let arrayOfItems = [];
        for (let k = 0; k < scema.length; k++) {
          let fieldValue = get(val[j], scema[k].value, "NA");
          fieldValue = fieldValue == null ? "NA" : fieldValue;
          if (scema[k].type == "date") {
            let myDate = new Date(fieldValue);
            if (isNaN(myDate) || fieldValue === 0) {
              arrayOfItems.push("NA");
            } else {
              let replaceValue = getDateInRequiredFormat(fieldValue,scema[k].format);
              // set(formatconfig,externalAPIArray[i].jPath[j].variable,replaceValue);
              arrayOfItems.push(replaceValue);
            }
          } 
          /**
           * This condition is for displaying the ordered list data 
           * when data is coming as array of strings instead of key value pair.
           * Provided new scema type (array-orderedlist) which we should mention at data-config
           * to display the array of string in order list.
           */
          else if (scema[k].type == "array-orderedlist" && Array.isArray(fieldValue)) {
            if(fieldValue !== "NA") {
              for (var p = 0; p < fieldValue.length; p++) {
                let orderedList = [];
                orderedList.push(fieldValue[p]);
                arrayOfBuiltUpDetails.push(orderedList);
              }
              isOrderedList = true;
            }
          } else {
            if (
              fieldValue !== "NA" &&
              scema[k].localisation &&
              scema[k].localisation.required
            ) {
              let loc = scema[k].localisation;
              fieldValue = await getLocalisationkey(
                loc.prefix,
                fieldValue,
                loc.isCategoryRequired,
                loc.isMainTypeRequired,
                loc.isSubTypeRequired,
                loc.delimiter
              );
              if(!localisationCodes.includes(fieldValue))
                localisationCodes.push(fieldValue);

              if(!localisationModules.includes(loc.module))
                localisationModules.push(loc.module);
            }
            arrayOfItems.push(fieldValue);
          }
        }
        if(isOrderedList === false)
          arrayOfBuiltUpDetails.push(arrayOfItems);
      }

      // remove enclosing [ &  ]
      let stringBuildpDetails = JSON.stringify(arrayOfBuiltUpDetails).replace(
        "[",
        ""
      );
      stringBuildpDetails = stringBuildpDetails.substring(
        0,
        stringBuildpDetails.length - 1
      );

      variableTovalueMap[directArr[i].jPath] = stringBuildpDetails;
      // set(formatconfig,directArr[i].jPath,arrayOfBuiltUpDetails);
    }
    //setting value in pdf for no type direct mapping
    else if (directArr[i].type == "label") {
      let code = await getLocalisationkey(
        directArr[i].localisation.prefix,
        directArr[i].valJsonPath,
        directArr[i].localisation.isCategoryRequired,
        directArr[i].localisation.isMainTypeRequired,
        directArr[i].localisation.isSubTypeRequired,
        directArr[i].localisation.delimiter
      );
      if(!localisationCodes.includes(code))
        localisationCodes.push(code);

      if(!localisationModules.includes(directArr[i].localisation.module))
        localisationModules.push(directArr[i].localisation.module);

      variableTovalueMap[directArr[i].jPath] = code;
      variableToModuleMap[directArr[i].jPath] = directArr[i].localisation.module;

    } 
    
    else if (directArr[i].type == "date") {
      let myDate = new Date(directArr[i].val[0]);
      if (isNaN(myDate) || directArr[i].val[0] === 0) {
        variableTovalueMap[directArr[i].jPath] = "NA";
      } else {
        let replaceValue = getDateInRequiredFormat(directArr[i].val[0],directArr[i].format);
        variableTovalueMap[directArr[i].jPath] = replaceValue;
      }
    } 

    else {
      directArr[i].val = getValue(
        directArr[i].val,
        "NA",
        directArr[i].valJsonPath
      );
      if (
        directArr[i].val !== "NA" &&
        directArr[i].localisation &&
        directArr[i].localisation.required
      ){

        let code = await getLocalisationkey(
          directArr[i].localisation.prefix,
          directArr[i].val,
          directArr[i].localisation.isCategoryRequired,
          directArr[i].localisation.isMainTypeRequired,
          directArr[i].localisation.isSubTypeRequired,
          directArr[i].localisation.delimiter
        );

        if (typeof code == "object" && code.length > 0)
          code = code[0];

        if(!localisationCodes.includes(code))
          localisationCodes.push(code);

        if(!localisationModules.includes(directArr[i].localisation.module))
          localisationModules.push(directArr[i].localisation.module);

        variableTovalueMap[directArr[i].jPath] = code;

        variableToModuleMap[directArr[i].jPath] = directArr[i].localisation.module;

      }
        
      else{
        let currentValue = directArr[i].val;
          if (typeof currentValue == "object" && currentValue.length > 0)
            currentValue = currentValue[0];
          
         // currentValue=currentValue.replace(/\\/g,"\\\\").replace(/"/g,'\\"');
        currentValue= escapeRegex(currentValue);
        variableTovalueMap[directArr[i].jPath] = currentValue;
      } 
      if (directArr[i].uCaseNeeded) {
        let currentValue = variableTovalueMap[directArr[i].jPath];
        if (typeof currentValue == "object" && currentValue.length > 0)
          currentValue = currentValue[0];
        variableTovalueMap[directArr[i].jPath] = currentValue.toUpperCase();
      }
    }
  }

  let localisationMap = [];
  try{
    let resposnseMap = await findLocalisation(
      requestInfo,
      localisationModules,
      localisationCodes,
      pdfKey+'-directMapping'
    );
  
    resposnseMap.messages.map((item) => {
      localisationMap[item.code + "_" + item.module] = item.message;
    });
  }
  catch (error) {
    logger.error(error.stack || error);
    throw{
      message: `Error in localisation service call: ${error.Errors[0].message}`
    }; 
  }

  
  

  Object.keys(variableTovalueMap).forEach(function(key) {
    if(variableToModuleMap[key] && typeof variableTovalueMap[key] == 'string'){
      var code = variableTovalueMap[key];
      var module = variableToModuleMap[key];
      if(localisationMap[code+"_"+module]){
        variableTovalueMap[key] = localisationMap[code+"_"+module];
        if(unregisteredLocalisationCodes.includes(code)){
          var index = unregisteredLocalisationCodes.indexOf(code);
          unregisteredLocalisationCodes.splice(index, 1);
        }
      }
      else{
        if(!unregisteredLocalisationCodes.includes(code))
          unregisteredLocalisationCodes.push(code);
      }
    }

    if(typeof variableTovalueMap[key] =='object'){
      Object.keys(variableTovalueMap[key]).forEach(function(objectKey){
        Object.keys(variableTovalueMap[key][objectKey]).forEach(function(objectItemkey) {
          if(variableToModuleMap[objectItemkey]){
            var module = variableToModuleMap[objectItemkey];
            var code = variableTovalueMap[key][objectKey][objectItemkey];
            if(localisationMap[code+"_"+module]){
              variableTovalueMap[key][objectKey][objectItemkey] = localisationMap[code+"_"+module];
              if(unregisteredLocalisationCodes.includes(code)){
                var index = unregisteredLocalisationCodes.indexOf(code);
                unregisteredLocalisationCodes.splice(index, 1);
              }
            }
            else{
              if(!unregisteredLocalisationCodes.includes(code))
                unregisteredLocalisationCodes.push(code);
            }
          }
        });
      });    
    }

  });
  
};
