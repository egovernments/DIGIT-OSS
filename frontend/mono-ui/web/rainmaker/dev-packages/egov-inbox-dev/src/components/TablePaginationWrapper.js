import React, { useEffect, useReducer, useState } from 'react';
import { FilterDropdown, svgIcons } from './Components';
import Table from './Table';

const { ArrowBack,
    ArrowToLast,
    ArrowToFirst,
    ArrowForward } = svgIcons;

const reducer = (state, action) => {
    let { page, nextPage, prevPage, rowsPerPage } = state;
    switch (action.type) {
        case 'initMDMS':
            return { ...state, initMDMS: true, rowsPerPage: action.value.defaultValue, rowsPerPageOptions: action.value.rowsPerPageOptions };
        case 'change_rows_per_page':
            page = 0;
            rowsPerPage = Number(action.value);
            nextPage = (action.dataCount - rowsPerPage - (rowsPerPage * page)) > 0 ? true : false;
            return { ...state, page: page, rowsPerPage: rowsPerPage, prevPage: false, nextPage: nextPage };
        case 'next_page':
            page += 1;
            nextPage = (action.value - rowsPerPage - (rowsPerPage * page)) > 0 ? true : false;
            return { ...state, page: page, prevPage: true, nextPage: nextPage };
        case 'prev_page':
            page -= 1;
            prevPage = page == 0 ? false : true;
            return { ...state, page: page, prevPage: prevPage, nextPage: true };
        case 'first_page':
            return { ...state, page: 0, prevPage: false, nextPage: true };
        case 'last_page':
            return { ...state, page: (Math.ceil(action.value / rowsPerPage) - 1), prevPage: true, nextPage: false };
        case 'total_records':
            return { ...state, selected_none: false, sla_breached: false, nearing_sla_records: false, total_records: true };
        case 'reset':
            return { ...initialState };
        default:
            throw new Error();
    }
}
const initialState = {
    prevPage: false,
    nextPage: true,
    rowsPerPageOptions: [25, 100],
    page: 0,
    rowsPerPage: 100,
    initMDMS: false
};

const TablePaginationWrapper = ({ data, t, paginationConfig, ...rest }) => {

    const [pagination, setPaginationDispatch] = useReducer(reducer, initialState);
    const [filteredData, setFilteredData] = useState([]);
    let dataCount = data.length;
    const { rowsPerPageOptions = [], page, rowsPerPage, initMDMS, prevPage, nextPage } = pagination;

    useEffect(() => {
        if (paginationConfig && paginationConfig.rowsPerPageOptions && !initMDMS) {
            setPaginationDispatch({ type: 'initMDMS', value: paginationConfig })
        }
    }, [paginationConfig])

    useEffect(() => {
        setPaginationDispatch({ type: 'change_rows_per_page', value: rowsPerPage, dataCount: dataCount })
    }, [data])

    useEffect(() => {
        let newData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setFilteredData(newData);
    }, [pagination])

    return <React.Fragment>

        <Table data={[...filteredData]} t={t} {...rest}></Table>
        <span key={"inbox-pagination"} className="inbox-row-holder jk-pagination-holder" >
            <span className={` inbox-row`}> {t("COMMON_INBOX_ROWS_LABEL")} </span>
            <FilterDropdown showOptionAll={false} t={t} className="inbox-pagination-dropdown" data={rowsPerPageOptions.map(value => { return { key: `${value}`, value: `${value}` } })} name="page" value={rowsPerPage} id="page" onChangeFunction={(e) => setPaginationDispatch({ type: 'change_rows_per_page', value: e.target.value, dataCount: dataCount })} />
            {<ArrowToFirst className={` inbox-row ${prevPage ? 'inbox-page-button' : 'inbox-page-button-disabled inbox-page-button-disabled1'}`} onClick={(e) => prevPage && setPaginationDispatch({ type: 'first_page', })} />}
            {<ArrowBack className={`inbox-row ${prevPage ? 'inbox-page-button' : 'inbox-page-button-disabled'} `} onClick={(e) => prevPage && setPaginationDispatch({ type: 'prev_page', value: dataCount })} />}
            {<ArrowForward className={` inbox-row ${nextPage ? 'inbox-page-button' : 'inbox-page-button-disabled'}`} onClick={(e) => nextPage && setPaginationDispatch({ type: 'next_page', value: dataCount })} />}
            {<ArrowToLast className={` inbox-row ${nextPage ? 'inbox-page-button' : 'inbox-page-button-disabled inbox-page-button-disabled1'}`} onClick={(e) => nextPage && setPaginationDispatch({ type: 'last_page', value: dataCount })} />}
        </span>

    </React.Fragment>
}

export default TablePaginationWrapper;