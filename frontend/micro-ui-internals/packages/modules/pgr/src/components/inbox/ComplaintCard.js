import React, { useState } from "react";

import { Card, DetailsCard, PopUp, SearchAction } from "@egovernments/digit-ui-react-components";
import useComplaintTable from "../../hooks/useComplaintTable";
import { FilterAction } from "@egovernments/digit-ui-react-components";
import Filter from "./Filter";

export const ComplaintCard = ({ data }) => {
  //let cardData = useComplaintTable(data);
  const [popup, setPopup] = useState(false);
  let cardData = [
    {
      "Complaint No.": "1290889999",
      "Complaint Sub Type": "Sub Type",
      Locality: "Amritsar",
      Status: "formattedAddress",
      "Task Owner": "test",
      "SLA Remaining": "120",
    },
    {
      "Complaint No.": "1290889999",
      "Complaint Sub Type": "Sub Type",
      Locality: "Amritsar",
      Status: "formattedAddress",
      "Task Owner": "test",
      "SLA Remaining": "120",
    },
  ];

  const handlePopupAction = () => {
    console.log("option");
    setPopup(true);
  };

  return (
    <React.Fragment>
      <div class="searchBox">
        <SearchAction text="SEARCH" handleActionClick={handlePopupAction} />
        <FilterAction text="FILTER" handleActionClick={handlePopupAction} />
        <FilterAction text="SORT" handleActionClick={handlePopupAction} />
      </div>
      <DetailsCard data={cardData} />
      {popup && (
        <PopUp>
          <div className="popup-module">
            <Filter />
          </div>
        </PopUp>
      )}
    </React.Fragment>
  );
};
