import React from "react";
import { CheckBox, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const Status = ({ complaints, onAssignmentChange, pgrfilters }) => {
  const { t } = useTranslation();
  const complaintsWithCount = Digit.Hooks.pgr.useComplaintStatusCount(complaints);
  let hasFilters = pgrfilters?.applicationStatus?.length;
  return (
    <div className="status-container">
      <div className="filter-label">{t("ES_PGR_FILTER_STATUS")}</div>
      {complaintsWithCount.length === 0 && <Loader />}
      {complaintsWithCount.map((option, index) => {
        return (
          <CheckBox
            key={index}
            onChange={(e) => onAssignmentChange(e, option)}
            checked={hasFilters ? (pgrfilters.applicationStatus.filter((e) => e.code === option.code).length !== 0 ? true : false) : false}
            label={`${option.name} (${option.count || 0})`}
          />
        );
      })}
    </div>
  );
};

export default Status;
