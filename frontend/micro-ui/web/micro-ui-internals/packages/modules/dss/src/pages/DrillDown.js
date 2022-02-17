import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { startOfYear, endOfYear, format, addMonths } from "date-fns";
import { Header, Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import CustomTable from "../components/CustomTable";
import FilterContext from "../components/FilterContext";
import GenericChart from "../components/GenericChart";
import Filters from "../components/Filters";
import CustomHorizontalBarChart from "../components/CustomHorizontalBarChart";
import CustomBarChart from "../components/CustomBarChart";


const key = 'DSS_FILTERS';

const getInitialRange = () => {
  const data = Digit.SessionStorage.get(key);
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : addMonths(startOfYear(new Date()), 3);
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : addMonths(endOfYear(new Date()), 3);
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  const denomination = data?.denomination || "Unit";
  const tenantId = data?.filters?.tenantId || []
  return { startDate, endDate, title, duration, denomination, tenantId };
};

const DrillDown = ({stateCode}) => {
  const [searchQuery, onSearch] = useState("");
  const { ulb, chart, title ,type='table',fillColor="",isNational="NO"} = Digit.Hooks.useQueryParams();
  const { t } = useTranslation();
const nationalDB=isNational=="YES"?true:false;
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate, title, duration, denomination, tenantId } = getInitialRange();
    return {
      range: { startDate, endDate, title, duration},
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: duration,
        title: title,
      },
      filters: {
        tenantId: tenantId,
      }
    }
  });

  const handleFilters = (data) => {
    Digit.SessionStorage.set(key, data);
    setFilters(data);
  }

  const { data: ulbTenants, isLoading: isUlbLoading } = Digit.Hooks.useModuleTenants("FSM");
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: handleFilters,
    }),
    [filters]
  );
 const { data: nationalInfo } = Digit.Hooks.dss.useMDMS(stateCode, "tenant", ["nationalInfo"], {
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
    handleFilters({ ...filters, filters: { ...filters?.filters, tenantId: [...filters?.filters?.tenantId].filter((tenant, index) => index !== id) } });
  };

  const handleClear = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, tenantId: [] } });
  };

  if (isUlbLoading) {
    return <Loader />;
  }

  return (
    <FilterContext.Provider value={provided}>
      <Header>{t(title)}</Header>
      <Filters t={t}         
        ulbTenants={isNational ? nationalInfo : ulbTenants}
        showDenomination={false}       
     isNational={nationalDB}
      />
      {filters?.filters?.tenantId.length > 0 && (
        <div className="tag-container">
          {filters?.filters?.tenantId?.map((filter, id) => (
            <RemoveableTag key={id} text={`${t(`DSS_HEADER_ULB`)}: ${t(filter)}`} onClick={() => removeULB(id)} />
          ))}
          <p className="clearText cursorPointer" onClick={handleClear}>
            {t(`DSS_FILTER_CLEAR`)}
          </p>
        </div>
      )}
      {type==="table"&&<GenericChart header={title} showDownload={true} showSearch={true} className={"fullWidth"} onChange={(e) => onSearch(e.target.value)} showHeader={false}>
        <CustomTable data={{ id: chart }} onSearch={searchQuery} />
      </GenericChart>}
      {type==="performing-metric"&&
      <GenericChart header={title} subHeader={`(${t(`DSS_SLA_ACHIEVED`)})`} showHeader={false}  className={"fullWidth"} >
      <CustomBarChart
            data={{ id: chart }}
            fillColor={fillColor }
            title={title}
        showDrillDown={false}
      />
    </GenericChart>}
    </FilterContext.Provider>
  );
};

export default DrillDown;
