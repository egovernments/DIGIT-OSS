import React from "react";
import { CheckBox } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const Status = ({ applications, onAssignmentChange, pgrfilters }) => {
  const { t } = useTranslation();
  // const applicationsWithCount = useComplaintStatusCount(applications);
  const applicationsWithCount = [
    {
      name: "Pending for Payment",
      count: 4,
    },
    {
      name: "Pending for DSO Assignment",
      count: 2,
    },
    {
      name: "Pending for Demand Generation",
      count: 6,
    },
  ];

  return (
    <div className="status-container">
      <div className="filter-label">{t("ES_INBOX_STATUS")}</div>
      {applicationsWithCount.map((option, index) => (
        <CheckBox
          key={index}
          onChange={(e) => onAssignmentChange(e, option)}
          checked={pgrfilters.applicationStatus.filter((e) => e.name === option.name).length !== 0 ? true : false}
          label={`${option.name} (${option.count})`}
        />
      ))}
    </div>
  );
};

export default Status;
