import React, { useState } from "react";
import { ActionBar, RadioButtons, ApplyFilterBar, CloseSvg, SortSvg } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SortBy = (props) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(() => {
    return props.sortParams?.[0]?.sortOrder === "DESC"
      ? { code: "DESC", name: t("ES_INBOX_DATE_LATEST_FIRST") }
      : { code: "ASC", name: t("ES_INBOX_DATE_LATEST_LAST") };
  });

  function clearAll() {}

  function onSort(option) {
    setSelectedOption({ id: "createdTime", sortOrder: option.code === "DESC" ? "DESC" : "ASC" })
    props.onSort([{ id: "createdTime", sortOrder: option.code === "DESC" ? "DESC" : "ASC" }]);
    props.onClose();
  }

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          {props.type === "mobile" && (
            <span onClick={props.onClose} className="filter-card-close-button">
              <CloseSvg />
            </span>
          )}
          <div className="heading">
            <div className="filter-label">
            <SortSvg />
              {t("SORT_BY")}
              <span className="clear-search" onClick={clearAll} style={{ border: "1px solid #e0e0e0", padding: "6px" }}>
                <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                  d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                  fill="#505A5F"
                  />
                </svg>
              </span>
            </div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </span>
            )}
          </div>
          <div>
            <RadioButtons
              onSelect={onSort}
              selectedOption={selectedOption}
              optionsKey="name"
              options={[
                { code: "DESC", name: t("ES_INBOX_DATE_LATEST_FIRST") },
                { code: "ASC", name: t("ES_INBOX_DATE_LATEST_LAST") },
              ]}
            />
          </div>
        </div>
      </div>
      {/* <ActionBar>
        {props.type === "mobile" && (
          <ApplyFilterBar
            labelLink={t("CS_COMMON_CLEAR_ALL")}
            buttonLink={t("CS_COMMON_FILTER")}
            onClear={clearAll}
            // onSubmit={props.onSort([selectedOption])}
          />
        )}
      </ActionBar> */}
    </React.Fragment>
  )
}

export default SortBy;
