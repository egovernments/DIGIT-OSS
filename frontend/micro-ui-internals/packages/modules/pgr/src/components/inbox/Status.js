import React from "react";
import { CheckBox, Loader } from "@egovernments/digit-ui-react-components";
import useComplaintStatusCount from "../../../../../libraries/src/hooks/pgr/useComplaintStatusWithCount";

const Status = ({ complaints, onAssignmentChange, pgrfilters }) => {
  const complaintsWithCount = useComplaintStatusCount(complaints);
  let hasFilters = pgrfilters?.applicationStatus?.length;
  return (
    <div className="status-container">
      <div className="filter-label">Status</div>
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
