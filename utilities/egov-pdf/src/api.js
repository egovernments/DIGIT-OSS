var config = require("./config");
var axios = require("axios").default;
var url = require("url");

auth_token = config.auth_token;

async function search_user(uuid, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.user, config.paths.user_search),
    data: {
      RequestInfo: requestinfo.RequestInfo,
      uuid: [uuid],
      tenantId: tenantId,
    },
  });
}

async function search_epass(uuid, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.epass, config.paths.epass_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      ids: uuid,
    },
  });
}

async function search_property(
  uuid,
  tenantId,
  requestinfo,
  allowCitizenTOSearchOthersRecords
) {
  // currently single property pdfs supported
  if (uuid.split(",").length > 1) {
    uuid = uuid.split(",")[0].trim();
  }
  var params = {
    tenantId: tenantId,
    uuids: uuid,
  };
  if (
    checkIfCitizen(requestinfo) &&
    allowCitizenTOSearchOthersRecords != true
  ) {
    var mobileNumber = requestinfo.RequestInfo.userInfo.mobileNumber;
    var userName = requestinfo.RequestInfo.userInfo.userName;
    params["mobileNumber"] = mobileNumber || userName;
  }
  return await axios({
    method: "post",
    url: url.resolve(config.host.pt, config.paths.pt_search),
    data: requestinfo,
    params,
  });
}

async function search_property_by_id(
  propertyId,
  tenantId,
  requestinfo,
  allowCitizenTOSearchOthersRecords
){
  var params = {
    tenantId: tenantId,
    propertyIds: propertyId,
  };
  if (
    checkIfCitizen(requestinfo) &&
    allowCitizenTOSearchOthersRecords != true
  ) {
    var mobileNumber = requestinfo.RequestInfo.userInfo.mobileNumber;
    var userName = requestinfo.RequestInfo.userInfo.userName;
    params["mobileNumber"] = mobileNumber || userName;
  }
  return await axios({
    method: "post",
    url: url.resolve(config.host.pt, config.paths.pt_search),
    data: requestinfo,
    params,
  });
}

async function search_workflow(applicationNumber, tenantId, requestinfo) {
  var params = {
    tenantId: tenantId,
    businessIds: applicationNumber,
  };
  return await axios({
    method: "post",
    url: url.resolve(config.host.workflow, config.paths.workflow_search),
    data: requestinfo,
    params,
  });
}

async function search_payment(
  consumerCodes,
  tenantId,
  requestinfo,
  bussinessService,
  receiptNumbers
) {
  var params = {
    tenantId: tenantId,
    consumerCodes: consumerCodes,
  };
  if (receiptNumbers && !consumerCodes) {
    params = {
      tenantId: tenantId,
      receiptNumbers: receiptNumbers,
    };
  }
  var searchEndpoint = config.paths.payment_search;
  searchEndpoint = searchEndpoint.replace(/\$module/g, bussinessService);
  if (checkIfCitizen(requestinfo)) {
    var mobileNumber = requestinfo.RequestInfo.userInfo.mobileNumber;
    var userName = requestinfo.RequestInfo.userInfo.userName;
    params["mobileNumber"] = mobileNumber || userName;
  }
  return await axios({
    method: "post",
    url: url.resolve(config.host.payments, searchEndpoint),
    data: requestinfo,
    params,
  });
}

async function search_bill(consumerCode, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.bill_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      consumerCode: consumerCode,
    },
  });
}

async function search_tllicense(applicationNumber, tenantId, requestinfo, allowCitizenTOSearchOthersRecords) {
  var params = {
    tenantId: tenantId,
    applicationNumber: applicationNumber,
  };
  if (checkIfCitizen(requestinfo) && allowCitizenTOSearchOthersRecords != true) {
    var mobileNumber = requestinfo.RequestInfo.userInfo.mobileNumber;
    var userName = requestinfo.RequestInfo.userInfo.userName;
    params["mobileNumber"] = mobileNumber || userName;
  }
  return await axios({
    method: "post",
    url: url.resolve(config.host.tl, config.paths.tl_search),
    data: requestinfo,
    params,
  });
}

async function search_water(applicationNumber, tenantId, requestinfo, allowCitizenTOSearchOthersRecords) {
  var params = {
    tenantId: tenantId,
    applicationNumber: applicationNumber,
  };
  if (checkIfCitizen(requestinfo) && allowCitizenTOSearchOthersRecords != true) {
    var mobileNumber = requestinfo.RequestInfo.userInfo.mobileNumber;
    var userName = requestinfo.RequestInfo.userInfo.userName;
    params["mobileNumber"] = mobileNumber || userName;
  }
  return await axios({
    method: "post",
    url: url.resolve(config.host.wns, config.paths.water_search),
    data: requestinfo,
    params,
  });
}

async function search_sewerage(applicationNumber, tenantId, requestinfo, allowCitizenTOSearchOthersRecords) {
  var params = {
    tenantId: tenantId,
    applicationNumber: applicationNumber,
  };
  if (checkIfCitizen(requestinfo) && allowCitizenTOSearchOthersRecords != true) {
    var mobileNumber = requestinfo.RequestInfo.userInfo.mobileNumber;
    var userName = requestinfo.RequestInfo.userInfo.userName;
    params["mobileNumber"] = mobileNumber || userName;
  }
  return await axios({
    method: "post",
    url: url.resolve(config.host.wns, config.paths.sewerage_search),
    data: requestinfo,
    params,
  });
}

async function search_mdms(tenantId, module, master, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.mdms, config.paths.mdms_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      ids: uuid,
    },
  });
}

async function search_echallan(tenantId, challanNo,requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.challan, config.paths.mcollect_challan_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      challanNo: challanNo,
    },
  });
}


async function search_bill_genie(data,requestinfo) {
   return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.bill_genie_getBill),
    data: Object.assign(requestinfo, data),
  });
}


async function search_waterOpenSearch(data,requestinfo) {
  
  return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.searcher_water_open_search),
    data: Object.assign(requestinfo, data),
  });
}

async function search_sewerageOpenSearch(data,requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.searcher_sewerage_open_search),
    data: Object.assign(requestinfo, data),
  });
}

async function search_bill_genie_water_bills(data,requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.bill_genie_waterBills),
    data: Object.assign(requestinfo, data),
  });
}

async function search_bill_genie_sewerage_bills(data,requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.bill_genie_sewerageBills),
    data: Object.assign(requestinfo, data),
  });
}

async function search_billV2(tenantId, consumerCode, serviceId, requestinfo) {
  //console.log("search_billV2 consumerCode--",consumerCode,"tenantId",tenantId,"serviceId",serviceId);
  return await axios({
    method: "post",
    url: url.resolve(config.host.mcollectBilling, config.paths.mcollect_bill),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      consumerCode: consumerCode,
      service:serviceId
    },
  });
}

async function fetch_bill(tenantId, consumerCode, serviceId, requestinfo) {
  //console.log("search_billV2 consumerCode--",consumerCode,"tenantId",tenantId,"serviceId",serviceId);
  return await axios({
    method: "post",
    url: url.resolve(config.host.mcollectBilling, config.paths.fetch_bill),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      consumerCode: consumerCode,
      businessService: serviceId
    },
  });
}

async function search_amendment(tenantId, amendmentId, serviceId, requestinfo) {
  //console.log("search_billV2 consumerCode--",amendmentId,"tenantId",tenantId,"serviceId",serviceId);
  return await axios({
    method: "post",
    url: url.resolve(config.host.mcollectBilling, config.paths.bill_ammendment_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      amendmentId: amendmentId,
      businessService:serviceId
    },
  });
}

async function getPropertyDeatils(requestinfo,tenantId,propertyIds,connectionnoToPropertyMap){
  var resProperty;

  try {
    resProperty = await search_property_by_id(
                  propertyIds.toString(),
                  tenantId,
                  requestinfo,
                  true);
  } catch (ex) {
      if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to query details of the property", 500);
      }

  
  var properties = resProperty.data;
  var propertyDeatils = {}; 

  for(let property of properties.Properties){
    var propertyAddress="";
    var locality;
    var address = property.address;
    if(address.plotNo)
      propertyAddress = propertyAddress + address.plotNo + ",";

    if(address.doorNo)
      propertyAddress = propertyAddress + address.doorNo + ",";

    if(address.buildingName)
      propertyAddress = propertyAddress + address.buildingName + ",";

    if(address.street)
      propertyAddress = propertyAddress + address.street + ",";

    if(address.locality.code)
      locality = address.locality.code;

    let result = {
      propertyUniqueId: property.propertyId,
      locality: locality,
      propertyAddress: propertyAddress
    };

    let connectionList = connectionnoToPropertyMap[property.propertyId];

    if(connectionList){
      for(let connection of connectionList){
        propertyDeatils[connection] =result;
      }
    }
    
  }

  return propertyDeatils;
}


async function create_pdf(tenantId, key, data, requestinfo) {
  return await axios({
    responseType: "stream",
    method: "post",
    url: url.resolve(config.host.pdf, config.paths.pdf_create),
    data: Object.assign(requestinfo, data),
    params: {
      tenantId: tenantId,
      key: key,
    },
  });
}

function checkIfCitizen(requestinfo) {
  if (requestinfo.RequestInfo.userInfo.type == "CITIZEN") {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  create_pdf,
  search_epass,
  search_mdms,
  search_user,
  search_property,
  search_bill,
  search_payment,
  search_tllicense,
  search_workflow,
  search_echallan,
  search_billV2,
  search_bill_genie,
  search_amendment,
  search_water,
  search_sewerage,
  search_waterOpenSearch,
  search_sewerageOpenSearch,
  search_bill_genie_water_bills,
  search_bill_genie_sewerage_bills,
  fetch_bill,
  search_property_by_id,
  getPropertyDeatils
};
