import get from "lodash/get";
import logger from "../config/logger";
import axios from "axios";
import {
  findAndUpdateLocalisation,
  getDateInRequiredFormat,
  getValue
} from "./commons";

var jp = require("jsonpath");

/**
 *
 * @param {*} req - current module object, picked from request body
 * @param {*} dataconfig  - data config
 * @param {*} variableTovalueMap - map used for filling values by template engine 'mustache'
 * @param {*} localisationMap - Map to store localisation key, value pair
 * @param {*} requestInfo - request info from request body
 */
export const directMapping = async (
  req,
  dataconfig,
  variableTovalueMap,
  localisationMap,
  requestInfo,
  localisationModuleList
) => {
  var directArr = [];
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
      variableTovalueMap[directArr[i].jPath] = directArr[i].val;
    } else if (directArr[i].type == "function") {
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
          if (scema[k].type == "date") {
            let myDate = new Date(fieldValue);
            if (isNaN(myDate) || fieldValue === 0) {
              ownerObject[scema[k].key] = "NA";
            } else {
              let replaceValue = getDateInRequiredFormat(fieldValue);
              // set(formatconfig,externalAPIArray[i].jPath[j].variable,replaceValue);
              ownerObject[scema[k].key] = replaceValue;
            }
          } else {
            if (
              fieldValue !== "NA" &&
              scema[k].localisation &&
              scema[k].localisation.required
            ) {
              let loc = scema[k].localisation;
              fieldValue = await findAndUpdateLocalisation(
                requestInfo,
                localisationMap,
                loc.prefix,
                fieldValue,
                loc.module,
                localisationModuleList,
                loc.isCategoryRequired,
                loc.isMainTypeRequired,
                loc.isSubTypeRequired,
                loc.delimiter
              );
            }
            ownerObject[scema[k].variable] = fieldValue;
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
      // let arrayOfFields=get(formatconfig, directArr[i].jPath+"[0]",[]);
      // arrayOfBuiltUpDetails.push(arrayOfFields);

      let { format = {}, val = [], variable } = directArr[i];
      let { scema = [] } = format;
      //to get data of multiple floor Built up details
      for (let j = 0; j < val.length; j++) {
        let arrayOfItems = [];
        for (let k = 0; k < scema.length; k++) {
          let fieldValue = get(val[j], scema[k].key, "NA");
          if (scema[k].type == "date") {
            let myDate = new Date(fieldValue);
            if (isNaN(myDate) || fieldValue === 0) {
              arrayOfItems.push("NA");
            } else {
              let replaceValue = getDateInRequiredFormat(fieldValue);
              // set(formatconfig,externalAPIArray[i].jPath[j].variable,replaceValue);
              arrayOfItems.push(replaceValue);
            }
          } else {
            if (
              fieldValue !== "NA" &&
              scema[k].localisation &&
              scema[k].localisation.required
            ) {
              let loc = scema[k].localisation;
              fieldValue = await findAndUpdateLocalisation(
                requestInfo,
                localisationMap,
                loc.prefix,
                fieldValue,
                loc.module,
                localisationModuleList,
                loc.isCategoryRequired,
                loc.isMainTypeRequired,
                loc.isSubTypeRequired,
                loc.delimiter
              );
            }
            arrayOfItems.push(fieldValue);
          }
        }

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
      variableTovalueMap[directArr[i].jPath] = await findAndUpdateLocalisation(
        requestInfo,
        localisationMap,
        directArr[i].localisation.prefix,
        directArr[i].valJsonPath,
        directArr[i].localisation.module,
        localisationModuleList,
        directArr[i].localisation.isCategoryRequired,
        directArr[i].localisation.isMainTypeRequired,
        directArr[i].localisation.isSubTypeRequired,
        directArr[i].localisation.delimiter
      );
    } else if (directArr[i].type == "date") {
      let myDate = new Date(directArr[i].val[0]);
      if (isNaN(myDate) || directArr[i].val[0] === 0) {
        variableTovalueMap[directArr[i].jPath] = "NA";
      } else {
        let replaceValue = getDateInRequiredFormat(directArr[i].val[0]);
        variableTovalueMap[directArr[i].jPath] = replaceValue;
      }
    } else {

      directArr[i].val = getValue(
        directArr[i].val,
        "NA",
        directArr[i].valJsonPath
      );
      if (
        directArr[i].val !== "NA" &&
        directArr[i].localisation &&
        directArr[i].localisation.required
      )
        variableTovalueMap[
          directArr[i].jPath
        ] = await findAndUpdateLocalisation(
          requestInfo,
          localisationMap,
          directArr[i].localisation.prefix,
          directArr[i].val,
          directArr[i].localisation.module,
          localisationModuleList,
          directArr[i].localisation.isCategoryRequired,
          directArr[i].localisation.isMainTypeRequired,
          directArr[i].localisation.isSubTypeRequired,
          directArr[i].localisation.delimiter
        );
      else variableTovalueMap[directArr[i].jPath] = directArr[i].val;
      if (directArr[i].uCaseNeeded) {
        let currentValue = variableTovalueMap[directArr[i].jPath];
        if (typeof currentValue == "object" && currentValue.length > 0)
          currentValue = currentValue[0];
        variableTovalueMap[directArr[i].jPath] = currentValue.toUpperCase();
      }
    }
  }
};
