import React from "react";
import { useTranslation } from "react-i18next";
import { Loader, Card } from "@egovernments/digit-ui-react-components";
import { ComplaintCard } from "./inbox/ComplaintCard";
import ComplaintsLink from "./inbox/ComplaintLinks";
import { LOCALE } from "../constants/Localization";
import PropTypes from "prop-types";

const GetSlaCell = (value) => {
  return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
};

const MobileInbox = ({ data, onFilterChange, onSearch, isLoading, searchParams }) => {
  const { t } = useTranslation();
  const localizedData = data?.map(({ locality, tenantId, serviceRequestId, complaintSubType, sla, status, taskOwner }) => ({
    [t("CS_COMMON_COMPLAINT_NO")]: serviceRequestId,
    [t("CS_ADDCOMPLAINT_COMPLAINT_SUB_TYPE")]: t(`SERVICEDEFS.${complaintSubType.toUpperCase()}`),
    [t("WF_INBOX_HEADER_LOCALITY")]: t(Digit.Utils.locale.getLocalityCode(locality, tenantId)),
    [t("CS_COMPLAINT_DETAILS_CURRENT_STATUS")]: t(`CS_COMMON_${status}`),
    [t("WF_INBOX_HEADER_CURRENT_OWNER")]: taskOwner,
    [t("WF_INBOX_HEADER_SLA_DAYS_REMAINING")]: GetSlaCell(sla),
    // status,
  }));

  let result;
  if (isLoading) {
    result = <Loader />;
  } else {
    result = (
      <ComplaintCard
        data={localizedData}
        onFilterChange={onFilterChange}
        serviceRequestIdKey={t("CS_COMMON_COMPLAINT_NO")}
        onSearch={onSearch}
        searchParams={searchParams}
      />
    );
  }

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          <ComplaintsLink isMobile={true} />
          {result}
        </div>
      </div>
    </div>
  );
};
MobileInbox.propTypes = {
  data: PropTypes.any,
  onFilterChange: PropTypes.func,
  onSearch: PropTypes.func,
  isLoading: PropTypes.bool,
  searchParams: PropTypes.any,
};

MobileInbox.defaultProps = {
  onFilterChange: () => {},
  searchParams: {},
};

export default MobileInbox;
