import { DownwardArrow, Loader, Rating, RemoveableTag, Table, UpwardArrow } from "@egovernments/digit-ui-react-components";
import { differenceInCalendarDays, subYears } from "date-fns";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
import { ArrowDownwardElement } from "./ArrowDownward";
import { ArrowUpwardElement } from "./ArrowUpward";
import ReactTooltip from "react-tooltip";

const rowNamesToBeLocalised = ["Department", "", "Usage Type", "Ward", "Wards", "City Name"];

const InsightView = ({ rowValue, insight, t }) => {
  return (
    <span>
      {rowValue}
      {` `}
      {insight >= 0 ? ArrowUpwardElement() : ArrowDownwardElement()}
      {` `}
      {isNaN(insight) ? `0%` : `${Digit.Utils.dss.formatter(Math.abs(insight), "number", "Lac", true, t)}%`}
    </span>
  );
};

const calculateFSTPCapacityUtilization = (value, totalCapacity, numberOfDays = 1) => {
  if (value === undefined) return value;
  return Math.round((value / (totalCapacity * numberOfDays)) * 100);
};

const CustomTable = ({ data = {}, onSearch, setChartData, setChartDenomination }) => {
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
      id === chartKey
        ? value?.filters
        : { ...value?.filters, [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue },
    addlFilter: filterStack[filterStack.length - 1]?.addlFilter,
    moduleLevel: value?.moduleLevel,
  });
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters:
      id === chartKey
        ? value?.filters
        : { ...value?.filters, [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue },
    addlFilter: filterStack[filterStack.length - 1]?.addlFilter,
    moduleLevel: value?.moduleLevel,
  });
  useEffect(() => {
    const { id } = data;
    setChartKey(id);
    setFilterStack([{ id: id }]);
  }, [data, value]);
  const tableData = useMemo(() => {
    if (!response || !lastYearResponse) return;
    setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    return response?.responseData?.data?.map((rows, id) => {
      const lyData = lastYearResponse?.responseData?.data?.find((lyRow) => lyRow?.headerName === rows?.headerName);
      return rows?.plots?.reduce((acc, row, currentIndex) => {
        let cellValue = row?.value !== null ? row?.value : row?.label || "";
        if (row?.strValue && row?.symbol === "string" && !row?.label) {
          cellValue = row?.strValue;
        }
        let prevData = lyData?.plots?.[currentIndex]?.value;
        let insight = null;
        if (row?.name === "CapacityUtilization" && chartKey !== "fsmVehicleLogReportByVehicleNo") {
          const { range } = value;
          const { startDate, endDate } = range;
          const numberOfDays = differenceInCalendarDays(endDate, startDate) + 1;
          const ulbs = dssTenants
            .filter((tenant) => tenant?.city?.ddrName === rows?.headerName || tenant?.code === rows?.headerName)
            .map((tenant) => tenant?.code);
          const totalCapacity = fstpMdmsData
            ?.filter((plant) => ulbs.find((ulb) => plant?.ULBS?.includes(ulb)))
            .reduce((acc, plant) => acc + Number(plant?.PlantOperationalCapacityKLD), 0);
          cellValue = calculateFSTPCapacityUtilization(cellValue, totalCapacity, numberOfDays);
          prevData = calculateFSTPCapacityUtilization(prevData, totalCapacity, numberOfDays);
        }
        if (row?.name === "CapacityUtilization" && chartKey === "fsmVehicleLogReportByVehicleNo") {
          const tankCapcity = rows?.plots.find((plot) => plot?.name === "TankCapacity");
          cellValue = calculateFSTPCapacityUtilization(cellValue, tankCapcity?.value);
          prevData = calculateFSTPCapacityUtilization(prevData, tankCapcity?.value);
        }
        if (
          (row?.symbol === "number" || row?.symbol === "percentage" || row?.symbol === "amount") &&
          row?.name !== "CitizenAverageRating" &&
          row?.name !== "TankCapacity" &&
          lyData !== undefined
        ) {
          if (prevData === cellValue) insight = 0;
          else insight = prevData === 0 ? 100 : Math.round(((cellValue - prevData) / prevData) * 100);
        }
        if (typeof cellValue === "number" && !Number.isInteger(cellValue)) {
          cellValue = Math.round((cellValue + Number.EPSILON) * 100) / 100;
        }
        if (typeof cellValue === "string" && rowNamesToBeLocalised?.includes(row.name)) {
          cellValue = t(`DSS_TB_` + Digit.Utils.locale.getTransformedLocale(cellValue));
        }
        acc[t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(row?.name)}`)] =
          insight !== null ? { value: cellValue, insight } : row?.name === "S.N." ? id + 1 : cellValue;
        acc["key"] = rows?.headerName;
        return acc;
      }, {});
    });
  }, [response, lastYearResponse]);

  useEffect(() => {
    if (tableData) {
      const result = tableData?.map((row) => {
        return Object.keys(row).reduce((acc, key) => {
          if (key === "key") return acc;
          acc[key] = typeof row?.[key] === "object" ? row?.[key]?.value : row?.[key];
          return acc;
        }, {});
      });
      setChartData(result);
    } else {
      const result = [];
      setChartData(result);
    }
  }, [tableData]);

  const filterValue = useCallback((rows, id, filterValue = "") => {
    return rows.filter((row) => {
      const res = Object.keys(row?.values).find((key) => {
        if (typeof row?.values?.[key] === "object") {
          return Object.keys(row?.values?.[key]).find((id) => {
            if (id === "insight") {
              return String(Math.abs(row?.values?.[key]?.[id]) + "%")
                .toLowerCase()
                .startsWith(filterValue?.toLowerCase());
            }
            return String(row?.values?.[key]?.[id])?.toLowerCase().includes(filterValue?.toLowerCase());
          });
        }
        return (
          String(row?.values?.[key]).toLowerCase()?.includes(filterValue?.toLowerCase()) ||
          String(t(row?.values?.[key])).toLowerCase()?.includes(filterValue?.toLowerCase())
          /* search in the table to get filter along with space is currently enabled
          Also replace startsWith with includes
          String(row?.values?.[key])
            .toLowerCase()
            .split(" ")
            .some((str) => str?.startsWith(filterValue?.toLowerCase())) ||
          String(t(row?.values?.[key]))
            .toLowerCase()
            .split(" ")
            .some((str) => str.startsWith(filterValue?.toLowerCase()))
            */
        );
      });
      return res;
    });
  }, []);

  const renderUnits = (denomination) => {
    switch (denomination) {
      case "Unit":
        return `(${t("DSS_" + Digit.Utils.locale.getTransformedLocale(denomination))})`;
      case "Lac":
        return `(${t("DSS_" + Digit.Utils.locale.getTransformedLocale(denomination))})`;
      case "Cr":
        return `(${t("DSS_" + Digit.Utils.locale.getTransformedLocale(denomination))})`;
      default:
        return "";
    }
  };

  const renderHeader = (plot) => {
    const code = `DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`;
    if (plot?.symbol === "amount") {
      return `${t(code)} ${renderUnits(value?.denomination)}`;
    }
    return t(code);
  };

  const getDrilldownCharts = (value, filterKey, label, filters = []) => {
    if (response?.responseData?.drillDownChartId && response?.responseData?.drillDownChartId !== "none") {
      let currentValue = value;
      if (filterKey === "tenantId") {
        currentValue = dssTenants
          ?.filter((tenant) => tenant?.city?.ddrName === value || tenant?.code === value || tenant?.description === value)
          .map((tenant) => tenant?.code);
        if (currentValue?.length == 0 && value) {
          currentValue = [value];
        }
        /*  Removed this mdms active tenants filter logic as per RAIN-5454
        currentValue = dssTenants.filter((tenant) => tenant?.city?.ddrName === value || tenant?.code === value).map((tenant) => tenant?.code);
        */
        if (currentValue === undefined) return;
      }

      let newStack = { id: response?.responseData?.drillDownChartId, name: value, filterKey, filterValue: currentValue, label };
      if (filters.length > 1) {
        let newFilter = filters.filter((ele) => ele.key != filterKey);
        newStack["addlFilter"] = { [newFilter?.[0]?.key]: filterStack?.[filterStack?.length - 1]?.filterValue };
        newFilter.map((fil) => {
          newStack["addlFilter"][fil?.key] =
            filterStack?.filter((e) => e.filterKey == fil?.key)?.[0]?.filterValue ||
            filterStack?.filter((e) => e.filterKey == "tenantId")?.[0]?.filterValue;
        });
      }
      setFilterStack([...filterStack, newStack]);
      setChartKey(response?.responseData?.drillDownChartId);
    }
  };

  const sortRows = useCallback((rowA, rowB, columnId) => {
    const firstCell = rowA?.values?.[columnId];
    const secondCell = rowB?.values?.[columnId];
    let value1, value2;
    value1 = typeof firstCell === "object" ? firstCell?.value : firstCell;
    value2 = typeof secondCell === "object" ? secondCell?.value : secondCell;
    return String(value1).localeCompare(String(value2), undefined, { numeric: true });
  }, []);

  const accessData = (plot) => {
    const name = t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`);
    return (originalRow, rowIndex, columns) => {
      const cellValue = originalRow?.[name];
      if (plot?.symbol === "amount") {
        return typeof cellValue === "object"
          ? { value: Digit.Utils.dss.formatter(convertDenomination(cellValue?.value), "number", "Lac", true, t), insight: cellValue?.insight }
          : String(Digit.Utils.dss.formatter(convertDenomination(cellValue), "number", "Lac", true, t));
      } else if (plot?.symbol === "number" || plot?.symbol === "percentage") {
        return typeof cellValue === "object"
          ? { value: Digit.Utils.dss.formatter(cellValue?.value, "number", "Lac", true, t), insight: cellValue?.insight }
          : String(Digit.Utils.dss.formatter(cellValue, "number", "Lac", true, t));
      }

      return originalRow[name];
    };
  };
  const isMobile = window.Digit.Utils.browser.isMobile();

  const getTooltipStyles = (name) => {
    if (isMobile)
      return {
        height: "fit-content",
        background: "#555",
        padding: "5px",
        wordBreak: name?.length > 100 ? "break-all" : "break-word",
        overflowWrap: "break-word",
        borderRadius: "6px",
        maxWidth: "205px",
      };
    else
      return {
        height: "fit-content",
        background: "#555",
        width: "fit-content",
        padding: "5px",
        wordBreak: name?.length > 100 ? "break-all" : "break-word",
        overflowWrap: "break-word",
        borderRadius: "6px",
      };
  };

  const tableColumns = useMemo(() => {
    const columns = response?.responseData?.data?.find((row) => !!row);
    return columns?.plots
      ?.filter((plot) => plot?.name !== "TankCapacity")
      .map((plot, index) => ({
        Header: (
          <span className="tooltip" data-tip="React-tooltip" data-for={`jk-table-${index}`}>
            {renderHeader(plot)}

            <ReactTooltip textColor="#fff" backgroundColor="#555" place="bottom" type="info" effect="solid" id={`jk-table-${index}`}>
              {t(`TIP_DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`)}
            </ReactTooltip>
            {/* <span
              className="tooltiptext"
              style={{
                fontSize: "14px",
                marginLeft:
                  t(`TIP_DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`).length < 10 ? -40 : tableData?.length > 2 ? -100 : -160,
                height: "35px",
                bottom: "0%",
                top: "100%",
                background: "none",
                width:
                  tableData?.length > 2 || t(`TIP_DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`).length < 42 ? "150px" : "250px",
              }}
            >
              <div style={getTooltipStyles(t(`TIP_DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`))}>
                {t(`TIP_DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`)}
              </div>
            </span> **/}
          </span>
        ),
        accessor: accessData(plot),
        id: plot?.name?.replaceAll(".", " "),
        symbol: plot?.symbol,
        sortType: sortRows,
        Cell: (args) => {
          const { value: cellValue, column, row } = args;
          if (typeof cellValue === "object") {
            return <InsightView insight={cellValue?.insight} rowValue={cellValue?.value} t={t} />;
          }
          const filter = response?.responseData?.filter?.find((elem) => elem?.column === column?.id);
          if (response?.responseData?.drillDownChartId !== "none" && filter !== undefined) {
            return (
              <span
                style={{ color: "#F47738", cursor: "pointer" }}
                onClick={() =>
                  getDrilldownCharts(
                    cellValue?.includes("DSS_TB_")?row?.original?.key:cellValue,
                    filter?.key,
                    t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`),
                    response?.responseData?.filter
                  )
                }
              >
                {t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(cellValue)}`)}
              </span>
            );
          }
          if (column?.id === "CitizenAverageRating") {
            return (
              <Rating
                id={row?.id}
                currentRating={Math.round(cellValue * 10) / 10}
                styles={{ width: "unset", marginBottom: 0 }}
                starStyles={{ width: "25px" }}
              />
            );
          }
          return String(t(cellValue));
        },
      }));
  }, [response, value?.denomination, value?.range]);

  const convertDenomination = (val) => {
    const { denomination } = value;
    switch (denomination) {
      case "Unit":
        return val;
      case "Lac":
        return Number((val / 100000).toFixed(2));
      case "Cr":
        return Number((val / 10000000).toFixed(2));
      default:
        return val;
    }
  };

  const removeULB = (id) => {
    const nextState = filterStack?.filter((filter, index) => index < id);
    setFilterStack(nextState);
    setChartKey(nextState[nextState?.length - 1]?.id);
  };

  if (isLoading || isRequestLoading) {
    return <Loader />;
  }
  return (
    <div style={{ width: "100%" }}>
      <span className={"dss-table-subheader"} style={{ position: "sticky", left: 0 }}>
        {t("DSS_CMN_TABLE_INFO")}
      </span>
      {filterStack?.length > 1 && (
        <div className="tag-container">
          <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
          {filterStack.map((filter, id) =>
            id > 0 ? (
              <RemoveableTag
                key={id}
                text={`${filter?.label}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter?.name)}`)}`}
                onClick={() => removeULB(id)}
              />
            ) : null
          )}
        </div>
      )}

      {!tableColumns || !tableData ? (
        <NoData t={t} />
      ) : (
        <Table
          className="customTable "
          t={t}
          customTableWrapperClassName={"dss-table-wrapper"}
          disableSort={false}
          autoSort={true}
          manualPagination={false}
          globalSearch={filterValue}
          initSortId="S N "
          onSearch={onSearch}
          data={tableData?.filter((tRow) => tRow) || []}
          totalRecords={tableData?.length}
          columns={tableColumns?.filter((row) => row)?.slice(1)}
          showAutoSerialNo={"DSS_HEADER_S_N_"}
          styles={{ overflow: "hidden" }}
          getCellProps={(cellInfo) => {
            return {
              style: {},
            };
          }}
        />
      )}
    </div>
  );
};

export default CustomTable;
