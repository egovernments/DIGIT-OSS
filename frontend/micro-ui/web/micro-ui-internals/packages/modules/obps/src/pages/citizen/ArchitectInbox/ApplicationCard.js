import React, { useState, useEffect } from "react";
import { Card, DetailsCard, Loader, PopUp, SearchAction, FilterAction } from "@egovernments/digit-ui-react-components";
import Search from "./Search";
import SortBy from "./SortBy";
import Filter from "./Filter";

const ApplicationCard = ({
  searchFields,
  searchParams,
  statusMap,
  sortParams = {},
  onSort,
  onFilterChange,
  onSearch,
  t,
  data
}) => {
  const [type, setType] = useState("");
  const [popup, setPopup] = useState(false);
  const [params, setParams] = useState(searchParams);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    if (type) setPopup(true);
  }, [type]);

  const selectParams = (param) => {
    setParams((o) => ({ ...o, ...param }));
  };

  const handlePopupClose = () => {
    setPopup(false);
    setParams(searchParams);
  };

  let result;
  if (data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {t("ES_NO_EVENTS")
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  }
  else if (data && data?.length > 0) {
    result = <DetailsCard data={data} />
  }

  return (
    <React.Fragment>
      <div className="searchBox">
        {onSearch && (
          <SearchAction
            text="SEARCH"
            handleActionClick={() => {
              setType("SEARCH");
              setPopup(true);
            }}
          />
        )}
        <FilterAction
          text="FILTER"
          handleActionClick={() => {
            setType("FILTER");
            setPopup(true);
          }}
        />
        <FilterAction
          text="SORT"
          handleActionClick={() => {
            setType("SORT");
            setPopup(true);
          }}
        />
      </div>
      {result}
      {popup && (
        <PopUp>
          {type === "SEARCH" && (
            <div className="popup-module">
              <Search
                t={t}
                type="mobile"
                onClose={handlePopupClose}
                onSearch={onSearch}
                searchParams={searchParams}
                searchFields={searchFields}
              />
            </div>
          )}
          {type === "FILTER" && (
            <div className="popup-module">
              {
                <Filter
                  onFilterChange={onFilterChange}
                  onClose={handlePopupClose}
                  onSearch={onSearch}
                  type="mobile"
                  searchParams={searchParams}
                  statuses={statusMap}
                  // removeParam={removeParam}
                />
              }
            </div>
          )}
          {type === "SORT" && (
            <div className="popup-module">
              {<SortBy type="mobile" sortParams={sortParams} onClose={handlePopupClose} type="mobile" onSort={onSort} />}
            </div>
          )}
        </PopUp>
      )}
    </React.Fragment>
  )
}

export default ApplicationCard;
