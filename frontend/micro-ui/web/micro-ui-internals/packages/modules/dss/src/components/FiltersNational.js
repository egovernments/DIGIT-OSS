import { CloseSvg, FilterIcon, MultiSelectDropdown, RefreshIcon } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useState } from "react";
import DateRange from "./DateRange";
import FilterContext from "./FilterContext";
import Switch from "./Switch";


const Filters = ({
  t,
  ulbTenants,
  isOpen,
  closeFilters,
  showDateRange = true,
  showDDR = true,
  showUlb = true,
  showDenomination = true,
  isNational = false,
}) => {
  const { value, setValue } = useContext(FilterContext);
  const [selected, setSelected] = useState(() =>
    ulbTenants?.ulb?.filter((tenant) => value?.filters?.ulb?.find((selectedTenant) => selectedTenant === tenant?.code))
  );
  const [selectedSt, setSelectedSt] = useState(() =>
    ulbTenants?.ddr?.filter((tenant) => value?.filters?.state?.find((selectedTenant) => selectedTenant === tenant?.code))
  );
  useEffect(() => {
    setSelected(ulbTenants?.ulb?.filter((tenant) => value?.filters?.ulb?.find((selectedTenant) => selectedTenant === tenant?.code)));
    setSelectedSt(ulbTenants?.ddr?.filter((tenant) => value?.filters?.state?.find((selectedTenant) => selectedTenant === tenant?.code)));
  }, [value]);

  const handleFilterChange = (data) => {
    setValue({ ...value, ...data });
  };

  const selectFilters = (e, data) => {
    let ulbs = e.map((allPropsData) => allPropsData?.[1]?.code);
    let states = ulbTenants?.ulb.filter((ele) => ulbs.includes(ele.code)).map((e) => e.ddrKey);
    let newStates = ulbTenants?.ddr.filter((ele) => states.includes(ele.ddrKey)).map((e) => e.code);
    if (value?.filters?.state?.length > 0) {
      value?.filters?.state.map((stt) => {
        if (!newStates.includes(stt)) {
          newStates.push(stt);
        }
      });
    }
    setValue({ ...value, filters: { ...value.filters, ulb: ulbs, state: newStates } });
  };
  const selectStFilters = (e, data) => {
    setValue({ ...value, filters: { ...value.filters, state: e.map((allPropsData) => allPropsData?.[1]?.code) } });
  };

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
      <div className="filters-input">
        <div className="mbsm">{t(isNational ? "ES_DSS_STATE" : "ES_DSS_DDR")}</div>
        <MultiSelectDropdown
          options={ulbTenants?.ddr && ulbTenants.ddr?.sort((x, y) => x?.ddrKey?.localeCompare(y?.ddrKey))?.map(ele=>({...ele,i18Key:`DSS_TB_${Digit.Utils.locale.getTransformedLocale(ele?.ddrKey)}`}))}
          optionsKey="i18Key"
          onSelect={selectStFilters}
          selected={selectedSt?.map(ele=>({...ele,i18Key:`DSS_TB_${Digit.Utils.locale.getTransformedLocale(ele?.ddrKey)}`}))}
          defaultLabel={t(isNational ? "ES_DSS_ALL_STATE_SELECTED" : "ES_DSS_ALL_DDR_SELECTED")}
          defaultUnit={t(isNational ? "ES_DSS_STATE_SELECTED" : "ES_DSS_DDR_SELECTED")}
        />
      </div>

      <div className="filters-input">
        <div className="mbsm">{t("ES_DSS_ULB")}</div>
        <MultiSelectDropdown
          options={ulbTenants?.ulb?.filter((e) => Digit.Utils.dss.checkSelected(e, selectedSt)).sort((x, y) => x?.ulbKey?.localeCompare(y?.ulbKey))?.map(ele=>({...ele,i18Key:`DSS_TB_${Digit.Utils.locale.getTransformedLocale(ele?.ulbKey)}`}))}
          optionsKey="i18Key"
          onSelect={selectFilters}
          selected={selected?.map(ele=>({...ele,i18Key:`DSS_TB_${Digit.Utils.locale.getTransformedLocale(ele?.ulbKey)}`}))}
          defaultLabel={t("ES_DSS_ALL_ULB_SELECTED")}
          defaultUnit={t("ES_DSS_DDR_SELECTED")}
        />
      </div>

      {showDenomination && (
        <div className="filters-input" style={{ flexBasis: "16%" }}>
          <Switch onSelect={handleFilterChange} t={t} />
        </div>
      )}
    </div>
  );
};

export default Filters;
