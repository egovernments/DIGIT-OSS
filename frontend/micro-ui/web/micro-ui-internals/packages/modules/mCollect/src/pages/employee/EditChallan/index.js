import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
//import EditForm from "./EditForm";
import CreateChallen from "../CreateChallan";
import NewChallan from "../NewChallan";

const EditChallan = () => {
  let filters = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  let { challanNo: challanNo } = useParams();
  let isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");
  sessionStorage.setItem("isHookRecall", true);
  const { isLoading, data: result } = Digit.Hooks.mcollect.useMCollectSearch({ tenantId, filters: { challanNo }, isMcollectAppChanged });
  return result && !isLoading ? <NewChallan ChallanData={result?.challans} tenantId={tenantId} /> : null;
};
export default EditChallan;
