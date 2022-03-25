import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WSPayment from "./WSPayment";
import { propertyCardBodyStyle } from "../../../utils";


const WSMyPayments = () => {

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
    ? { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber, searchType:"CONNECTION" }
    : { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber, searchType:"CONNECTION" };

  // const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });


  const { isLoading: isSWLoading, isError : isSWError, error : SWerror, data: SWdata } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1,BusinessService:"SW"}, { filters: filter1 });
  // const result = Digit.Hooks.ws.useMypaymentWS({});
  // const consumerCode = result?.data?.Properties?.map((a) => a.propertyId).join(",");
  let connectionNoWS =  data ? data?.WaterConnection?.map((ob) => ob.connectionNo).join(",") : null;
  let connectionNoSW =  data ? data?.SewerageConnections?.map((ob)=>ob.connectionNo).join(",") : null;

  const {data:wspayments, isLoading:iswsLoading} = Digit.Hooks.ws.useMypaymentWS({tenantId : tenantId,filters: {consumerCodes:connectionNoWS},BusinessService:"WS"},{enabled:connectionNoWS!==null?true:false});
  const {data:swpayments, isLoading:isswLoading} = Digit.Hooks.ws.useMypaymentWS({tenantId : tenantId,filters: {consumerCodes:connectionNoSW},BusinessService:"SW"},{enabled:connectionNoSW!==null?true:false});

  if (isLoading || iswsLoading||isswLoading||isSWLoading) {
    return <Loader />;
  }
  const wspayment = wspayments && wspayments?.Payments || [];
  const swpayment = swpayments && swpayments?.Payments || [];

  let applicationsList = wspayment.concat(swpayment);

  
  // let applicationNoWS =  data && data?.WaterConnection?.map((ob) => ob.propertyId).join(",") || "";
  // let applicaionNoSW = SWdata && SWdata?.SewerageConnections?.map((ob) => ob.propertyId).join(",") || "";
  // let applicationNos = applicationNoWS.concat(applicaionNoSW);
  // const { isLoading: PTisLoading, isError: PTisError, error: PTerror, data : PTdata } = Digit.Hooks.pt.usePropertySearch({ filters: { propertyIds:applicationNos } }, { filters: { propertyIds:applicationNos },enabled:applicationNos?true:false });
  // applicationsList = applicationsList && applicationsList.map((ob) => {return({...ob,"property":PTdata?.Properties?.filter((pt) => pt.propertyId === ob.propertyId)[0]})})

  // const applicationsList = wspayments && wspayments?.Payments || [];
  // console.log("mypaymentindex")

  return (
    <React.Fragment>
      <Header>{`${t("WS_MY_PAYMENTS_HEADER")} ${applicationsList ? `(${applicationsList.length})` : ""}`}</Header>
      <div>
      {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <WSPayment application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_APPLICATION_FOUND_MSG")}</p>}
      </div>
      {/* <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("WS_TEXT_NOT_ABLE_TO_FIND_THE_PAYMENT")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/pt/property/citizen-search">{t("PT_COMMON_CLICK_HERE_TO_SEARCH_THE_PROPERTY")}</Link>
        </span>
      </p> */}
    </React.Fragment>
  );
};


export default WSMyPayments;