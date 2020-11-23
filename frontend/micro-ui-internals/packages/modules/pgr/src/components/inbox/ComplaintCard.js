import { Card, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";

export const ComplaintCard = () => {
  let data = {
    "Complaint No.": "1290889999",
    "Complaint Sub Type": "Sub Type",
    Locality: "Amritsar",
    Status: "formattedAddress",
    "Task Owner": "test",
    "SLA Remaining": "120",
  };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
        {Object.keys(data).map((name, index) => (
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
            <span style={{ width: "150px", padding: "16px 0" }}>
              <h2>{name}</h2>
            </span>
            <span style={{ marginLeft: "29px", padding: "16px 0" }}>{data[name]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
