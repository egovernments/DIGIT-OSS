import { requestInfoToResponseInfo, upadteForAuditDetails } from "../utils";
import { validateBillingSlabSearch } from "../utils/modelValidation";
import { replaceSchemaPlaceholder } from "../utils/index";

const search = async (req, res, pool, next) => {
  console.log("search");
  const queryObj = JSON.parse(JSON.stringify(req.query));

  let errors = validateBillingSlabSearch(queryObj);
  if (errors.length > 0) {
    next({
      errorType: "custom",
      errorReponse: {
        ResponseInfo: requestInfoToResponseInfo(req.body.RequestInfo, false),
        Errors: errors
      }
    });
    return;
  }

  let searchResponse = {};
  searchResponse.ResponseInfo = requestInfoToResponseInfo(
    req.body.RequestInfo,
    true
  );

  searchResponse.BillingSlabs = await searchService(
    req.query,
    searchResponse,
    pool
  );
  res.send(searchResponse);
};

export default search;

export const searchService = async (reqestCriteria, searchResponse, pool) => {
  var querystring = generateQuery(reqestCriteria);
  querystring = replaceSchemaPlaceholder(querystring, reqestCriteria.tenantId);
  let billingSlabs = [];
  billingSlabs = await pool
    .query(querystring)
    .then(result => {
      return popolateSearchResponse(result);
    })
    .catch(err => console.log(err));

  return billingSlabs;
};

const popolateSearchResponse = result => {
  let BillingSlabs = [];
  result.rows.map(rowData => {
    const billingSlab = {};
    billingSlab.tenantId = rowData.tenantid;
    billingSlab.id = rowData.id;
    billingSlab.isActive = rowData.isactive;
    billingSlab.fireNOCType = rowData.firenoctype;
    billingSlab.buildingUsageType = rowData.buildingusagetype;
    billingSlab.calculationType = rowData.calculationtype;
    billingSlab.rate = Number(rowData.rate);
    billingSlab.uom = rowData.uom;
    billingSlab.fromUom = rowData.fromuom;
    billingSlab.toUom = rowData.touom;
    billingSlab.fromDate = rowData.fromuom;
    billingSlab.toDate = rowData.todate;
    billingSlab.auditDetails = {};
    billingSlab.auditDetails.createdBy = rowData.createdby;
    billingSlab.auditDetails.createdDate = Number(rowData.createddate);
    billingSlab.auditDetails.lastModifiedBy = rowData.lastmodifiedby;
    billingSlab.auditDetails.lastModifiedDate = Number(
      rowData.lastmodifieddate
    );
    BillingSlabs.push(billingSlab);
  });
  return BillingSlabs;
};

const generateQuery = params => {
  let queryString =
    "select tenantid, id, isactive , firenoctype, buildingusagetype, calculationtype, uom, fromuom, touom, fromdate, todate, rate, createdby, createddate, lastmodifiedby, lastmodifieddate from {schema}.eg_firenoc_billingslab where ";
  queryString = `${queryString} tenantid = '${params.tenantId}'`;
  if (params.hasOwnProperty("isActive")) {
    queryString = `${queryString} and isactive = ${params.isActive}`;
  } else queryString = `${queryString} and  isactive = true`;

  if (params.hasOwnProperty("fireNOCType")) {
    queryString = `${queryString} and firenoctype = '${params.fireNOCType}'`;
  }
  if (params.hasOwnProperty("buildingUsageType")) {
    queryString = `${queryString} and buildingusagetype = '${
      params.buildingUsageType
    }'`;
  }
  if (params.hasOwnProperty("calculationType")) {
    queryString = `${queryString} and calculationtype = '${
      params.calculationType
    }'`;
  }
  if (params.hasOwnProperty("uom")) {
    queryString = `${queryString} and uom = '${params.uom}'`;
  }
  if (params.hasOwnProperty("uomValue")) {
    queryString = `${queryString} and fromuom < ${
      params.uomValue
    } and touom >= ${params.uomValue} `;
  }
  return queryString;
};
