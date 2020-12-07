import React, { useState } from "react";

import { Card, DetailsCard, PopUp, SearchAction } from "@egovernments/digit-ui-react-components";
import useComplaintTable from "../../hooks/useComplaintTable";
import { FilterAction } from "@egovernments/digit-ui-react-components";
import Filter from "./Filter";
import SearchComplaint from "./search";

export const ComplaintCard = ({ data }) => {
  //let cardData = useComplaintTable(data);
  const [popup, setPopup] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
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

  const handlePopupAction = (type) => {
    console.log("option");
    if (type === "SEARCH") {
      setSelectedComponent(<SearchComplaint />);
    } else if (type === "FILTER") {
      setSelectedComponent(<Filter />);
    }
    setPopup(true);
  };

  return (
    <React.Fragment>
      <div className="searchBox">
        <SearchAction text="SEARCH" handleActionClick={() => handlePopupAction("SEARCH")} />
        <FilterAction text="FILTER" handleActionClick={() => handlePopupAction("FILTER")} />
        <FilterAction text="SORT" handleActionClick={handlePopupAction} />
      </div>
      <DetailsCard data={cardData} />
      {popup && (
        <PopUp>
          <div className="popup-module">{selectedComponent}</div>
        </PopUp>
      )}
    </React.Fragment>
  );
};
