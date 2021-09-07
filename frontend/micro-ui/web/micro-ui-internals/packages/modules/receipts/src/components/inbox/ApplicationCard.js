import { Card, DetailsCard, FilterAction, Loader, PopUp, SearchAction } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import ReceiptsFilter from "../ReceiptsFilter";
import SearchApplication from "./search";
export const ApplicationCard = ({
  t,
  data,
  onFilterChange,
  onSearch,
  onSort,
  serviceRequestIdKey,
  isFstpOperator,
  isLoading,
  isSearch,
  searchParams,
  searchFields,
  sortParams,
  linkPrefix,
  removeParam,
  defaultSearchParams
}) => {

  const [type, setType] = useState(isSearch ? "SEARCH" : "");
  const [popup, setPopup] = useState(isSearch ? true : false);
  const [params, setParams] = useState(searchParams);
  const [_sortparams, setSortParams] = useState(sortParams);
  const selectParams = (param) => {
    setParams((o) => ({ ...o, ...param }));
  };
  const clearParam = () => {
    setParams({});
  };
  const onSearchPara = (param) => {
    onFilterChange({ ...params, ...param });
    setType("");
    setPopup(false);
  };

  useEffect(() => {
    if (type) setPopup(true);
  }, [type]);
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const handlePopupClose = () => {
    setPopup(false);
    setType("");
    setParams(searchParams);
    setSortParams(sortParams);
  };
  const onSearchSortParams = (d) => {
    setSortParams(d);
    setPopup(false);
    setType("");
    onSort(d);
  };
  if (isLoading) {
    return <Loader />;
  }


  let result;
  if (!data || data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {t("CS_MYAPPLICATIONS_NO_APPLICATION")
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (data && data?.length > 0) {
    result = (
      <DetailsCard
        data={data}
        serviceRequestIdKey={serviceRequestIdKey}
        linkPrefix={linkPrefix ? linkPrefix : DSO ? "/digit-ui/employee/fsm/application-details/" : "/digit-ui/employee/fsm/"}
      />
    );
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
        {!isSearch && onFilterChange && (
          <FilterAction
            text="FILTER"
            handleActionClick={() => {
              setType("FILTER");
              setPopup(true);
            }}
          />
        )}
        {/* <FilterAction
          text="SORT"
          handleActionClick={() => {
            setType("SORT");
            setPopup(true);
          }}
        /> */}
      </div>
      {result}
      {popup && (
        <PopUp>
          {type === "FILTER" && (
            <div className="popup-module">
              {
                <ReceiptsFilter
                  defaultSearchParams={defaultSearchParams}
                  onFilterChange={onFilterChange}
                  searchParams={searchParams}
                  type="mobile"
                  onClose={handlePopupClose}
                />
              }
            </div>
          )}
          {type === "SEARCH" && (
            <div className="popup-module">
              <SearchApplication
                type="mobile"
                onClose={handlePopupClose}
                onSearch={onSearch}
                isFstpOperator={isFstpOperator}
                searchParams={searchParams}
                searchFields={searchFields}
              />
            </div>
          )}
        </PopUp>
      )}
    </React.Fragment>
  );
};
