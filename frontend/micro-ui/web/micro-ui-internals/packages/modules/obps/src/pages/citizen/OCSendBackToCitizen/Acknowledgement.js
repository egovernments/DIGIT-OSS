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

  let bpaBusinessService = BPAData?.businessService ? BPAData?.businessService : "BPA";
  let bpaStatus = BPAData?.status;
  let bpaAction = BPAData?.workflow?.action ? BPAData?.workflow?.action : "VERIFY_FORWARD";
  let typeOfArchitect = BPAData?.additionalDetails?.typeOfArchitect
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA";

  return (
    <div>
      <Card style={{ padding: "0px" }}>
        <Banner
          message={t(`BPA_HEADER_${bpaBusinessService}_${bpaAction}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`)}
          applicationNumber={BPAData?.applicationNo}
          info={t("PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL")}
          successful={true}
          infoStyles = {{fontSize: "18px", lineHeight: "21px", fontWeight: "bold", textAlign: "center", padding: "0px 15px"}}
          applicationNumberStyles = {{fontSize: "24px", lineHeight: "28px", fontWeight: "bold", marginTop: "10px"}}
          style={{width: "100%", padding: "10px"}}
          headerStyles={{fontSize: "32px"}}
        />
        <CardText>{t(`BPA_SUB_HEADER_${bpaBusinessService}_${bpaAction}_${typeOfArchitect ? typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`)}</CardText>
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