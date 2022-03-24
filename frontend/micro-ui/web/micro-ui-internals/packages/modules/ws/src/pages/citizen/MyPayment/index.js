import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WSPayment from "./WSPayment";
import { propertyCardBodyStyle } from "../../../utils";
// import useWSSearch from "../../../../../../libraries/src/hooks/ws/useMyPaymentWS";

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

  // const {data, isLoading, error} = Digit.Hooks.ws.useMypaymentWS({tenantId : tenantId,filters: {consumerCodes:consumerCode}},{enabled:result?.data?.Properties.length>0?true:false, propertyData:result?.data?.Properties});
  console.log(data, "data")
  console.log(SWdata,"swdata")
  
  if (isLoading || result?.isLoading) {
    return <Loader />;
  }
  
  const applicationsList = data && data?.Payments || [];
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
      <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("WS_TEXT_NOT_ABLE_TO_FIND_THE_PAYMENT")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/pt/property/citizen-search">{t("PT_COMMON_CLICK_HERE_TO_SEARCH_THE_PROPERTY")}</Link>
        </span>
      </p>
    </React.Fragment>
  );
};


export default WSMyPayments;