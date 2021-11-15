import { getLocalityData, wfEsclationSearch, wfSearch, workflowSearchCount } from "./API/api"
import { formatWFEsclatedSearch, formatWFSearch } from "./utils"

const sortOrder = {
    'CS_INBOX_MODULE_FILTER': { order: 1, width: 70 },
    "WF_INBOX_HEADER_APPLICATION_NO": { order: 0, width: 100 },
    "WF_INBOX_HEADER_STATUS": { order: 2, width: 80 },
    "WF_INBOX_HEADER_LOCALITY": { order: 3, width: 90 },
    "WF_INBOX_HEADER_CURRENT_OWNER": { order: 4, width: 40 },
    "WF_INBOX_HEADER_SLA_DAYS_REMAINING": { order: 5, width: 70 },
    // "AppliedOn": 5,
}


const loadLocalityData = async (localityService, businessIds, setLocalityData, setSetLocalities) => {
    getLocalityData(localityService, businessIds).then(response => {
        setLocalityData(state => { return { ...state, ...response } })
        let localities = Object.values(response).reduce((prev, curr) => {
            prev[curr] = curr;
            return { ...prev }
        }, {})
        setSetLocalities(state => { return { ...state, ...localities } })
    })
}

const loadAssignedToMeCount = (setCountData) => {
    try {
        wfSearch([{ key: "tenantId", value: localStorage.getItem("inb-tenantId") }]).then(response => setCountData(state => ({ ...state, assignedToMe: response.totalCount }))).catch(err => {
            console.error(err)
        })
    }
    catch (e) {
        console.log(e);
    }
}

const Initdata = (props) => {

    try {
        let businessIds = [];
        let status = {};
        wfSearch([{ key: "tenantId", value: localStorage.getItem("inb-tenantId") }, { key: "offset", value: props.offset || 0 }, { key: "limit", value: props.limit || "10" }, { key: "businessService", value: props.businessService }]).then(resp => {
            props.setServiceCount((state) => {
                if (state[props.businessService]) {
                    let loadedCount = resp.ProcessInstances && resp.ProcessInstances.length || 0;
                    if (state[props.businessService].loadedCount) {
                        loadedCount += state[props.businessService].loadedCount;
                    }
                    state[props.businessService] = { ...state[props.businessService], loadedCount: loadedCount };
                } else {
                    state[props.businessService] = { loadedCount: resp.ProcessInstances && resp.ProcessInstances.length || 0 };
                }
                return { ...state }
            });
            return resp.ProcessInstances.map(data => {
                businessIds.push(data.businessId);
                status[`WF_${data.businessService.toUpperCase()}_${data.state.state}`] = data.state.state;
                return formatWFSearch(data, props.wfSlaConfig,
                    props.wfBusinessConfig);
            })
        }
        ).then(resp => {
            props.setIsLoading(false);
            props.setData((state) => state.concat(resp));
            if (status) {
                props.setApplicationStates(state => { return { ...state, ...status } });
            }
            if (props.localityModule && businessIds.length > 0) {
                loadLocalityData(props.localityModule, businessIds, props.setLocalityData, props.setSetLocalities);
            }

        }).catch(err => {
            props.setIsLoading(false);
            console.error(err)
        });

        //    loadAllData:true,
        // loadedCount:totalCount,

        if (!props.loadAllData) {
            workflowSearchCount(props.businessService).then(resp => {
                resp && typeof resp == "number" && props.setServiceCount((state) => {
                    if (state[props.businessService]) {
                        state[props.businessService] = { ...state[props.businessService], totalCount: resp };
                    } else {
                        state[props.businessService] = { totalCount: resp };
                    }
                    return { ...state }
                });
                resp && typeof resp == "number" && props.setCount((state) => state + resp)
            }).catch(err => {
                props.setIsLoading(false);
                console.error(err)
            });
        }

    }
    catch (e) {
        console.log(e);
    }
}



const getEsclationRecords = (props) => {

    try {
        let service = '';
        let businessIds = [];
        let status = {};
        wfEsclationSearch([{ key: "tenantId", value: localStorage.getItem("inb-tenantId") }]).then(resp => {
            props.setCountData(state => ({ ...state, esclated: resp.totalCount }));
            return resp.ProcessInstances.map(data => {
                businessIds.push(data.businessId);
                service = data.businessService;
                status[`WF_${data.businessService.toUpperCase()}_${data.state.state}`] = data.state.state;
                return formatWFEsclatedSearch(data, props.wfSlaConfig,
                    props.wfBusinessConfig);
            })
        }
        ).then(resp => {
            props.setIsLoading(false);
            props.setData({ loaded: true, load: false, data: resp });
            if (status) {
                props.setApplicationStates(state => { return { ...state, ...status } });
            }
            if (props.localityModule && props.localityModule[service] && businessIds.length > 0) {
                loadLocalityData(props.localityModule[service], businessIds, props.setLocalityData, props.setSetLocalities);
            }

        }).catch(err => {
            props.setIsLoading(false);
            console.error(err)
        });

    }
    catch (e) {
        console.log(e);
    }
}



export const inboxHelperFunction = {
    Initdata: Initdata,
    loadLocalityData: loadLocalityData,
    sortOrder: sortOrder,
    loadAssignedToMeCount: loadAssignedToMeCount,
    getEsclationRecords: getEsclationRecords
}