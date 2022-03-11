import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WSApplication from "./ws-application";
import { propertyCardBodyStyle } from "../../../utils";

export const WSMyApplications = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  let filter = window.location.href.split("/").pop();
  let t1;
  let off;
  if (!isNaN(parseInt(filter))) {
    off = filter;
    t1 = parseInt(filter) + 50;
  } else {
    t1 = 4;
  }
  
  let filter1 = !isNaN(parseInt(filter))
    ? { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber }
    : { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber };

  const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });

  const { isLoading: isSWLoading, isError : isSWError, error : SWerror, data: SWdata } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1,BusinessService:"SW"}, { filters: filter1 });
  let applicationNoWS =  data && data?.WaterConnection?.map((ob) => ob.applicationNo).join(",") || "";
  let applicaionNoSW = data && data?.SewerageConnections?.map((ob) => ob.applicationNo).join(",") || ""
  let applicationNos = applicationNoWS.concat(applicaionNoSW);
  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: applicationNos,
    moduleCode: "WS,SW",
    config: {
      enabled: !!applicationNos
    }
  });
  if (isLoading || isSWLoading) {
    return <Loader />;
  }
  let { WaterConnection: WSapplicationsList } = data || {};
  let { SewerageConnections: SWapplicationsList } = SWdata || {};
  WSapplicationsList = WSapplicationsList?.map((ob) => {return ({...ob,"sla":workflowDetails?.data?.processInstances?.filter((pi) => pi.businessId == ob.applicationNo)[0].businesssServiceSla})})
  SWapplicationsList = SWapplicationsList?.map((ob) => {return ({...ob,"sla":workflowDetails?.data?.processInstances?.filter((pi) => pi.businessId == ob.applicationNo)[0].businesssServiceSla})})
  const applicationsList =WSapplicationsList.concat(SWapplicationsList)
  return (
    <React.Fragment>
      <Header>{`${t("My Applications")} ${applicationsList ? `(${applicationsList.length})` : ""}`}</Header>
      <div>
        {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <WSApplication application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_APPLICATION_FOUND_MSG")}</p>}

      </div>

    </React.Fragment>
  );
};
