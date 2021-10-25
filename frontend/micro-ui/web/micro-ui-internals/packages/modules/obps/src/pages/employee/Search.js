import React, { useEffect, useState } from "react"
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Loader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";

const Search = ({path}) => {
    const { variant } = useParams();
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [selectedType, setSelectedType]=useState();
    const [payload, setPayload] = useState({})
    const [id, setids] = useState("");
    const [BPAdata, setBPAdata] = useState([]);
    const [BPAREGdata, setBPAREGdata] = useState([]);
    let workflowRes;

    const Search = Digit.ComponentRegistryService.getComponent("OBPSSearchApplication");

    function onSubmit (_data) {
        var fromDate = new Date(_data?.fromDate)
        fromDate?.setSeconds(fromDate?.getSeconds() - 19800 )
        var toDate = new Date(_data?.toDate)
        setSelectedType(_data?.serviceType?.code);
        toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800)
        const data = {
            ..._data,
            ...(_data.toDate ? {toDate: toDate?.getTime()} : {}),
            ...(_data.fromDate ? {fromDate: fromDate?.getTime()} : {})
        }

        setPayload(Object.keys(data).filter( k => data[k]).reduce( (acc, key) => ({...acc,  [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {} ))
    }

    const config = {
        enabled: !!( payload && Object.keys(payload).length > 0 )
    }

    // useEffect(() => {
    //     debugger;
    //     if(BPAdata.length>0 || BPAREGdata.length>0)
    //     (async () => {
    //         workflowRes = await Digit.WorkflowService.getAllApplication('pb.amritsar', id);
    //         console.log(workflowRes,"workflowres");
    //     });
    // },[BPAdata,BPAREGdata])

    if((selectedType && selectedType.includes("STAKEHOLDER")) || (Object.keys(payload).length>0 && payload?.applicationType && payload?.applicationType.includes("STAKEHOLDER")))
    {

        let filters = payload;
        if(payload.applicationNo) {
        payload["applicationNumber"] = payload.applicationNo;
        payload.applicationNo="";
        }
        let params = {...payload, tenantId:"pb"};
        const { data: bparegData, isLoading: isBparegLoading, isSuccess : isBpregSuccess } = Digit.Hooks.obps.useEmpBPAREGSearch(tenantId, {}, params);
        
        return <Search t={t} tenantId={tenantId} onSubmit={onSubmit} isLoading={isBparegLoading} Count={bparegData?.[0]?.Count} data={ !isBparegLoading && isBpregSuccess ? bparegData : { display: "ES_COMMON_NO_DATA" } } /> 
        
    }
    else
    {
        if(Object.keys(payload).length === 0)
        {
            let payload1={
                applicationType:"BUILDING_PLAN_SCRUTINY",
                serviceType:"NEW_CONSTRUCTION",
            }
            setPayload({...payload,...payload1});
        }
        let filters = payload;
        const { data: bpaData, isLoading: isBpaSearchLoading, isSuccess : isBpaSuccess } = Digit.Hooks.obps.useBPASearch(tenantId, filters);
        const businessIds = bpaData ? bpaData.map(application => application.applicationNumber) : "";
        // if(BPAdata.length>0)
        // (async () => {
        //     workflowRes = Digit.WorkflowService.getAllApplication('pb.amritsar', { businessIds: businessIds.join()  }).then((result) =>{
        //         console.log(result,"workflowres");
        //     });
        //     console.log(workflowRes,"workflowres");
        // });
        //setBPAdata(bpaData);
        // let scrutinyNumber = "";
        // bpaData && bpaData.map((ob, ind) => {
        //     scrutinyNumber = scrutinyNumber+(ind!=0?",":"")+ob.edcrNumber;
        // })
        // let scrutinyNumber1 = {edcrNumber:scrutinyNumber};
        // console.log(scrutinyNumber1,"scrutinyNumber1");
        // const { data: data1, isLoading, refetch, isSuccess } = Digit.Hooks.obps.useScrutinyDetails("pb", scrutinyNumber1, {
        //     enabled: bpaData?.[0]?.edcrNumber?true:false
        //   })
        // console.log(data1,"data1");
        return <Search t={t} tenantId={tenantId} onSubmit={onSubmit} isLoading={isBpaSearchLoading} Count={bpaData?.[0]?.Count} data={ !isBpaSearchLoading && isBpaSuccess ? bpaData : { display: "ES_COMMON_NO_DATA" }  } /> 
    }
    //  const { data: bpaData, isLoading: isBpaSearchLoading } = Digit.Hooks.obps.useBPASearch(tenantId, {applicationNo:applicationNo});

    


    //const {data: searchReult, isLoading , isSuccess } = Digit.Hooks.tl.useSearch({tenantId, filters: payload, config})
    //return <Search t={t} tenantId={tenantId} onSubmit={onSubmit} data={ !isLoading && isSuccess ? searchReult : { display: "ES_COMMON_NO_DATA" } } /> 

}

export default Search