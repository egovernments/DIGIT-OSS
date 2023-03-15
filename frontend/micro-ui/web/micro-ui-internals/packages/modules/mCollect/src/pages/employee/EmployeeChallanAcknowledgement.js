import { Banner, Card, CardText, LinkButton, ActionBar, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as func from "./Utils/getQueryParams";
import { downloadAndPrintChallan } from "../../utils";

const MCollectAcknowledgement = () => {
  const location = useLocation();
  const [params, setParams] = useState({});
  const { isEdit } = Digit.Hooks.useQueryParams();
  useEffect(() => {
    setParams(func.getQueryStringParams(location.search)); // result: '?query=abc'

  }, [location]);
  const { t } = useTranslation();

  const printReciept = async () => {
    const challanNo = params?.challanNumber;
    downloadAndPrintChallan(challanNo, "print");
  };

  return (
    <div>
      {params?.applicationStatus === "CANCELLED" ? (
        <Card>
          <Banner
            message={t("UC_BILL_CANCELLED_SUCCESS_MESSAGE")}
            applicationNumber={params?.challanNumber}
            info={t("UC_CHALLAN_NO")}
            successful={true}
          />
          <CardText>{t("UC_BILL_CANCELLED_SUCCESS_SUB_MESSAGE")}</CardText>
          {"generatePdfKey" ? (
            <div className="primary-label-btn d-grid" style={{ marginLeft: "unset" }} onClick={printReciept}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              {t("UC_PRINT_CHALLAN_LABEL")}
            </div>
          ) : null}
          <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
            <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
              <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
            </Link>
          </ActionBar>
        </Card>
      ) : (
        <Card>
          <Banner
            message={!isEdit ? t("UC_BILL_GENERATED_SUCCESS_MESSAGE") : t("UC_BILL_UPDATED_SUCCESS_MESSAGE")}
            applicationNumber={params?.challanNumber}
            info={t("UC_CHALLAN_NO")}
            successful={true}
          />
          <CardText>{t("UC_BILL_GENERATION_MESSAGE_SUB")}</CardText>
          {"generatePdfKey" ? (
            <div className="primary-label-btn d-grid" style={{ marginLeft: "unset" }} onClick={printReciept}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              {t("UC_PRINT_CHALLAN_LABEL")}
            </div>
          ) : null}
          <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
            <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
              <LinkButton style={{ color: "#FF8C00" }} label={t("CORE_COMMON_GO_TO_HOME")} />
            </Link>

            <Link
              to={{
                pathname: `/digit-ui/employee/payment/collect/${params?.serviceCategory}/${params?.challanNumber}/tenantId=${params?.tenantId}?workflow=mcollect`,
              }}
            >
              <SubmitBar label={t("UC_BUTTON_PAY")} />
            </Link>
          </ActionBar>
        </Card>
      )}
    </div>
  );
};
export default MCollectAcknowledgement;
