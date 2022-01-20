import { Banner, Card, CardText, ActionBar, SubmitBar, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { stringReplaceAll } from "../../utils";
import { Link, useHistory } from "react-router-dom";


const OBPSResponse = (props) => {
  const { state } = props.location;
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const bpaData = state?.data?.BPA?.[0];
  const [applicationData, setApplicationData] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const history = useHistory();

  let bpaBusinessService = applicationData?.businessService;
  let bpaStatus = applicationData?.status;
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA"

  useEffect(async () => {
    setIsLoader(true);
    const bpaResponse = await Digit.OBPSService.BPASearch(tenantId, { applicationNo: bpaData?.applicationNo });
    setIsLoader(false);
    setApplicationData(bpaResponse?.BPA?.[0]);
  }, [])

  const getHeaderMessage = () => {
    return t(`BPA_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${stringReplaceAll(bpaStatus, " ", "_").toUpperCase()}`)
  }

  const getSubHeaderMessage = () => {
    return t(`BPA_SUB_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${bpaData?.additionalDetails?.typeOfArchitect ? bpaData?.additionalDetails?.typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus, " ", "_").toUpperCase()}`)
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
      {isLoader ? <Loader /> :
        <Card>
          <Banner
            message={getHeaderMessage()}
            applicationNumber={applicationData?.applicationNo}
            info={t("BPA_APPLICATION_NUMBER_LABEL")}
            successful={applicationData?.status == "PERMIT REVOCATION" || applicationData?.status == "REJECTED" ? false : true}
            style={{ padding: "10px" }}
            headerStyles={{fontSize: "32px"}}
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
              <Link to={{
                pathname: `/digit-ui/citizen`,
              }}>
                <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
              </Link> :
              <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <SubmitBar
                  label={t("CORE_COMMON_GO_TO_HOME")}
                  onSubmit={onSubmit}
                />
              </ActionBar>
          }
        </Card>}
    </div>
  );
};
export default OBPSResponse;