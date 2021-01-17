import React, { useState } from "react";

import { Card, DetailsCard, PopUp, SearchAction, RoundedLabel } from "@egovernments/digit-ui-react-components";
import { FilterAction } from "@egovernments/digit-ui-react-components";
import Filter from "./Filter";
import SearchComplaint from "./search";

export const ComplaintCard = ({ data, onFilterChange, onSearch, serviceRequestIdKey }) => {
  const [popup, setPopup] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [filterCount, setFilterCount] = useState(Digit.SessionStorage.get("pgr_filter_count") || 0);

  const handlePopupAction = (type) => {
    if (type === "SEARCH") {
      setSelectedComponent(<SearchComplaint type="mobile" onClose={handlePopupClose} onSearch={onSearch} />);
    } else if (type === "FILTER") {
      setSelectedComponent(<Filter complaints={data} onFilterChange={onFilterChange} onClose={handlePopupClose} type="mobile" />);
    }
    setPopup(true);
  };

  const handlePopupClose = () => {
    setPopup(false);
    setSelectedComponent(null);
  };

  return (
    <React.Fragment>
      <div className="searchBox">
        <SearchAction text="SEARCH" handleActionClick={() => handlePopupAction("SEARCH")} />
        <FilterAction
          filterCount={Digit.SessionStorage.get("pgr_filter_count")}
          text="FILTER"
          handleActionClick={() => handlePopupAction("FILTER")}
        />
        {/* <FilterAction text="SORT" handleActionClick={handlePopupAction} /> */}
      </div>
      <DetailsCard data={data} serviceRequestIdKey={serviceRequestIdKey} linkPrefix={"/digit-ui/employee/pgr/complaint/details/"} />
      {popup && (
        <PopUp>
          <div className="popup-module">{selectedComponent}</div>
        </PopUp>
      )}
    </React.Fragment>
  );
};
