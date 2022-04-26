import { Card, CardHeader, CardText, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import TradeLicenseList from "./TradeLicenseList";

export const TLList = () => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const tenantId = userInfo?.info?.permanentCity;
  const { mobileNumber: mobileno, LicenseNumber: licenseno, tenantId:tenantID } = Digit.Hooks.useQueryParams();
  let filter1 = {};
  if (licenseno) filter1.licenseNumbers = licenseno;
  if (licenseno) filter1.tenantId = tenantID;
  const { isLoading, isError, error, data } = Digit.Hooks.tl.useTradeLicenseSearch({ filters: filter1 }, {});
  if (isLoading) {
    return <Loader />;
  }
  let { Licenses: applicationsList } = data || {};
  let applications = {};
  applicationsList.filter((response)=>response.licenseNumber).map((ob)=>{
    if(applications[ob.licenseNumber]){
    if(applications[ob.licenseNumber].applicationDate<ob.applicationDate)
    applications[ob.licenseNumber]=ob
    }
    else
    applications[ob.licenseNumber]=ob;    
    })
  let newapplicationlist = Object.values(applications);
  newapplicationlist = newapplicationlist ? newapplicationlist.filter(ele => ele.financialYear != "2021-22" && (ele.status == "EXPIRED" || ele.status == "APPROVED")) : [];
  return (
    <React.Fragment>
      <Card>
        <CardHeader>{`${t("TL_RENEW_TRADE_HEADER")}`}</CardHeader>
        <CardText>{`${t("TL_RENEW_TRADE_TEXT")}`}</CardText>
      </Card>
      <div >
        {newapplicationlist?.length > 0 &&
          newapplicationlist.map((application, index) => (
            <div key={index}>
              <TradeLicenseList application={application} />
            </div>
          ))}
        {!newapplicationlist?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_APPLICATION_FOUND_MSG")}</p>}
      </div>
      {/* <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("TL_NOT_ABLE_TO_FIND_TRADE_LICENSE")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/tl/tradelicence/trade-search">{t("TL_SEARCH_TRADE_LICENSE")}</Link>
        </span>
      </p> */}
    </React.Fragment>
  );
};