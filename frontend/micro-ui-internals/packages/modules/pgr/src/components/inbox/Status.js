import React from "react";
import { CheckBox } from "@egovernments/digit-ui-react-components";
import useComplaintStatusCount from "../../../../../libraries/src/hooks/pgr/useComplaintStatusWithCount";

const Status = ({ complaints, onAssignmentChange, pgrfilters }) => {
  const complaintsWithCount = useComplaintStatusCount(complaints);
  return (
    <div className="status-container">
      <div className="filter-label">Status</div>
      {complaintsWithCount.map((option, index) => (
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
