import { Banner, Card, CardText, LinkButton, ActionBar, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import getPTAcknowledgementData from "../utils/getTLAcknowledgementData";
import * as func from "../utils";


const Response = (props) => {
  const location = useLocation();
  const { state } = props.location;
  const [params, setParams] = useState({});
  const { isEdit } = Digit.Hooks.useQueryParams();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};


  useEffect(() => {
    setParams(func.getQueryStringParams(location.search));
  }, [location]);
  const { t } = useTranslation();

  const printReciept = async () => {
    const Licenses = state?.data || [];
    const license = (Licenses && Licenses[0]) || {};
    const tenantInfo = tenants.find((tenant) => tenant.code === license.tenantId);
    const data = await getPTAcknowledgementData({ ...license }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  const routeToPaymentScreen = async () => {
    window.location.assign(`${window.location.origin}/digit-ui/employee/payment/collect/TL/${state?.data?.[0]?.applicationNumber}/${state?.data?.[0]?.tenantId}`);
  }

  return (
    <div>
        <Card>
          <Banner
            message={t("TL_APPLICATION_SUCCESS_MESSAGE_MAIN")}
            applicationNumber={state?.data?.[0]?.applicationNumber}
            info={t("TL_REF_NO_LABEL")}
            successful={true}
          />
         
          <CardText>{t("TL_NEW_SUCESS_RESPONSE_NOTIFICATION_LABEL")}</CardText>
          <div className="primary-label-btn d-grid" style={{ marginLeft: "unset" }} onClick={printReciept}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              {t("TL_PRINT_APPLICATION_LABEL")}
          </div>
          <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          {state?.data?.[0]?.status !== "PENDINGPAYMENT" ?
            <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
              <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
            </Link> :
            // <Link to={`digit-ui/employee/payment/collect/TL/${state?.data?.[0]?.applicationNumber}/${state?.data?.[0]?.tenantId}`} style={{ marginRight: "1rem" }}>
            <div onClick={routeToPaymentScreen}>
                <SubmitBar label={t("TL_COLLECT_PAYMENT")} />
            </div> 
            
            // </Link>
          }
          </ActionBar>
        </Card>
    </div>
  );
};
export default Response;
