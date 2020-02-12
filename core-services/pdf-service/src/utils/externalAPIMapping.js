import get from "lodash/get";
import axios from "axios";
import { httpRequest } from "../api/api";
import {
  findAndUpdateLocalisation,
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

export const externalAPIMapping = async function(
  key,
  req,
  dataconfig,
  variableTovalueMap,
  localisationMap,
  requestInfo,
  localisationModuleList
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
  for (let i = 0; i < externalAPIArray.length; i++) {
    var temp1 = "";
    var temp2 = "";
    var flag = 0;
    //to convert queryparam and uri into properURI

    //for PT module
    if (key == "pt-receipt") {
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
          ].queryParams.replace("{","");
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
            ].queryParams.replace("}","");
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
    var res;
    if (externalAPIArray[i].requesttype == "POST") {
      res = await httpRequest(
        externalAPIArray[i].uri + "?" + externalAPIArray[i].queryParams,
        { RequestInfo: requestInfo },
        headers
      );
    } else {
      var apires = await axios.get(
        externalAPIArray[i].uri + "?" + externalAPIArray[i].queryParams,
        {
          responseType: "application/json"
        }
      );
      res = apires.data;
    }
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
              replaceValue[0].split(",")[len - 1],
              {
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
          replaceValue = getDateInRequiredFormat(replaceValue[0]);
          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = replaceValue;
        }
      } else {
        if (
          replaceValue !== "NA" &&
          externalAPIArray[i].jPath[j].localisation &&
          externalAPIArray[i].jPath[j].localisation.required &&
          externalAPIArray[i].jPath[j].localisation.prefix
        )
          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = await findAndUpdateLocalisation(
            requestInfo,
            localisationMap,
            loc.prefix,
            replaceValue,
            loc.module,
            localisationModuleList,
            loc.isCategoryRequired,
            loc.isMainTypeRequired,
            loc.isSubTypeRequired,
            loc.delimiter
          );
        else
          variableTovalueMap[
            externalAPIArray[i].jPath[j].variable
          ] = replaceValue;
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
};
