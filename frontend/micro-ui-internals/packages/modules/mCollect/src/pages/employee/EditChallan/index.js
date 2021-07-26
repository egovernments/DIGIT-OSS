import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
//import EditForm from "./EditForm";
import CreateChallen from "../CreateChallan";

const EditChallan = () => {
  //debugger;
  let filters = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  //const tenantId = userInfo?.info?.permanentCity;

  let { challanNo: challanNo } = useParams();
  console.log(challanNo);
  //if (challanNo) filters.challanNo = challanNo;
  //if (businesService) filters.businesService = businesService;
  let isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");
  const { isLoading, data: result } = Digit.Hooks.mcollect.useMCollectSearch({ tenantId, filters: { challanNo }, isMcollectAppChanged });
  console.log("result");
  console.log(result);
  //return;
  return result && !isLoading ? <CreateChallen ChallanData={result?.challans} tenantId={tenantId} /> : null;
};
export default EditChallan;
