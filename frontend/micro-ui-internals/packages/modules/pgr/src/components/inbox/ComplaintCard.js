import React from "react";

import { Card, DetailsCard } from "@egovernments/digit-ui-react-components";

export const ComplaintCard = ({ data }) => {
  // let data = [
  //   {
  //     "Complaint No.": "1290889999",
  //     "Complaint Sub Type": "Sub Type",
  //     Locality: "Amritsar",
  //     Status: "formattedAddress",
  //     "Task Owner": "test",
  //     "SLA Remaining": "120",
  //   },
  // ];

  return (
    <Card>
      <DetailsCard data={tableData} />
    </Card>
  );
};
