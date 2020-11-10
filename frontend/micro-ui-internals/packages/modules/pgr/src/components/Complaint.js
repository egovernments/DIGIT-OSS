import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, CardCaption } from "@egovernments/digit-ui-react-components";
// import { ConvertTimestampToDate } from "../@egovernments/digit-utils/services/date";

const Complaint = (props) => {
  let { data } = props;
  let { serviceCode, serviceRequestId, applicationStatus } = data;
  const CS_COMMON = "CS_COMMON";

  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = () => {
    history.push(`/complaint/details/${serviceRequestId}`);
  };
  return (
    <Card>
      <div onClick={handleClick}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "self-end",
          }}
        >
          <div>
            <div>
              <CardCaption>{t(`SERVICEDEFS.${serviceCode.toUpperCase()}`)}</CardCaption>
            </div>
            <div>
              <>{Digit.DateUtils.ConvertTimestampToDate(data.auditDetails.createdTime)} </>
            </div>
          </div>
          <div
            style={{
              borderRadius: "15px",
              color: "#D4351C",
              backgroundColor: "#f8e0dc",
              padding: "0.1rem 1.2rem",
              fontSize: "1.2rem",
              display: "inline-block",
            }}
          >
            Open
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <div>{t(`${CS_COMMON}_COMPLAINT_NO`)}</div>
          <CardCaption>{serviceRequestId}</CardCaption>
        </div>
        <div style={{ marginTop: "1rem" }}>
          {/* {t("CS_COMMON_" + applicationStatus.toUpperCase())} */}
          {/* {console.log(
            serviceRequestId,
            "applicationStatus.toLowerCase():",
            applicationStatus.toLowerCase()
          )} */}
          {t(`${CS_COMMON}_${applicationStatus}`)}
        </div>
      </div>
    </Card>
  );
};

export default Complaint;
