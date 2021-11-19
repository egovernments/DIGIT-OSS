import {
  Banner,
  Card,
  SubmitBar
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Acknowledgement = (props) => {
  const BPAData = props?.data;
  const { t } = useTranslation();

  return (
    <div>
      <Card style={{ padding: "0px" }}>
        <Banner
          message={t("BPA_APPLICATION_SUCCESS_MESSAGE_MAIN")}
          applicationNumber={BPAData?.applicationNo}
          info={t("PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL")}
          successful={true}
          style={{width: "100%", padding: "10px"}}
        />
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