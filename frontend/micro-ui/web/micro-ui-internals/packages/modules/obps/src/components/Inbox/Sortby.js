import React, { useState } from "react";
import { ActionBar, RadioButtons } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { ApplyFilterBar, CloseSvg } from "@egovernments/digit-ui-react-components";

const SortBy = (props) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(() => {
    return props.sortParams?.[0]?.desc
      ? { code: "DESC", name: t("ES_INBOX_DATE_LATEST_FIRST") }
      : { code: "ASC", name: t("ES_INBOX_DATE_LATEST_LAST") };
  });

  function clearAll() {}

  function onSort(option) {
    props.onSort([{ id: "createdTime", desc: option.code === "DESC" ? true : false }]);
    props.onClose();
  }

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("SORT_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
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
            onSubmit={props.onSort([selectedOption])}
          />
        )}
      </ActionBar> */}
    </React.Fragment>
  );
};

export default SortBy;
