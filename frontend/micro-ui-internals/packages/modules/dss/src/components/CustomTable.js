import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime, subYears, differenceInCalendarDays } from "date-fns";
import { UpwardArrow, TextInput, Loader, Table, RemoveableTag, Rating, DownwardArrow } from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const InsightView = ({ rowValue, insight }) => {
  return (
    <span>
      {rowValue}
      {` `}
      {insight >= 0 ? <UpwardArrow /> : <DownwardArrow />}
      {` `}
      {`${Math.abs(insight)}%`}
    </span>
  );
}

const calculateFSTPCapacityUtilization = (value, totalCapacity, numberOfDays = 1) => {
  if (value === undefined) return value;
  return Math.round((((value / (totalCapacity * numberOfDays)) * 100)));
}

const CustomTable = ({ data, onSearch, setChartData }) => {
  const { id } = data;
  const [chartKey, setChartKey] = useState(id);
  const [filterStack, setFilterStack] = useState([{ id: chartKey }]);
  const { t } = useTranslation();
  const { value, setValue, ulbTenants, fstpMdmsData } = useContext(FilterContext);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const dssTenants = Digit.SessionStorage.get("DSS_TENANTS");
  const lastYearDate = {
    startDate: subYears(value?.range?.startDate, 1).getTime(),
    endDate: subYears(value?.range?.endDate, 1).getTime(),
    interval: "month",
    title: "",
  };
  const { isLoading: isRequestLoading, data: lastYearResponse } = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId,
    requestDate: { ...lastYearDate },
    filters:
      id === chartKey ? value?.filters : { [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue },
  });
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters:
      id === chartKey ? value?.filters : { [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue },
  });

  const tableData = useMemo(() => {
    if (!response || !lastYearResponse) return;
    return response?.responseData?.data?.map((rows, id) => {
      const lyData = lastYearResponse?.responseData?.data?.find((lyRow) => lyRow?.headerName === rows?.headerName);
      return rows?.plots?.reduce((acc, row, currentIndex) => {
        let cellValue = row?.value !== null ? row?.value : row?.label || "";
        let prevData = lyData?.plots?.[currentIndex]?.value;
        let insight = null;
        if (row?.name === "CapacityUtilization" && chartKey !== "fsmVehicleLogReportByVehicleNo") {
          const { range } = value;
          const { startDate, endDate } = range;
          const numberOfDays = differenceInCalendarDays(endDate, startDate) + 1;
          const ulbs  = dssTenants.filter((tenant) => tenant?.city?.ddrName === rows.headerName || tenant?.code === rows.headerName).map(tenant => tenant.code);
          const totalCapacity = fstpMdmsData?.filter(plant => ulbs.find(ulb => plant.ULBS.includes(ulb))).reduce((acc, plant) => acc + Number(plant.PlantOperationalCapacityKLD), 0)
          cellValue = calculateFSTPCapacityUtilization(cellValue, totalCapacity, numberOfDays);
          prevData = calculateFSTPCapacityUtilization(prevData, totalCapacity, numberOfDays);
        }
        if (row?.name === "CapacityUtilization" && chartKey === "fsmVehicleLogReportByVehicleNo") {
          const tankCapcity = rows?.plots.find(plot => plot?.name === "TankCapacity");
          console.log(tankCapcity, 'tank capacity');
          cellValue = calculateFSTPCapacityUtilization(cellValue, tankCapcity?.value);
          prevData = calculateFSTPCapacityUtilization(prevData, tankCapcity?.value);
        }
        if ((row.symbol === "number" || row.symbol === "percentage" || row.symbol === "amount") && (row.name !== "CitizenAverageRating" && row.name !== "TankCapacity") && lyData !== undefined) {
          if (prevData === cellValue) insight = 0;
          else insight = prevData === 0 ? 100 : Math.round(((cellValue - prevData) / prevData) * 100);
        }
        // if (row?.name === "CapacityUtilization") cellValue = cellValue + "%"
        if (typeof cellValue === "number" && !Number.isInteger(cellValue)) {
          cellValue = Math.round((cellValue + Number.EPSILON) * 100) / 100;
        }
        acc[t(`DSS_HEADER_${row?.name.toUpperCase()}`)] = insight !== null ? { value: cellValue, insight } : row?.name === "S.N." ? id + 1 : cellValue;
        acc['key'] = rows.headerName; 
        return acc;
      }, {});
    });
  }, [response, lastYearResponse]);

  useEffect(() => {
    if (tableData) {
      const result = tableData.map(row => {
        return Object.keys(row).reduce((acc, key) => {
          if (key === "key") return acc;
          acc[key] =  typeof row[key] === 'object' ? row[key]?.value : row[key];
          return acc;
        }, {});
      })
      setChartData(result);
    }
  }, [tableData]);

  const filterValue = useCallback((rows, id, filterValue = "") => {
    return rows.filter(row => {
      const res = Object.keys(row.values).find(key => {
        if (typeof row.values[key] === 'object') {
          return Object.keys(row.values[key]).find(id => {
            if (id === 'insight') {
              return String(Math.abs(row.values[key][id]) + '%').toLowerCase().startsWith(filterValue?.toLowerCase());
            }
            return String(row.values[key][id]).toLowerCase().startsWith(filterValue?.toLowerCase());
          })
        }
        return String(row.values[key]).toLowerCase().split(' ').some(str => str.startsWith(filterValue?.toLowerCase()));
      })
      return res;
    })
  }, []);

  const renderUnits = (denomination) => {
    switch (denomination) {
      case "Unit":
        return "(₹)";
      case "Lac":
        return "(Lac)"
      case "Cr":
        return "(Cr)";
    }
  }

  const renderHeader = (plot) => {
    const code = `DSS_HEADER_${plot?.name.toUpperCase()}`;
    // const units = ["TotalSeptageDumped", "TotalSeptageCollected"];
    // if (id === "fsmVehicleLogReportByDDR" && units.includes(plot?.name)) {
    //   return `${t(code)} (${t("DSS_KL")})`;
    // }
    if (plot?.symbol === "amount") {
      return `${t(code)} ${renderUnits(value?.denomination)}`;
    }
    return t(code);
  };

  const getDrilldownCharts = (value, filterKey, label) => {
    if (response?.responseData?.drillDownChartId && response?.responseData?.drillDownChartId !== "none") {
      let currentValue = value;
      if (filterKey === "tenantId") {
        currentValue = dssTenants.filter((tenant) => tenant?.city?.ddrName === value || tenant?.code === value).map(tenant => tenant?.code);
        if (currentValue === undefined) return;
      }
      setFilterStack([...filterStack, { id: response?.responseData?.drillDownChartId, name: value, filterKey, filterValue: currentValue, label }]);
      setChartKey(response?.responseData?.drillDownChartId);
    }
  };

  const sortRows = useCallback((rowA, rowB, columnId) => {
    const firstCell = rowA.values[columnId];
    const secondCell = rowB.values[columnId];
    let value1, value2;
    value1 = typeof firstCell === "object" ? firstCell?.value : firstCell;
    value2 = typeof secondCell === "object" ? secondCell?.value : secondCell;
    return String(value1).localeCompare(String(value2), undefined, { numeric: true });
  }, []);

  const accessData = (plot) => {
    const name = t(`DSS_HEADER_${plot?.name.toUpperCase()}`)
    return (originalRow, rowIndex, columns) => {
      const cellValue = originalRow[name];
      if (plot?.symbol === "amount") {
        return typeof cellValue === "object" ?
          { value: convertDenomination(cellValue?.value), insight: cellValue?.insight } :
          String(convertDenomination(cellValue))
      }
      return originalRow[name];
    }
  }

  const tableColumns = useMemo(
    () => {
      const columns = response?.responseData?.data?.find(row => !!row);
      return columns?.plots?.filter(plot => plot?.name !== 'TankCapacity').map((plot) => ({
        Header: renderHeader(plot),
        accessor: accessData(plot),
        id: plot?.name.replaceAll(".", " "),
        symbol: plot?.symbol,
        sortType: sortRows,
        Cell: (args) => {
          const { value: cellValue, column, row } = args;
          if (typeof cellValue === "object") {
            return (
              <InsightView insight={cellValue?.insight} rowValue={cellValue?.value} />
            );
          }
          const filter = response?.responseData?.filter.find((elem) => elem.column === column.id);
          if (response?.responseData?.drillDownChartId !== "none" && filter !== undefined) {
            return (
              <span style={{ color: "#F47738", cursor: "pointer" }} onClick={() => getDrilldownCharts(cellValue, filter?.key, t(`DSS_HEADER_${plot?.name.toUpperCase()}`))}>
                {t(cellValue)}
              </span>
            );
          }
          if (column.id === "CitizenAverageRating") {
            return <Rating id={row.id} currentRating={Math.round(cellValue * 10) / 10} styles={{ width: "unset", marginBottom: 0 }} starStyles={{ width: "25px" }} />;
          }
          return String(t(cellValue));
        },
      })
    )},
    [response, value?.denomination, value?.range]
  );

  const convertDenomination = (val) => {
    const { denomination } = value;
    switch (denomination) {
      case "Unit":
        return val;
      case "Lac":
        return Number((val / 100000).toFixed(2));
      case "Cr":
        return Number((val / 10000000).toFixed(2));
    }
  };

  const removeULB = (id) => {
    const nextState = filterStack.filter((filter, index) => index < id);
    setFilterStack(nextState);
    setChartKey(nextState[nextState.length - 1]?.id);
  };

  if (isLoading || isRequestLoading) {
    return <Loader />;
  }
  if (!tableColumns || !tableData) {
    return (
      <div className="no-data">
        <p>{t("DSS_NO_DATA")}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {filterStack.length > 1 && (
        <div className="tag-container">
          <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
          {filterStack.map((filter, id) => (id > 0 ? <RemoveableTag key={id} text={`${filter?.label}: ${t(filter?.name)}`} onClick={() => removeULB(id)} /> : null))}
        </div>
      )}
      <Table
        className="customTable"
        t={t}
        disableSort={false}
        autoSort={true}
        manualPagination={false}
        globalSearch={filterValue}
        initSortId="S N "
        onSearch={onSearch}
        data={tableData}
        totalRecords={tableData?.length}
        columns={tableColumns}
        getCellProps={(cellInfo) => {
          return {
            style: {},
          };
        }}
      />
    </div>
  );
};

export default CustomTable;
