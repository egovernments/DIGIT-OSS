import { BackButton, DownloadBtnCommon, Header, Loader, SearchForm, Table } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MobileSearchApplication from "./MobileSearchApplication";
import SearchFields from "./SearchFields";

const SearchApplication = ({ tenantId, t, onSubmit, data, count }) => {
  const initialValues = Digit.SessionStorage.get("AUDIT_APPLICATION_DETAIL") || {
    offset: 0,
    limit: 5,
    sortOrder: "DESC",
  };
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: initialValues,
  });
  const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  const convertEpochToTimeInHours = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let hour = dateFromApi.getHours();
    let min = dateFromApi.getMinutes();
    let period = hour > 12 ? "PM" : "AM";
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour > 9 ? "" : "0") + hour;
    min = (min > 9 ? "" : "0") + min;
    return `${hour}:${min} ${period}`;
  };
  const [tabledata, settabledata] = useState([]);
  const DownloadBtn = (props) => {
    return (
      <div onClick={props.onClick}>
        <DownloadBtnCommon />
      </div>
    );
  };
  const handleExcelDownload = (tabData) => {
    if (tabData?.[0] !== undefined) {
      return Digit.Download.Excel(tabData?.[0], "AuditReport");
    }
  };
  useEffect(() => {
    register("offset", 0);
    register("limit", 5);
    register("sortOrder", "DESC");
  }, [register]);
  useEffect(() => {
    if (data?.length > 0) {
      settabledata([
        data?.map((obj) => {
          let returnObject = {};
          returnObject[t("AUDIT_DATE_LABEL")] = convertEpochToDate(obj?.timestamp);
          returnObject[t("AUDIT_TIME_LABEL")] = convertEpochToTimeInHours(obj?.timestamp);
          returnObject[t("AUDIT_DATAVIEWED_LABEL")] = obj?.dataView[0] + "," + obj?.dataView[1];
          returnObject[t("AUDIT_DATAVIEWED_BY_LABEL")] = obj?.dataViewedBy;
          returnObject[t("AUDIT_ROLE_LABEL")] = obj?.roles.map((obj) => obj.name).join(",");
          return {
            ...returnObject,
          };
        }),
      ]);
    }
  }, [data]);
  const onSort = useCallback((args) => {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }
  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }
  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isMobile) {
    return <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }} />;
  }

  //need to get from workflow
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const columns = useMemo(
    () => [
      {
        Header: t("AUDIT_DATE_LABEL"),
        disableSortBy: true,
        accessor: (row) => {
          const timestamp = row.timestamp === "NA" ? t("WS_NA") : convertEpochToDate(row.timestamp);
          return GetCell(`${timestamp}`);
        },
      },
      {
        Header: t("AUDIT_TIME_LABEL"),
        disableSortBy: true,
        accessor: (row) => {
          const timestamp = row.timestamp === "NA" ? t("WS_NA") : convertEpochToTimeInHours(row.timestamp);
          return GetCell(`${timestamp}`);
        },
      },
      {
        Header: isMobile ? t("AUDIT_DATAVIEWED_LABEL") : t("AUDIT_DATAVIEWED_PRIVACY"),
        disableSortBy: true,
        accessor: (row) => {
          return GetCell(`${row?.dataView}`);
        },
      },
      {
        Header: isMobile ? t("AUDIT_DATAVIEWED_BY_LABEL") : t("AUDIT_DATAVIEWED_BY_PRIVACY"),
        disableSortBy: true,
        accessor: (row) => {
          return GetCell(`${row?.dataViewedBy}`);
        },
      },
      {
        Header: t("AUDIT_ROLE_LABEL"),
        disableSortBy: true,
        accessor: (row) => {
          return GetCell(`${row?.roles.slice(0, 3)?.map((e) => e.name)}`);
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div style={{ marginRight: "-70px" }}>
        {" "}
        <BackButton />{" "}
      </div>
      <div style={{ marginTop: "30px", marginLeft: "30px" }}>
        {" "}
        <Header>{t("PRIVACY_AUDIT_REPORT")}</Header>{" "}
      </div>
      <SearchForm className="audit-card" onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchFields {...{ register, control, reset, tenantId, t, previousPage }} />
      </SearchForm>
      <div style={{ marginTop: "240px", marginLeft: "-55%", maxWidth: "80%", marginRight: "52px" }}>
        {data?.display ? (
          <div style={{ marginTop: "20x", width: "1025px", marginLeft: "25px", backgroundColor: "white", height: "60px" }}>
            {t(data.display)
              .split("\\n")
              .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                  {text}
                </p>
              ))}
          </div>
        ) : data !== "" ? (
          <div style={{ backgroundColor: "white", marginRight: "-30px", marginLeft: "30px" }}>
            <div className="sideContent" style={{ float: "right", padding: "10px 30px" }}>
              <DownloadBtn className="mrlg cursorPointer" onClick={() => handleExcelDownload(tabledata)} />
            </div>
            <Table
              t={t}
              data={data}
              totalRecords={count}
              columns={columns}
              getCellProps={(cellInfo) => {
                return {
                  style: {
                    minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                    padding: "20px 18px",
                    fontSize: "16px",
                  },
                };
              }}
              onPageSizeChange={onPageSizeChange}
              currentPage={getValues("offset") / getValues("limit")}
              onNextPage={nextPage}
              onPrevPage={previousPage}
              manualPagination={false}
              pageSizeLimit={getValues("limit")}
              onSort={onSort}
              disableSort={false}
              sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
            />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </React.Fragment>
  );
};

export default SearchApplication;
