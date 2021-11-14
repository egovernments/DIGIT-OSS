import React, { useEffect, useState } from "react"
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Loader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";

const Search = ({path}) => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [selectedType, setSelectedType]=useState();
    const [payload, setPayload] = useState({})

    const Search = Digit.ComponentRegistryService.getComponent("OBPSSearchApplication");

    function onSubmit (_data) {
        var fromDate = new Date(_data?.fromDate)
        fromDate?.setSeconds(fromDate?.getSeconds() - 19800 )
        var toDate = new Date(_data?.toDate)
        setSelectedType(_data?.applicationType?.code);
        toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800)
        const data = {
            ..._data,
            ...(_data.toDate ? {toDate: toDate?.getTime()} : {}),
            ...(_data.fromDate ? {fromDate: fromDate?.getTime()} : {})
        }

        setPayload(Object.keys(data).filter( k => data[k]).reduce( (acc, key) => ({...acc,  [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {} ))
    }

    let params = {};
    let filters = {};
    let paramerror = "";

    if((selectedType && selectedType.includes("STAKEHOLDER")) || (Object.keys(payload).length>0 && payload?.applicationType && payload?.applicationType.includes("STAKEHOLDER")))
    {
        if(Object.entries(payload).length <= 2 && Object.keys(payload).filter((ob) => ob === "applicationType").length == 0)
        {
            paramerror="BPA_ADD_MORE_PARAM_STAKEHOLDER";
        }
        else{
            let filters = payload;
            if(payload.applicationNo) {
            payload["applicationNumber"] = payload.applicationNo;
            payload.applicationNo="";
            }
            if(payload && payload["applicationType"]) delete payload["applicationType"];
            if(payload && payload["serviceType"]) delete payload["serviceType"];
            params = {...payload, tenantId:"pb"};
        }   
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
        filters = payload;
    }
    const { data: bpaData=[], isLoading: isBpaSearchLoading, isSuccess : isBpaSuccess, error : bpaerror } = Digit.Hooks.obps.useOBPSSearch(selectedType,payload,tenantId, filters,params);
    return <Search t={t} tenantId={tenantId} onSubmit={onSubmit} isLoading={isBpaSearchLoading} Count={bpaData?.[0]?.Count} error={paramerror} data={ !isBpaSearchLoading && isBpaSuccess ? bpaData : [{ display: "ES_COMMON_NO_DATA" }]  } /> 
}

export default Search