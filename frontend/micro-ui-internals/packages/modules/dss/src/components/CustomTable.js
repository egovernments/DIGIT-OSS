import React, { Fragment, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { UpwardArrow, TextInput, Loader, Table } from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const CustomTable = ({ data, onSearch }) => {
  const { id } = data;
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const requestDate = {
    startDate: value?.range?.startDate.getTime(),
    endDate: value?.range?.endDate.getTime(),
    interval: "month",
    title: "",
  };
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate,
  });

  const tableColumns = useMemo(
    () =>
      response?.responseData?.data?.[0]?.plots?.map((plot) => ({
        Header: plot?.name,
        accessor: plot?.name.replaceAll(".", " "),
        symbol: plot?.symbol,
      })),
    [response]
  );

  const tableData = useMemo(
    () =>
      response?.responseData?.data?.map((rows) =>
        rows.plots.reduce((acc, row) => {
          acc[row?.name.replaceAll(".", " ")] = row?.value !== null ? row?.value : row?.label || "";
          if (typeof acc[row?.name] === "number" && !Number.isInteger(acc[row.name])) {
            acc[row.name.replaceAll(".", " ")] = Math.round((acc[row.name] + Number.EPSILON) * 100) / 100;
          }
          return acc;
        }, {})
      ),
    [response]
  );

  if (isLoading || !tableColumns || !tableData) {
    return <Loader />;
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table
        className="customTable"
        t={t}
        disableSort={false}
        autoSort={true}
        initSortId="SN"
        onSearch={onSearch}
        data={tableData}
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
