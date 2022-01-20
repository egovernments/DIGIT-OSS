import React, { useState, useEffect } from "react";
import { Card, DetailsCard, Loader, PopUp, SearchAction, FilterAction } from "@egovernments/digit-ui-react-components";
import Filter from "./Filter";
import Search from "./Search";
import { useHistory, Link } from "react-router-dom";
import { areEqual } from "../../utils";

const ApplicationCard = ({
  searchFields,
  searchParams,
  onFilterChange,
  onSearch,
  t,
  data,
  responseData,
}) => {
  const [type, setType] = useState("");
  const [popup, setPopup] = useState(false);
  const [params, setParams] = useState(searchParams);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory()
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

  const redirectToDetailsPage = (data) => {
    const details = responseData?.find((item) => (areEqual(item.postedBy, data["Posted By"]) && areEqual(item.name, data["Document Name"])));
    if (details) {
      history.push(`/digit-ui/employee/engagement/documents/inbox/details/${details?.name}`, { details })
    }
  }

  let result;
  if (data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {t("CE_DOCUMENTS_NOT_FOUND")}<br />
        <Link className="link" to={`/digit-ui/employee/engagement/documents/inbox/new-doc`}>{t('NEW_DOCUMENT_TEXT')}</Link>
      </Card>
    );
  }
  else if (data && data?.length > 0) {
    result = <DetailsCard data={data} handleSelect={() => { }} handleDetailCardClick={redirectToDetailsPage} />
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
      </div>
      {result}
      {popup && (
        <PopUp>
          {type === "FILTER" && (
            <div className="popup-module">
              {
                <Filter
                  onFilterChange={onFilterChange}
                  onClose={handlePopupClose}
                  onSearch={onSearch}
                  type="mobile"
                  searchParams={params}
                />
              }
            </div>
          )}
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
        </PopUp>
      )}
    </React.Fragment>
  )
};

export default ApplicationCard;