import React, { Fragment, useCallback, useMemo, useEffect, useState, useReducer } from "react";
import {
  CloseSvg,
  SearchForm,
  Table,
  Card,
  SearchAction,
  PopUp,
  DetailsCard,
  Loader,
  Toast,
} from "@egovernments/digit-ui-react-components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";


const SearchApplicationDesktopView = ({columns, SearchFormFieldsComponent, onSubmit, data, error, isLoading, Count}) => {
    const { handleSubmit, setValue, getValues } = useFormContext()
    const [currPage, setCurrPage] = useState(getValues("offset") / getValues("limit"));
    const { t } = useTranslation()

    const fetchLastPage = () => {
      setValue("offset", Count && Math.ceil(Count / 10) * 10 - getValues("limit"));
      handleSubmit(onSubmit)();
    };
  
    const fetchFirstPage = () => {
      setValue("offset", 0);
      handleSubmit(onSubmit)();
    };
  
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
  
    useEffect(() => {
      if(!(getValues("offset") == undefined || getValues("limit") == undefined))
      setCurrPage(getValues("offset") / getValues("limit"));
    }, [getValues("offset"), getValues("limit")]);
  
    const TableComponent = () => {
        if(isLoading){
            return <Loader/>
        } else{
            return data?.[0]?.display ? <Card style={{ marginTop: 20 }}>
                    {t(data?.[0]?.display)
                    .split("\\n")
                    .map((text, index) => (
                        <p key={index} style={{ textAlign: "center" }}>
                        {text}
                        </p>
                    ))}
                </Card> : <Table
                    t={t}
                    data={data}
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
                    //currentPage={getValues("offset")/getValues("limit")}
                    currentPage={currPage}
                    onNextPage={nextPage}
                    onPrevPage={previousPage}
                    pageSizeLimit={getValues("limit")}
                    onSort={onSort}
                    totalRecords={Count}
                    disableSort={false}
                    onLastPage={fetchLastPage}
                    onFirstPage={fetchFirstPage}
                    sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
                />
        }
         
    }

    return <React.Fragment>
    <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
      <SearchFormFieldsComponent />
    </SearchForm>
    <TableComponent/>
  </React.Fragment>
}

export default SearchApplicationDesktopView