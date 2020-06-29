import { addIDGenId} from "../utils";
import envVariables from "../envVariables";
import get from "lodash/get";

export const getApprovedList = async request => {
  let { FireNOCs, RequestInfo } = request;
  let approvedList=[];
  //for loop should be replaced new alternative
  for (var i = 0; i < FireNOCs.length; i++) {
    if (FireNOCs[i].fireNOCDetails.status=="APPROVED") {
      let fireNOCNumber=FireNOCs[i].fireNOCNumber;
      FireNOCs[i].fireNOCNumber = fireNOCNumber
        ? fireNOCNumber
        : await addIDGenId(RequestInfo, [
            {
              tenantId: FireNOCs[i].tenantId,
              format: envVariables.EGOV_CIRTIFICATE_FORMATE
            }
          ]);
      FireNOCs[i].fireNOCDetails.validFrom=new Date().getTime();
      let validTo = new Date();
      validTo.setFullYear(validTo.getFullYear() + 1);
      FireNOCs[i].fireNOCDetails.validTo=validTo.getTime();
      FireNOCs[i].fireNOCDetails.issuedDate=new Date().getTime();
      approvedList.push(FireNOCs[i]);
    }
  }
  request.FireNOCs = approvedList;
  return request;
};
