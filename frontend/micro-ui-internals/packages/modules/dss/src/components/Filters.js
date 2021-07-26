import React, { useContext, useEffect, useMemo, useState } from "react";
import { MultiSelectDropdown, FilterIcon, RefreshIcon, CloseSvg } from "@egovernments/digit-ui-react-components";
import Switch from "./Switch";
import DateRange from "./DateRange";
import FilterContext from "./FilterContext";

const Filters = ({ t, ulbTenants, isOpen, closeFilters, showDateRange = true, showDDR = true, showUlb = true, showDenomination = true }) => {
  const { value, setValue } = useContext(FilterContext);

  const [selected, setSelected] = useState(() =>
    ulbTenants?.ulb.filter((tenant) => value.filters.tenantId.find((selectedTenant) => selectedTenant === tenant.code))
  );

  useEffect(() => {
    setSelected(ulbTenants?.ulb.filter((tenant) => value.filters.tenantId.find((selectedTenant) => selectedTenant === tenant.code)));
  }, [value.filters.tenantId]);

  const selectULB = (data) => {
    const _data = Array.isArray(data) ? data : [data];
    setValue({ ...value, filters: { tenantId: [...value?.filters?.tenantId, ..._data] } });
  };
  const removeULB = (data) => {
    const _data = Array.isArray(data) ? data : [data];
    setValue({
      ...value,
      filters: { ...value?.filters, tenantId: [...value?.filters?.tenantId].filter((tenant) => !_data.find((e) => e === tenant)) },
    });
  };
  const handleFilterChange = (data) => {
    setValue({ ...value, ...data });
  };

  const selectFilters = (e, data) => {
    const { checked } = e?.target;
    if (checked) selectULB(data.code);
    else removeULB(data.code);
  };

  const selectDDR = (e, data) => {
    const { checked } = e?.target;
    if (checked) selectULB(ulbTenants.ulb.filter((ulb) => ulb.ddrKey === data.ddrKey).map((ulb) => ulb.code));
    else removeULB(ulbTenants.ulb.filter((ulb) => ulb.ddrKey === data.ddrKey).map((ulb) => ulb.code));
  };

  const selectedDDRs = useMemo(
    () =>
      selected
        .map((ulb) => ulbTenants.ulb.filter((e) => e.code === ulb.code)[0])
        .filter((item, i, arr) => i === arr.findIndex((t) => t.ddrKey === item.ddrKey)),
    [selected, ulbTenants]
  );

  const handleClear = () => {
    setValue({
      denomination: "Unit",
      range: Digit.Utils.dss.getInitialRange(),
    });
  };

  return (
    <div className={`filters-wrapper ${isOpen ? "filters-modal" : ""}`}>
      <span className="filter-close" onClick={() => closeFilters()}>
        <CloseSvg />
      </span>
      {isOpen && (
        <div className="filter-header">
          <FilterIcon />
          <p>{t(`DSS_FILTERS`)}</p>
          <span onClick={handleClear}>
            <RefreshIcon />
          </span>
        </div>
      )}
      {showDateRange && (
        <div className="filters-input">
          <DateRange onFilterChange={handleFilterChange} values={value?.range} t={t} />
        </div>
      )}
      {showDDR && (
        <div className="filters-input">
          <div>{t("ES_DSS_DDR")}</div>
          <MultiSelectDropdown
            options={ulbTenants?.ddr}
            optionsKey="ddrKey"
            onSelect={selectDDR}
            selected={selectedDDRs}
            defaultLabel={t("ES_DSS_ALL_DDR_SELECTED")}
            defaultUnit={t("ES_DSS_DDR_SELECTED")}
          />
        </div>
      )}
      {showUlb && (
        <div className="filters-input">
          <div>{t("ES_DSS_ULB")}</div>
          <MultiSelectDropdown
            options={ulbTenants?.ulb}
            optionsKey="ulbKey"
            onSelect={selectFilters}
            selected={selected}
            defaultLabel={t("ES_DSS_ALL_ULB_SELECTED")}
            defaultUnit={t("ES_DSS_DDR_SELECTED")}
          />
        </div>
      )}
      {showDenomination && (
        <div className="filters-input" style={{ flexBasis: "16%" }}>
          <Switch onSelect={handleFilterChange} t={t} />
        </div>
      )}
    </div>
  );
};

export default Filters;
