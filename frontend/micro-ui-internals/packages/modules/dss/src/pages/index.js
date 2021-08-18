import React, { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader, ShareIcon, DownloadIcon, FilterIcon } from "@egovernments/digit-ui-react-components";
import { startOfYear, endOfYear, getTime, format, addMonths } from "date-fns";
import Filters from "../components/Filters";
import Layout from "../components/Layout";
import FilterContext from "../components/FilterContext";

const getInitialRange = () => {
  const startDate = addMonths(startOfYear(new Date()), 3);
  const endDate = addMonths(endOfYear(new Date()), 3);
  const title = `${format(startDate, "MMM d, yy")} - ${format(endDate, "MMM d, yy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  return { startDate, endDate, title, duration };
};

const DashBoard = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    denomination: "Unit",
    range: getInitialRange(),
  });
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: setFilters,
    }),
    [filters]
  );
  const stateCode = tenantId.split(".")[0];
  const moduleCode = "fsm";
  // const moduleCode = "propertytax";
  const mdmsType = "dss-dashboard";
  // const { data: dashData } = Digit.Hooks.dss.useDSSDashboard(stateCode, mdmsType, moduleCode);
  const { data: screenConfig } = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard");
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);
  // console.log("find all data here", dashData, screenConfig);
  if (isLoading) {
    return <Loader />;
  }

  const dashboardConfig = response?.responseData;
  return (
    <FilterContext.Provider value={provided}>
      <div className="chart-wrapper">
        <div className="options">
          <div className="mrlg">
            <ShareIcon className="mrsm" />
            {t(`ES_DSS_SHARE`)}
          </div>
          <div className="mrsm">
            <DownloadIcon className="mrsm" />
            {t(`ES_DSS_DOWNLOAD`)}
          </div>
        </div>
        <Header>{t(dashboardConfig?.[0]?.name)}</Header>
        <Filters />
        <div className="options-m">
          <div>
            <FilterIcon style />
          </div>
          <div>
            <ShareIcon />
            {t(`ES_DSS_SHARE`)}
          </div>
          <div>
            <DownloadIcon />
            {t(`ES_DSS_DOWNLOAD`)}
          </div>
        </div>
        {dashboardConfig?.[0]?.visualizations.map((row, key) => {
          if (row.row === 4) return null;
          return <Layout rowData={row} key={key} />;
        })}
      </div>
    </FilterContext.Provider>
  );
};

export default DashBoard;
