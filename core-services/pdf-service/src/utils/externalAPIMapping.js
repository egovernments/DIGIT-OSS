import get from "lodash/get";
import axios from "axios";
import {
  getLocalisationkey,
  findLocalisation,
  getDateInRequiredFormat,
  getValue
} from "./commons";
import logger from "../config/logger";
/**
 *
 * @param {*} key -name of the key used to identify module configs. Provided request URL
 * @param {*} req -current module object, picked from request body
 * @param {*} dataconfig - data config
 * @param {*} variableTovalueMap -map used for filling values by template engine 'mustache'
 * @param {*} localisationMap -Map to store localisation key, value pair
 * @param {*} requestInfo -request info from request body
 */

function escapeRegex(string) {
  if (typeof string == "string")
    return string.replace(/[\\"]/g, '\\$&');
  else
    return string;
}

export const externalAPIMapping = async function (
  pdfKey,
  req,
  dataconfig,
  variableTovalueMap,
  requestInfo,
  unregisteredLocalisationCodes
) {
  var jp = require("jsonpath");
  var objectOfExternalAPI = getValue(
    jp.query(dataconfig, "$.DataConfigs.mappings.*.mappings.*.externalAPI.*"),
    [],
    "$.DataConfigs.mappings.*.mappings.*.externalAPI.*"
  );
  var externalAPIArray = objectOfExternalAPI.map(item => {
    return {
      uri: item.path,
      queryParams: item.queryParam,
      jPath: item.responseMapping,
      requesttype: item.requesttype || "POST",
      variable: "",
      val: ""
    };
  });

  var localisationCodes = [];
  var localisationModules = [];
  var variableToModuleMap = {};

  var responses = [];
  var responsePromises = [];

  for (let i = 0; i < externalAPIArray.length; i++) {
    var temp1 = "";
    var temp2 = "";
    var flag = 0;
    //to convert queryparam and uri into properURI

    //for PT module
    if (pdfKey == "pt-receipt") {
      for (let j = 0; j < externalAPIArray[i].queryParams.length; j++) {
        if (externalAPIArray[i].queryParams[j] == "$") {
          flag = 1;
        }
        if (
          externalAPIArray[i].queryParams[j] == "," ||
          externalAPIArray[i].queryParams[j] == ":"
        ) {
          if (flag == 1) {
            temp2 = temp1;
            var temp3 = getValue(jp.query(req, temp1), "NA", temp1);
            externalAPIArray[i].queryParams = externalAPIArray[
              i
            ].queryParams.replace(temp2, temp3);

            j = 0;
            flag = 0;
            temp1 = "";
            temp2 = "";
          }
        }

        if (flag == 1) {
          temp1 += externalAPIArray[i].queryParams[j];
        }
        if (j == externalAPIArray[i].queryParams.length - 1 && flag == 1) {
          temp2 = temp1;
          var temp3 = getValue(jp.query(req, temp1), "NA", temp1);

          externalAPIArray[i].queryParams = externalAPIArray[
            i
          ].queryParams.replace(temp2, temp3);

          flag = 0;
          temp1 = "";
          temp2 = "";
        }
      }
    }
    //for other modules
    else {
      for (let j = 0; j < externalAPIArray[i].queryParams.length; j++) {
        if (externalAPIArray[i].queryParams[j] == "{") {
          externalAPIArray[i].queryParams = externalAPIArray[
            i
          ].queryParams.replace("{", "");
        }


        if (externalAPIArray[i].queryParams[j] == "$") {
          flag = 1;
        }
        if (
          externalAPIArray[i].queryParams[j] == "," ||
          externalAPIArray[i].queryParams[j] == "}"
        ) {
          if (flag == 1) {
            temp2 = temp1;

            var temp3 = getValue(jp.query(req, temp1), "NA", temp1);
            externalAPIArray[i].queryParams = externalAPIArray[
              i
            ].queryParams.replace(temp2, temp3);

            j = 0;
            flag = 0;
            temp1 = "";
            temp2 = "";
          }
          if (externalAPIArray[i].queryParams[j] == "}") {
            externalAPIArray[i].queryParams = externalAPIArray[
              i
            ].queryParams.replace("}", "");
          }

        }
        if (flag == 1) {
          temp1 += externalAPIArray[i].queryParams[j];
        }
        if (j == externalAPIArray[i].queryParams.length - 1 && flag == 1) {
          temp2 = temp1;
          var temp3 = getValue(jp.query(req, temp1), "NA", temp1);

          externalAPIArray[i].queryParams = externalAPIArray[
            i
          ].queryParams.replace(temp2, temp3);

          flag = 0;
          temp1 = "";
          temp2 = "";
        }
      }
    }
    externalAPIArray[i].queryParams = externalAPIArray[i].queryParams.replace(
      /,/g,
      "&"
    );
    let headers = {
      "content-type": "application/json;charset=UTF-8",
      accept: "application/json, text/plain, */*"
    };

    var resPromise;
    if (externalAPIArray[i].requesttype == "POST") {
      resPromise = axios.post(
        externalAPIArray[i].uri + "?" + externalAPIArray[i].queryParams, {
          RequestInfo: requestInfo
        }, {
          headers: headers
        }
      );
    } else {
      resPromise = axios.get(
        externalAPIArray[i].uri + "?" + externalAPIArray[i].queryParams, {
          responseType: "application/json"
        }
      );
    }
    responsePromises.push(resPromise)
  }

  responses = await Promise.all(responsePromises)
  for (let i = 0; i < externalAPIArray.length; i++) {
    var res = responses[i].data

    //putting required data from external API call in format config

    for (let j = 0; j < externalAPIArray[i].jPath.length; j++) {
      let replaceValue = getValue(
        jp.query(res, externalAPIArray[i].jPath[j].value),
        "NA",
        externalAPIArray[i].jPath[j].value
      );
      let loc = externalAPIArray[i].jPath[j].localisation;
      if (externalAPIArray[i].jPath[j].type == "image") {
        // default empty image
        var imageData =
          "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=";
        if (replaceValue != "NA") {
          try {
            var len = replaceValue[0].split(",").length;
            var response = await axios.get(
              replaceValue[0].split(",")[len - 1], {
                responseType: "arraybuffer"
              }
            );
            imageData =
              "data:" +
              response.headers["content-type"] +
              ";base64," +
              Buffer.from(response.data).toString("base64");
          } catch (error) {
            logger.error(error.stack || error);
            throw {
              message: `error while loading image from: ${replaceValue[0]}`
            };
          }
        }
        variableTovalueMap[externalAPIArray[i].jPath[j].variable] = imageData;
      } else if (externalAPIArray[i].jPath[j].type == "date") {
        let myDate = new Date(replaceValue[0]);
        if (isNaN(myDate) || replaceValue[0] === 0) {
          variableTovalueMap[externalAPIArray[i].jPath[j].variable] = "NA";
        } else {
          replaceValue = getDateInRequiredFormat(replaceValue[0], externalAPIArray[i].jPath[j].format);
          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = replaceValue;
        }
      } else if (externalAPIArray[i].jPath[j].type == "array") {

        let arrayOfOwnerObject = [];
        // let ownerObject = JSON.parse(JSON.stringify(get(formatconfig, directArr[i].jPath + "[0]", [])));
        let {
          format = {}, value = [], variable
        } = externalAPIArray[i].jPath[j];
        let {
          scema = []
        } = format;
        let val = getValue(jp.query(res, value), "NA", value);


        //taking values about owner from request body
        for (let l = 0; l < val.length; l++) {
          // var x = 1;
          let ownerObject = {};
          for (let k = 0; k < scema.length; k++) {
            let fieldValue = get(val[l], scema[k].value, "NA");
            fieldValue = fieldValue == null ? "NA" : fieldValue;
            if (scema[k].type == "date") {
              let myDate = new Date(fieldValue);
              if (isNaN(myDate) || fieldValue === 0) {
                ownerObject[scema[k].variable] = "NA";
              } else {
                let replaceValue = getDateInRequiredFormat(fieldValue, scema[k].format);
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
              //console.log("\nvalue-->"+fieldValue)
              let currentValue = fieldValue;
              if (typeof currentValue == "object" && currentValue.length > 0)
                currentValue = currentValue[0];

              currentValue = escapeRegex(currentValue);
              ownerObject[scema[k].variable] = currentValue;

            }
            // set(ownerObject[x], "text", get(val[j], scema[k].key, ""));
            // x += 2;
          }
          arrayOfOwnerObject.push(ownerObject);

        }

        variableTovalueMap[variable] = arrayOfOwnerObject;
        //console.log("\nvariableTovalueMap[externalAPIArray[i].jPath.variable]--->\n"+JSON.stringify(variableTovalueMap[externalAPIArray[i].jPath.variable]));

      } else {
        if (
          replaceValue !== "NA" &&
          externalAPIArray[i].jPath[j].localisation &&
          externalAPIArray[i].jPath[j].localisation.required &&
          externalAPIArray[i].jPath[j].localisation.prefix
        ){
          let currentValue= await getLocalisationkey(
            loc.prefix,
            replaceValue,
            loc.isCategoryRequired,
            loc.isMainTypeRequired,
            loc.isSubTypeRequired,
            loc.delimiter
          );
          if (typeof currentValue == "object" && currentValue.length > 0)
            currentValue = currentValue[0];

          //currentValue = escapeRegex(currentValue);
          if(!localisationCodes.includes(currentValue))
            localisationCodes.push(currentValue);

          if(!localisationModules.includes(loc.module))
            localisationModules.push(loc.module);

          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = currentValue;

          variableToModuleMap[
            externalAPIArray[i].jPath[j].variable
          ] = loc.module;

        }
        else {
          let currentValue = replaceValue;
          if (typeof currentValue == "object" && currentValue.length > 0)
            currentValue = currentValue[0];

          // currentValue=currentValue.replace(/\\/g,"\\\\").replace(/"/g,'\\"');
          currentValue = escapeRegex(currentValue);
          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = currentValue;

        }
        if (externalAPIArray[i].jPath[j].isUpperCaseRequired) {
          let currentValue =
            variableTovalueMap[externalAPIArray[i].jPath[j].variable];
          if (typeof currentValue == "object" && currentValue.length > 0)
            currentValue = currentValue[0];

          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = currentValue.toUpperCase();
        }
      }
    }
  }

  let localisationMap = [];
  try{
    let resposnseMap = await findLocalisation(
      requestInfo,
      localisationModules,
      localisationCodes,
      pdfKey+'-externalMapping'
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