"use strict";
import http from "http";
import request from "request";
import express from "express";
import logger from "./config/logger";
import path from "path";
import fs, { exists } from "fs";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";
import * as pdfmake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import get from "lodash/get";
import set from "lodash/set";
import { strict } from "assert";
import { Recoverable } from "repl";
import { fileStoreAPICall } from "./utils/fileStoreAPICall";
import { directMapping } from "./utils/directMapping";
import { externalAPIMapping } from "./utils/externalAPIMapping";
import envVariables from "./EnvironmentVariables";
import QRCode from "qrcode";
import { getValue } from "./utils/commons";
import { getFileStoreIds, insertStoreIds } from "./queries";
var jp = require("jsonpath");
//create binary
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var pdfMakePrinter = require("pdfmake/src/printer");

let app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

let maxPagesAllowed = envVariables.MAX_NUMBER_PAGES;
let serverport = envVariables.SERVER_PORT;

let dataConfigUrls = envVariables.DATA_CONFIG_URLS;
let formatConfigUrls = envVariables.FORMAT_CONFIG_URLS;

let dataConfigMap = {};
let formatConfigMap = {};

var fontDescriptors = {
  Cambay: {
    normal: "src/fonts/Cambay-Regular.ttf",
    bold: "src/fonts/Cambay-Bold.ttf",
    italics: "src/fonts/Cambay-Italic.ttf",
    bolditalics: "src/fonts/Cambay-BoldItalic.ttf"
  },
  Roboto: {
    bold: "src/fonts/Roboto-Bold.ttf",
    normal: "src/fonts/Roboto-Regular.ttf"
  }
};

const printer = new pdfMakePrinter(fontDescriptors);
const uuidv4 = require("uuid/v4");

let mustache = require("mustache");
mustache.escape = function(text) {
  return text;
};
let borderLayout = {
  hLineColor: function(i, node) {
    return "#979797";
  },
  vLineColor: function(i, node) {
    return "#979797";
  },
  hLineWidth: function(i, node) {
    return 0.5;
  },
  vLineWidth: function(i, node) {
    return 0.5;
  }
};

/**
 *
 * @param {*} key - name of the key used to identify module configs. Provided request URL
 * @param {*} listDocDefinition - doc definitions as per pdfmake and formatconfig, each for each file
 * @param {*} successCallback - callaback when success
 * @param {*} errorCallback - callback when error
 * @param {*} tenantId - tenantID
 */
const createPdfBinary = async (
  key,
  listDocDefinition,
  entityIds,
  formatconfig,
  successCallback,
  errorCallback,
  tenantId,
  starttime,
  totalobjectcount,
  userid
) => {
  try {
    let noOfDefinitions = listDocDefinition.length;

    var jobid = `${key}${new Date().getTime()}`;
    if (noOfDefinitions == 0) {
      logger.error("no file generated for pdf");
      errorCallback({ message: " error: no file generated for pdf" });
    } else {
      var dbInsertSingleRecords = [];
      var dbInsertBulkRecords = [];
      await Promise.all([
        uploadFiles(
          dbInsertSingleRecords,
          dbInsertBulkRecords,
          formatconfig,
          listDocDefinition,
          key,
          false,
          jobid,
          noOfDefinitions,
          entityIds,
          starttime,
          successCallback,
          errorCallback,
          tenantId,
          totalobjectcount,
          userid
        ),
        uploadFiles(
          dbInsertSingleRecords,
          dbInsertBulkRecords,
          formatconfig,
          listDocDefinition,
          key,
          true,
          jobid,
          noOfDefinitions,
          entityIds,
          starttime,
          successCallback,
          errorCallback,
          tenantId,
          totalobjectcount,
          userid
        )
      ]);
    }
  } catch (err) {
    logger.error(err.stack || err);
    errorCallback({
      message: ` error occured while creating pdf: ${
        typeof err === "string" ? err : err.message
      }`
    });
  }
};

const uploadFiles = async (
  dbInsertSingleRecords,
  dbInsertBulkRecords,
  formatconfig,
  listDocDefinition,
  key,
  isconsolidated,
  jobid,
  noOfDefinitions,
  entityIds,
  starttime,
  successCallback,
  errorCallback,
  tenantId,
  totalobjectcount,
  userid
) => {
  let convertedListDocDefinition = [];
  var formatobject = JSON.parse(JSON.stringify(formatconfig));
  let listOfFilestoreIds = [];

  if (!isconsolidated) {
    listDocDefinition.forEach(docDefinition => {
      docDefinition["content"].forEach(defn => {
        var formatobject = JSON.parse(JSON.stringify(formatconfig));
        formatobject["content"] = defn;
        convertedListDocDefinition.push(formatobject);
      });
    });
  } else {
    convertedListDocDefinition = [...listDocDefinition];
  }

  convertedListDocDefinition.forEach(function(docDefinition, i) {
    const doc = printer.createPdfKitDocument(
      JSON.parse(JSON.stringify(docDefinition))
    );
    let fileNameAppend = "-" + new Date().getTime();
    // let filename="src/pdfs/"+key+" "+fileNameAppend+".pdf"
    let filename = key + "" + fileNameAppend + ".pdf";
    //reference link
    //https://medium.com/@kainikhil/nodejs-how-to-generate-and-properly-serve-pdf-6835737d118e#d8e5

    //storing file on local computer/server

    var chunks = [];

    doc.on("data", function(chunk) {
      chunks.push(chunk);
    });
    doc.on("end", function() {
      // console.log("enddddd "+cr++);
      var data = Buffer.concat(chunks);
      fileStoreAPICall(filename, tenantId, data)
        .then(result => {
          listOfFilestoreIds.push(result);
          if (!isconsolidated) {
            dbInsertSingleRecords.push({
              jobid,
              id: uuidv4(),
              createdby: userid,
              modifiedby: userid,
              entityid: entityIds[i],
              isconsolidated: false,
              filestoreids: [result],
              tenantId,
              createdtime: starttime,
              endtime: new Date().getTime(),
              totalcount: 1
            });

            // insertStoreIds(jobid,entityIds[i],[result],tenantId,starttime,successCallback,errorCallback,1,false);
          } else if (
            isconsolidated &&
            listOfFilestoreIds.length == noOfDefinitions
          ) {
            // insertStoreIds("",);
            // logger.info("PDF uploaded to filestore");
            dbInsertBulkRecords.push({
              jobid,
              id: uuidv4(),
              createdby: userid,
              modifiedby: userid,
              entityid: null,
              isconsolidated: true,
              filestoreids: listOfFilestoreIds,
              tenantId,
              createdtime: starttime,
              endtime: new Date().getTime(),
              totalcount: totalobjectcount
            });
          }
          if (
            dbInsertSingleRecords.length == totalobjectcount &&
            dbInsertBulkRecords.length == 1
          ) {
            insertStoreIds(
              dbInsertSingleRecords.concat(dbInsertBulkRecords),
              jobid,
              listOfFilestoreIds,
              tenantId,
              starttime,
              successCallback,
              errorCallback,
              totalobjectcount
            );
          }
        })
        .catch(err => {
          logger.error(err.stack || err);
          errorCallback({
            message:
              "error occurred while uploading pdf: " + (typeof err === "string")
                ? err
                : err.message
          });
        });
    });
    doc.end();
  });
};

app.post(
  "/pdf-service/v1/_create",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      requestInfo = get(req.body, "RequestInfo");
      await createAndSave(
        req,
        res,
        response => {
          // doc successfully created
          res.status(201);
          res.json({
            ResponseInfo: requestInfo,
            message: response.message,
            filestoreIds: response.filestoreIds,
            jobid: response.jobid,
            createdtime: response.starttime,
            endtime: response.endtime,
            tenantid: response.tenantid,
            totalcount: response.totalcount
          });
        },
        error => {
          res.status(500);
          // doc creation error
          res.json({
            ResponseInfo: requestInfo,
            message: "error in createPdfBinary " + error.message
          });
        }
      );
      //
    } catch (error) {
      logger.error(error.stack || error);
      res.status(500);
      res.json({
        ResponseInfo: requestInfo,
        message: "some unknown error while creating: " + error.message
      });
    }
  })
);

app.post(
  "/pdf-service/v1/_createnosave",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      var starttime = new Date().getTime();
      let key = req.query.key;
      let tenantId = req.query.tenantId;
      var formatconfig = formatConfigMap[key];
      var dataconfig = dataConfigMap[key];

      requestInfo = get(req.body, "RequestInfo");
      //

      var valid = validateRequest(req, res, key, tenantId, requestInfo);

      if (valid) {
        let [
          formatConfigByFile,
          totalobjectcount,
          entityIds
        ] = await prepareBegin(
          key,
          req,
          requestInfo,
          true,
          formatconfig,
          dataconfig
        );
        const doc = printer.createPdfKitDocument(formatConfigByFile[0]);
        let fileNameAppend = "-" + new Date().getTime();
        let filename = key + "" + fileNameAppend + ".pdf";

        var chunks = [];
        doc.on("data", function(chunk) {
          chunks.push(chunk);
        });
        doc.on("end", function() {
          // console.log("enddddd "+cr++);
          var data = Buffer.concat(chunks);
          res.writeHead(201, {
            // 'Content-Type': mimetype,
            "Content-disposition": "attachment;filename=" + filename,
            "Content-Length": data.length
          });
          res.end(Buffer.from(data, "binary"));
        });
        doc.end();
      }
    } catch (error) {
      logger.error(error.stack || error);
      res.status(500);
      res.json({
        message: "some unknown error while creating: " + error.message
      });
    }
  })
);

app.post(
  "/pdf-service/v1/_search",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      let tenantid = req.query.tenantid;
      let jobid = req.query.jobid;
      let isconsolidated = req.query.isconsolidated;
      let entityid = req.query.entityid;
      requestInfo = get(req.body, "RequestInfo");
      if (
        (jobid == undefined || jobid.trim() == "") &&
        (entityid == undefined || entityid.trim() == "")
      ) {
        res.status(400);
        res.json({
          ResponseInfo: requestInfo,
          message: "jobid and entityid both can not be empty"
        });
      } else {
        if (jobid) {
          if (jobid.includes(",")) {
            jobid = jobid.split(",");
          } else {
            jobid = [jobid];
          }
        }

        getFileStoreIds(
          jobid,
          tenantid,
          isconsolidated,
          entityid,
          responseBody => {
            // doc successfully created
            res.status(responseBody.status);
            delete responseBody.status;
            res.json({ ResponseInfo: requestInfo, ...responseBody });
          }
        );
      }
    } catch (error) {
      logger.error(error.stack || error);
      res.status(500);
      res.json({
        ResponseInfo: requestInfo,
        message: "some unknown error while searching: " + error.message
      });
    }
  })
);

dataConfigUrls &&
  dataConfigUrls.split(",").map(item => {
    item = item.trim();
    if (item.includes("file://")) {
      item = item.replace("file://", "");
      fs.readFile(item, "utf8", function(err, data) {
        try {
          if (err) {
            logger.error(
              "error when reading file for dataconfig: file:///" + item
            );
            logger.error(err.stack);
          } else {
            data = JSON.parse(data);
            dataConfigMap[data.key] = data;
            logger.info("loaded dataconfig: file:///" + item);
          }
        } catch (error) {
          logger.error("error in loading dataconfig: file:///" + item);
          logger.error(error.stack);
        }
      });
    } else {
      (async () => {
        try {
          var response = await axios.get(item);
          dataConfigMap[response.data.key] = response.data;
          logger.info("loaded dataconfig: " + item);
        } catch (error) {
          logger.error("error in loading dataconfig: " + item);
          logger.error(error.stack);
        }
      })();
    }
  });

formatConfigUrls &&
  formatConfigUrls.split(",").map(item => {
    item = item.trim();
    if (item.includes("file://")) {
      item = item.replace("file://", "");
      fs.readFile(item, "utf8", function(err, data) {
        try {
          if (err) {
            logger.error(err.stack);
            logger.error(
              "error when reading file for formatconfig: file:///" + item
            );
          } else {
            data = JSON.parse(data);
            formatConfigMap[data.key] = data.config;
            logger.info("loaded formatconfig: file:///" + item);
          }
        } catch (error) {
          logger.error("error in loading formatconfig: file:///" + item);
          logger.error(error.stack);
        }
      });
    } else {
      (async () => {
        try {
          var response = await axios.get(item);
          formatConfigMap[response.data.key] = response.data.config;
          logger.info("loaded formatconfig: " + item);
        } catch (error) {
          logger.error("error in loading formatconfig: " + item);
          logger.error(error.stack);
        }
      })();
    }
  });

app.listen(serverport, () => {
  logger.info(`Server running at http:${serverport}/`);
});

/**
 *
 * @param {*} formatconfig - format config read from formatconfig file
 */

export const createAndSave = async (
  req,
  res,
  successCallback,
  errorCallback
) => {
  var starttime = new Date().getTime();
  let key = get(req.query || req, "key");
  let tenantId = get(req.query || req, "tenantId");
  var formatconfig = formatConfigMap[key];
  var dataconfig = dataConfigMap[key];
  var dataconfig = dataConfigMap[key];
  var dataconfig = dataConfigMap[key];
  var userid = get(req.body || req, "RequestInfo.userInfo.id");
  var requestInfo = get(req.body || req, "RequestInfo");
  //

  var valid = validateRequest(req, res, key, tenantId, requestInfo);
  if (valid) {
    let [formatConfigByFile, totalobjectcount, entityIds] = await prepareBegin(
      key,
      req,
      requestInfo,
      false,
      formatconfig,
      dataconfig
    );

    // logger.info(`Applied templating engine on ${moduleObjectsArray.length} objects output will be in ${formatConfigByFile.length} files`);
    logger.info(
      `Applied templating engine on ${totalobjectcount} objects output will be in ${formatConfigByFile.length} files`
    );
    // var util = require('util');
    // fs.writeFileSync('./data.txt', util.inspect(JSON.stringify(formatconfig)) , 'utf-8');
    //function to download pdf automatically
    createPdfBinary(
      key,
      formatConfigByFile,
      entityIds,
      formatconfig,
      successCallback,
      errorCallback,
      tenantId,
      starttime,
      totalobjectcount,
      userid
    ).catch(err => {
      logger.error(err.stack || err);
      errorCallback({
        message:
          "error occurred in createPdfBinary call: " + (typeof err === "string")
            ? err
            : err.message
      });
    });
  }
};
const updateBorderlayout = formatconfig => {
  formatconfig.content = formatconfig.content.map(item => {
    if (
      item.hasOwnProperty("layout") &&
      typeof item.layout === "object" &&
      Object.keys(item.layout).length === 0
    ) {
      item.layout = borderLayout;
    }
    return item;
  });
  return formatconfig;
};

/**
 *
 * @param {*} variableTovalueMap - key, value map. Keys are variable defined in data config
 * and value is their corresponding values. Map will be used by Moustache template engine
 * @param {*} formatconfig -format config read from formatconfig file
 */
export const fillValues = (variableTovalueMap, formatconfig) => {
  let input = JSON.stringify(formatconfig);
  //console.log(variableTovalueMap);
  //console.log(mustache.render(input, variableTovalueMap).replace(/""/g,"\"").replace(/\\/g,"").replace(/"\[/g,"\[").replace(/\]"/g,"\]").replace(/\]\[/g,"\],\[").replace(/"\{/g,"\{").replace(/\}"/g,"\}"));
  let output = JSON.parse(
    mustache
      .render(input, variableTovalueMap)
      .replace(/""/g, '"')
      .replace(/\\/g, "")
      .replace(/"\[/g, "[")
      .replace(/\]"/g, "]")
      .replace(/\]\[/g, "],[")
      .replace(/"\{/g, "{")
      .replace(/\}"/g, "}")
  );
  return output;
};

/**
 * generateQRCodes-function to geneerate qrcodes
 * moduleObject-current module object from request body
 * dataconfig- data config read from dataconfig of module
 */
const generateQRCodes = async (
  moduleObject,
  dataconfig,
  variableTovalueMap
) => {
  let qrcodeMappings = getValue(
    jp.query(dataconfig, "$.DataConfigs.mappings.*.mappings.*.qrcodeConfig.*"),
    [],
    "$.DataConfigs.mappings.*.mappings.*.qrcodeConfig.*"
  );

  for (var i = 0, len = qrcodeMappings.length; i < len; i++) {
    let qrmapping = qrcodeMappings[i];
    let varname = qrmapping.variable;
    let qrtext = mustache.render(qrmapping.value, variableTovalueMap);

    let qrCodeImage = await QRCode.toDataURL(qrtext);
    variableTovalueMap[varname] = qrCodeImage;
  }
};

const handleDerivedMapping = (dataconfig, variableTovalueMap) => {
  let derivedMappings = getValue(
    jp.query(dataconfig, "$.DataConfigs.mappings.*.mappings.*.derived.*"),
    [],
    "$.DataConfigs.mappings.*.mappings.*.derived.*"
  );

  for (var i = 0, len = derivedMappings.length; i < len; i++) {
    let mapping = derivedMappings[i];
    let expression = mustache
      .render(
        mapping.formula.replace(/-/g, " - ").replace(/\+/g, " + "),
        variableTovalueMap
      )
      .replace(/NA/g, "0");
    variableTovalueMap[mapping.variable] = eval(expression);
  }
};

const validateRequest = (req, res, key, tenantId, requestInfo) => {
  let errorMessage = "";
  if (key == undefined || key.trim() === "") {
    errorMessage += " key is missing,";
  }
  if (tenantId == undefined || tenantId.trim() === "") {
    errorMessage += " tenantId is missing,";
  }
  if (requestInfo == undefined) {
    errorMessage += " requestInfo is missing,";
  }
  if (requestInfo && requestInfo.userInfo == undefined) {
    errorMessage += " userInfo is missing,";
  }
  if (formatConfigMap[key] == undefined || dataConfigMap[key] == undefined) {
    errorMessage += ` no config found for key ${key}`;
  }
  if (res && errorMessage !== "") {
    res.status(400);
    res.json({
      message: errorMessage,
      ResponseInfo: requestInfo
    });
    return false;
  } else {
    return true;
  }
};

const prepareBegin = async (
  key,
  req,
  requestInfo,
  returnFileInResponse,
  formatconfig,
  dataconfig
) => {
  var baseKeyPath = get(dataconfig, "DataConfigs.baseKeyPath");
  var entityIdPath = get(dataconfig, "DataConfigs.entityIdPath");
  if (baseKeyPath == null) {
    logger.error("baseKeyPath is absent in config");
    throw { message: `baseKeyPath is absent in config` };
  }
  return await prepareBulk(
    key,
    dataconfig,
    formatconfig,
    req,
    baseKeyPath,
    requestInfo,
    returnFileInResponse,
    entityIdPath
  );
};

const handlelogic = async (
  key,
  formatObject,
  moduleObject,
  dataconfig,
  isCommonTableBorderRequired,
  requestInfo
) => {
  let variableTovalueMap = {};
  let localisationMap = {};
  let localisationModuleList = [];
  //direct mapping service
  await Promise.all([
    directMapping(
      moduleObject,
      dataconfig,
      variableTovalueMap,
      localisationMap,
      requestInfo,
      localisationModuleList
    ),
    //external API mapping
    externalAPIMapping(
      key,
      moduleObject,
      dataconfig,
      variableTovalueMap,
      localisationMap,
      requestInfo,
      localisationModuleList
    )
  ]);
  await generateQRCodes(moduleObject, dataconfig, variableTovalueMap);
  handleDerivedMapping(dataconfig, variableTovalueMap);
  formatObject = fillValues(variableTovalueMap, formatObject);
  if (isCommonTableBorderRequired === true)
    formatObject = updateBorderlayout(formatObject);
  return formatObject;
};

// const prepareSingle=(key)=>{
//   handlelogic();
// }

const prepareBulk = async (
  key,
  dataconfig,
  formatconfig,
  req,
  baseKeyPath,
  requestInfo,
  returnFileInResponse,
  entityIdPath
) => {
  let isCommonTableBorderRequired = get(
    dataconfig,
    "DataConfigs.isCommonTableBorderRequired"
  );
  let formatObjectArrayObject = [];
  let formatConfigByFile = [];
  let totalobjectcount = 0;
  let entityIds = [];
  let countOfObjectsInCurrentFile = 0;
  let moduleObjectsArray = getValue(
    jp.query(req.body || req, baseKeyPath),
    [],
    baseKeyPath
  );
  if (Array.isArray(moduleObjectsArray) && moduleObjectsArray.length > 0) {
    totalobjectcount = moduleObjectsArray.length;
    for (var i = 0, len = moduleObjectsArray.length; i < len; i++) {
      let moduleObject = moduleObjectsArray[i];
      let entityKey = getValue(
        jp.query(moduleObject, entityIdPath),
        [null],
        entityIdPath
      );
      entityIds.push(entityKey[0]);

      let formatObject = JSON.parse(JSON.stringify(formatconfig));

      // Multipage pdf, each pdf from new page
      if (
        formatObjectArrayObject.length != 0 &&
        formatObject["content"][0] !== undefined
      ) {
        formatObject["content"][0]["pageBreak"] = "before";
      }

      /////////////////////////////
      formatObject = await handlelogic(
        key,
        formatObject,
        moduleObject,
        dataconfig,
        isCommonTableBorderRequired,
        requestInfo
      );

      formatObjectArrayObject.push(formatObject["content"]);
      //putting formatconfig in a file to check docdefinition on pdfmake playground online
      countOfObjectsInCurrentFile++;
      if (
        (!returnFileInResponse &&
          countOfObjectsInCurrentFile == maxPagesAllowed) ||
        i + 1 == len
      ) {
        let formatconfigCopy = JSON.parse(JSON.stringify(formatconfig));
        formatconfigCopy["content"] = formatObjectArrayObject;
        formatConfigByFile.push(formatconfigCopy);
        formatObjectArrayObject = [];
        countOfObjectsInCurrentFile = 0;
      }
    }
    return [formatConfigByFile, totalobjectcount, entityIds];
  } else {
    logger.error(
      `could not find property of type array in request body with name ${baseKeyPath}`
    );
    throw {
      message: `could not find property of type array in request body with name ${baseKeyPath}`
    };
  }
};
export default app;
