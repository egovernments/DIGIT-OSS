import { CloseSvg, FilterIcon, MultiSelectDropdown, RefreshIcon, Dropdown, Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useMemo, useState } from "react";
import DateRange from "./DateRange";
import FilterContext from "./FilterContext";
import Switch from "./Switch";


const CustomFilter = ({
  t,
  filterConfig,
  isOpen,
  closeFilters
}) => {
  const { value, setValue } = useContext(FilterContext);
  const [ backupDate, setBackupDate ] = useState({});

  const [selected, setSelected] = useState({});

  const handleDateFilterChange = (data) => {
    let numberOfDays = _.get(_.find(filterConfig, ['type', 'DateRange']), 'props.maxNumberOfDays')
    if (numberOfDays && _.isNumber(numberOfDays)) {
      let dateDiff = Digit.Utils.dss.getDateDiffrenence(data.range.endDate, data.range.startDate);
      if (dateDiff > numberOfDays) {
        window.alert(`Invalid date, please do not select date more then ${numberOfDays}.`);
        setValue({ ...value, ...backupDate });
      } else {
        setBackupDate({...data})
        setValue({ ...value, ...data });
      }
    } else {
      setBackupDate({...data})
      setValue({ ...value, ...data });
    }
  };

  useEffect(()=>{
    handleClear();
  }, [])

  const { data: updatedFilterConfig, isLoading: isFilterGetValLoading } = Digit.Hooks.dss.useGetCustomFilterRequestValues(filterConfig,{});

  const { data: filterConfigResp, isLoading: isFilterDataLoading } = Digit.Hooks.dss.useGetCustomFilterValues(updatedFilterConfig, {enabled: !isFilterGetValLoading ? true : false});

  const [appliedFilterChips, setAppliedFilterChips] = useState([]);
  useEffect(() => {
    if (filterConfig?.length) {
      let filtersChips = [];
      filterConfig.forEach((filter) => {
        let appliedFilters = selected?.[filter.id];
        if (appliedFilters) {
          if (_.isArray(appliedFilters)) {
            _.forEach(appliedFilters, (appliedFilter) => {
              filtersChips.push({
                id: filter.id,
                label: filter.name,
                value: appliedFilter.value,
                name: appliedFilter.key
              })
            })
          } else {
            filtersChips.push({
              id: filter.id,
              label: filter.name,
              value: appliedFilters.value,
              name: appliedFilters.key
            })
          }
        }
      });
      setAppliedFilterChips(filtersChips);
    } else {
      setAppliedFilterChips([]);
    }
  },[selected])


  const selectFilters = (filter) => {
    return (e, data)=> {
      let filterObj, selectedFilter = {};
      if (filter?.type == "MultiSelectDropdown" && e) {
        let obj =  getMultiSelectAppliedFilterObj(filter, e)
        filterObj = obj.filterObj;
        selectedFilter[filter.id] = obj.selectedFilter;
      } else if (filter?.type == "Dropdown" && e) {
        let obj = getSingleSelectAppliedFilterObj(filter, e);
        filterObj = obj.filterObj;
        selectedFilter[filter.id] = obj.selectedFilter;
      }
      setValue({...value, ...filterObj});
      setSelected({...selected, ...selectedFilter});
    }
  };

  const removeFilter = (id) => {
    let chipData = appliedFilterChips[id];
    let filter = _.find(filterConfig, ['id', chipData.id]);
    let selectedFilter = selected[filter.id];
    let selectedValues = _.get(value, filter.appliedFilterPath);
    if (selectedFilter) {
      if (_.isArray(selectedFilter)) {
        selectedFilter = _.filter(selectedFilter, (sf)=> { return sf.value != chipData.value });
        selectedValues = _.filter(selectedValues, (sf)=> { return sf != chipData.value });
      } else {
        selectedFilter = null;
        selectedValues = null;
      }
      let nSelectedFilter = {[filter.id]:selectedFilter};
      let nSelectedValues = {...value}
      if (selectedValues == null || _.isEmpty(selectedValues)) {
        nSelectedValues = _.omit(nSelectedValues, filter.appliedFilterPath);
      } else {
        _.set(nSelectedValues, filter.appliedFilterPath, selectedValues);
      }
      setSelected({...selected, ...nSelectedFilter});
      setValue(nSelectedValues);
    }
  }

  const getMultiSelectAppliedFilterObj = (filter, event) => {
    let filterObj = {...value};
    let selectedMultiFiltersArr = []
    if (event && event.length) {
      let values = event.map((allEventsData) => allEventsData?.[1]?.value)
      _.set(filterObj, filter.appliedFilterPath, values)
      selectedMultiFiltersArr = event.map((allEventsData) => allEventsData?.[1])
    } else {
      _.set(filterObj, filter.appliedFilterPath, [])
    }
    return {filterObj, selectedFilter: selectedMultiFiltersArr }
  }

  const getSingleSelectAppliedFilterObj = (filter, event) => {
    let filterObj = {...value};
    if (event && event.value && filter.appliedFilterPath) {
      _.set(filterObj, filter.appliedFilterPath, event.value)
    } else {
      _.set(filterObj, filter.appliedFilterPath, null)
    }
    return {filterObj, selectedFilter: event};
  }


  const handleClear = () => {
    setValue({
      denomination: "Unit",
      range: getDateRange(),
    });
    setSelected({});
  };

  const getDateRange = () => {
    let numberOfDays = _.get(_.find(filterConfig, ['type', 'DateRange']), 'props.maxNumberOfDays')
    if (numberOfDays && _.isNumber(numberOfDays))
      return Digit.Utils.dss.getDatesBackFromToday(numberOfDays);
    else
      return Digit.Utils.dss.getInitialRange();
  }

  const getFilter = (filter) => {
    switch(filter.type) {
      case "DateRange": 
        return dateRangeFilter(filter);
      case "Dropdown": 
        return dropdownFilter(filter);
      case "MultiSelectDropdown": 
        return multiSelectFilter(filter);
      default:
        return '';
    }
  }

  const dateRangeFilter = (filter) => {
    return <DateRange onFilterChange={handleDateFilterChange} values={value?.range} t={t} />
  }

  const dropdownFilter = (filter) => {
    let options = filterConfigResp[filter?.id] || [];
    // if (!selected[filter.id] && options?.length) {
    //   let selectedDD = {}
    //   selectedDD[filter?.id] = options[0];
    //   setSelected({...selected, ...selectedDD})
    // }
    return <React.Fragment>
      <div className="mbsm">{t(filter?.name)}</div>
      <Dropdown
        option={options}
        optionKey="key"
        select={selectFilters(filter)}
        selected={selected[filter.id]}
        placeholder={t(`ES_DSS_ALL_${filter.id}_SELECTED`)}
      />
    </React.Fragment>
  }

  const multiSelectFilter = (filter) => {
    let options = filterConfigResp[filter?.id] || [];
    return <React.Fragment>
      <div className="mbsm">{t(filter?.name)}</div>
      <MultiSelectDropdown
        options={
          options
        }
        optionsKey="key"
        onSelect={selectFilters(filter)}
        selected={selected[filter.id]}
        defaultLabel={t(`ES_DSS_ALL_${filter.id}_SELECTED`)}
        defaultUnit={t(`ES_DSS_${filter.id}_SELECTED`)}
      />
    </React.Fragment>
  }

  if (isFilterDataLoading || isFilterGetValLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className={`filters-wrapper ${isOpen ? "filters-modal" : ""}`} style={{
        justifyContent: window.location.href.includes("dss/dashboard/finance") && !isOpen ? "space-between" : "unset",
        paddingRight: window.location.href.includes("dss/dashboard/finance") && !isOpen? "24px" : "0px",
        paddingBottom: window.location.href.includes("dss/dashboard/finance") && !isOpen? "20px" : "unset"
        }}>
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
        {
          filterConfig?.map((filter) => {
            return (<div className="filters-input">{getFilter(filter)}</div>)
          })
        }
      </div>
      <div>
      {appliedFilterChips?.length > 0 && (
          <div className="tag-container">
            {appliedFilterChips
                .map((filter, id) => (
                  <RemoveableTag
                    key={id}
                    text={`${t(filter?.label)}: ${t(filter?.name)}`}
                    onClick={() => removeFilter(id)}
                  />
                ))}
            <p className="clearText cursorPointer" onClick={handleClear}>
              {t(`DSS_FILTER_CLEAR`)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomFilter;