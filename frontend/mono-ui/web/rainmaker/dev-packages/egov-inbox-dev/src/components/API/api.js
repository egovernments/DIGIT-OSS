import { convertQueryArgToString } from "../utils";

let controller;

export const getController = () => {
  controller = controller ? controller : new AbortController();
  return controller;
}
export const getSignal = () => {
  return getController().signal;
}
export const cancelSignal = () => {
   getController().abort();
   controller=new AbortController();
  }

export const httpRequest = async (apiURL, body) => {
  var myHeaders = new Headers();
  myHeaders.append("authority", "uat.digit.org");
  myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"");
  myHeaders.append("accept", "application/json, text/plain, */*");
  myHeaders.append("sec-ch-ua-mobile", "?0");
  myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36");
  myHeaders.append("content-type", "application/json;charset=UTF-8");
  myHeaders.append("origin", "https://uat.digit.org");
  myHeaders.append("sec-fetch-site", "same-origin");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("referer", "https://uat.digit.org/employee/inbox");
  myHeaders.append("accept-language", "en-US,en;q=0.9");

  var raw = {
    "RequestInfo": {
      "apiId": "Rainmaker",
      "ver": ".01",
      "ts": "",
      "action": "_search",
      "did": "1",
      "key": "",
      "msgId": "20170310130900|en_IN",
      "authToken": localStorage.getItem("Employee.token")
    }
  }
  if (body) {
    raw = { ...raw, ...body }
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow',
    signal: getSignal()
  };
  let url = window.location.origin;
  return fetch(`${url}/${apiURL}`, requestOptions)
    .then(response => response.text())
    .then(response => { if (response && !response.includes("InvalidAccessTokenException")) { return JSON.parse(response); } else { throw new Error("CANCELLED") } })
    //   .then(result => console.log(result))
    .catch(error => { console.error(error); return error; });

}


export const workflowSearchCount = async (businessService) => {
  return httpRequest(`egov-workflow-v2/egov-wf/process/_count?tenantId=${localStorage.getItem("inb-tenantId")}&businessService=${businessService}`);
}

export const workflowSearch = async (businessService) => {
  return wfSearch([{ key: "tenantId", value: localStorage.getItem("inb-tenantId") }, { key: "offset", value: "0" }, { key: "limit", value: "10" }, { key: "businessService", value: businessService }])
  // return httpRequest(`egov-workflow-v2/egov-wf/process/_search?tenantId=pb.amritsar&offset=0&limit=10&businessService=${businessService}`);
}

export const wfSearch = async (queryArg = []) => {
  return httpRequest(`egov-workflow-v2/egov-wf/process/_search?${convertQueryArgToString(queryArg)}`);
}

export const wfBusinessSearch = async (queryArg = []) => {
  return httpRequest(`egov-workflow-v2/egov-wf/businessservice/_search?${convertQueryArgToString(queryArg)}`);
}

export const getMdmsData = async (mdmsCriteria) => {
  return httpRequest(`egov-mdms-service/v1/_search`, { "MdmsCriteria": mdmsCriteria });
}

export const getInboxConfig = async (tenant = "") => {
  return getMdmsData({
    "tenantId": tenant,
    "moduleDetails": [

      {
        "moduleName": "common-masters",
        "masterDetails": [
          {
            "name": "wfSlaConfig"
          },

          {
            "name": "TablePaginationOptions"
          },
          {
            "name": "CommonInboxConfig"
          }

        ]
      }
    ]
  })
}


export const getLocalityData = async (module = "", applicationNos = []) => {
  return httpRequest(`egov-searcher/locality/${module}/_get`, {
    "searchCriteria": {
      "referenceNumber": applicationNos
    }
  }).then(resp => {
    if(!resp||!resp.Localities){
      return {};
    }
    let localityData = {};
    resp.Localities.map(locality => {
      localityData[locality.referencenumber] = locality.locality;
    });
    return localityData;
  });
}



export const wfEsclationSearch = async (queryArg = []) => {
  return httpRequest(`egov-workflow-v2/egov-wf/escalate/_search?${convertQueryArgToString(queryArg)}`);
}