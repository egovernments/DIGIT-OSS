import request from "request";
import fs from "fs";
import get from "lodash/get";
import axios, { post } from "axios";
var FormData = require("form-data");
import envVariables from "../EnvironmentVariables";

let egovFileHost = envVariables.EGOV_FILESTORE_SERVICE_HOST;
let externalHost = envVariables.EGOV_EXTERNAL_HOST;

/**
 *
 * @param {*} filename -name of localy stored temporary file
 * @param {*} tenantId - tenantID
 */
export const fileStoreAPICall = async function(filename, tenantId, fileData) {
  var url = `${egovFileHost}/filestore/v1/files?tenantId=${tenantId}&module=pdfgen&tag=00040-2017-QR`;
  var form = new FormData();
  form.append("file", fileData, {
    filename: filename,
    contentType: "application/pdf"
  });
  let response = await axios.post(url, form, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      ...form.getHeaders()
    }
  });
  return get(response.data, "files[0].fileStoreId");
};

export async function getFilestoreUrl(filestoreid, tenantId){
  var url = `${egovFileHost}/filestore/v1/files/url?tenantId=${tenantId}&fileStoreIds=${filestoreid}`;
  let response = await axios.get(url);
  let data = response.data;
  var fileURL = data['fileStoreIds'][0]['url'].split(",");
  var shorteningUrl = getShortneningUrl(fileURL[0]);
  return shorteningUrl;
}

export async function getShortneningUrl(actualUrl){
  var url = `${externalHost}egov-url-shortening/shortener`;
  var request = {
    "url": actualUrl
  };

  let headers = {
    headers:{
      'Content-Type': 'application/json'
    }
  };

  let response = await axios.post(url,request, headers);
  let shortUrl = response.data;
  return shortUrl;
}