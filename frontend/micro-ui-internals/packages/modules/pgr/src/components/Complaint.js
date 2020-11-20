import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, CardCaption } from "@egovernments/digit-ui-react-components";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../constants/Localization";
// import { ConvertTimestampToDate } from "../@egovernments/digit-utils/services/date";

const Complaint = (props) => {
  let { data } = props;
  let { serviceCode, serviceRequestId, applicationStatus } = data;

  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = () => {
    history.push(`/complaint/details/${serviceRequestId}`);
  };

  return (
    <Card>
      <div onClick={handleClick}>
        <div>
          <div>
            {/* TO-DO: create new component to avoid spacing */}
            <CardSubHeader>{t(`SERVICEDEFS.${serviceCode.toUpperCase()}`)}</CardSubHeader>
          </div>
          <div className="date-wrap">{Digit.DateUtils.ConvertTimestampToDate(data.auditDetails.createdTime)}</div>
        </div>

        <div className="key-note-pair">
          <h3>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMPLAINT_NO`)}</h3>
          <CardCaption>{serviceRequestId}</CardCaption>
        </div>

        <div className="status-highlight">
          <p>Open</p>
        </div>
        <div>
          {/* {t("CS_COMMON_" + applicationStatus.toUpperCase())} */}
          {/* {console.log(
            serviceRequestId,
            "applicationStatus.toLowerCase():",
            applicationStatus.toLowerCase()
          )} */}
          {t(`${LOCALIZATION_KEY.CS_COMMON}_${applicationStatus}`)}
        </div>
      </div>
    </Card>
  );
};

export default Complaint;
