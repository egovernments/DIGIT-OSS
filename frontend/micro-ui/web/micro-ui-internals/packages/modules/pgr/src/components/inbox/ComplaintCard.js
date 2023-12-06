import React, { useState } from "react";

import { FilterAction, Card, DetailsCard, PopUp, SearchAction } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import SearchComplaint from "./search";
import { LOCALE } from "../../constants/Localization";

export const ComplaintCard = ({ data, onFilterChange, onSearch, serviceRequestIdKey, searchParams }) => {
  const { t } = useTranslation();
  const [popup, setPopup] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [filterCount, setFilterCount] = useState(Digit.inboxFilterCount || 1);

  const handlePopupAction = (type) => {
    if (type === "SEARCH") {
      setSelectedComponent(<SearchComplaint type="mobile" onClose={handlePopupClose} onSearch={onSearch} searchParams={searchParams} />);
    } else if (type === "FILTER") {
      setSelectedComponent(
        <Filter complaints={data} onFilterChange={onFilterChange} onClose={handlePopupClose} type="mobile" searchParams={searchParams} />
      );
    }
    setPopup(true);
  };

  const handlePopupClose = () => {
    setPopup(false);
    setSelectedComponent(null);
  };

  let result;
  if (data && data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {t(LOCALE.NO_COMPLAINTS_EMPLOYEE)
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (data && data?.length > 0) {
    result = <DetailsCard data={data} serviceRequestIdKey={serviceRequestIdKey} linkPrefix={"/digit-ui/employee/pgr/complaint/details/"} />;
  } else {
    result = (
      <Card style={{ marginTop: 20 }}>
        {t(LOCALE.ERROR_LOADING_RESULTS)
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  }

  return (
    <React.Fragment>
      <div className="searchBox">
        <SearchAction text="SEARCH" handleActionClick={() => handlePopupAction("SEARCH")} />
        <FilterAction filterCount={filterCount} text="FILTER" handleActionClick={() => handlePopupAction("FILTER")} />
        {/* <FilterAction text="SORT" handleActionClick={handlePopupAction} /> */}
      </div>
      {result}
      {popup && (
        <PopUp>
          <div className="popup-module">{selectedComponent}</div>
        </PopUp>
      )}
    </React.Fragment>
  );
};
