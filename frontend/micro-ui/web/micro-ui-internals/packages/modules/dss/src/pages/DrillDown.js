import { Header, Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import { addMonths, endOfYear, format, startOfYear } from "date-fns";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomBarChart from "../components/CustomBarChart";
import CustomTable from "../components/CustomTable";
import FilterContext from "../components/FilterContext";
import Filters from "../components/Filters";
import FiltersNational from "../components/FiltersNational";
import GenericChart from "../components/GenericChart";

const key = "DSS_FILTERS";

const getInitialRange = () => {
  const data = Digit.SessionStorage.get(key);
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : addMonths(startOfYear(new Date()), 3);
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : addMonths(endOfYear(new Date()), 3);
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const interval = Digit.Utils.dss.getDuration(startDate, endDate);
  const denomination = data?.denomination || "Unit";
  const tenantId = data?.filters?.tenantId || [];
  return { startDate, endDate, title, interval, denomination, tenantId };
};

const DrillDown = ({ stateCode }) => {
  const [searchQuery, onSearch] = useState("");
  const { ulb, chart, title, type = "table", fillColor = "", isNational = "NO" } = Digit.Hooks.useQueryParams();
  const { t } = useTranslation();
  const nationalDB = isNational == "YES" ? true : false;
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate, title, interval, denomination, tenantId } = getInitialRange();
    return {
      range: { startDate, endDate, title, interval },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: interval,
        title: title,
      },
      filters: {
        tenantId: tenantId,
      },
    };
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilters = (data) => {
    Digit.SessionStorage.set(key, data);
    setFilters(data);
  };

  const { data: ulbTenants, isLoading: isUlbLoading } = Digit.Hooks.useModuleTenants("DSS");
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: handleFilters,
    }),
    [filters]
  );
  const { data: nationalInfo, isLoadingNAT } = Digit.Hooks.dss.useMDMS(stateCode, "tenant", ["nationalInfo"], {
    select: (data) => {
      let nationalInfo = data?.tenant?.nationalInfo || [];
      let combinedResult = nationalInfo.reduce((acc, curr) => {
        if (acc[curr.stateCode]) {
          acc[curr.stateCode].push(curr);
        } else {
          acc[curr.stateCode] = [curr];
        }
        return { ...acc };
      }, {});
      let formattedResponse = { ddr: [], ulb: [] };
      Object.keys(combinedResult).map((key) => {
        let stateName = combinedResult[key]?.[0].stateName;
        formattedResponse.ddr.push({ code: key, ddrKey: stateName, ulbKey: stateName });
        formattedResponse.ulb.push(...combinedResult[key].map((e) => ({ code: e.code, ulbKey: e.name, ddrKey: e.stateName })));
      });
      return formattedResponse;
    },
    enabled: nationalDB,
  });
  const removeULB = (id) => {
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, tenantId: [...filters?.filters?.tenantId].filter((tenant, index) => index !== id) },
    });
  };
  const removeST = (id) => {
    let newStates = [...filters?.filters?.state].filter((tenant, index) => index !== id);
    let newUlbs = filters?.filters?.ulb || [];
    if (newStates?.length == 0) {
      newUlbs = [];
    } else {
      let filteredUlbs = nationalInfo?.ulb?.filter((e) => Digit.Utils.dss.getCitiesAvailable(e, newStates))?.map((ulbs) => ulbs?.code);
      newUlbs = newUlbs.filter((ulb) => filteredUlbs.includes(ulb));
    }
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, state: newStates, ulb: newUlbs },
    });
  };

  const removeTenant = (id) => {
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, ulb: [...filters?.filters?.ulb].filter((tenant, index) => index !== id) },
    });
  };
  const handleClear = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, tenantId: [] } });
  };
  const clearAllTn = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, ulb: [] } });
  };
  const clearAllSt = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, state: [], ulb: [] } });
  };

  if (isUlbLoading) {
    return <Loader />;
  }

  return (
    <FilterContext.Provider value={provided}>
      <Header>{t(title)}</Header>
      {isNational ? (
        <FiltersNational t={t} ulbTenants={nationalInfo} isNational={isNational} />
      ) : (
        <Filters
          t={t}
          ulbTenants={isNational ? nationalInfo : ulbTenants}
          // showDenomination={false}
          isNational={nationalDB}
        />
      )}
      {filters?.filters?.tenantId?.length > 0 && (
        <div className="tag-container">
          {!showFilters &&
            filters?.filters?.tenantId &&
            filters.filters.tenantId
              .slice(0, 5)
              .map((filter, id) => (
                <RemoveableTag
                  key={id}
                  text={`${t(`DSS_HEADER_ULB`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                  onClick={() => removeULB(id)}
                />
              ))}
          {filters?.filters?.tenantId?.length > 6 && (
            <>
              {showFilters &&
                filters.filters.tenantId.map((filter, id) => (
                  <RemoveableTag
                    key={id}
                    text={`${t(`DSS_HEADER_ULB`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                    onClick={() => removeULB(id)}
                  />
                ))}
              {!showFilters && (
                <p className="clearText cursorPointer" onClick={() => setShowFilters(true)}>
                  {t(`DSS_FILTER_SHOWALL`)}
                </p>
              )}
              {showFilters && (
                <p className="clearText cursorPointer" onClick={() => setShowFilters(false)}>
                  {t(`DSS_FILTER_SHOWLESS`)}
                </p>
              )}
            </>
          )}
          <p className="clearText cursorPointer" onClick={handleClear}>
            {t(`DSS_FILTER_CLEAR`)}
          </p>
        </div>
      )}
      {filters?.filters?.state?.length > 0 && (
        <div className="tag-container">
          {!showFilters &&
            filters?.filters?.state &&
            filters.filters.state
              .slice(0, 5)
              .map((filter, id) => (
                <RemoveableTag
                  key={id}
                  text={`${t(`DSS_HEADER_STATE`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                  onClick={() => removeST(id)}
                />
              ))}
          {filters?.filters?.state?.length > 6 && (
            <>
              {showFilters &&
                filters.filters.state.map((filter, id) => (
                  <RemoveableTag
                    key={id}
                    text={`${t(`DSS_HEADER_STATE`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                    onClick={() => removeST(id)}
                  />
                ))}
              {!showFilters && (
                <p className="clearText cursorPointer" onClick={() => setShowFilters(true)}>
                  {t(`DSS_FILTER_SHOWALL`)}
                </p>
              )}
              {showFilters && (
                <p className="clearText cursorPointer" onClick={() => setShowFilters(false)}>
                  {t(`DSS_FILTER_SHOWLESS`)}
                </p>
              )}
            </>
          )}
          <p className="clearText cursorPointer" onClick={clearAllSt}>
            {t(`DSS_FILTER_CLEAR_ST`)}
          </p>
        </div>
      )}
      {filters?.filters?.ulb?.length > 0 && (
        <div className="tag-container">
          {!showFilters &&
            filters?.filters?.ulb &&
            filters.filters.ulb
              .slice(0, 5)
              .map((filter, id) => (
                <RemoveableTag
                  key={id}
                  text={`${t(`DSS_HEADER_ULB`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                  onClick={() => removeTenant(id)}
                />
              ))}
          {filters?.filters?.ulb?.length > 6 && (
            <>
              {showFilters &&
                filters.filters.ulb.map((filter, id) => (
                  <RemoveableTag
                    key={id}
                    text={`${t(`DSS_HEADER_ULB`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                    onClick={() => removeTenant(id)}
                  />
                ))}
              {!showFilters && (
                <p className="clearText cursorPointer" onClick={() => setShowFilters(true)}>
                  {t(`DSS_FILTER_SHOWALL`)}
                </p>
              )}
              {showFilters && (
                <p className="clearText cursorPointer" onClick={() => setShowFilters(false)}>
                  {t(`DSS_FILTER_SHOWLESS`)}
                </p>
              )}
            </>
          )}
          <p className="clearText cursorPointer" onClick={clearAllTn}>
            {t(`DSS_FILTER_CLEAR_TN`)}
          </p>
        </div>
      )}
      {type === "table" && (
        <GenericChart
          header={title}
          showDownload={true}
          showSearch={true}
          className={"fullWidth"}
          onChange={(e) => onSearch(e.target.value)}
          showHeader={false}
        >
          <CustomTable data={{ id: chart }} onSearch={searchQuery} />
        </GenericChart>
      )}
      {type === "performing-metric" && (
        <GenericChart header={title} subHeader={`(${t(`SUB_${title}`)})`} showHeader={false} className={"fullWidth"}>
          <CustomBarChart data={{ id: chart }} fillColor={fillColor} title={title} showDrillDown={false} />
        </GenericChart>
      )}
    </FilterContext.Provider>
  );
};

export default DrillDown;
