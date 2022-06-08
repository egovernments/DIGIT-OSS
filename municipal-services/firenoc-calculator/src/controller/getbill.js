import { requestInfoToResponseInfo, upadteForAuditDetails } from "../utils";
import { generateBill } from "../services/demandService";
import { validateBillReq } from "../utils/modelValidation";

const getbill = async (req, res, next) => {
  console.log("getbill");
  const queryObj = JSON.parse(JSON.stringify(req.query));

  let errors = validateBillReq(queryObj);
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

  let getbillResponse = {};
  let requestInfo = req.body.RequestInfo;
  let billCriteria = req.query;
  getbillResponse = await generateBill(requestInfo, billCriteria);
  getbillResponse.ResponseInfo = requestInfoToResponseInfo(requestInfo, true);
  res.send(getbillResponse);
};

export default getbill;
