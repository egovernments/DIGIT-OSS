import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WSApplication from "./ws-application";
import { propertyCardBodyStyle } from "../../../utils";
import WSInfoLabel from "../../../pageComponents/WSInfoLabel";

export const WSMyApplications = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
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
  let applicaionNoSW = SWdata && SWdata?.SewerageConnections?.map((ob) => ob.applicationNo).join(",") || ""
  let applicationNos = applicationNoWS.concat(applicaionNoSW);
  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: applicationNos,
    moduleCode: "WS,SW",
    config: {
      enabled: !!applicationNos
    }
  });
  let propertyWS = (data && data?.WaterConnection?.map((ob) => ob?.propertyId).join(",")) || "";
  let propertySW = (SWdata && SWdata?.SewerageConnections?.map((ob) => ob?.propertyId).join(",")) || "";
  let propertyNos = propertyWS.concat(propertySW);
  const { isLoading: PTisLoading, isError: PTisError, error: PTerror, data: PTdata } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyNos } },
    { filters: { propertyIds: propertyNos }, enabled: propertyNos ? true : false }
  );
  if (isLoading || isSWLoading || PTisLoading) {
    return <Loader />;
  }
  let { WaterConnection: WSapplicationsList } = data || {};
  let { SewerageConnections: SWapplicationsList } = SWdata || {};
  WSapplicationsList = WSapplicationsList?.map((ob) => {return ({...ob,"sla":workflowDetails?.data?.processInstances?.filter((pi) => pi.businessId == ob.applicationNo)[0]?.businesssServiceSla})})
  SWapplicationsList = SWapplicationsList?.map((ob) => {return ({...ob,"sla":workflowDetails?.data?.processInstances?.filter((pi) => pi.businessId == ob.applicationNo)[0]?.businesssServiceSla})})
  WSapplicationsList = WSapplicationsList?.filter((ob) => ob?.applicationType !== "MODIFY_WATER_CONNECTION");
  SWapplicationsList = SWapplicationsList?.filter((ob) => ob?.applicationType !== "MODIFY_SEWERAGE_CONNECTION");
  let applicationsList =WSapplicationsList.concat(SWapplicationsList)
  applicationsList =
  applicationsList &&
  applicationsList.map((ob) => {
      return { ...ob, property: PTdata?.Properties?.filter((pt) => pt?.propertyId === ob?.propertyId)[0] };
    });
  return (
    <React.Fragment>
      <Header>{`${t("CS_HOME_MY_APPLICATIONS")} ${applicationsList ? `(${applicationsList.length})` : ""}`}</Header>
      {/* For UM-4418 changes */}
       <WSInfoLabel t={t} /> 
      <div>
        {applicationsList?.length > 0 &&
          applicationsList.sort((a, b) => b.auditDetails?.lastModifiedTime - a.auditDetails?.lastModifiedTime ).map((application, index) => (
            <div key={index}>
              <WSApplication application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("WS_NO_APPLICATION_FOUND_MSG")}</p>}

      </div>

    </React.Fragment>
  );
};
