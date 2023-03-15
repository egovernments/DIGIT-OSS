import { Banner, Card, CardText, ActionBar, SubmitBar, Loader, LinkButton } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { stringReplaceAll, getBusinessServices } from "../../utils";
import { Link, useHistory } from "react-router-dom";


const OBPSResponse = (props) => {
  const { state } = props.location;
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const bpaData = state?.data?.BPA?.[0];
  const [applicationData, setApplicationData] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const history = useHistory();
  const [isSanctionFee, setSanctionFee] = useState("");
  const [billData, setBillData] = useState(null);

  let bpaBusinessService = applicationData?.businessService;
  let bpaStatus = applicationData?.status;
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA"

  let workflowDetails = Digit.Hooks.useWorkflowDetails({ tenantId: bpaData?.tenantId, id: bpaData?.applicationNo, moduleCode: "BPA" });

  useEffect(async () => {
    setIsLoader(true);
    const bpaResponse = await Digit.OBPSService.BPASearch(tenantId, { applicationNo: bpaData?.applicationNo });
    // let businessService = "BPA.LOW_RISK_PERMIT_FEE";
    // if (bpaResponse?.BPA?.[0]?.businessService === "BPA") businessService = "BPA.NC_SAN_FEE";
    // else if (bpaResponse?.BPA?.[0]?.businessService === "BPA_OC") businessService = "BPA.NC_OC_SAN_FEE";
    let businessService = await getBusinessServices(bpaResponse?.BPA?.[0]?.businessService, bpaResponse?.BPA?.[0]?.status);

    const fetchBill = await Digit.PaymentService.fetchBill(tenantId, { consumerCode: bpaResponse?.BPA?.[0]?.applicationNo, businessService: businessService });
    if (bpaResponse?.BPA?.[0]?.status == "APPROVED" && fetchBill?.Bill[0] && fetchBill?.Bill[0]?.totalAmount != 0) setSanctionFee("_SAN_FEE");
    setIsLoader(false);
    setApplicationData(bpaResponse?.BPA?.[0]);
    setBillData(fetchBill?.Bill)
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

  const getApplicationNoLabel = () => {
    return bpaBusinessService == "BPA" ? t("BPA_PERMIT_APPLICATION_NUMBER_LABEL") : t("BPA_OCCUPANCY_CERTIFICATE_APPLICATION_NUMBER_LABEL")
  }

  const getPaymentURL = (isCitizen) => {
    if (isCitizen == true) return `/digit-ui/citizen/payment/collect/${getBusinessServices(applicationData?.businessService, applicationData?.status)}/${applicationData?.applicationNo}/${applicationData?.tenantId}?tenantId=${applicationData?.tenantId}`;
  }

  const getPaymentURLEmployee = () => {
    history.push(`/digit-ui/employee/payment/collect/${getBusinessServices(applicationData?.businessService, applicationData?.status)}/${applicationData?.applicationNo}/${applicationData?.tenantId}?tenantId=${applicationData?.tenantId}`);
  }

  let isWorkflowLoading = true, isPayButtonEnable = false;
  if (workflowDetails && workflowDetails?.data && !workflowDetails?.isLoading) {
    isWorkflowLoading = false;
    workflowDetails?.data?.nextActions?.forEach(data => {
      if (data.action == "PAY" && !isPayButtonEnable) isPayButtonEnable = true;
    })
  }

  return (
    <div>
      {isLoader || workflowDetails?.isLoading ? <Loader /> :
        <Card>
          <Banner
            message={getHeaderMessage()}
            applicationNumber={applicationData?.applicationNo}
            info={getApplicationNoLabel()}
            successful={applicationData?.status == "PERMIT REVOCATION" || applicationData?.status == "REJECTED" ? false : true}
            style={{ padding: "10px" }}
            headerStyles={{ fontSize: "32px", wordBreak: "break-word" }}
          />
          <CardText style={{ paddingBottom: "10px", marginBottom: "10px" }}>{getSubHeaderMessage()}</CardText>
          {applicationData?.status == "PERMIT REVOCATION" ?
            <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
              <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
              </svg>
              {t("BPA_REVOCATION_PDF_LABEL")}
            </div> : null
          }
          {
            window.location.href.includes("/citizen") ?
              <div>
                {(applicationData?.status == "PENDING_APPL_FEE" || applicationData?.status == "PENDING_FEE" || applicationData?.status == "PENDING_SANC_FEE_PAYMENT") && billData?.length > 0 && isPayButtonEnable ?
                  <div>
                    <Link to={{ pathname: getPaymentURL(true) }}>
                      <SubmitBar label={t("WF_BPA_PAY")} style={{ margin: "10px 0px 0px 0px" }} />
                    </Link>
                    <Link to={`/digit-ui/citizen`} >
                      <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
                    </Link>
                  </div> :
                  <Link to={{ pathname: `/digit-ui/citizen` }}>
                    <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} style={{ margin: "10px 10px 0px 0px" }} />
                  </Link>}
              </div>
              :
              <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <div>
                  {(applicationData?.status == "PENDING_APPL_FEE" || applicationData?.status == "PENDING_FEE" || applicationData?.status == "PENDING_SANC_FEE_PAYMENT") && billData?.length > 0 && isPayButtonEnable ?
                    <div>
                      <SubmitBar
                        label={t("WF_BPA_PAY")}
                        onSubmit={getPaymentURLEmployee}
                        style={{ margin: "10px 0px 0px 0px" }}
                      />
                      <Link to={`/digit-ui/employee`} >
                        {/* <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} /> */}
                        <span style={{ color: "#f47738", margin: "0px 10px" }}>{t("CORE_COMMON_GO_TO_HOME")}</span>
                      </Link>
                    </div> : <SubmitBar
                      label={t("CORE_COMMON_GO_TO_HOME")}
                      onSubmit={onSubmit}
                      style={{ margin: "10px 10px 0px 0px" }}
                    />}
                </div>
              </ActionBar>
          }
        </Card>}
    </div>
  );
};
export default OBPSResponse;