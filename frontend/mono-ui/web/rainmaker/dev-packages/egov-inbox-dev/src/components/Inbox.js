

import React, { useEffect, useState } from 'react';
import { getInboxConfig, wfBusinessSearch } from './API/api';
import ErrorBoundary from './ErrorBoundary';
import { inboxHelperFunction } from './inboxUtil';
import "./index.css";
import TableFilterWrapper from './TableFilterWrapper';
import { checkUserRole, convertMillisecondsToDays, getLimitAndOffset } from './utils';

const { Initdata,
    sortOrder, getEsclationRecords, loadAssignedToMeCount } = inboxHelperFunction

const WfTable = (props) => {
    const { user = {}, historyComp = null, historyClick, esclatedComp = null } = props;
    let { t: newT = (key) => key } = props;
    const t = (key) => newT(key && typeof key == "string" && key.toUpperCase());
    localStorage.setItem("inb-uuid", user.uuid);
    localStorage.setItem("inb-tenantId", user.tenantId);
    localStorage.setItem("inb-stateTenant", user.permanentCity);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [esclationData, setEsclationData] = useState({ loaded: false, load: false, data: [] });
    const [localityData, setLocalityData] = useState({});
    const [count, setCount] = useState(0);
    const [countData, setCountData] = useState({ all: 0, assignedToMe: 0, esclated: 0 });
    const [serviceCount, setServiceCount] = useState({});
    const [wfSlaConfig, setWfSlaConfig] = useState({});
    const [canLoadAll, setLoadAll] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);
    const [businessServices, setBusinessServices] = useState([]);
    const [localitySearcher, setLocalitySearcher] = useState({});
    const [wfBusinessConfig, setWfBusinessConfig] = useState({});
    const [applicationStates, setApplicationStates] = useState({});
    const [paginationConfig, setPaginationConfig] = useState({});
    const [inboxConfig, setInboxConfig] = useState({});
    const [localities, setSetLocalities] = useState([]);

    useEffect(() => {
        if (canLoadAll && !loadedAll) {

            businessServices.map((service) => {
                setIsLoading(true);
                let limitOffsetObject = getLimitAndOffset(serviceCount[service]);
                Initdata({
                    businessService: service,
                    loadAllData: true,
                    serviceCount: serviceCount,
                    limit: limitOffsetObject.limit,
                    offset: limitOffsetObject.offset,
                    setCount: setCount, setServiceCount: setServiceCount, setData: setData,
                    setIsLoading: setIsLoading, setLocalityData: setLocalityData,
                    localityModule: localitySearcher[service],
                    wfSlaConfig: wfSlaConfig,
                    wfBusinessConfig: wfBusinessConfig,
                    setSetLocalities: setSetLocalities,
                    setApplicationStates: setApplicationStates
                })
            })
        }
    }, [canLoadAll, businessServices])

    useEffect(() => {
        if (esclationData.load) {
            setIsLoading(true);
            getEsclationRecords({
                setCountData: setCountData,
                setData: setEsclationData,
                setIsLoading: setIsLoading, setLocalityData: setLocalityData,
                localityModule: localitySearcher,
                wfSlaConfig: wfSlaConfig,
                wfBusinessConfig: wfBusinessConfig,
                setSetLocalities: setSetLocalities,
                setApplicationStates: setApplicationStates
            })
        }


    }, [esclationData])

    useEffect(() => {
        getInboxConfig(user.permanentCity || "pb").then(response => {
            setWfSlaConfig(response.MdmsRes["common-masters"].wfSlaConfig[0]);
            setPaginationConfig(response.MdmsRes["common-masters"].TablePaginationOptions[0])
            setInboxConfig(response.MdmsRes["common-masters"].CommonInboxConfig.reduce((prev, curr) => {
                prev[curr.BusinessService] = curr;
                return { ...prev };
            }, {}));
            loadAssignedToMeCount(setCountData);
            setLocalitySearcher(response.MdmsRes["common-masters"].CommonInboxConfig.filter(config => config.locality).reduce((prev, curr) => {
                prev[curr.BusinessService] = curr.localityModule;
                return { ...prev };
            }, {}))
            let businessServices = response.MdmsRes["common-masters"].CommonInboxConfig.filter(config => config.active) || [];
            if (user.tenantId) {
                businessServices = businessServices.filter(service => checkUserRole(service.roles, props.user.roles.map(role => role.code)))
            }
            businessServices = businessServices.map(config => config.BusinessService);
            // businessServices = ["NewTL"] //dev
            setBusinessServices(businessServices);
        });
        return () => {
            setData([]);
            setBusinessServices([]);
            setLocalityData({});
            setCount(0);
            setServiceCount({});
            setPaginationConfig({});
            setWfSlaConfig({});
            setInboxConfig({});
            setLocalitySearcher({});
        }

    }, [])

    useEffect(() => {
        if (businessServices && businessServices.length > 0) {
            wfBusinessSearch([{ key: "tenantId", value: user.tenantId }, { key: "businessServices", value: businessServices.join(',') }]).then(resp => {
                if (resp) {
                    let wfService = resp.BusinessServices.reduce((prev, curr) => {
                        curr.MAX_SLA = convertMillisecondsToDays(curr.businessServiceSla);
                        prev[curr.businessService] = curr;
                        return { ...prev }
                    }, {})
                    return wfService;
                }
            }).then(updatedResp => {
                updatedResp && setWfBusinessConfig(state => {
                    return {
                        ...state, ...updatedResp
                    }
                })
                updatedResp && businessServices.map((service) => {
                    setIsLoading(true);
                    Initdata({
                        businessService: service, setCount: setCount,
                        // businessServices.length>1?60:100
                        // limit: businessServices.length > 1 ? 20 : 40,  // dev
                        limit: businessServices.length > 1 ? 60 : 100,
                        offset: 0,
                        setServiceCount: setServiceCount, setData: setData, setIsLoading: setIsLoading,
                        setLocalityData: setLocalityData, localityModule: localitySearcher[service],
                        wfSlaConfig: wfSlaConfig,
                        wfBusinessConfig: updatedResp,
                        setSetLocalities: setSetLocalities,
                        setApplicationStates: setApplicationStates
                    })
                });
            });

        }
    }, [businessServices])

    useEffect(() => {
        if (serviceCount) {
            if (Object.values(serviceCount).every(service => service.loadedCount == service.totalCount || (service.totalCount - service.loadedCount < 100)) && loadedAll == false && canLoadAll == true) {
                setLoadedAll(true);
                setLoadAll(false);
            }
        }

    }, [serviceCount]);



    useEffect(() => {
        if (count > 0) {
            setCountData(state => ({ ...state, all: count }));
            !esclationData.loaded && !esclationData.load && setEsclationData({ loaded: false, load: true, data: [] })
        }
    }, [count])

    return (
        <React.Fragment>
            <div style={{ margin: "10px" }}>
            {/* data={[...data, ...esclationData.data]    to get mix of all tab application and esclated application */}
                <TableFilterWrapper data={[...data]}
                    count={count}
                    countData={countData}
                    esclationData={esclationData}
                    inboxConfig={inboxConfig}
                    t={t}
                    historyComp={historyComp}
                    esclatedComp={esclatedComp}
                    uuid={user.uuid}
                    applicationStates={applicationStates}
                    localities={localities}
                    loadedAll={loadedAll}
                    header={Object.keys(sortOrder).reduce((prev, curr) => {
                        prev[curr] = curr;
                        return { ...prev }
                    }, {})}
                    businessServices={businessServices}
                    isLoading={isLoading}
                    localityData={localityData}
                    paginationConfig={paginationConfig}
                    sortOrder={sortOrder}
                    setBusinessServices={setBusinessServices}
                    historyClick={historyClick}
                    setLoadAll={setLoadAll}
                    setEsclationData={setEsclationData}
                    setData={setData}
                    wfSlaConfig={wfSlaConfig}
                    setIsLoading={setIsLoading}
                    wfBusinessConfig={wfBusinessConfig}
                >
                </TableFilterWrapper>
            </div>
        </React.Fragment>
    )
}
const Inbox = (props) => (
    <ErrorBoundary>
        <WfTable {...props}></WfTable>
    </ErrorBoundary>
)
export default Inbox;