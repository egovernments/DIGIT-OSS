import {
  Banner,
  Card,
  SubmitBar,
  CardText
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { stringReplaceAll } from "../../../utils";

const Acknowledgement = (props) => {
  const BPAData = props?.data;
  const { t } = useTranslation();
  let getAppAction = sessionStorage.getItem("BPA_SUBMIT_APP") ? JSON.parse(sessionStorage.getItem("BPA_SUBMIT_APP")) : null;

  let bpaBusinessService = BPAData?.businessService ? BPAData?.businessService : "BPA";
  let bpaStatus = BPAData?.status;
  let bpaAction = BPAData?.workflow?.action ? BPAData?.workflow?.action : "VERIFY_FORWARD";
  let typeOfArchitect = BPAData?.additionalDetails?.typeOfArchitect
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA";

  return (
    <div>
      <Card>
        <Banner
          message={getAppAction == "BPA_SUBMIT_APP" ?  t(`BPA_SUBMIT_HEADER_${bpaBusinessService}_${bpaAction}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`): t(`BPA_HEADER_${bpaBusinessService}_${bpaAction}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`)}
          applicationNumber={BPAData?.applicationNo}
          info={bpaBusinessService == "BPA" ? t("BPA_PERMIT_APPLICATION_NUMBER_LABEL") : t("BPA_OCCUPANCY_CERTIFICATE_APPLICATION_NUMBER_LABEL")}
          successful={true}
          style={{ padding: "10px" }}
          headerStyles={{fontSize: "32px"}}
        />
        <CardText>{getAppAction == "BPA_SUBMIT_APP" ? t(`BPA_SUBMIT_SUB_HEADER_${bpaBusinessService}_${bpaAction}_${typeOfArchitect ? typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`) : t(`BPA_SUB_HEADER_${bpaBusinessService}_${bpaAction}_${typeOfArchitect ? typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`)}</CardText>
        <div style={{ marginTop: "12px", padding: "10px" }}>
          <Link to={`/digit-ui/citizen`} >
            <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        </div>
      </Card>
    </div>
  );
};
export default Acknowledgement;