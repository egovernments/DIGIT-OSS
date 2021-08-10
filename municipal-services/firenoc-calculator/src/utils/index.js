import envVariables from "../envVariables";

export const requestInfoToResponseInfo = (requestinfo, success) => {
  let ResponseInfo = {
    apiId: "",
    ver: "",
    ts: 0,
    resMsgId: "",
    msgId: "",
    status: ""
  };
  ResponseInfo.apiId =
    requestinfo && requestinfo.apiId ? requestinfo.apiId : "";
  ResponseInfo.ver = requestinfo && requestinfo.ver ? requestinfo.ver : "";
  ResponseInfo.ts = requestinfo && requestinfo.ts ? requestinfo.ts : null;
  ResponseInfo.resMsgId = "uief87324";
  ResponseInfo.msgId =
    requestinfo && requestinfo.msgId ? requestinfo.msgId : "";
  ResponseInfo.status = success ? "successful" : "failed";

  return ResponseInfo;
};

export const upadteForAuditDetails = (
  auditDetails,
  requestInfo,
  isupdate = false
) => {
  if (!isupdate) {
    auditDetails.createdBy = requestInfo.userInfo.uuid;
    auditDetails.createdDate = new Date().getTime();
  } else {
    auditDetails.lastModifiedBy = requestInfo.userInfo.uuid;
    auditDetails.lastModifiedDate = new Date().getTime();
  }
};

export const addQueryArg = (url, queries = []) => {
  if (url && url.includes("?")) {
    const urlParts = url.split("?");
    const path = urlParts[0];
    let queryParts = urlParts.length > 1 ? urlParts[1].split("&") : [];
    queries.forEach(query => {
      const key = query.key;
      const value = query.value;
      const newQuery = `${key}=${value}`;
      queryParts.push(newQuery);
    });
    const newUrl = path + "?" + queryParts.join("&");
    return newUrl;
  } else {
    return url;
  }
};

export const generateDemandSearchURL = () => {
  let url = "";
  url = url + envVariables.EGOV_DEMAND_SEARCH_ENDPOINT;
  url = `${url}?tenantId={1}&businessService={2}&consumerCode={3}`;
  return url;
};

export const generateGetBillURL = (tenantId, consumerCode) => {
  let url = "";
  url = url + envVariables.EGOV_BILL_GEN_ENDPOINT;
  url = `${url}?tenantId={1}&businessService={2}&consumerCode={3}`;
  url = url.replace("{1}", tenantId);
  url = url.replace("{2}", envVariables.BUSINESSSERVICE);
  url = url.replace("{3}", consumerCode);

  return url;
};

export const generateFireNOCSearchURL = (tenantId, applicationNumber) => {
  let url = "";
  url = url + envVariables.EGOV_FIRENOC_SEARCH_ENDPOINT;
  url = `${url}?tenantId={1}&businessService={2}`;
  url = url.replace("{1}", tenantId);
  url = url.replace("{2}", applicationNumber);

  return url;
};
