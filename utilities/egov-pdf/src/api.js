var config = require("./config");
var axios = require("axios").default;
var url = require("url");
var producer = require("./producer").producer ;
var logger = require("./logger").logger;
const { Pool } = require('pg');

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

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

async function search_payment(consumerCodes, tenantId, requestinfo, bussinessService, receiptNumbers) {
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
  var resProperty = [];

  try {
    let size = propertyIds.length;
    for(var i =0; i<size; i+=50){
      var propertyResponse = await search_property_by_id(
                              propertyIds.slice(i, i+50).toString(),
                              tenantId,
                              requestinfo,
                              true);
      resProperty.push(propertyResponse.data.Properties)
    }
  } catch (ex) {
      if (ex.response && ex.response.data) logger.error(ex.response.data);
      throw new Error("Failed to query details of the property");
      }

  
  var properties = [];
  for(let data of resProperty){
    
    properties = properties.concat(data);
  }
  
  var propertyDeatils = {}; 

  for(let property of properties){
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

async function create_pdf_and_upload(tenantId, key, data, requestinfo) {
  return await axios({
    //responseType: "stream",
    method: "post",
    url: url.resolve(config.host.pdf, config.paths.pdf_create_upload),
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

async function create_bulk_pdf(kafkaData){
  var restWater,restSewerage;
  var waterBills, sewerageBills;
  var consolidatedResult = {Bill:[]};
  var propertyIdSet = [];
  var connectionnoToPropertyMap = {};

  var tenantId = kafkaData.tenantId;
  var locality = kafkaData.locality;
  var bussinessService = kafkaData.bussinessService;
  var isConsolidated = kafkaData.isConsolidated;
  var consumerCode = kafkaData.consumerCode;
  var requestinfo = kafkaData.requestinfo;
  var jobid = kafkaData.jobid;

  try {
    if(isConsolidated){
      try{
       
        var searchCriteria = {searchCriteria :{locality: locality, tenantId: tenantId,connectionno: consumerCode}};

        restWater = await search_waterOpenSearch(
          searchCriteria,
          {RequestInfo:requestinfo.RequestInfo}
        );

        restWater = restWater.data.WaterConnection;
        if(restWater.length>0){
          for(let water of restWater){
            if(water.connectionno){
              if(!connectionnoToPropertyMap[water.property_id]){
                connectionnoToPropertyMap[water.property_id] = [];
              }
                connectionnoToPropertyMap[water.property_id].push(water.connectionno);
            }
            if(!propertyIdSet.includes(water.property_id)){
              propertyIdSet.push(water.property_id);
            }
          }
        }


        restSewerage = await search_sewerageOpenSearch(
          searchCriteria,
          {RequestInfo:requestinfo.RequestInfo}
        );

        restSewerage = restSewerage.data.SewerageConnections;
        if(restSewerage.length>0){
          for(let sewerage of restSewerage){
            if(sewerage.connectionno){
              if(!connectionnoToPropertyMap[sewerage.property_id]){
                connectionnoToPropertyMap[sewerage.property_id] = [];
              }
                connectionnoToPropertyMap[sewerage.property_id].push(sewerage.connectionno);
            }
            if(!propertyIdSet.includes(sewerage.property_id)){
                propertyIdSet.push(sewerage.property_id);
            }
          }   
        }

      }
      catch (ex) {
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error("Failed to query details of water and sewerage connection");
      }

      try{
        var inputData = {searchCriteria :{locality: locality, tenantId: tenantId, propertyId: propertyIdSet}};

        waterBills = await search_bill_genie_water_bills(
          inputData,
          {RequestInfo:requestinfo.RequestInfo}
        );
        waterBills = waterBills.data.Bills;

        sewerageBills = await search_bill_genie_sewerage_bills(
          inputData,
          {RequestInfo:requestinfo.RequestInfo}
        );
        sewerageBills = sewerageBills.data.Bills;

        if(waterBills.length>0){
          for(let waterBill of waterBills){
            if(waterBill.status ==='EXPIRED'){
              var billresponse = await fetch_bill(
              tenantId, waterBill.consumerCode,
              waterBill.businessService, {RequestInfo:requestinfo.RequestInfo});
              consolidatedResult.Bill.push(billresponse.data.Bill[0]);
            }
            else{
              if(waterBill.status ==='ACTIVE')
                consolidatedResult.Bill.push(waterBill);
            }
          }
        }

        if(sewerageBills.length>0){
          for(let sewerageBill of sewerageBills){
            if(sewerageBill.status ==='EXPIRED'){
              var billresponse = await fetch_bill(
              tenantId, sewerageBill.consumerCode,
              sewerageBill.businessService, {RequestInfo:requestinfo.RequestInfo});
              consolidatedResult.Bill.push(billresponse.data.Bill[0]);
            }
            else{
              if(sewerageBill.status ==='ACTIVE')
                consolidatedResult.Bill.push(sewerageBill);
            }
          }
        }

      }
      catch (ex) {
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error('Failed to query bills for water and sewerage connection');
      }


    }

    else if(!isConsolidated && bussinessService == 'WS'){

      //get property ids
      try{
        var searchCriteria = {searchCriteria :{locality: locality, tenantId: tenantId,connectionno: consumerCode}};

        restWater = await search_waterOpenSearch(
          searchCriteria,
          {RequestInfo:requestinfo.RequestInfo}
        );

        restWater = restWater.data.WaterConnection;
        if(restWater.length>0){
          for(let water of restWater){
            if(water.connectionno){
              if(!connectionnoToPropertyMap[water.property_id]){
                connectionnoToPropertyMap[water.property_id] = [];
              }
                connectionnoToPropertyMap[water.property_id].push(water.connectionno);
            }
            if(!propertyIdSet.includes(water.property_id)){
              propertyIdSet.push(water.property_id);
            }
          }
        }

      }
      catch (ex) {
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error("Failed to query details of water connection");
      }
      
      //get water bills for the property ids
      try{

        var inputData = {searchCriteria :{locality: locality, tenantId: tenantId, propertyId: propertyIdSet}};
        waterBills = await search_bill_genie_water_bills(
          inputData,
          {RequestInfo:requestinfo.RequestInfo}
        );

        waterBills = waterBills.data.Bills;
        if(waterBills.length>0){
          for(let waterBill of waterBills){
            if(waterBill.status ==='EXPIRED'){
              var billresponse = await fetch_bill(
              tenantId, waterBill.consumerCode,
              waterBill.businessService, {RequestInfo:requestinfo.RequestInfo});
            
              consolidatedResult.Bill.push(billresponse.data.Bill[0]);
            }
            else{
              if(waterBill.status ==='ACTIVE')
                consolidatedResult.Bill.push(waterBill);
            }
          }
        }
      }
      catch (ex) {
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error(res, `Failed to query bills for water connection`);
      }
    }

    else if(!isConsolidated && bussinessService == 'SW'){

      try{
       
        var searchCriteria = {searchCriteria :{locality: locality, tenantId: tenantId,connectionno: consumerCode}};

        restSewerage = await search_sewerageOpenSearch(
          searchCriteria,
          {RequestInfo:requestinfo.RequestInfo}
        );

        restSewerage = restSewerage.data.SewerageConnections;
        if(restSewerage.length>0){
          for(let sewerage of restSewerage){
            if(sewerage.connectionno){
              if(!connectionnoToPropertyMap[sewerage.property_id]){
                connectionnoToPropertyMap[sewerage.property_id] = [];
              }
                connectionnoToPropertyMap[sewerage.property_id].push(sewerage.connectionno);
            }
            if(!propertyIdSet.includes(sewerage.property_id)){
              propertyIdSet.push(sewerage.property_id);
            }
          }   
        }

      }
      catch (ex) {
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error("Failed to query details of sewerage connection");
      }

      try{
        var inputData = {searchCriteria :{locality: locality, tenantId: tenantId, propertyId: propertyIdSet}};

        sewerageBills = await search_bill_genie_sewerage_bills(
          inputData,
          {RequestInfo:requestinfo.RequestInfo}
        );
        sewerageBills = sewerageBills.data.Bills;

        if(sewerageBills.length>0){
          for(let sewerageBill of sewerageBills){
            if(sewerageBill.status ==='EXPIRED'){
              var billresponse = await fetch_bill(
              tenantId, sewerageBill.consumerCode,
              sewerageBill.businessService, {RequestInfo:requestinfo.RequestInfo});
            
              consolidatedResult.Bill.push(billresponse.data.Bill[0]);
            }
            else{
              if(sewerageBill.status ==='ACTIVE')
                consolidatedResult.Bill.push(sewerageBill);
            }
          }
        }

      }
      catch (ex) {
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error(res, `Failed to query bills for sewerage connection`);
      }

    }

    else{
      throw new Error("There is no billfound for the criteria");
    }

    var propertyDetails = await getPropertyDeatils({RequestInfo:requestinfo.RequestInfo}, tenantId, propertyIdSet, connectionnoToPropertyMap);
    if (consolidatedResult && consolidatedResult.Bill && consolidatedResult.Bill.length > 0) {
      var pdfResponse;
      var pdfkey = config.pdf.wns_bill;
      try {
        consolidatedResult.Bill = consolidatedResult.Bill.filter(function(e){return e});
        for(let i=0;i<consolidatedResult.Bill.length;i++){
          let consumerCode = consolidatedResult.Bill[i].consumerCode;
          let data = propertyDetails[consumerCode];
          if(data){
            consolidatedResult.Bill[i].propertyUniqueId = data.propertyUniqueId;
            consolidatedResult.Bill[i].propertyAddress = data.propertyAddress;
            consolidatedResult.Bill[i].locality = data.locality;
          }
        }
        
        /*pdfResponse = await create_pdf(
          tenantId,
          pdfkey,
          billArray,
          requestinfo
        );*/
        var batchSize = config.PDF_BATCH_SIZE;
        var size = consolidatedResult.Bill.length;
        var numberOfFiles = (size%batchSize) == 0 ? (size/batchSize) : (~~(size/batchSize) +1);
        for(var i = 0;i<size;i+=batchSize){
          var payloads = [];
          var billData = consolidatedResult.Bill.slice(i,i+batchSize);
          var billArray = { 
              Bill: billData,
              isBulkPdf: true,
              pdfJobId: jobid,
              pdfKey: pdfkey,
              totalPdfRecords:size,
              currentPdfRecords: billData.length,
              tenantId: tenantId,
              numberOfFiles:numberOfFiles,
              locality: locality,
              service: bussinessService,
              isConsolidated: isConsolidated,
              consumerCode: consumerCode
          };
          var pdfData = Object.assign({RequestInfo:requestinfo.RequestInfo}, billArray)
          payloads.push({
            topic: config.KAFKA_RECEIVE_CREATE_JOB_TOPIC,
            messages: JSON.stringify(pdfData)
          });
          producer.send(payloads, function(err, data) {
            if (err) {
              logger.error(err.stack || err);
              errorCallback({
                message: `error while publishing to kafka: ${err.message}`
              });
            } else {
              logger.info("jobid: " + jobid + ": published to kafka successfully");
            }
          });

        }

        try {
          const result = await pool.query('select * from egov_bulk_pdf_info where jobid = $1', [jobid]);
          if(result.rowCount>=1){
            const updateQuery = 'UPDATE egov_bulk_pdf_info SET totalrecords = $1 WHERE jobid = $2';
            await pool.query(updateQuery,[size, jobid]);
              }
        } catch (err) {
          logger.error(err.stack || err);
        }
      } catch (ex) {
        let errorMessage= "Failed to generate PDF"; 
        if (ex.response && ex.response.data) logger.error(ex.response.data);
        throw new Error(errorMessage);
      }
      // var filename = `${pdfkey}_${new Date().getTime()}`;
      // res.writeHead(200, {
      //   "Content-Type": "application/pdf",
      //   "Content-Disposition": `attachment; filename=${filename}.pdf`,
      // });
      // pdfResponse.data.pipe(res);
    } else {
      throw new Error("There is no billfound for the criteria");
    }
    
  } catch (ex) {
    throw new Error("Failed to query bill for water and sewerage application");
  }

}

module.exports = {
  create_pdf,
  create_pdf_and_upload,
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
  getPropertyDeatils,
  create_bulk_pdf
};
