import React, { useEffect, useState } from "react"
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";

const Search = ({path}) => {
    const { variant } = useParams();
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [payload, setPayload] = useState({})
    const [isSubmit, setIsSubmit] = useState(false);
    const [searchData, setSearchData] = useState([]);

    const Search = Digit.ComponentRegistryService.getComponent( variant === "license" ? "SearchLicense" : "SearchApplication" )

    function onSubmit (_data) {
        sessionStorage.setItem("SEARCH_APPLICATION_DETAIL", JSON.stringify({
            applicationNumber: _data?.applicationNumber,
            licenseNumbers: _data?.licenseNumbers,
            tradeName: _data?.tradeName,
            fromDate: _data?.fromDate,
            toDate: _data?.toDate,
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC"
        }));
        var fromDate = new Date(_data?.fromDate)
        fromDate?.setSeconds(fromDate?.getSeconds() - 19800 )
        var toDate = new Date(_data?.toDate)
        toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800)
        const data = {
            ..._data,
            ...(_data.toDate ? {toDate: toDate?.getTime()} : {}),
            ...(_data.fromDate ? {fromDate: fromDate?.getTime()} : {})
        }

        setPayload(Object.keys(data).filter( k => data[k] ).reduce( (acc, key) => ({...acc,  [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {} ));
        setIsSubmit(true);
    }
    console.log("Payoad: " + JSON.stringify(payload));
    const config = {
        enabled: !!( payload && Object.keys(payload).length > 0 )
    }

    const {data: {Licenses: searchReult, Count: count} = {}, isLoading , isSuccess } = Digit.Hooks.tl.useSearch({tenantId, filters: payload, config})

    useEffect(()=>{
        if( isSuccess && !isLoading ){
            console.log("Func");
            sessionStorage.setItem("TL_APPLICATION_PAYLOAD", JSON.stringify(searchReult));
            const tableData = sessionStorage.getItem("TL_APPLICATION_PAYLOAD");
            console.log("TableData: " + tableData);
            setSearchData(JSON.parse(tableData));
        }
      },[isSubmit, payload, searchReult]);

    return <Search t={t} tenantId={tenantId} onSubmit={onSubmit} data={ !isLoading && isSuccess ? (searchData?.length>0? searchData : { display: "ES_COMMON_NO_DATA" }) : "" } count={count} /> 

}

export default Search