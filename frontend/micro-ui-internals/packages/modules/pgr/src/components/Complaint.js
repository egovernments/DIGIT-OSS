import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, DateWrap, KeyNote } from "@egovernments/digit-ui-react-components";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../constants/Localization";

// import { ConvertTimestampToDate } from "../@egovernments/digit-utils/services/date";

const Complaint = ({ data, path }) => {
  let { serviceCode, serviceRequestId, applicationStatus } = data;

  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = () => {
    history.push(`${path}/${serviceRequestId}`);
  };

  return (
    <React.Fragment>
      <Card onClick={handleClick}>
        <CardSubHeader>{t(`SERVICEDEFS.${serviceCode.toUpperCase()}`)}</CardSubHeader>

        <DateWrap date={Digit.DateUtils.ConvertTimestampToDate(data.auditDetails.createdTime)} />

        <KeyNote keyValue={t(`${LOCALIZATION_KEY.CS_COMMON}_COMPLAINT_NO`)} note={serviceRequestId} />

        <div className="status-highlight">
          <p>Open</p>
        </div>
        {/* {t("CS_COMMON_" + applicationStatus.toUpperCase())} */}
        {/* {console.log(
          serviceRequestId,
          "applicationStatus.toLowerCase():",
          applicationStatus.toLowerCase()
        )} */}
        {t(`${LOCALIZATION_KEY.CS_COMMON}_${applicationStatus}`)}
      </Card>
    </React.Fragment>
  );
};

export default Complaint;
