import { Banner, Card, CardText, ActionBar, SubmitBar, Loader, LinkButton } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { stringReplaceAll, getBusinessServices } from "../../utils";
import { Link, useHistory } from "react-router-dom";
import * as func from "../../utils";


const WSResponse = (props) => {
  debugger;
  const { state } = props.location;
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [applicationData, setApplicationData] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const history = useHistory();
  let filters = func.getQueryStringParams(location.search);

  const { isLoading: waterLoading, isError: waterError, data: waterApplicationDetails } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, filters?.applicationNumber, "WATER", {enabled: filters?.applicationNumber ? true : false});
  const { isLoading: sewerageLoading, isError: sewerageError, data: sewerageApplicationDetails } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, filters?.applicationNumber1, "SEWERAGE", {enabled: filters?.applicationNumber1 ? true : false});

  console.log(waterApplicationDetails, sewerageApplicationDetails, "dkaoiasdiadshoihsd")
  
  useEffect(async () => {
    // setIsLoader(true);
    // const bpaResponse = await Digit.OBPSService.BPASearch(tenantId, { applicationNo: bpaData?.applicationNo });
    // // let businessService = "BPA.LOW_RISK_PERMIT_FEE";
    // // if (bpaResponse?.BPA?.[0]?.businessService === "BPA") businessService = "BPA.NC_SAN_FEE";
    // // else if (bpaResponse?.BPA?.[0]?.businessService === "BPA_OC") businessService = "BPA.NC_OC_SAN_FEE";
    // let businessService = await getBusinessServices(bpaResponse?.BPA?.[0]?.businessService, bpaResponse?.BPA?.[0]?.status);

    // const fetchBill = await Digit.PaymentService.fetchBill(tenantId, { consumerCode: bpaResponse?.BPA?.[0]?.applicationNo, businessService: businessService });
    // if (bpaResponse?.BPA?.[0]?.status == "APPROVED" && fetchBill?.Bill[0] && fetchBill?.Bill[0]?.totalAmount != 0) setSanctionFee("_SAN_FEE");
    // setIsLoader(false);
    // setApplicationData(bpaResponse?.BPA?.[0]);
    // setBillData(fetchBill?.Bill)
  }, [])

  const getHeaderMessage = () => {
    return t(`BPA_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${stringReplaceAll(bpaStatus, " ", "_").toUpperCase()}${isSanctionFee ? isSanctionFee : ""}`)
  }

  const getSubHeaderMessage = () => {
    return t(`BPA_SUB_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${bpaData?.additionalDetails?.typeOfArchitect ? bpaData?.additionalDetails?.typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus, " ", "_").toUpperCase()}${isSanctionFee ? isSanctionFee : ""}`)
  }

  const printReciept = async () => {
    let response = await Digit.PaymentService.generatePdf(tenantId, { Bpa: [applicationData] }, "bpa-revocation");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  };

  const onSubmit = () => {
    history.push(`/digit-ui/employee`);
  }


  return (
    <div>
      <Card>
        <Banner
          message={t("CS_PROPERTY_APPLICATION_SUCCESS")}
          applicationNumber={filters?.applicationNumber}
          applicationNumberOne={filters?.applicationNumber1}
          info={t("PT_APPLICATION_NO")}
          infoOne={t("PT_APPLICATION_NO")}
          successful={true}
          style={{ padding: "10px" }}
          headerStyles={{ fontSize: "32px" }}
          infoOneStyles={{ paddingTop: "20px" }}
        />
        <CardText style={{ paddingBottom: "10px", marginBottom: "10px" }}>{t("WS_MESSAGE_SUB_DESCRIPTION_LABEL")}</CardText>
        <div style={{display: "flex"}}>
        {filters?.applicationNumber && <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
          <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
          </svg>
          {t("BPA_REVOCATION_PDF_LABEL")}
        </div>}
        {filters?.applicationNumber1 && <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
          <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
          </svg>
          {t("BPA_REVOCATION_PDF_LABEL")}
        </div>}
        </div>
      </Card>
    </div>
  );
};
export default WSResponse;