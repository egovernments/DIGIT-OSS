import { Header, DownloadIcon, Table, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import DesktopInbox from "../../../components/inbox/BillsDesktopInbox";
import MobileInbox from "../../../components/inbox/BillsMobileInbox";
import useSearchApplicationTableConfig from "./useTableConfig";
import { useFormContext } from "react-hook-form";

const DownloadBillInbox = () => {
  const { t } = useTranslation();

  const [showToast, setShowToast] = useState(null);

  const [pageOffset, setPageOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filters = {
    offset: 0,
    limit: 100,
  };

  const { data, isLoading, isError, error } = Digit.Hooks.useBulkPdfDetails({ filters: filters });

  useEffect(() => {
    setTotalRecords(data?.groupBillrecords.length);
  }, [data]);

  const fetchLastPage = () => {
    setPageOffset(totalRecords && Math.ceil(totalRecords / 10) * 10 - pageSize);
  };
  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };
  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };


  const showingToastMessage = (message) => {
    setShowToast(message);
  };

  const columns = useSearchApplicationTableConfig(showingToastMessage);
  const TableComponent = useCallback(() => {
    if (isLoading) {
      return <Loader />;
    } else {
      return data?.[0]?.display ? (
        <Card style={{ marginTop: 20 }}>
          {t(data?.[0]?.display)
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))}
        </Card>
      ) : (
        <>
          <Table
            t={t}
            data={data?.groupBillrecords}
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
            currentPage={Math.floor(pageOffset / pageSize)}
            onLastPage={fetchLastPage}
            onNextPage={fetchNextPage}
            onPrevPage={fetchPrevPage}
            isLoading={isLoading}
            totalRecords={totalRecords}
            manualPagination={false}
            pageSizeLimit={10}
          />
        </>
      );
    }
  }, [isLoading, data]);
  return (
    <div>
      <Header>{t("ACTION_TEST_DOWNLOADBILLS")}</Header>
      <TableComponent />
      {showToast?.label && (
        <Toast
          label={showToast?.label}
          onClose={(w) => {
            setShowToast((x) => null);
          }}
        />
      )}
    </div>
  );
};

export default DownloadBillInbox;
