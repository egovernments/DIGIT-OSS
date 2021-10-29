import { Card, DetailsCard, FilterAction, PopUp, SearchAction } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Filter from "./Filter";
import Search from "./Search";
import SortBy from "./SortBy";

const ApplicationCard = ({
  searchFields,
  searchParams,
  statusMap,
  sortParams = {},
  onSort,
  onFilterChange,
  onSearch,
  t,
  data,
  idKey
}) => {
  const [type, setType] = useState("");
  const history = useHistory();
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
    result = <DetailsCard data={data} handleSelect={(e) => console.log(e)} handleDetailCardClick={(e) => { history.push(`/digit-ui/citizen/obps/${["BPA_LOW", "BPA", "BPA_OC"].includes(e?.serviceType?.value) ? "bpa" : "stakeholder"}/${e?.[idKey]}`); console.log(e) }} />
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
