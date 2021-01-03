import React from "react";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const Status = ({ complaints, onAssignmentChange, pgrfilters }) => {
  // const complaintsWithCount = useComplaintStatusCount(complaints);
  const complaintsWithCount = [
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
