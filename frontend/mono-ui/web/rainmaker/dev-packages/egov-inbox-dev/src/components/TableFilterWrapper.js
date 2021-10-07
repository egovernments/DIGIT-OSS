import React, { useEffect, useReducer, useState } from 'react';
import { cancelSignal, wfEsclationSearch, wfSearch } from './API/api';
import { FilterDropdown, svgIcons } from './Components';
import TablePaginationWrapper from './TablePaginationWrapper';
import { formatWFSearch, mobileCheck, transformLocality } from './utils';

const checkStringValid = (str = "") => {
    return str.match(new RegExp(/^([a-zA-Z0-9-]){4,25}$/)) ? true : false;
}

const { SortDown,
    SortUp } = svgIcons;

const checkFilterCondition = (element, filters, localityData, uuid) => {
    let condition = false;
    if (filters.selected_none) {
        condition = true;
    } else {
        if (filters.service != "ALL" && element.other.BusinessService != filters.service) {
            return false;
        } else if (filters.status != "ALL" && element.other.State != filters.status) {
            return false;
        } else if (filters.locality != "ALL" && localityData[element.BusinessId] != filters.locality) {
            return false;
        }
        else if (!filters.assigned_to_all) {
            if (filters.assigned_to_me && element.other.uuid != uuid) {
                return false;
            }
        }
        else if (!filters.total_records) {
            if (element.other.nearingEsclation != filters.nearing_sla_records) {
                return false;
            } else if (element.other.esclated != filters.sla_breached) {
                return false;
            }
        }
        condition = true;
    }
    return condition;
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'service':
            return { ...state, selected_none: action.value == "ALL" ? true : false, service: action.value };
        case 'locality':
            return { ...state, selected_none: action.value == "ALL" ? true : false, locality: action.value };
        case 'status':
            return { ...state, selected_none: action.value == "ALL" ? true : false, status: action.value };
        case 'assigned_to_me':
            return { ...state, selected_none: false, assigned_to_all: false, assigned_to_me: true, esclated: false };
        case 'assigned_to_all':
            return { ...state, selected_none: true, assigned_to_all: true, assigned_to_me: false, esclated: false };
        case 'esclated':
            return { ...state, selected_none: false, assigned_to_all: false, assigned_to_me: false, esclated: true };
        case 'total_records':
            return { ...state, selected_none: true, sla_breached: false, nearing_sla_records: false, total_records: true };
        case 'nearing_sla_records':
            return { ...state, selected_none: false, sla_breached: false, total_records: false, nearing_sla_records: true };
        case 'sla_breached':
            return { ...state, selected_none: false, nearing_sla_records: false, total_records: false, sla_breached: true };
        case 'reset':
            return { ...initialState };
        default:
            throw new Error();
    }
}
const initialState = {
    service: "ALL", locality: "ALL", status: "ALL", assigned_to_me: false, assigned_to_all: true,
    esclated: false,
    total_records: true,
    nearing_sla_records: false,
    sla_breached: false,
    selected_none: true
};

const TableFilterWrapper = ({ businessServices, countData, setData, setLoadAll, count, uuid, loadedAll, localities = [], localityData, t, esclationData, setEsclationData, applicationStates, setIsLoading, setBusinessServices, wfSlaConfig, isLoading, wfBusinessConfig, data, ...rest }) => {
    let isMobile = mobileCheck()
    const [searchText, setSearchText] = useState("");
    const [searchRecord, setSearchRecord] = useState([]);
    const [filters, setFiltersDispatch] = useReducer(reducer, initialState);
    const [sort, setSortOrder] = useState(true);
    const [filteredData, setFilteredData] = useState(data || []);
    useEffect(() => {
        if (checkStringValid(searchText)) {

            const timer = setTimeout(() => {
                setIsLoading(true);
                if (filters.esclated) {
                    wfSearch([{ key: "businessIds", value: searchText }, { key: "tenantId", value: localStorage.getItem("inb-tenantId") }]).then(resp => resp && resp.ProcessInstances && wfEsclationSearch([{ key: "businessIds", value: resp.ProcessInstances.map(res => res.businessId).join(',') }, { key: "tenantId", value: localStorage.getItem("inb-tenantId") }])).then(resp => resp && resp.ProcessInstances && resp.ProcessInstances.filter(wfrec => businessServices.includes(wfrec.businessService)).map(wfRecord => formatWFSearch(wfRecord, wfSlaConfig, wfBusinessConfig))).then(response => setSearchRecord(response ? response : [])).then(e => setIsLoading(false));
                } else {
                    wfSearch([{ key: "businessIds", value: searchText }, { key: "tenantId", value: localStorage.getItem("inb-tenantId") }]).then(resp => resp && resp.ProcessInstances && resp.ProcessInstances.filter(wfrec => businessServices.includes(wfrec.businessService)).map(wfRecord => formatWFSearch(wfRecord, wfSlaConfig, wfBusinessConfig))).then(response => setSearchRecord(response ? response : [])).then(e => setIsLoading(false));
                }

            }, 1000)
            return () => {
                clearTimeout(timer);
                cancelSignal()
            }
        }
    }, [searchText])


    useEffect(() => {
        if (searchRecord.length != 0 && checkStringValid(searchText)) {
            let newData = searchRecord.filter(element => checkFilterCondition(element, filters, localityData, uuid));
            setFilteredData(newData);
            // setFilteredData([...searchRecord]);
        } else if (checkStringValid(searchText) && searchRecord.length == 0) {
            setFilteredData([]);
        } else if (filters.esclated) {
            let newData = esclationData.data.filter(element => checkFilterCondition(element, filters, localityData, uuid));
            setFilteredData(newData);
            // setFilteredData([...esclationData.data]);
        } else if (filters.selected_none) {
            setFilteredData(data);
        } else {
            !loadedAll && setLoadAll(true); //dev
            let newData = data.filter(element => checkFilterCondition(element, filters, localityData, uuid));
            setFilteredData(newData);
        }

    }, [filters, data, searchRecord, esclationData])
    return <React.Fragment>
        <div className="jk-inbox-first-element">
            <div>
                <h4>  {t("WF_MY_WORKLIST")}</h4>
            </div>
            <div className="jk-inbox-search-holder">
                <label for="inbox-search" className="jk-inbox-search-label">     {t("CS_INBOX_SEARCH")}</label>
                <input id="inbox-search" disabled={isLoading} style={{ borderColor: searchText.length !== 0 && !checkStringValid(searchText) ? "red" : "black" }} type="text" onChange={(e) => setSearchText(e.target.value)} value={searchText} placeholder={t("INBOX_ENTER_BID")} />
                {searchText.length !== 0 && !checkStringValid(searchText) && <span style={{ color: "red" }} >{t("ERR_INVALID_APPID")}</span>}
            </div>
        </div>
        <div className="inbox-filter-wrapper">
            <FilterDropdown t={t} header={"CS_INBOX_MODULE_FILTER"} data={businessServices.map(service => { return { key: `CS_COMMON_INBOX_${service}`, value: service } })} name="businessService" value={filters.service} id="businessService" onChangeFunction={(e) => setFiltersDispatch({ type: 'service', value: e.target.value })} />
            <FilterDropdown t={t} header={"CS_INBOX_LOCALITY_FILTER"} data={Object.values(localities).map(locality => { return { key: transformLocality(locality), value: locality } })} name="locality" value={filters.locality} id="locality" onChangeFunction={(e) => setFiltersDispatch({ type: 'locality', value: e.target.value })} />
            <FilterDropdown t={t} header={"CS_INBOX_STATUS_FILTER"} data={Object.keys(applicationStates).map(key => { return { key: `${key}`, value: applicationStates[key] } })} name="status" value={filters.status} id="status" onChangeFunction={(e) => setFiltersDispatch({ type: 'status', value: e.target.value })} />
            <div className="inbox-filter-clear-buttons">
                <button className="clear-button jk-inbox-pointer" onClick={() => { !loadedAll && setLoadAll(true) }}>{t("CS_INBOX_LOAD_ALL")}</button>
            </div>
            <div className="inbox-filter-clear-buttons">
                <button className="clear-button jk-inbox-pointer" onClick={() => {
                    setFiltersDispatch({ type: 'reset' })
                    setSearchText("");
                }}>{t("CS_INBOX_CLEAR")}</button>
            </div>
        </div>
        <div className="inbox-taskboard-holder">
            <div className="inbox-taskboard-card inbox-task-total" style={!filters.total_records ? { border: 'none' } : {}} onClick={() => {
                setFiltersDispatch({ type: 'total_records' })
            }}>
                {t("WF_TOTAL_TASK")}
                <span className="inbox-task-font">
                    {filters.selected_none && searchText === "" ? count : filteredData.length}
                </span>

            </div>
            <div className="inbox-taskboard-card inbox-task-nearing-sla" style={!filters.nearing_sla_records ? { border: "none" } : {}} onClick={() => {
                setFiltersDispatch({ type: 'nearing_sla_records' })
            }}>
                {t("WF_TOTAL_NEARING_SLA")}
                <span className="inbox-task-font">
                    {filteredData.filter(item => item.other.nearingEsclation).length}
                </span>

            </div>
            <div className="inbox-taskboard-card inbox-task-esclated-sla" style={!filters.sla_breached ? { border: "none" } : {}} onClick={() => {
                setFiltersDispatch({ type: 'sla_breached' })
            }} >
                {t("WF_ESCALATED_SLA")}
                <span className="inbox-task-font">
                    {filteredData.filter(item => item.other.esclated).length}
                </span>
            </div>
        </div>
        <div style={{ backgroundColor: "white" }}>
            <div className={"jk-inbox-tab-header-holder"}>
                <span className={`assigned-inbox inb-all-tab ${filters.assigned_to_all && "jk-selected-header"}`} onClick={() => {
                    setFiltersDispatch({ type: 'assigned_to_all' })
                }}>
                    {t("COMMON_INBOX_TAB_ALL")} <span style={{display:"inline-block"}}>{` ( ${countData.all} )`}</span>
                </span>
                <span className={`assigned-inbox inb-me-tab ${filters.assigned_to_me && "jk-selected-header"}`} onClick={() => {
                    setFiltersDispatch({ type: 'assigned_to_me' })
                }}>
                    {t("COMMON_INBOX_TAB_ASSIGNED_TO_ME")} <span style={{display:"inline-block"}}>{` ( ${countData.assignedToMe} )`}</span>
                </span>
                <span className={`assigned-inbox inb-esc-tab ${filters.esclated && "jk-selected-header"}`} onClick={() => {
                    !esclationData.loaded && !esclationData.load && setEsclationData({ loaded: false, load: true, data: [] });
                    setFiltersDispatch({ type: 'esclated' })
                }}>
                    {t("COMMON_INBOX_TAB_ESCALATED")}<span style={{display:"inline-block"}}> {` ( ${countData.esclated} )`}</span>
                </span>
                {isMobile && <span className="jk-inbox-pointer jk-sort-ico" onClick={() => setSortOrder(state => !state)} >{sort ? <SortDown /> : <SortUp />}</span>}
            </div>
            <TablePaginationWrapper sort={sort} data={[...filteredData.sort((x, y) => sort ? x.other.sla - y.other.sla : y.other.sla - x.other.sla)]} t={t} setSortOrder={setSortOrder} isLoading={isLoading} localityData={localityData}{...rest}></TablePaginationWrapper>
        </div>
    </React.Fragment>
}

export default TableFilterWrapper;
